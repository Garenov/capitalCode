import { db, schema } from "@/lib/db";
import { eq } from "drizzle-orm";

export const dynamic = 'force-dynamic';

/** Escape HTML special characters to prevent XSS */
function escapeHtml(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const token = searchParams.get("token");

        if (!token) {
            return new Response("Missing token", { status: 400 });
        }

        const existing = await db
            .select({ id: schema.notificationSubscribers.id, email: schema.notificationSubscribers.email })
            .from(schema.notificationSubscribers)
            .where(eq(schema.notificationSubscribers.unsubscribeToken, token))
            .limit(1);

        if (existing.length === 0) {
            // Return HTML — this is a link clicked from email
            return new Response(
                `<html><body style="font-family:sans-serif;text-align:center;padding:40px;background:#0d1b35;color:#f0f0f0">
          <h2 style="color:#e0c73a">This link is invalid or has already been used.</h2>
          <a href="${process.env.NEXT_PUBLIC_APP_URL || '/'}" style="color:#e0c73a">Back to Home</a>
        </body></html>`,
                { status: 200, headers: { "Content-Type": "text/html" } }
            );
        }

        await db
            .delete(schema.notificationSubscribers)
            .where(eq(schema.notificationSubscribers.unsubscribeToken, token));

        return new Response(
            `<html><body style="font-family:sans-serif;text-align:center;padding:40px;background:#0d1b35;color:#f0f0f0">
        <h2 style="color:#e0c73a">Successfully unsubscribed.</h2>
        <p style="color:#aaa">We have unsubscribed <strong>${escapeHtml(existing[0].email)}</strong> from the newsletter.</p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL || '/'}" style="color:#e0c73a">Back to Home</a>
      </body></html>`,
            { status: 200, headers: { "Content-Type": "text/html" } }
        );
    } catch (error) {
        console.error("Unsubscribe error:", error);
        return new Response("Error processing unsubscribe", { status: 500 });
    }
}
