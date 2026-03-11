import { db, schema } from "@/lib/db";
import { eq, and, or } from "drizzle-orm";
import jwt from "jsonwebtoken";
import { readFile } from "fs/promises";
import path from "path";

export const dynamic = "force-dynamic";

// NOTE: The real purchasable book file should be placed at private/capitalCode_full.pdf
// Once the file is ready, purchases with DIGITAL or BUNDLE edition will allow download.
const BOOK_FILE = path.join(process.cwd(), "private", "capitalCode_full.pdf");

function verifyToken(token) {
    try {
        return jwt.verify(token, process.env.JWT_SECRET || "your-secret-key");
    } catch {
        return null;
    }
}

export async function GET(request) {
    // 1. Verify auth token
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "");

    if (!token) {
        return new Response(
            JSON.stringify({ success: false, message: "Authentication required" }),
            { status: 401, headers: { "Content-Type": "application/json" } }
        );
    }

    const decoded = verifyToken(token);
    if (!decoded) {
        return new Response(
            JSON.stringify({ success: false, message: "Invalid token" }),
            { status: 401, headers: { "Content-Type": "application/json" } }
        );
    }

    try {
        // 2. Check user has a completed DIGITAL or BUNDLE purchase
        const eligible = await db
            .select({ id: schema.purchases.id })
            .from(schema.purchases)
            .where(
                and(
                    eq(schema.purchases.userId, decoded.userId),
                    eq(schema.purchases.status, "completed"),
                    or(
                        eq(schema.purchases.planName, "DIGITAL"),
                        eq(schema.purchases.planName, "BUNDLE")
                    )
                )
            )
            .all();

        if (!eligible || eligible.length === 0) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: "No eligible purchase found for digital download",
                }),
                { status: 403, headers: { "Content-Type": "application/json" } }
            );
        }

        // 3. Stream the full book PDF
        let fileBuffer;
        try {
            fileBuffer = await readFile(BOOK_FILE);
        } catch {
            return new Response(
                JSON.stringify({ success: false, message: "Book file not available yet" }),
                { status: 503, headers: { "Content-Type": "application/json" } }
            );
        }

        return new Response(fileBuffer, {
            status: 200,
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": 'attachment; filename="CapitalCode.pdf"',
                "Cache-Control": "no-store",
            },
        });
    } catch (error) {
        console.error("Download error:", error);
        return new Response(
            JSON.stringify({ success: false, message: "Failed to process download" }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}
