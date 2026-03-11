import { Elysia, t } from "elysia";
import { db, schema } from "../db";
import { asc } from "drizzle-orm";

const ADMIN_KEY = process.env.ADMIN_KEY ?? "CC4P@dm1nKey";

export const reviewsRoutes = new Elysia({ prefix: "/reviews" })

    // GET /reviews — public
    .get("/", async () => {
        const rows = await db
            .select()
            .from(schema.reviews)
            .orderBy(asc(schema.reviews.createdAt));
        return { success: true, reviews: rows };
    })

    // POST /reviews — admin only
    .post(
        "/",
        async ({ body, request, set }) => {
            const key = request.headers.get("x-admin-key");
            if (key !== ADMIN_KEY) { set.status = 401; return { success: false, message: "Unauthorized" }; }

            const [review] = await db
                .insert(schema.reviews)
                .values({ author: body.author, text: body.text, stars: body.stars ?? 5 })
                .returning();

            set.status = 201;
            return { success: true, review };
        },
        {
            body: t.Object({
                author: t.String({ minLength: 1 }),
                text: t.String({ minLength: 1 }),
                stars: t.Optional(t.Number({ minimum: 1, maximum: 5 })),
            }),
        }
    );
