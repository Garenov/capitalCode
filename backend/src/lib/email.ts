/**
 * Shared email utility for the Elysia backend.
 * Uses the Resend HTTP API (no SDK needed — just fetch).
 *
 * Required env vars (from backend/.env):
 *   RESEND_API_KEY  — Resend API key
 *   EMAIL_FROM      — verified sender, e.g. "Verify <info@thecapitalcode.net>"
 *   APP_URL         — public frontend URL for links in emails
 */

const RESEND_ENDPOINT = "https://api.resend.com/emails";

function getApiKey(): string {
    const key = process.env.RESEND_API_KEY;
    if (!key) throw new Error("RESEND_API_KEY is not set in .env");
    return key;
}

function getFrom(): string {
    return process.env.EMAIL_FROM ?? "The Capital Code <noreply@thecapitalcode.net>";
}

export function getAppUrl(): string {
    return process.env.APP_URL ?? "http://localhost:3000";
}

/** Escape HTML special characters to prevent XSS in email templates */
export function escapeHtml(str: string | null | undefined): string {
    if (!str) return "";
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

/**
 * Send an email via the Resend API.
 * In dev mode (no API key or placeholder key), logs to console instead.
 */
export async function sendEmail(to: string, subject: string, html: string): Promise<void> {
    const apiKey = process.env.RESEND_API_KEY;
    const from = getFrom();

    // Dev mode: mock email if no real API key
    if (!apiKey || apiKey.startsWith("re_your") || apiKey === "re_...") {
        console.log(`[EMAIL MOCK] To: ${to} | Subject: ${subject}`);
        return;
    }

    const res = await fetch(RESEND_ENDPOINT, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ from, to, subject, html }),
    });

    if (!res.ok) {
        const body = await res.text();
        console.error(`[EMAIL ERROR] ${res.status} ${res.statusText}: ${body}`);
        throw new Error(`Failed to send email: ${res.statusText}`);
    }
}

// ── Pre-built email templates ──────────────────────────────────────

/**
 * Newsletter subscription confirmation (double opt-in).
 */
export async function sendNewsletterConfirmation(to: string, name: string | null, confirmUrl: string): Promise<void> {
    const safeName = escapeHtml(name) || "there";
    await sendEmail(
        to,
        "Confirm your subscription — The Capital Code",
        `<div style="font-family:sans-serif;max-width:600px;margin:auto;padding:32px;background:#0d1b35;color:#f0f0f0;border-radius:12px">
            <h1 style="color:#e0c73a;margin:0 0 16px">Confirm your subscription</h1>
            <p style="line-height:1.7;color:#d0d0d0">Hi ${safeName},</p>
            <p style="line-height:1.7;color:#d0d0d0">Please confirm your subscription by clicking the button below:</p>
            <a href="${confirmUrl}"
               style="display:inline-block;margin:24px 0;padding:14px 28px;background:#e0c73a;color:#0a1428;border-radius:8px;text-decoration:none;font-weight:700;font-size:16px">
                Confirm Subscription
            </a>
            <p style="font-size:13px;color:#888">If you didn't sign up, ignore this email.</p>
            <hr style="border-color:#273d69;margin:24px 0"/>
            <p style="font-size:12px;color:#666">© ${new Date().getFullYear()} The Capital Code</p>
        </div>`,
    );
}

/**
 * Newsletter welcome email after confirmation.
 */
export async function sendNewsletterWelcome(to: string, name: string | null, unsubUrl: string): Promise<void> {
    const safeName = escapeHtml(name) || "there";
    await sendEmail(
        to,
        "Welcome to The Capital Code Newsletter",
        `<div style="font-family:sans-serif;max-width:600px;margin:auto;padding:32px;background:#0d1b35;color:#f0f0f0;border-radius:12px">
            <h1 style="color:#e0c73a;margin:0 0 16px">Welcome! 🎉</h1>
            <p style="line-height:1.7;color:#d0d0d0">Hi ${safeName},</p>
            <p style="line-height:1.7;color:#d0d0d0">
                You're confirmed! Every week you'll receive carefully curated financial education content.
            </p>
            <p style="line-height:1.7;color:#d0d0d0;font-size:13px">
                ⚠️ All content is for educational purposes only. Not financial advice.
            </p>
            <hr style="border-color:#273d69;margin:24px 0"/>
            <p style="font-size:12px;color:#666">
                <a href="${unsubUrl}" style="color:#888">Unsubscribe</a><br/>
                © ${new Date().getFullYear()} The Capital Code
            </p>
        </div>`,
    );
}
