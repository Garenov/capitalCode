import { db, schema } from "@/lib/db";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { sendVerificationEmail } from "@/lib/email";

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const { name, email, password, phone } = await request.json();

    if (!name || !email || !password) {
      return Response.json({ success: false, message: "Please provide name, email, and password" }, { status: 400 });
    }

    if (password.length < 6) {
      return Response.json({ success: false, message: "Password must be at least 6 characters" }, { status: 400 });
    }

    const existingUser = await db
      .select({ id: schema.users.id })
      .from(schema.users)
      .where(eq(schema.users.email, email.toLowerCase().trim()))
      .limit(1);

    if (existingUser.length > 0) {
      return Response.json({ success: false, message: "Email already registered" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate a cryptographically secure verification token
    const rawToken = crypto.randomBytes(32).toString("hex");
    // Store hashed token in DB so raw token isn't stored plaintext
    const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");
    // 24-hour expiry (unix timestamp in seconds)
    const expiry = Math.floor(Date.now() / 1000) + 60 * 60 * 24;

    const [newUser] = await db
      .insert(schema.users)
      .values({
        name,
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        phone: phone || null,
        emailVerified: false,
        verifyToken: hashedToken,
        verifyTokenExpiry: expiry,
      })
      .returning();

    // Send verification email (fire and forget — don't fail registration if email fails)
    sendVerificationEmail({ to: newUser.email, name: newUser.name, token: rawToken }).catch((err) => {
      console.error("Failed to send verification email:", err);
    });

    return Response.json(
      {
        success: true,
        message: "Registration successful. Please check your email to verify your account.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return Response.json({ success: false, message: error.message || "Registration failed" }, { status: 500 });
  }
}
