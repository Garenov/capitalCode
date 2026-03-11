/**
 * Central API fetch helper for Next.js → Elysia backend calls.
 * Reads NEXT_PUBLIC_API_URL at runtime so it works both in dev (localhost:4000)
 * and in production (https://api.youromain.com).
 */

const API_BASE =
    (typeof process !== "undefined" && process.env.NEXT_PUBLIC_API_URL) ||
    "http://localhost:4000";

/**
 * @param {string} path  — e.g. "/auth/login"
 * @param {RequestInit} options — standard fetch options
 */
export async function apiFetch(path, options = {}) {
    const url = `${API_BASE}${path}`;
    const res = await fetch(url, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...options.headers,
        },
    });
    return res;
}

/**
 * Shorthand for authenticated requests — reads token from localStorage.
 * Only call from client components.
 */
export function authFetch(path, options = {}) {
    const token =
        typeof window !== "undefined" ? localStorage.getItem("authToken") ?? "" : "";
    return apiFetch(path, {
        ...options,
        headers: {
            ...options.headers,
            Authorization: `Bearer ${token}`,
        },
    });
}
