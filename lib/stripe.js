// Use require() to force CJS resolution — fixes Turbopack's ESM resolution issue with stripe
const Stripe = require("stripe");

// Lazy singleton
let _stripe = null;

export function getStripe() {
    if (!_stripe) {
        if (!process.env.STRIPE_SECRET_KEY) {
            throw new Error("STRIPE_SECRET_KEY is not set");
        }
        // stripe exports a named export default; handle both ESM/CJS shapes
        const StripeClass = Stripe.default ?? Stripe;
        _stripe = new StripeClass(process.env.STRIPE_SECRET_KEY, {
            apiVersion: "2024-12-18.acacia",
        });
    }
    return _stripe;
}
