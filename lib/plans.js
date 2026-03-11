/**
 * Single source of truth for plan definitions.
 * Prices are in CZK (whole korunas). Stripe uses haléře (×100).
 *
 * After creating products in the Stripe Dashboard, paste the
 * Price IDs below. e.g. price_1ABC...
 */
export const PLANS = {
    DIGITAL: {
        name: "DIGITAL",
        label: "Digitální edice",
        priceKc: 299,
        // Replace with your real Stripe Price ID
        stripePriceId: process.env.STRIPE_PRICE_DIGITAL || "price_REPLACE_DIGITAL",
        currency: "CZK",
        downloadable: true,
    },
    PHYSICAL: {
        name: "PHYSICAL",
        label: "Tištěná edice",
        priceKc: 599,
        stripePriceId: process.env.STRIPE_PRICE_PHYSICAL || "price_REPLACE_PHYSICAL",
        currency: "CZK",
        downloadable: false,
    },
    BUNDLE: {
        name: "BUNDLE",
        label: "Bundle edice",
        priceKc: 799,
        stripePriceId: process.env.STRIPE_PRICE_BUNDLE || "price_REPLACE_BUNDLE",
        currency: "CZK",
        downloadable: true,
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
