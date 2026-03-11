import { db, schema } from "@/lib/db";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

export const dynamic = 'force-dynamic';

/**
 * TEST ACCOUNT SEED ENDPOINT
 *
 * Creates or updates a pre-verified test user that bypasses email verification.
 *
 * Credentials:
 *   email:    test@example.com
 *   password: test123
 *
 * Usage: GET /api/auth/seed-test
 *
 * This endpoint is idempotent — calling it multiple times is safe.
 * If the account already exists, it UPDATES emailVerified to true
 * and resets the password to the default test password.
 */
export async function GET() {
    try {
        const TEST_EMAIL = "test@example.com";
        const TEST_PASSWORD = "test123";
        const TEST_NAME = "Test User";

        const hashedPassword = await bcrypt.hash(TEST_PASSWORD, 10);

        // Check if already exists
        const existing = await db
            .select({ id: schema.users.id, emailVerified: schema.users.emailVerified })
            .from(schema.users)
            .where(eq(schema.users.email, TEST_EMAIL))
            .limit(1);

        if (existing.length > 0) {
            // Always force-update emailVerified and password for safety
            await db
                .update(schema.users)
                .set({
                    emailVerified: true,
                    password: hashedPassword,
                })
                .where(eq(schema.users.email, TEST_EMAIL));

            return Response.json({
                success: true,
                message: "Test account exists — emailVerified set to true, password reset.",
                credentials: { email: TEST_EMAIL, password: TEST_PASSWORD },
            });
        }

        await db.insert(schema.users).values({
            name: TEST_NAME,
            email: TEST_EMAIL,
            password: hashedPassword,
            phone: null,
            emailVerified: true,
            verifyToken: null,
            verifyTokenExpiry: null,
        });

        return Response.json({
            success: true,
            message: "Test account created with email pre-verified.",
            credentials: { email: TEST_EMAIL, password: TEST_PASSWORD },
        }, { status: 201 });
    } catch (error) {
        console.error("Seed test account error:", error);
        return Response.json({ success: false, message: error.message || "Failed to seed test account" }, { status: 500 });
    }
}
