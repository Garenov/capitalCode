import { Elysia, t } from "elysia";
import { jwt } from "@elysiajs/jwt";
import { db, schema } from "../db";
import { eq, and, or, sql } from "drizzle-orm";
import crypto from "crypto";

const JWT_SECRET = process.env.JWT_SECRET ?? "change-this-to-a-long-random-string";
const ADMIN_KEY = process.env.ADMIN_KEY ?? "CC4P@dm1nKey";
const MIN_PAYOUT = 500;
const IBAN_KEY = Buffer.from(
    process.env.IBAN_ENCRYPTION_KEY ?? "0".repeat(64),
    "hex"
);

// ── Crypto helpers ───────────────────────────────────────────────────────────

function encryptIBAN(iban: string): string {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv("aes-256-cbc", IBAN_KEY, iv);
    const enc = Buffer.concat([cipher.update(iban, "utf8"), cipher.final()]);
    return `${iv.toString("hex")}:${enc.toString("hex")}`;
}

function buildIdempotencyKey(userId: number, amount: number): string {
    const day = new Date().toISOString().slice(0, 10);
    return crypto
        .createHash("sha256")
        .update(`${userId}:${amount}:${day}`)
        .digest("hex");
}

async function getBalance(userId: number): Promise<number> {
    const rows = await db
        .select({ total: sql<number>`COALESCE(SUM(delta), 0)` })
        .from(schema.userBalanceLedger)
        .where(eq(schema.userBalanceLedger.userId, userId));
    return Number(rows[0]?.total ?? 0);
}

async function requireAuth(authHeader: string | null, jwtInstance: { verify: (t: string) => Promise<unknown> }) {
    if (!authHeader) return null;
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : authHeader;
    return (await jwtInstance.verify(token)) as { userId: number; email: string } | null;
}

// ── Routes ────────────────────────────────────────────────────────────────────

