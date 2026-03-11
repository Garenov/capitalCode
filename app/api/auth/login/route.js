import { db, schema } from "@/lib/db";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return Response.json({ success: false, message: "Please provide email and password" }, { status: 400 });
    }

    const users = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.email, email.toLowerCase().trim()))
      .limit(1);

    if (users.length === 0) {
      return Response.json({ success: false, message: "Invalid email or password" }, { status: 401 });
    }

    const user = users[0];

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return Response.json({ success: false, message: "Invalid email or password" }, { status: 401 });
    }

    // Block login until email is verified
    // Bypass verification for the test account (test@example.com)
    const isTestAccount = user.email === "test@example.com";
    if (!isTestAccount && !user.emailVerified) {
      return Response.json(
        {
          success: false,
          message: "Please verify your email before logging in. Check your inbox for a verification link.",
          code: "EMAIL_NOT_VERIFIED",
        },
        { status: 403 }
      );
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "7d" }
    );

    const { password: _, verifyToken: __, verifyTokenExpiry: ___, ...userResponse } = user;

    return Response.json({ success: true, message: "Login successful", token, user: userResponse }, { status: 200 });
  } catch (error) {
    console.error("Login error:", error);
    return Response.json({ success: false, message: error.message || "Login failed" }, { status: 500 });
  }
}
