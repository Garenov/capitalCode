import { defineConfig } from "drizzle-kit";

// Load .env locally (no-op in production where env vars are set directly)
import "dotenv/config";

export default defineConfig({
    schema: "./lib/schema.ts",
    out: "./drizzle",
    dialect: "turso",
    dbCredentials: {
        url: process.env.TURSO_DATABASE_URL!,
        authToken: process.env.TURSO_AUTH_TOKEN!,
    },
});
