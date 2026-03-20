/**
 * Single source of truth for plan definitions.
 * Prices in USD. Stripe uses cents (×100).
 *
 * After creating products in the Stripe Dashboard, paste the
 * Price IDs below. e.g. price_1ABC...
 */
export const PLANS = {
    // ── New plans ───────────────────────────────────────────────
    BOOK: {
        name: "BOOK",
        label: "Book",
        priceUsd: 20,
        stripePriceId: process.env.STRIPE_PRICE_BOOK || "price_REPLACE_BOOK",
        currency: "USD",
        downloadable: true,
        recurring: false,
    },
    PREMIUM: {
        name: "PREMIUM",
        label: "Premium Book",
        priceUsd: 25,
        stripePriceId: process.env.STRIPE_PRICE_PREMIUM || "price_REPLACE_PREMIUM",
        currency: "USD",
        downloadable: true,
        recurring: false,
    },
    DISCORD: {
        name: "DISCORD",
        label: "Discord Subscription",
        priceUsd: 5,
        stripePriceId: process.env.STRIPE_PRICE_DISCORD || "price_REPLACE_DISCORD",
        currency: "USD",
        downloadable: false,
        recurring: true,
        trialDays: 7, // first week free
    },

    // ── Legacy plans (kept for existing purchases) ───────────────
    DIGITAL: {
        name: "DIGITAL",
        label: "Digital Edition",
        priceKc: 299,
        stripePriceId: process.env.STRIPE_PRICE_DIGITAL || "price_REPLACE_DIGITAL",
        currency: "CZK",
        downloadable: true,
        recurring: false,
    },
    PHYSICAL: {
        name: "PHYSICAL",
        label: "Physical Edition",
        priceKc: 599,
        stripePriceId: process.env.STRIPE_PRICE_PHYSICAL || "price_REPLACE_PHYSICAL",
        currency: "CZK",
        downloadable: false,
        recurring: false,
    },
    BUNDLE: {
        name: "BUNDLE",
        label: "Bundle Edition",
        priceKc: 799,
        stripePriceId: process.env.STRIPE_PRICE_BUNDLE || "price_REPLACE_BUNDLE",
        currency: "USD",
        downloadable: true,
        recurring: false,
    },
};

/**
 * Validate that a claimed price matches the server-authoritative price.
 * Returns the canonical plan or null if invalid.
 */
export function validatePlan(planName, claimedPriceKc) {
    const plan = PLANS[planName];
    if (!plan) return null;
    if (claimedPriceKc !== undefined && claimedPriceKc !== plan.priceKc) return null;
    return plan;
}

