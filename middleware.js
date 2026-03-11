import { NextResponse } from "next/server";

export function middleware(request) {
    const { pathname } = request.nextUrl;

    if (pathname === "/ccBook.pdf") {
        // Allow the request if it comes from an <iframe> embed.
        // Browsers set Sec-Fetch-Dest: "iframe" for embedded frame requests.
        const fetchDest = request.headers.get("sec-fetch-dest");
        if (fetchDest === "iframe" || fetchDest === "document" || fetchDest === "empty") {
            return NextResponse.next();
        }

        // Block direct navigation (e.g. user opens the URL in a new tab / downloads it).
        return NextResponse.redirect(new URL("/pricing", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/ccBook.pdf"],
};
