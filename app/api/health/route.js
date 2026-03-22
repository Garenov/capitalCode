// Health check endpoint for Render.com
// Render pings this URL to verify the service is alive
export const dynamic = "force-dynamic";

export async function GET() {
    return Response.json(
        {
            status: "ok",
            timestamp: new Date().toISOString(),
            environment: process.env.NODE_ENV ?? "unknown",
        },
        {
            status: 200,
            headers: {
                // Don't cache — Render must see live status
                "Cache-Control": "no-store",
            },
        }
    );
}
