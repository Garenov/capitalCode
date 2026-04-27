import { db, schema } from "@/lib/db";
import { eq } from "drizzle-orm";
import { getStripe } from "@/lib/stripe";
import { PLANS } from "@/lib/plans";
import { sendPurchaseConfirmation } from "@/lib/email";

export const dynamic = 'force-dynamic';

// Stripe requires the raw body for signature verification — disable Next.js body parsing
export const config = { api: { bodyParser: false } };

export async function POST(request) {
    const stripe = getStripe();
    const sig = request.headers.get("stripe-signature");
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!webhookSecret) {
        console.error("STRIPE_WEBHOOK_SECRET is not set");
        return new Response("Webhook secret not configured", { status: 500 });
    }

    let event;
    try {
        const rawBody = await request.text();
        event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
    } catch (err) {
        console.error("Stripe webhook signature error:", err.message);
        return new Response(`Webhook Error: ${err.message}`, { status: 400 });
    }

    if (event.type === "checkout.session.completed") {
        const session = event.data.object;

        const { userId, planName, priceUsd } = session.metadata ?? {};

        if (!userId || !planName) {
            console.error("Missing metadata in Stripe session", session.id);
            return new Response("Missing metadata", { status: 400 });
        }

        const plan = PLANS[planName];
        if (!plan) {
            console.error("Unknown planName in metadata:", planName);
            return new Response("Unknown plan", { status: 400 });
        }

        // Idempotency: skip if this session was already processed
        const existing = await db
            .select({ id: schema.purchases.id })
            .from(schema.purchases)
            .where(eq(schema.purchases.stripeSessionId, session.id))
            .limit(1);

        if (existing.length > 0) {
            return new Response("Already processed", { status: 200 });
        }

        const [purchase] = await db
            .insert(schema.purchases)
            .values({
                userId: parseInt(userId, 10),
                planName: plan.name,
                price: plan.priceUsd,
                currency: "USD",
                devices: 1,
                years: 1,
                status: "completed",
                stripeSessionId: session.id,
                transactionId: session.payment_intent ?? session.id,
            })
            .returning();

        // Get user data for the email
        const users = await db
            .select({ email: schema.users.email, name: schema.users.name })
            .from(schema.users)
            .where(eq(schema.users.id, parseInt(userId, 10)))
            .limit(1);

        if (users.length > 0) {
            sendPurchaseConfirmation({
                to: users[0].email,
                name: users[0].name,
                planName: plan.label,
                priceUsd: plan.priceUsd,
                downloadable: plan.downloadable,
            }).catch((err) => console.error("Purchase email error:", err));
        }

        console.log(`Purchase created: id=${purchase.id} plan=${plan.name} user=${userId}`);
    }

    return new Response("OK", { status: 200 });
}