export const payoutsRoutes = new Elysia({ prefix: "/payouts" })
    .use(jwt({ name: "jwt", secret: JWT_SECRET }))

    // GET /payouts/balance
    .get("/balance", async ({ request, jwt, set }) => {
        const user = await requireAuth(request.headers.get("authorization"), jwt);
        if (!user) { set.status = 401; return { success: false, message: "Unauthorized" }; }
        const balance = await getBalance(user.userId);
        return { success: true, balance, currency: "CZK" };
    })

    // GET /payouts — user's payout list
    .get("/", async ({ request, jwt, set }) => {
        const user = await requireAuth(request.headers.get("authorization"), jwt);
        if (!user) { set.status = 401; return { success: false, message: "Unauthorized" }; }

        const rows = await db
            .select({
                id: schema.payoutRequests.id,
                amount: schema.payoutRequests.amount,
                currency: schema.payoutRequests.currency,
                status: schema.payoutRequests.status,
                requestedAt: schema.payoutRequests.requestedAt,
                paidAt: schema.payoutRequests.paidAt,
                rejectionReason: schema.payoutRequests.rejectionReason,
            })
            .from(schema.payoutRequests)
            .where(eq(schema.payoutRequests.userId, user.userId))
            .orderBy(sql`${schema.payoutRequests.requestedAt} desc`);

        return { success: true, payouts: rows };
    })

    // POST /payouts — request a new payout
    .post(
        "/",
        async ({ body, request, jwt, set }) => {
            const user = await requireAuth(request.headers.get("authorization"), jwt);
            if (!user) { set.status = 401; return { success: false, message: "Unauthorized" }; }

            const { amount, iban } = body;
            const cleanIban = iban.replace(/\s/g, "").toUpperCase();

            // IBAN format check (basic EU pattern)
            if (!/^[A-Z]{2}\d{2}[A-Z0-9]{4,30}$/.test(cleanIban)) {
                set.status = 400;
                return { success: false, message: "Invalid IBAN format" };
            }

            if (amount < MIN_PAYOUT) {
                set.status = 400;
                return { success: false, message: `Minimum payout is ${MIN_PAYOUT} CZK` };
            }

            // Idempotency — one request per amount per day
            const idempotencyKey = buildIdempotencyKey(user.userId, amount);
            const dup = await db
                .select({ id: schema.payoutRequests.id })
                .from(schema.payoutRequests)
                .where(eq(schema.payoutRequests.idempotencyKey, idempotencyKey))
                .limit(1);

            if (dup.length > 0) {
                set.status = 409;
                return { success: false, message: "Duplicate payout request for today." };
            }

            // Balance check
            const balance = await getBalance(user.userId);
            if (balance < amount) {
                set.status = 400;
                return { success: false, message: "Insufficient balance" };
            }

            // Fraud score — simple: new account gets higher score
            const prevPaid = await db
                .select({ id: schema.payoutRequests.id })
                .from(schema.payoutRequests)
                .where(and(
                    eq(schema.payoutRequests.userId, user.userId),
                    eq(schema.payoutRequests.status, "paid")
                ))
                .limit(1);
            const fraudScore = prevPaid.length === 0 ? 35 : 5;

            const [payout] = await db.insert(schema.payoutRequests).values({
                userId: user.userId,
                amount,
                currency: "USD",
                bankIban: encryptIBAN(cleanIban),
                status: fraudScore > 30 ? "under_review" : "pending",
                idempotencyKey,
                ipAddress: request.headers.get("x-forwarded-for") ?? "unknown",
                userAgent: request.headers.get("user-agent") ?? "",
                fraudScore,
            }).returning();

            // Debit ledger
            await db.insert(schema.userBalanceLedger).values({
                userId: user.userId,
                delta: -amount,
                reason: "PAYOUT_DEBIT",
                referenceId: String(payout.id),
                balanceAfter: balance - amount,
            });

            // Audit
            await db.insert(schema.payoutAuditLog).values({
                payoutId: payout.id,
                actorId: user.userId,
                action: "PAYOUT_REQUESTED",
                newStatus: payout.status,
                metadata: JSON.stringify({ fraudScore, amount }),
            });

            set.status = 201;
            return {
                success: true,
                payoutId: payout.id,
                status: payout.status,
                message: payout.status === "under_review"
                    ? "Request is under review due to security checks."
                    : "Payout request submitted.",
            };
        },
        {
            body: t.Object({
                amount: t.Number({ minimum: MIN_PAYOUT }),
                iban: t.String({ minLength: 10 }),
            }),
        }
    )

    // PATCH /payouts/:id — admin approve or reject
    .patch(
        "/:id",
        async ({ params, body, request, set }) => {
            const adminKey = request.headers.get("x-admin-key");
            if (adminKey !== ADMIN_KEY) { set.status = 401; return { success: false, message: "Unauthorized" }; }

            const { action, rejectionReason } = body;
            const payoutId = Number(params.id);

            const [payout] = await db
                .select()
                .from(schema.payoutRequests)
                .where(eq(schema.payoutRequests.id, payoutId))
                .limit(1);

            if (!payout) { set.status = 404; return { success: false, message: "Payout not found" }; }
            if (!["pending", "under_review"].includes(payout.status)) {
                set.status = 409;
                return { success: false, message: "Payout is not in an actionable state" };
            }

            const newStatus = action === "approve" ? "approved" : "rejected";

            await db.update(schema.payoutRequests)
                .set({ status: newStatus, reviewedAt: new Date(), rejectionReason: rejectionReason ?? null })
                .where(eq(schema.payoutRequests.id, payoutId));

            await db.insert(schema.payoutAuditLog).values({
                payoutId,
                action: `ADMIN_${action.toUpperCase()}`,
                oldStatus: payout.status,
                newStatus,
                metadata: JSON.stringify({ rejectionReason }),
            });

            // Reverse debit if rejected
            if (action === "reject") {
                const balance = await getBalance(payout.userId);
                await db.insert(schema.userBalanceLedger).values({
                    userId: payout.userId,
                    delta: payout.amount,
                    reason: "PAYOUT_REVERSAL",
                    referenceId: String(payoutId),
                    balanceAfter: balance + payout.amount,
                });
            }

            return { success: true, status: newStatus };
        },
        {
            params: t.Object({ id: t.String() }),
            body: t.Object({
                action: t.Union([t.Literal("approve"), t.Literal("reject")]),
                rejectionReason: t.Optional(t.String()),
            }),
        }
    );
