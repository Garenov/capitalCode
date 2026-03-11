import { db, schema } from "@/lib/db";
import { eq } from "drizzle-orm";
import crypto from "crypto";
import { sendSubscribeConfirmation } from "@/lib/email";

export const dynamic = 'force-dynamic';

export async function POST(request) {
    try {
        const { email, name } = await request.json();

        if (!email) {
            return Response.json({ success: false, message: "Email is required" }, { status: 400 });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return Response.json({ success: false, message: "Invalid email address" }, { status: 400 });
        }

        const normalized = email.toLowerCase().trim();

        // Check if already subscribed
        const existing = await db
            .select({ id: schema.notificationSubscribers.id })
            .from(schema.notificationSubscribers)
            .where(eq(schema.notificationSubscribers.email, normalized))
            .limit(1);

        if (existing.length > 0) {
            return Response.json({ success: true, message: "Already subscribed" }, { status: 200 });
        }

        const unsubscribeToken = crypto.randomBytes(32).toString("hex");

        await db.insert(schema.notificationSubscribers).values({
            email: normalized,
            name: name?.trim() || null,
            unsubscribeToken,
        });

        sendSubscribeConfirmation({ to: normalized, name: name?.trim(), unsubscribeToken }).catch((err) => {
            console.error("Subscription confirmation email error:", err);
        });

        return Response.json({ success: true, message: "Subscribed successfully" }, { status: 201 });
    } catch (error) {
        console.error("Subscribe error:", error);
        return Response.json({ success: false, message: error.message || "Subscription failed" }, { status: 500 });
    }
}
