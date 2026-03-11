import { Elysia } from "elysia";
import { jwt } from "@elysiajs/jwt";
import { db, schema } from "../db";
import { eq, and, or } from "drizzle-orm";
import { readFile } from "fs/promises";
import path from "path";

const JWT_SECRET = process.env.JWT_SECRET ?? "change-this-to-a-long-random-string";

// The real book file lives in the private directory — never in public/
const BOOK_FILE = path.join(
    process.cwd(), // /backend
    "..",
    "private",
    "capitalCode_full.pdf"
);

export const downloadRoute = new Elysia({ prefix: "/download" })
    .use(jwt({ name: "jwt", secret: JWT_SECRET }))

    .get("/", async ({ request, jwt, set }) => {
        // 1. Verify bearer token
        const authHeader = request.headers.get("authorization") ?? "";
        const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : authHeader;
        if (!token) { set.status = 401; return { success: false, message: "Authentication required" }; }

        const payload = await jwt.verify(token);
        if (!payload) { set.status = 401; return { success: false, message: "Invalid token" }; }
        const user = payload as { userId: number };

        // 2. Check for an eligible completed purchase (DIGITAL or BUNDLE)
        const eligible = await db
            .select({ id: schema.purchases.id })
            .from(schema.purchases)
            .where(and(
                eq(schema.purchases.userId, user.userId),
                eq(schema.purchases.status, "completed"),
                or(
                    eq(schema.purchases.planName, "DIGITAL"),
                    eq(schema.purchases.planName, "BUNDLE")
                )
            ))
            .limit(1);

        if (!eligible || eligible.length === 0) {
            set.status = 403;
            return { success: false, message: "No eligible purchase found for digital download." };
        }

        // 3. Stream the book
        let fileBuffer: Buffer;
        try {
            fileBuffer = await readFile(BOOK_FILE);
        } catch {
            set.status = 503;
            return { success: false, message: "Book file not available yet. Contact support." };
        }

        return new Response(fileBuffer, {
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": 'attachment; filename="CapitalCode.pdf"',
                "Cache-Control": "no-store, no-cache",
            },
        });
    });
