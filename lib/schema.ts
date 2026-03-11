import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

// Users table
export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  phone: text("phone"),
  // Email verification — nullable so existing rows aren't truncated
  emailVerified: integer("email_verified", { mode: "boolean" }).default(false),
  verifyToken: text("verify_token"),
  verifyTokenExpiry: integer("verify_token_expiry"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

// Purchases table
export const purchases = sqliteTable("purchases", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  // Fixed enum to match actual plan names in the UI
  planName: text("plan_name", { enum: ["DIGITAL", "PHYSICAL", "BUNDLE"] }).notNull(),
  price: integer("price").notNull(),
  currency: text("currency").notNull().default("Kč"),
  devices: integer("devices").notNull().default(1),
  years: integer("years").notNull().default(1),
  status: text("status", { enum: ["pending", "completed", "cancelled"] })
    .notNull()
    .default("pending"),
  // Stripe session/payment intent id
  stripeSessionId: text("stripe_session_id"),
  transactionId: text("transaction_id"),
  purchaseDate: integer("purchase_date", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

// Reviews table
export const reviews = sqliteTable("reviews", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  author: text("author").notNull(),
  text: text("text").notNull(),
  stars: integer("stars").notNull().default(5),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

// Notification subscribers table
export const notificationSubscribers = sqliteTable("notification_subscribers", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  email: text("email").notNull().unique(),
  name: text("name"),
  // Random token used in unsubscribe links
  unsubscribeToken: text("unsubscribe_token").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

// Type exports
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Purchase = typeof purchases.$inferSelect;
export type NewPurchase = typeof purchases.$inferInsert;
export type Review = typeof reviews.$inferSelect;
export type NewReview = typeof reviews.$inferInsert;
export type NotificationSubscriber = typeof notificationSubscribers.$inferSelect;
export type NewNotificationSubscriber = typeof notificationSubscribers.$inferInsert;
