/**
 * Creates Stripe products and prices for all plans.
 * Also fetches correct price IDs for existing products.
 * 
 * Usage: node scripts/create-stripe-prices.js
 */

const Stripe = require("stripe");

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY 
  || "sk_test_51TDqWkFqF2q5w0tw4MEfGYMbs2hhLJQDAq2WTNbbHOaYqDfjenNriFva5bVYq7tmCKYdkOWEZfvQkXtFjxwuR2xW00zuX7lu5p";

const stripe = new Stripe(STRIPE_SECRET_KEY, { apiVersion: "2024-12-18.acacia" });

const PLANS_TO_CREATE = [
  {
    envKey: "STRIPE_PRICE_BOOK",
    name: "The Capital Code – Book",
    description: "Full digital PDF (250+ pages). Instant access, lifetime updates.",
    priceUsd: 2000, // $20.00 in cents
    recurring: false,
  },
  {
    envKey: "STRIPE_PRICE_PREMIUM",
    name: "The Capital Code – Premium Book",
    description: "Everything in Book plus bonus chapters, source code, and exclusive case studies.",
    priceUsd: 2500, // $25.00 in cents
    recurring: false,
  },
  {
    envKey: "STRIPE_PRICE_DISCORD",
    name: "The Capital Code – Discord Access",
    description: "Private Discord community with live trading signals, market analysis, and direct author Q&A.",
    priceUsd: 500, // $5.00/month in cents
    recurring: true,
  },
];

// Existing product IDs from .env.local that need price IDs fetched
const EXISTING_PRODUCTS = [
  { envKey: "STRIPE_PRICE_DIGITAL", productId: "prod_UCF59cCbjwIxSQ" },
  { envKey: "STRIPE_PRICE_PHYSICAL", productId: "prod_UCF6PcW6bNKWuR" },
  { envKey: "STRIPE_PRICE_BUNDLE", productId: "prod_UCF7QP57HAY9lg" },
];

async function main() {
  console.log("🔧 Creating Stripe products and prices...\n");

  const envLines = [];

  // 1. Create new products + prices
  for (const plan of PLANS_TO_CREATE) {
    try {
      console.log(`Creating product: ${plan.name}`);
      const product = await stripe.products.create({
        name: plan.name,
        description: plan.description,
      });

      const priceData = {
        product: product.id,
        unit_amount: plan.priceUsd,
        currency: "usd",
      };

      if (plan.recurring) {
        priceData.recurring = { interval: "month" };
      }

      const price = await stripe.prices.create(priceData);

      console.log(`  ✅ Product: ${product.id}`);
      console.log(`  ✅ Price:   ${price.id}`);
      envLines.push(`${plan.envKey}=${price.id}`);
    } catch (err) {
      console.error(`  ❌ Failed: ${err.message}`);
    }
    console.log();
  }

  // 2. Fetch price IDs for existing products
  for (const existing of EXISTING_PRODUCTS) {
    try {
      console.log(`Fetching prices for product: ${existing.productId}`);
      const prices = await stripe.prices.list({
        product: existing.productId,
        active: true,
        limit: 1,
      });

      if (prices.data.length > 0) {
        const priceId = prices.data[0].id;
        console.log(`  ✅ Price: ${priceId}`);
        envLines.push(`${existing.envKey}=${priceId}`);
      } else {
        console.log(`  ⚠️  No active prices found for ${existing.productId}`);
        envLines.push(`# ${existing.envKey}= (no active price found for ${existing.productId})`);
      }
    } catch (err) {
      console.error(`  ❌ Failed: ${err.message}`);
    }
    console.log();
  }

  // 3. Print .env block
  console.log("═".repeat(60));
  console.log("📋 Copy these into your .env and .env.local files:");
  console.log("═".repeat(60));
  console.log();
  console.log("# ─── Stripe Price IDs ────────────────────────────────────────");
  for (const line of envLines) {
    console.log(line);
  }
  console.log();
}

main().catch(console.error);
