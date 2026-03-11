import { Elysia } from "elysia";
import { readFile } from "fs/promises";
import path from "path";

const PREVIEW_FILE = path.join(process.cwd(), "..", "public", "ccBook.pdf");

export const previewRoute = new Elysia({ prefix: "/preview" })

    // No auth required — public preview of the sample book
    .get("/", async ({ set }) => {
        let fileBuffer: Buffer;
        try {
            fileBuffer = await readFile(PREVIEW_FILE);
        } catch {
            set.status = 404;
            return "Preview not found";
        }

        return new Response(fileBuffer, {
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": "inline",          // browser renders it, no download prompt
                "Cache-Control": "no-store",
                "X-Frame-Options": "SAMEORIGIN",          // only embeddable from same origin
            },
        });
    });
