import { Elysia, t } from "elysia";
import { db, schema } from "../db";
import { eq } from "drizzle-orm";
import crypto from "crypto";

const CONSENT_TEXT =
    "I agree to receive weekly financial education newsletters from The Capital Code. I can unsubscribe at any time.";

const APP_URL = process.env.APP_URL ?? "http://localhost:3000";

function makeToken(seed: string): string {
    return crypto
        .createHmac("sha256", process.env.JWT_SECRET ?? "secret")
        .update(seed + Date.now())
        .digest("hex");
}

/** Very basic email sender — swap for Resend/SendGrid in production */
async function sendEmail(to: string, subject: string, html: string) {
    const apiKey = process.env.RESEND_API_KEY;
    const from = process.env.EMAIL_FROM ?? "noreply@capitalcode.cz";
    if (!apiKey || apiKey.startsWith("re_your")) {
        console.log(`[EMAIL MOCK] To: ${to} | Subject: ${subject}`);
        return;
    }
    await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({ from, to, subject, html }),
    });
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

            const confirmUrl = `${APP_URL}/api/newsletter/confirm?token=${confirmToken}`;
            await sendEmail(
                email,
                "Confirm your subscription — The Capital Code",
                `<p>Hi ${name ?? "there"},</p>
         <p>Please confirm your subscription by clicking the link below:</p>
         <p><a href="${confirmUrl}">Confirm Subscription</a></p>
         <p style="color:#888;font-size:12px">If you didn't sign up, ignore this email.</p>`
            );

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

        await sendEmail(
            sub.email,
            "Welcome to The Capital Code Newsletter",
            `<p>Hi ${sub.name ?? "there"},</p>
       <p>You're confirmed! Every week you'll receive carefully curated financial education content.</p>
       <p style="color:#888;font-size:12px">
         ⚠️ All content is for educational purposes only. Not financial advice.
         <a href="${APP_URL}/api/newsletter/unsubscribe?token=${sub.unsubToken}">Unsubscribe</a>
       </p>`
        );

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
