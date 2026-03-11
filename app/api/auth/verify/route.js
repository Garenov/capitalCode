import { db, schema } from "@/lib/db";
import { eq } from "drizzle-orm";
import crypto from "crypto";

export const dynamic = 'force-dynamic';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const rawToken = searchParams.get("token");

        if (!rawToken) {
            return Response.json({ success: false, message: "Missing token" }, { status: 400 });
        }

        // Hash the incoming token the same way we stored it
        const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");
        const nowUnix = Math.floor(Date.now() / 1000);

        const users = await db
            .select()
            .from(schema.users)
            .where(eq(schema.users.verifyToken, hashedToken))
            .limit(1);

        if (users.length === 0) {
            return Response.json({ success: false, message: "Invalid or expired token" }, { status: 400 });
        }

        const user = users[0];

        if (user.emailVerified) {
            return Response.json({ success: true, message: "Email already verified" }, { status: 200 });
        }

        if (user.verifyTokenExpiry < nowUnix) {
            return Response.json({ success: false, message: "Verification link has expired. Please register again." }, { status: 400 });
        }

        // Mark as verified and clear token fields
        await db
            .update(schema.users)
            .set({ emailVerified: true, verifyToken: null, verifyTokenExpiry: null })
            .where(eq(schema.users.id, user.id));

        return Response.json({ success: true, message: "Email verified successfully. You can now log in." }, { status: 200 });
    } catch (error) {
        console.error("Verify error:", error);
        return Response.json({ success: false, message: error.message || "Verification failed" }, { status: 500 });
    }
}
