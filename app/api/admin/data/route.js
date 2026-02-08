import { db, schema } from "@/lib/db";
import { eq } from "drizzle-orm";

// Simple admin key verification
const ADMIN_KEY = process.env.ADMIN_KEY || "CC4P@dm1nKey";

function verifyAdminKey(key) {
  return key === ADMIN_KEY;
}

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const adminKey = request.headers.get("x-admin-key");

    if (!verifyAdminKey(adminKey)) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Unauthorized",
        }),
        { status: 401 }
      );
    }

    // Get all users (without passwords)
    const users = await db
      .select({
        id: schema.users.id,
        name: schema.users.name,
        email: schema.users.email,
        phone: schema.users.phone,
        createdAt: schema.users.createdAt,
        updatedAt: schema.users.updatedAt,
      })
      .from(schema.users);

    // Get all purchases with user info
    const purchases = await db
      .select({
        id: schema.purchases.id,
        userId: schema.purchases.userId,
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
          name: schema.users.name,
          email: schema.users.email,
        },
      })
      .from(schema.purchases)
      .leftJoin(schema.users, eq(schema.purchases.userId, schema.users.id));

    // Calculate statistics
    const stats = {
      totalUsers: users.length,
      totalPurchases: purchases.length,
      totalRevenue: purchases.reduce((sum, p) => sum + (p.price || 0), 0),
      purchasesByPlan: purchases.reduce((acc, p) => {
        acc[p.planName] = (acc[p.planName] || 0) + 1;
        return acc;
      }, {}),
    };

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          stats,
          users,
          purchases,
        },
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Get admin data error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: error.message || "Failed to retrieve data",
      }),
      { status: 500 }
    );
  }
}
