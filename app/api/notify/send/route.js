import { db, schema } from "@/lib/db";
import { sendBookUpdateNotification } from "@/lib/email";

export const dynamic = 'force-dynamic';

const ADMIN_KEY = process.env.ADMIN_KEY || "CC4P@dm1nKey";

export async function POST(request) {
    try {
        const adminKey = request.headers.get("x-admin-key");
        if (adminKey !== ADMIN_KEY) {
            return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const { subject, message } = await request.json();

        if (!subject || !message) {
            return Response.json({ success: false, message: "Subject and message are required" }, { status: 400 });
        }

        const subscribers = await db
            .select()
            .from(schema.notificationSubscribers);

        if (subscribers.length === 0) {
            return Response.json({ success: true, sent: 0, message: "No subscribers" }, { status: 200 });
        }

        // Send in parallel with error tolerance — one failed email doesn't stop the rest
        const results = await Promise.allSettled(
            subscribers.map((sub) =>
                sendBookUpdateNotification({
                    to: sub.email,
                    name: sub.name,
                    subject,
                    message,
                    unsubscribeToken: sub.unsubscribeToken,
                })
            )
        );

        const sent = results.filter((r) => r.status === "fulfilled").length;
        const failed = results.filter((r) => r.status === "rejected").length;

        if (failed > 0) {
            console.warn(`Notification blast: ${sent} sent, ${failed} failed`);
        }

        return Response.json(
            { success: true, sent, failed, total: subscribers.length },
            { status: 200 }
        );
    } catch (error) {
        console.error("Notification send error:", error);
        return Response.json({ success: false, message: error.message || "Failed to send notifications" }, { status: 500 });
    }
}
