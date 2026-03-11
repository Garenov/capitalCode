import { Elysia } from "elysia";
import { db, schema } from "../db";
import { eq, sql } from "drizzle-orm";

const ADMIN_KEY = process.env.ADMIN_KEY ?? "CC4P@dm1nKey";

export const adminRoutes = new Elysia({ prefix: "/admin" })

    .get("/data", async ({ request, set }) => {
        const key = request.headers.get("x-admin-key");
        if (key !== ADMIN_KEY) { set.status = 401; return { success: false, message: "Unauthorized" }; }

        const users = await db.select({
            id: schema.users.id,
            name: schema.users.name,
            email: schema.users.email,
            phone: schema.users.phone,
            createdAt: schema.users.createdAt,
        }).from(schema.users);

        const purchases = await db.select({
            id: schema.purchases.id,
            userId: schema.purchases.userId,
            planName: schema.purchases.planName,
            price: schema.purchases.price,
            currency: schema.purchases.currency,
            devices: schema.purchases.devices,
            status: schema.purchases.status,
            purchaseDate: schema.purchases.purchaseDate,
            user: { name: schema.users.name, email: schema.users.email },
        }).from(schema.purchases)
            .leftJoin(schema.users, eq(schema.purchases.userId, schema.users.id))
            .orderBy(sql`${schema.purchases.purchaseDate} desc`);

        const payouts = await db.select({
            id: schema.payoutRequests.id,
            userId: schema.payoutRequests.userId,
            amount: schema.payoutRequests.amount,
            currency: schema.payoutRequests.currency,
            status: schema.payoutRequests.status,
            fraudScore: schema.payoutRequests.fraudScore,
            requestedAt: schema.payoutRequests.requestedAt,
            user: { name: schema.users.name, email: schema.users.email },
        }).from(schema.payoutRequests)
            .leftJoin(schema.users, eq(schema.payoutRequests.userId, schema.users.id))
            .orderBy(sql`${schema.payoutRequests.requestedAt} desc`);

        const newsletterCount = await db
            .select({ count: sql<number>`COUNT(*)` })
            .from(schema.newsletterSubscribers)
            .where(eq(schema.newsletterSubscribers.status, "confirmed"));

        const stats = {
            totalUsers: users.length,
            totalPurchases: purchases.length,
            totalRevenue: purchases.reduce((s, p) => s + (p.price ?? 0), 0),
            purchasesByPlan: purchases.reduce<Record<string, number>>((acc, p) => {
                acc[p.planName] = (acc[p.planName] ?? 0) + 1;
                return acc;
            }, {}),
            pendingPayouts: payouts.filter(p => ["pending", "under_review"].includes(p.status)).length,
            totalPayoutAmount: payouts.filter(p => p.status === "paid").reduce((s, p) => s + p.amount, 0),
            confirmedNewsletterSubscribers: Number(newsletterCount[0]?.count ?? 0),
        };

        return { success: true, data: { stats, users, purchases, payouts } };
    });
