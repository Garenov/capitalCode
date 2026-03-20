"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import styles from "./pricing.module.css";
import { useToast } from "@/app/components/Toast";

const pricingPlans = [
  {
    id: "BOOK",
    name: "Book",
    emoji: "📖",
    price: "$20",
    period: "one-time",
    badge: null,
    highlighted: false,
    description: "The Capital Code in a beautifully designed digital PDF. Instant access — read on any device, any time.",
    features: [
      "Full digital PDF (250+ pages)",
      "Instant access after purchase",
      "All devices supported",
      "Lifetime access & updates",
    ],
    cta: "Buy Now",
    note: "Secure one-time payment",
    recurring: false,
  },
  {
    id: "PREMIUM",
    name: "Premium Book",
    emoji: "⭐",
    price: "$25",
    period: "one-time",
    badge: "Best Value",
    highlighted: true,
    description: "Everything in Book, plus bonus chapters, source code examples, and exclusive case studies from real markets.",
    features: [
      "Everything in Book",
      "Bonus chapters & case studies",
      "Source code for all examples",
      "Priority support channel",
      "Downloadable worksheets",
    ],
    cta: "Get Premium",
    note: "Most popular choice",
    recurring: false,
  },
  {
    id: "DISCORD",
    name: "Discord Access",
    emoji: "💬",
    price: "$5",
    period: "/month",
    badge: "Free Trial",
    highlighted: false,
    description: "Join our private Discord community. Get live trading signals, market analysis, and talk directly with the author.",
    features: [
      "First 7 days completely free",
      "Private Discord server",
      "Live trading signals",
      "Market analysis & discussion",
      "Direct author Q&A",
      "Cancel anytime",
    ],
    cta: "Start Free Trial",
    note: "First week free · then $5/month",
    recurring: true,
  },
];

export default function Pricing() {
  const router = useRouter();
  const toast = useToast();
  const [expandedPlan, setExpandedPlan] = useState(null);
  const [loadingPlan, setLoadingPlan] = useState(null);

  const toggleFeatures = (id) => setExpandedPlan(expandedPlan === id ? null : id);

  const handleBuy = async (plan) => {
    const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;

    if (!token) {
      toast.warning("Please log in to make a purchase.");
      router.push("/");
      return;
    }

    setLoadingPlan(plan.id);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ planName: plan.id }),
      });

      const data = await res.json();

      if (!data.success) {
        toast.error(data.message || "Failed to start payment.");
        return;
      }

      window.location.href = data.url;
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <div className={styles.page}>
      <Header />
      <main className={styles.mainContent}>
        <div className={styles.container}>
          <div className={styles.background} />
          <div className={styles.content}>

            {/* Header */}
            <div className={styles.header}>
              <h1 className={styles.title}>Simple, Honest Pricing</h1>
              <p className={styles.subtitle}>Choose the plan that fits your learning style. No hidden fees.</p>
            </div>

            {/* Cards */}
            <div className={styles.pricingGrid}>
              {pricingPlans.map((plan) => (
                <div
                  key={plan.id}
                  className={`${styles.card} ${plan.highlighted ? styles.highlighted : ""}`}
                >
                  {/* Top badge (Most Popular) */}
                  {plan.highlighted && (
                    <div className={styles.highlightBadge}>⭐ BEST VALUE</div>
                  )}

                  {/* Plan emoji + name */}
                  <div className={styles.cardHeader}>
                    <span className={styles.planEmoji}>{plan.emoji}</span>
                    <h2 className={styles.planName}>{plan.name}</h2>
                    {plan.badge && !plan.highlighted && (
                      <span className={styles.sideBadge}>{plan.badge}</span>
                    )}
                  </div>

                  {/* Description */}
                  <p className={styles.description}>{plan.description}</p>

                  {/* Price block */}
                  <div className={styles.priceSection}>
                    <div className={styles.price}>
                      <span className={styles.amount}>{plan.price}</span>
                      {plan.period !== "one-time" && (
                        <span className={styles.period}>{plan.period}</span>
                      )}
                    </div>
                    {plan.recurring && (
                      <p className={styles.trialNote}>🎉 First 7 days completely FREE</p>
                    )}
                  </div>

                  {/* CTA */}
                  <button
                    className={`${styles.buyButton} ${plan.highlighted ? styles.buyButtonHighlighted : ""} ${plan.recurring ? styles.buyButtonSubscribe : ""}`}
                    onClick={() => handleBuy(plan)}
                    disabled={loadingPlan === plan.id}
                  >
                    {loadingPlan === plan.id ? "Redirecting…" : plan.cta}
                  </button>

                  <p className={styles.paymentNote}>{plan.note}</p>

                  {/* Features accordion */}
                  <button
                    className={styles.featuresToggle}
                    onClick={() => toggleFeatures(plan.id)}
                    aria-expanded={expandedPlan === plan.id}
                  >
                    <span>What&apos;s included</span>
                    <span className={styles.toggleIcon}>
                      {expandedPlan === plan.id ? "−" : "+"}
                    </span>
                  </button>

                  {expandedPlan === plan.id && (
                    <ul className={styles.featuresList}>
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className={styles.featureItem}>
                          <span className={styles.featureBullet}>✓</span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>

            {/* Security note */}
            <p className={styles.secureNote}>
              🔒 All payments secured by Stripe · Cancel subscription anytime
            </p>

          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
