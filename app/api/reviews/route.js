import { db, schema } from "@/lib/db";
import { eq, desc } from "drizzle-orm";

export const dynamic = 'force-dynamic';

// Public — fetch all reviews (no auth required)
export async function GET() {
    try {
        const reviews = await db
            .select()
            .from(schema.reviews)
            .orderBy(desc(schema.reviews.createdAt));

        return new Response(
            JSON.stringify({ success: true, reviews }),
            { status: 200, headers: { "Content-Type": "application/json" } }
        );
    } catch (error) {
        console.error("Get reviews error:", error);
        return new Response(
            JSON.stringify({ success: false, message: error.message }),
            { status: 500 }
        );
    }
}

// Admin — create a new review
const ADMIN_KEY = process.env.ADMIN_KEY || "CC4P@dm1nKey";

export async function POST(request) {
    try {
        const adminKey = request.headers.get("x-admin-key");
        if (adminKey !== ADMIN_KEY) {
            return new Response(
                JSON.stringify({ success: false, message: "Unauthorized" }),
                { status: 401 }
            );
        }

        const body = await request.json();
        const { author, text, stars } = body;

        if (!author || !text) {
            return new Response(
                JSON.stringify({ success: false, message: "Author and text are required" }),
                { status: 400 }
            );
        }

        const [review] = await db
            .insert(schema.reviews)
            .values({
                author,
                text,
                stars: Math.min(5, Math.max(1, stars || 5)),
            })
            .returning();

        return new Response(
            JSON.stringify({ success: true, review }),
            { status: 201, headers: { "Content-Type": "application/json" } }
        );
    } catch (error) {
        console.error("Create review error:", error);
        return new Response(
            JSON.stringify({ success: false, message: error.message }),
            { status: 500 }
        );
    }
}

// Admin — delete a review
export async function DELETE(request) {
    try {
        const adminKey = request.headers.get("x-admin-key");
        if (adminKey !== ADMIN_KEY) {
            return new Response(
                JSON.stringify({ success: false, message: "Unauthorized" }),
                { status: 401 }
            );
        }

        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");

        if (!id) {
            return new Response(
                JSON.stringify({ success: false, message: "ID is required" }),
                { status: 400 }
            );
        }

        await db.delete(schema.reviews).where(eq(schema.reviews.id, Number(id)));

        return new Response(
            JSON.stringify({ success: true }),
            { status: 200, headers: { "Content-Type": "application/json" } }
        );
    } catch (error) {
        console.error("Delete review error:", error);
        return new Response(
            JSON.stringify({ success: false, message: error.message }),
            { status: 500 }
        );
    }
}
