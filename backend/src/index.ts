import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";

import { authRoutes } from "./routes/auth";
import { purchasesRoutes } from "./routes/purchases";
import { payoutsRoutes } from "./routes/payouts";
import { newsletterRoutes } from "./routes/newsletter";
import { adminRoutes } from "./routes/admin";
import { downloadRoute } from "./routes/download";
import { previewRoute } from "./routes/preview";
import { reviewsRoutes } from "./routes/reviews";

const PORT = Number(process.env.PORT ?? 4000);
const FRONTEND_URL = process.env.APP_URL ?? "http://localhost:3000";

const app = new Elysia()
    .use(
        cors({
            origin: [FRONTEND_URL, "http://localhost:3001"],
            credentials: true,
            methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
            allowedHeaders: [
                "Content-Type",
                "Authorization",
                "x-admin-key",
                "x-forwarded-for",
            ],
        })
    )

    // Health check
    .get("/health", () => ({
        status: "ok",
        timestamp: new Date().toISOString(),
        service: "capitalcode-api",
    }))

    // All API routes
    .use(authRoutes)
    .use(purchasesRoutes)
    .use(payoutsRoutes)
    .use(newsletterRoutes)
    .use(adminRoutes)
    .use(downloadRoute)
    .use(previewRoute)
    .use(reviewsRoutes)

    // Global error handler
    .onError(({ code, error, set }) => {
        console.error(`[${code}]`, error);
        if (code === "VALIDATION") {
            set.status = 400;
            return { success: false, message: "Invalid request data", details: error.message };
        }
        if (code === "NOT_FOUND") {
            set.status = 404;
            return { success: false, message: "Route not found" };
        }
        set.status = 500;
        return { success: false, message: "Internal server error" };
    })

    .listen(PORT);

console.log(
    `🦊 The Capital Code API running on http://localhost:${PORT}`
);

export type App = typeof app;
