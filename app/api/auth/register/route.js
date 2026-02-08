import { db, schema } from "@/lib/db";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const { name, email, password, phone } = await request.json();

    // Validate input
    if (!name || !email || !password) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Please provide name, email, and password",
        }),
        { status: 400 }
      );
    }

    // Validate password length
    if (password.length < 6) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Password must be at least 6 characters long",
        }),
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.email, email))
      .limit(1);

    if (existingUser.length > 0) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Email already registered",
        }),
        { status: 400 }
      );
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = await db
      .insert(schema.users)
      .values({
        name,
        email,
        password: hashedPassword,
        phone: phone || null,
      })
      .returning();

    // Return user data without password
    const { password: _, ...userResponse } = newUser[0];

    return new Response(
      JSON.stringify({
        success: true,
        message: "User registered successfully",
        user: userResponse,
      }),
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: error.message || "Registration failed",
      }),
      { status: 500 }
    );
  }
}
