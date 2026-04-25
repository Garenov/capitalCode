import { Elysia, t } from "elysia";
import { db, schema } from "../db";
import { eq } from "drizzle-orm";
import crypto from "crypto";
import { sendEmail, sendNewsletterConfirmation, sendNewsletterWelcome, getAppUrl } from "../lib/email";

const CONSENT_TEXT =
    "I agree to receive weekly financial education newsletters from The Capital Code. I can unsubscribe at any time.";

function makeToken(seed: string): string {
    return crypto
        .createHmac("sha256", process.env.JWT_SECRET ?? "secret")
        .update(seed + Date.now())
        .digest("hex");
}

export const newsletterRoutes = new Elysia({ prefix: "/newsletter" })

    // POST /newsletter/subscribe
    .post(
        "/subscribe",
        async ({ body, request, set }) => {
            const { email, name } = body;

            const existing = await db
                .select({ id: schema.newsletterSubscribers.id, status: schema.newsletterSubscribers.status })
                .from(schema.newsletterSubscribers)
                .where(eq(schema.newsletterSubscribers.email, email.toLowerCase()))
                .limit(1);

            if (existing.length > 0 && existing[0].status === "confirmed") {
                set.status = 409;
                return { success: false, message: "Already subscribed" };
            }

            const confirmToken = makeToken(email);
            const unsubToken = makeToken(email + "unsub");

            if (existing.length > 0) {
                // Resend confirmation
                await db.update(schema.newsletterSubscribers)
                    .set({ confirmToken, confirmSentAt: new Date() })
                    .where(eq(schema.newsletterSubscribers.email, email.toLowerCase()));
            } else {
                await db.insert(schema.newsletterSubscribers).values({
                    email: email.toLowerCase(),
                    name: name ?? null,
                    confirmToken,
                    confirmSentAt: new Date(),
                    unsubToken,
                    source: request.headers.get("referer") ?? "direct",
                    ipAddress: request.headers.get("x-forwarded-for") ?? "unknown",
                    consentText: CONSENT_TEXT,
                });
            }

            const APP_URL = getAppUrl();
            const confirmUrl = `${APP_URL}/api/newsletter/confirm?token=${confirmToken}`;

            await sendNewsletterConfirmation(email, name ?? null, confirmUrl);

            return { success: true, message: "Check your inbox to confirm your subscription." };
        },
        {
            body: t.Object({
                email: t.String({ format: "email" }),
                name: t.Optional(t.String()),
            }),
        }
    )

    // GET /newsletter/confirm?token=...
    .get("/confirm", async ({ query, set }) => {
        const { token } = query;
        if (!token) { set.status = 400; return { success: false, message: "Token required" }; }

        const [sub] = await db
            .select()
            .from(schema.newsletterSubscribers)
            .where(eq(schema.newsletterSubscribers.confirmToken, token))
            .limit(1);

        if (!sub) { set.status = 404; return { success: false, message: "Invalid token" }; }

        await db.update(schema.newsletterSubscribers)
            .set({ status: "confirmed", confirmedAt: new Date(), confirmToken: null })
            .where(eq(schema.newsletterSubscribers.id, sub.id));

        const APP_URL = getAppUrl();
        const unsubUrl = `${APP_URL}/api/newsletter/unsubscribe?token=${sub.unsubToken}`;

        await sendNewsletterWelcome(sub.email, sub.name, unsubUrl);

        return { success: true, message: "Subscription confirmed!" };
    }, { query: t.Object({ token: t.Optional(t.String()) }) })

    // GET /newsletter/unsubscribe?token=...
    .get("/unsubscribe", async ({ query, set }) => {
        const { token } = query;
        if (!token) { set.status = 400; return { success: false, message: "Token required" }; }

        const [sub] = await db
            .select({ id: schema.newsletterSubscribers.id })
            .from(schema.newsletterSubscribers)
            .where(eq(schema.newsletterSubscribers.unsubToken, token))
            .limit(1);

        if (!sub) { set.status = 404; return { success: false, message: "Invalid token" }; }

        await db.update(schema.newsletterSubscribers)
            .set({ status: "unsubscribed", unsubscribedAt: new Date() })
            .where(eq(schema.newsletterSubscribers.id, sub.id));

        return { success: true, message: "Unsubscribed successfully." };
    }, { query: t.Object({ token: t.Optional(t.String()) }) });
