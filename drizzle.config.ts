import { defineConfig } from "drizzle-kit";

export default defineConfig({
    schema: "./lib/schema.ts",
    out: "./drizzle",
    dialect: "turso",
    dbCredentials: {
        url: "libsql://ccd-garenov.aws-eu-west-1.turso.io",
        authToken: "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NzA1NjY4NDQsImlkIjoiZTc3MDIwNzItZjAyYS00OWFiLThmM2QtOGVkOTQwZDgyNmYxIiwicmlkIjoiNzljYTlhYTgtNmU3NS00NGY3LWI0Y2UtOTVjNGU4MDRkMDkyIn0.8rRL3cE9RNZnrRtj3EFM3d34exqJgf8GA1Tbru0jcozwC8XTTYMzKZWduq9gm6UyzOxIl-qrTS_xkhKHTVEJCQ",
    },
});
