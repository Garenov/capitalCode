import { Elysia } from "elysia";
import { jwt } from "@elysiajs/jwt";

const JWT_SECRET = process.env.JWT_SECRET ?? "change-this-to-a-long-random-string";

/**
 * A reusable Elysia plugin that adds `.bearer` to the context.
 * Usage: `.use(authPlugin).derive(({ bearer }) => ...) `
 * Throws 401 if the Authorization header is missing/invalid.
 */
export const authPlugin = new Elysia({ name: "auth-plugin" })
    .use(
        jwt({
            name: "jwt",
            secret: JWT_SECRET,
            exp: "7d",
        })
    )
    .macro({
        isAuth: true,
    })
    .onBeforeHandle(async ({ jwt: jwtInstance, request, set }) => {
        const authHeader = request.headers.get("authorization") ?? "";
        const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : authHeader;
        if (!token) {
            set.status = 401;
            return { success: false, message: "Authentication required" };
        }
        const payload = await jwtInstance.verify(token);
        if (!payload) {
            set.status = 401;
            return { success: false, message: "Invalid or expired token" };
        }
    })
    .derive(async ({ jwt: jwtInstance, request }) => {
        const authHeader = request.headers.get("authorization") ?? "";
        const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : authHeader;
        const payload = (await jwtInstance.verify(token)) as { userId: number; email: string } | false;
        return {
            user: payload as { userId: number; email: string },
        };
    });
