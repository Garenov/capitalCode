import { db, schema } from "@/lib/db";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";
import { getStripe } from "@/lib/stripe";
import { PLANS } from "@/lib/plans";

export const dynamic = 'force-dynamic';

function verifyToken(token) {
    try {
        return jwt.verify(token, process.env.JWT_SECRET || "your-secret-key");
    } catch {
        return null;
    }
}

export async function POST(request) {
    try {
        const authHeader = request.headers.get("authorization");
        const token = authHeader?.replace("Bearer ", "");

        if (!token) {
            return Response.json({ success: false, message: "Authentication required" }, { status: 401 });
        }

        const decoded = verifyToken(token);
        if (!decoded) {
            return Response.json({ success: false, message: "Invalid token" }, { status: 401 });
        }

        // Look up the user to get their email for the Stripe pre-fill
        const users = await db
            .select({ id: schema.users.id, email: schema.users.email, name: schema.users.name, emailVerified: schema.users.emailVerified })
            .from(schema.users)
            .where(eq(schema.users.id, decoded.userId))
            .limit(1);

        if (users.length === 0) {
            return Response.json({ success: false, message: "User not found" }, { status: 404 });
        }

        const user = users[0];

        if (!user.emailVerified) {
            return Response.json({ success: false, message: "Please verify your email before purchasing." }, { status: 403 });
        }

        const { planName } = await request.json();

        // Server-side price validation — client cannot inject a price
        const plan = PLANS[planName];
        if (!plan) {
            return Response.json({ success: false, message: "Invalid plan" }, { status: 400 });
        }

        const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
        const stripe = getStripe();

        const sessionConfig = {
            payment_method_types: ["card"],
            customer_email: user.email,
            line_items: [
                {
                    price: plan.stripePriceId,
                    quantity: 1,
                },
            ],
            metadata: {
                userId: String(user.id),
                planName: plan.name,
                priceUsd: String(plan.priceUsd),
            },
            success_url: `${APP_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${APP_URL}/checkout/cancel`,
        };

        // Use subscription mode for recurring plans, payment mode for one-time
        if (plan.recurring) {
            sessionConfig.mode = "subscription";
            if (plan.trialDays) {
                sessionConfig.subscription_data = {
                    trial_period_days: plan.trialDays,
                };
            }
        } else {
            sessionConfig.mode = "payment";
        }

        const session = await stripe.checkout.sessions.create(sessionConfig);

        return Response.json({ success: true, url: session.url }, { status: 200 });
    } catch (error) {
        console.error("Stripe checkout error:", error);
        return Response.json({ success: false, message: error.message || "Checkout failed" }, { status: 500 });
    }
}
