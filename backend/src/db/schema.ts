import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

// ─── Existing tables (mirrors lib/schema.ts) ───────────────────────────────

export const users = sqliteTable("users", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    password: text("password").notNull(),
    phone: text("phone"),
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

export const purchases = sqliteTable("purchases", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    userId: integer("user_id")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
    planName: text("plan_name", { enum: ["DIGITAL", "PHYSICAL", "BUNDLE"] }).notNull(),
    price: integer("price").notNull(),
    currency: text("currency").notNull().default("Kč"),
    devices: integer("devices").notNull().default(1),
    years: integer("years").notNull().default(1),
    status: text("status", { enum: ["pending", "completed", "cancelled"] })
        .notNull()
        .default("pending"),
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

export const reviews = sqliteTable("reviews", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    author: text("author").notNull(),
    text: text("text").notNull(),
    stars: integer("stars").notNull().default(5),
    createdAt: integer("created_at", { mode: "timestamp" })
        .notNull()
        .default(sql`(unixepoch())`),
});

export const notificationSubscribers = sqliteTable("notification_subscribers", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    email: text("email").notNull().unique(),
    name: text("name"),
    unsubscribeToken: text("unsubscribe_token").notNull(),
    createdAt: integer("created_at", { mode: "timestamp" })
        .notNull()
        .default(sql`(unixepoch())`),
});

// ─── New tables from blueprint ─────────────────────────────────────────────

/** Append-only financial ledger — never update rows, only insert */
export const userBalanceLedger = sqliteTable("user_balance_ledger", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    userId: integer("user_id")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
    /** Positive = credit, negative = debit */
    delta: real("delta").notNull(),
    reason: text("reason").notNull(), // e.g. PURCHASE_COMMISSION, PAYOUT_DEBIT
    referenceId: text("reference_id"),
    balanceAfter: real("balance_after").notNull(),
    createdAt: integer("created_at", { mode: "timestamp" })
        .notNull()
        .default(sql`(unixepoch())`),
});

export const payoutRequests = sqliteTable("payout_requests", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    userId: integer("user_id")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
    amount: real("amount").notNull(),
    currency: text("currency").notNull().default("CZK"),
    /** AES-256-CBC encrypted: iv:ciphertext hex */
    bankIban: text("bank_iban").notNull(),
    bankName: text("bank_name"),
    status: text("status", {
        enum: ["pending", "under_review", "approved", "rejected", "paid", "cancelled"],
    })
        .notNull()
        .default("pending"),
    requestedAt: integer("requested_at", { mode: "timestamp" })
        .notNull()
        .default(sql`(unixepoch())`),
    reviewedAt: integer("reviewed_at", { mode: "timestamp" }),
    reviewedBy: integer("reviewed_by"),
    paidAt: integer("paid_at", { mode: "timestamp" }),
    rejectionReason: text("rejection_reason"),
    /** SHA-256 of userId+amount+date — prevents duplicate requests */
    idempotencyKey: text("idempotency_key").notNull().unique(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    /** 0-100 composite fraud risk */
    fraudScore: integer("fraud_score").notNull().default(0),
    notes: text("notes"),
});

export const payoutAuditLog = sqliteTable("payout_audit_log", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    payoutId: integer("payout_id").references(() => payoutRequests.id),
    actorId: integer("actor_id"),
    action: text("action").notNull(), // STATUS_CHANGED, FLAGGED, APPROVED, REJECTED
    oldStatus: text("old_status"),
    newStatus: text("new_status"),
    metadata: text("metadata"), // JSON string
    createdAt: integer("created_at", { mode: "timestamp" })
        .notNull()
        .default(sql`(unixepoch())`),
});

/** GDPR-compliant double opt-in newsletter subscribers */
export const newsletterSubscribers = sqliteTable("newsletter_subscribers", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    email: text("email").notNull().unique(),
    name: text("name"),
    status: text("status", {
        enum: ["pending", "confirmed", "unsubscribed", "bounced"],
    })
        .notNull()
        .default("pending"),
    confirmToken: text("confirm_token").unique(),
    confirmSentAt: integer("confirm_sent_at", { mode: "timestamp" }),
    confirmedAt: integer("confirmed_at", { mode: "timestamp" }),
    unsubToken: text("unsub_token").unique(),
    unsubscribedAt: integer("unsubscribed_at", { mode: "timestamp" }),
    source: text("source"),
    ipAddress: text("ip_address"),
    /** Exact consent wording stored at subscription time for GDPR compliance */
    consentText: text("consent_text").notNull(),
    createdAt: integer("created_at", { mode: "timestamp" })
        .notNull()
        .default(sql`(unixepoch())`),
});

// ─── Type exports ──────────────────────────────────────────────────────────

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Purchase = typeof purchases.$inferSelect;
export type NewPurchase = typeof purchases.$inferInsert;
export type Review = typeof reviews.$inferSelect;
export type NewReview = typeof reviews.$inferInsert;
export type PayoutRequest = typeof payoutRequests.$inferSelect;
export type NewPayoutRequest = typeof payoutRequests.$inferInsert;
export type PayoutAuditLog = typeof payoutAuditLog.$inferSelect;
export type NewsletterSubscriber = typeof newsletterSubscribers.$inferSelect;
