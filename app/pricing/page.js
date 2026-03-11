"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/app/components/Header";
import styles from "./pricing.module.css";
import { useToast } from "@/app/components/Toast";

const pricingPlans = [
  {
    id: 1,
    name: "DIGITAL",
    price: "299",
    currency: "Kč",
    period: "one-time",
    devices: 1,
    description: "Digital edition of The Capital Code in PDF format. Instant access to all chapters — read on any device.",
    features: [
      "Downloadable PDF (250+ pages)",
      "Instant access after purchase",
      "Readable on all devices",
      "Full-text search",
      "Lifetime updates",
      "Copy-paste code snippets",
    ],
    highlighted: false,
    badge: "Fastest Access",
    downloadable: true,
  },
  {
    id: 2,
    name: "PHYSICAL",
    price: "599",
    currency: "Kč",
    period: "one-time",
    devices: 1,
    description: "Printed hardcover edition of The Capital Code. Premium paper, professional print, and free shipping.",
    features: [
      "Hardcover, premium print",
      "250+ pages of quality paper",
      "Free shipping",
      "Full-color diagrams & illustrations",
      "Perfect for margin notes",
      "Collector's edition",
    ],
    highlighted: true,
    badge: "Most Popular",
    downloadable: false,
  },
  {
    id: 3,
    name: "BUNDLE",
    price: "799",
    currency: "Kč",
    period: "one-time",
    devices: 1,
    description: "Complete package: printed book + digital PDF + bonus content. Best value for serious developers.",
    features: [
      "Everything in DIGITAL + PHYSICAL",
      "Source code for all examples",
      "Video tutorials (5+ hours)",
      "Bonus chapter: Advanced Topics",
      "Private Discord community access",
      "Priority author support",
    ],
    highlighted: false,
    badge: "Best Value",
    downloadable: true,
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
        body: JSON.stringify({ planName: plan.name }),
      });

      const data = await res.json();

      if (!data.success) {
        toast.error(data.message || "Failed to start payment.");
        return;
      }

      // Redirect to Stripe Checkout
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
            <div className={styles.header}>
              <h1 className={styles.title}>The Capital Code Book</h1>
              <p className={styles.subtitle}>Learn to invest like a professional</p>
            </div>
            <div className={styles.pricingGrid}>
              {pricingPlans.map((plan) => (
                <div key={plan.id} className={`${styles.card} ${plan.highlighted ? styles.highlighted : ""}`}>
                  {plan.highlighted && <div className={styles.highlightBadge}>MOST POPULAR EDITION</div>}

                  <div className={styles.cardHeader}>
                    <h2 className={styles.planName}>{plan.name}</h2>
                    {plan.badge && <p className={styles.promotionBadge}>{plan.badge}</p>}
                  </div>

                  <p className={styles.description}>{plan.description}</p>

                  <div className={styles.specs}>
                    <div className={styles.spec}>
                      <span className={styles.label}>QUANTITY</span>
                      <div className={styles.specValue}>
                        <span className={styles.number}>{plan.devices}</span>
                      </div>
                    </div>
                  </div>

                  <div className={styles.priceSection}>
                    <div className={styles.price}>
                      <span className={styles.amount}>{plan.price}</span>
                      <span className={styles.currencySmall}>{plan.currency}</span>
                    </div>
                    <p style={{ fontSize: 12, color: "#888", margin: "4px 0 0" }}>Secure payment via Stripe</p>
                  </div>

                  <button
                    className={`${styles.buyButton} ${plan.highlighted ? styles.buyButtonHighlighted : ""}`}
                    onClick={() => handleBuy(plan)}
                    disabled={loadingPlan === plan.id}
                  >
                    {loadingPlan === plan.id ? "Redirecting…" : "BUY NOW"}
                  </button>

                  <button className={styles.featuresToggle} onClick={() => toggleFeatures(plan.id)}>
                    <span>Key Features</span>
                    <span className={styles.toggleIcon}>{expandedPlan === plan.id ? "−" : "+"}</span>
                  </button>

                  {expandedPlan === plan.id && (
                    <div className={styles.featuresList}>
                      {plan.features.map((feature, idx) => (
                        <div key={idx} className={styles.featureItem}>
                          <span className={styles.featureBullet}>✓</span>
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
