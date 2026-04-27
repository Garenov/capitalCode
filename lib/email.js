import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = process.env.EMAIL_FROM || "Verify <info@thecapitalcode.net>";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://www.thecapitalcode.net";

/** Escape HTML special characters to prevent XSS in email templates */
function escapeHtml(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

/**
 * Send email verification link to a newly registered user.
 */
export async function sendVerificationEmail({ to, name, token }) {
    const link = `${APP_URL}/verify?token=${token}`;

    await resend.emails.send({
        from: FROM,
        to,
        subject: "Verify your email – The Capital Code",
        html: `
      <div style="font-family:sans-serif;max-width:600px;margin:auto;padding:32px;background:#0d1b35;color:#f0f0f0;border-radius:12px">
        <h1 style="color:#e0c73a;margin:0 0 16px">Welcome, ${escapeHtml(name)}!</h1>
        <p style="line-height:1.7;color:#d0d0d0">
          Thank you for signing up. Click the button below to verify your email.
          This link is valid for 24 hours.
        </p>
        <a href="${link}"
           style="display:inline-block;margin:24px 0;padding:14px 28px;background:#e0c73a;color:#0a1428;border-radius:8px;text-decoration:none;font-weight:700;font-size:16px">
          Verify Email
        </a>
        <p style="font-size:13px;color:#888">If you did not sign up, you can ignore this email.</p>
        <hr style="border-color:#273d69;margin:24px 0"/>
        <p style="font-size:12px;color:#666">© ${new Date().getFullYear()} The Capital Code</p>
      </div>
    `,
    });
}

/**
 * Send purchase confirmation after successful Stripe payment.
 */
export async function sendPurchaseConfirmation({ to, name, planName, priceUsd, downloadable }) {
    const downloadSection = downloadable
        ? `<p style="line-height:1.7;color:#d0d0d0">Your PDF download is available in the <a href="${APP_URL}/user" style="color:#e0c73a">My Orders</a> section.</p>`
        : `<p style="line-height:1.7;color:#d0d0d0">Your book is being prepared for shipping. We will contact you with delivery information.</p>`;

    await resend.emails.send({
        from: FROM,
        to,
        subject: `Order Confirmation – ${planName} – The Capital Code`,
        html: `
      <div style="font-family:sans-serif;max-width:600px;margin:auto;padding:32px;background:#0d1b35;color:#f0f0f0;border-radius:12px">
        <h1 style="color:#e0c73a;margin:0 0 16px">Payment Received ✓</h1>
        <p style="line-height:1.7;color:#d0d0d0">Hello, <strong>${escapeHtml(name)}</strong>!</p>
        <p style="line-height:1.7;color:#d0d0d0">Your order has been successfully completed.</p>
        <div style="background:#1a3050;border-radius:8px;padding:16px;margin:20px 0">
          <p style="margin:4px 0;color:#aaa;font-size:13px">Product</p>
          <p style="margin:0;font-size:18px;font-weight:700;color:#e0c73a">${escapeHtml(planName)}</p>
          <p style="margin:8px 0 0;color:#d0d0d0;font-size:15px">$${priceUsd} USD</p>
        </div>
        ${downloadSection}
        <hr style="border-color:#273d69;margin:24px 0"/>
        <p style="font-size:12px;color:#666">© ${new Date().getFullYear()} The Capital Code</p>
      </div>
    `,
    });
}

/**
 * Send book update notification to a single subscriber.
 */
export async function sendBookUpdateNotification({ to, name, subject, message, unsubscribeToken }) {
    const unsubscribeLink = `${APP_URL}/api/notify/unsubscribe?token=${unsubscribeToken}`;

    await resend.emails.send({
        from: FROM,
        to,
        subject,
        html: `
      <div style="font-family:sans-serif;max-width:600px;margin:auto;padding:32px;background:#0d1b35;color:#f0f0f0;border-radius:12px">
        <h1 style="color:#e0c73a;margin:0 0 16px">📖 News – The Capital Code</h1>
        ${name ? `<p style="color:#d0d0d0">Hello, <strong>${escapeHtml(name)}</strong>!</p>` : ""}
        <div style="line-height:1.8;color:#d0d0d0;white-space:pre-line">${message}</div>
        <div style="margin-top:28px">
          <a href="${APP_URL}/pricing"
             style="display:inline-block;padding:12px 24px;background:#e0c73a;color:#0a1428;border-radius:8px;text-decoration:none;font-weight:700">
            Buy the Book
          </a>
        </div>
        <hr style="border-color:#273d69;margin:24px 0"/>
        <p style="font-size:12px;color:#666">
          Unsubscribe: <a href="${unsubscribeLink}" style="color:#888">click here</a><br/>
          © ${new Date().getFullYear()} The Capital Code
        </p>
      </div>
    `,
    });
}

/**
 * Send notification subscription confirmation.
 */
export async function sendSubscribeConfirmation({ to, name, unsubscribeToken }) {
    const unsubscribeLink = `${APP_URL}/api/notify/unsubscribe?token=${unsubscribeToken}`;

    await resend.emails.send({
        from: FROM,
        to,
        subject: "You're subscribed to updates – The Capital Code",
        html: `
      <div style="font-family:sans-serif;max-width:600px;margin:auto;padding:32px;background:#0d1b35;color:#f0f0f0;border-radius:12px">
        <h1 style="color:#e0c73a;margin:0 0 16px">Thanks for subscribing! 🎉</h1>
        ${name ? `<p style="color:#d0d0d0">Hello, <strong>${escapeHtml(name)}</strong>!</p>` : ""}
        <p style="line-height:1.7;color:#d0d0d0">
          We'll keep you informed about The Capital Code updates, new chapters, and exclusive content.
        </p>
        <hr style="border-color:#273d69;margin:24px 0"/>
        <p style="font-size:12px;color:#666">
          Unsubscribe: <a href="${unsubscribeLink}" style="color:#888">click here</a><br/>
          © ${new Date().getFullYear()} The Capital Code
        </p>
      </div>
    `,
    });
}
