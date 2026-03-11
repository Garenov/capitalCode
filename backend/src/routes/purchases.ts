import { Elysia, t } from "elysia";
import { jwt } from "@elysiajs/jwt";
import { db, schema } from "../db";
import { eq, sql } from "drizzle-orm";

const JWT_SECRET = process.env.JWT_SECRET ?? "change-this-to-a-long-random-string";


async function requireAuth(authHeader: string | null, jwtInstance: { verify: (t: string) => Promise<unknown> }) {
    if (!authHeader) return null;
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : authHeader;
    const payload = await jwtInstance.verify(token);
    return payload as { userId: number; email: string } | null;
}

export const purchasesRoutes = new Elysia({ prefix: "/purchases" })
    .use(jwt({ name: "jwt", secret: JWT_SECRET }))

    // ── GET /purchases — user's purchase history ────────────────
    .get("/", async ({ request, jwt, set }) => {
        const user = await requireAuth(request.headers.get("authorization"), jwt);
        if (!user) { set.status = 401; return { success: false, message: "Unauthorized" }; }

        const rows = await db
            .select()
            .from(schema.purchases)
            .where(eq(schema.purchases.userId, user.userId))
            .orderBy(sql`${schema.purchases.purchaseDate} desc`);

        return { success: true, purchases: rows };
    })

    // ── POST /purchases — record a new purchase ─────────────────
    .post(
        "/",
        async ({ body, request, jwt, set }) => {
            const user = await requireAuth(request.headers.get("authorization"), jwt);
            if (!user) { set.status = 401; return { success: false, message: "Unauthorized" }; }

            const { planName, price, devices, years, currency, transactionId } = body;

            const [purchase] = await db
                .insert(schema.purchases)
                .values({
                    userId: user.userId,
                    planName,
                    price,
                    devices: devices ?? 1,
                    years: years ?? 1,
                    currency: currency ?? "Kč",
                    transactionId: transactionId ?? null,
                    status: "completed",
                })
                .returning();

            set.status = 201;
            return { success: true, message: "Purchase recorded", purchase };
        },
        {
            body: t.Object({
                planName: t.Union([t.Literal("DIGITAL"), t.Literal("PHYSICAL"), t.Literal("BUNDLE")]),
                price: t.Number(),
                devices: t.Optional(t.Number()),
                years: t.Optional(t.Number()),
                currency: t.Optional(t.String()),
                transactionId: t.Optional(t.String()),
            }),
        }
    );
