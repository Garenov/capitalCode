import { readFile } from "fs/promises";
import path from "path";

export const dynamic = "force-dynamic";

// Serves ccBook.pdf for the iframe preview on the main page.
// Content-Disposition: inline makes it viewable in browser but not prompted as a download.
// No auth required — this is just a description/preview.
export async function GET() {
    try {
        const filePath = path.join(process.cwd(), "public", "ccBook.pdf");
        const fileBuffer = await readFile(filePath);

        return new Response(fileBuffer, {
            status: 200,
            headers: {
                "Content-Type": "application/pdf",
                // inline = browser renders it; no download prompt
                "Content-Disposition": "inline",
                // Prevent caching so the client can't easily save it
                "Cache-Control": "no-store",
                // Block embedding outside our own origin
                "X-Frame-Options": "SAMEORIGIN",
            },
        });
    } catch (error) {
        console.error("Preview error:", error);
        return new Response("Not found", { status: 404 });
    }
}
