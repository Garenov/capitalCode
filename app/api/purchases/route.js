import { db, schema } from "@/lib/db";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";

// Middleware to verify token
function verifyToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET || "your-secret-key");
  } catch (error) {
    return null;
  }
}

export const dynamic = 'force-dynamic';

// GET - Retrieve user's purchases
export async function GET(request) {
  try {
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "");

    if (!token) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Authentication required",
        }),
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Invalid token",
        }),
        { status: 401 }
      );
    }

    // Get purchases for the user
    const userPurchases = await db
      .select({
        id: schema.purchases.id,
        planName: schema.purchases.planName,
        price: schema.purchases.price,
        currency: schema.purchases.currency,
        devices: schema.purchases.devices,
        years: schema.purchases.years,
        status: schema.purchases.status,
        transactionId: schema.purchases.transactionId,
        purchaseDate: schema.purchases.purchaseDate,
        createdAt: schema.purchases.createdAt,
        updatedAt: schema.purchases.updatedAt,
        user: {
          id: schema.users.id,
          name: schema.users.name,
          email: schema.users.email,
        },
      })
      .from(schema.purchases)
      .leftJoin(schema.users, eq(schema.purchases.userId, schema.users.id))
      .where(eq(schema.purchases.userId, decoded.userId));

    return new Response(
      JSON.stringify({
        success: true,
        purchases: userPurchases,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Get purchases error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: error.message || "Failed to retrieve purchases",
      }),
      { status: 500 }
    );
  }
}

// POST - Create a new purchase
export async function POST(request) {
  try {
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "");

    if (!token) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Authentication required",
        }),
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Invalid token",
        }),
        { status: 401 }
      );
    }

    const { planName, price, devices, years, currency, transactionId } =
      await request.json();

    // Validate input
    if (!planName || !price) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Please provide planName and price",
        }),
        { status: 400 }
      );
    }

    // Create purchase
    const newPurchase = await db
      .insert(schema.purchases)
      .values({
        userId: decoded.userId,
        planName,
        price,
        devices: devices || 1,
        years: years || 1,
        currency: currency || "Kč",
        transactionId: transactionId || null,
        status: "completed",
      })
      .returning();

    return new Response(
      JSON.stringify({
        success: true,
        message: "Purchase created successfully",
        purchase: newPurchase[0],
      }),
      { status: 201 }
    );
  } catch (error) {
    console.error("Create purchase error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: error.message || "Failed to create purchase",
      }),
      { status: 500 }
    );
  }
}
