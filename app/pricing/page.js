"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Header from "@/app/components/Header";
import styles from "./pricing.module.css";

export default function Pricing() {
  const router = useRouter();
  const [expandedPlan, setExpandedPlan] = useState(null);
  const [cartItems, setCartItems] = useState({});

  const pricingPlans = [
    {
      id: 1,
      name: "DIGITAL",
      price: "299",
      currency: "Kč",
      period: "jednorázově",
      devices: 1,
      description: "Digitální verze knihy Capital Code v PDF formátu. Okamžitý přístup ke všem kapitolám a možnost číst na jakémkoliv zařízení.",
      features: [
        "PDF ke stažení (250+ stran)",
        "Okamžitý přístup po nákupu",
        "Čitelné na všech zařízeních",
        "Vyhledávání v textu",
        "Celoživotní aktualizace",
        "Kopírovatelné ukázky kódu",
      ],
      highlighted: false,
      badge: "Nejrychlejší přístup",
      downloadable: true
    },
    {
      id: 2,
      name: "PHYSICAL",
      price: "599",
      currency: "Kč",
      period: "jednorázově",
      devices: 1,
      description: "Tištená verze knihy Capital Code v pevné vazbě. Prémiový papír, profesionální tisk a doprava zdarma.",
      features: [
        "Pevná vazba, prémiový tisk",
        "250+ stran kvalitního papíru",
        "Doprava zdarma",
        "Barevné diagramy a ilustrace",
        "Ideální pro poznámky",
        "Sběratelská edice",
      ],
      highlighted: true,
      badge: "Nejoblíbenější volba",
      downloadable: false
    },
    {
      id: 3,
      name: "BUNDLE",
      price: "799",
      currency: "Kč",
      period: "jednorázově",
      devices: 1,
      description: "Kompletní balíček: tištená kniha + digitální PDF + bonusový obsah. Nejlepší hodnota pro seriózní vývojáře.",
      features: [
        "Vše z DIGITAL + PHYSICAL",
        "Zdrojové kódy všech příkladů",
        "Video tutoriály (5+ hodin)",
        "Bonusová kapitola: Advanced Topics",
        "Přístup do privátní Discord komunity",
        "Prioritní podpora autora",
      ],
      highlighted: false,
      badge: "Nejlepší hodnota",
      downloadable: true
    },
  ];

  const toggleFeatures = (id) => {
    setExpandedPlan(expandedPlan === id ? null : id);
  };

  const handleAddToCart = (plan) => {
    // Get existing cart from localStorage
    const existingCart = localStorage.getItem("cart");
    let cart = existingCart ? JSON.parse(existingCart) : [];

    // Check if item already exists in cart
    const existingItemIndex = cart.findIndex(item => item.id === plan.id);

    if (existingItemIndex > -1) {
      // Increase quantity if item exists
      cart[existingItemIndex].quantity += 1;
    } else {
      // Add new item to cart
      const cleanPrice = parseInt(plan.price.replace(/\s/g, ''));
      cart.push({
        id: plan.id,
        name: plan.name,
        price: cleanPrice,
        description: plan.description,
        downloadable: plan.downloadable,
        quantity: 1
      });
    }

    // Save to localStorage
    localStorage.setItem("cart", JSON.stringify(cart));

    // Show confirmation and navigate to cart
    alert(`${plan.name} edice přidána do košíku!`);
    router.push('/cart');
  };

  const handleDeviceChange = (planId, increment) => {
    console.log(`Plan ${planId}: device change ${increment ? '+' : '-'}`);
  };

  const handleYearChange = (planId, increment) => {
    console.log(`Plan ${planId}: year change ${increment ? '+' : '-'}`);
  };

  return (
    <div className={styles.page}>
      <Header />
      <main className={styles.mainContent}>
        <div className={styles.container}>
          <div className={styles.background}></div>

          <div className={styles.content}>
            <div className={styles.header}>
              <h1 className={styles.title}>Capital Code Kniha</h1>
              <p className={styles.subtitle}>Naučte se programovat jako profesionál</p>
            </div>

            <div className={styles.pricingGrid}>
              {pricingPlans.map((plan) => (
                <div
                  key={plan.id}
                  className={`${styles.card} ${plan.highlighted ? styles.highlighted : ""
                    }`}
                >
                  {plan.highlighted && (
                    <div className={styles.highlightBadge}>
                      NEJOBLÍBENĚJŠÍ EDICE
                    </div>
                  )}

                  <div className={styles.cardHeader}>
                    <h2 className={styles.planName}>{plan.name}</h2>
                    {plan.badge && (
                      <p className={styles.promotionBadge}>{plan.badge}</p>
                    )}
                  </div>

                  <p className={styles.description}>{plan.description}</p>

                  <div className={styles.specs}>
                    <div className={styles.spec}>
                      <span className={styles.label}>POČET KUSŮ</span>
                      <div className={styles.specValue}>
                        <span className={styles.number}>{plan.devices}</span>
                        <button
                          className={styles.specButton}
                          onClick={() => handleDeviceChange(plan.id, false)}
                        >−</button>
                        <button
                          className={styles.specButton}
                          onClick={() => handleDeviceChange(plan.id, true)}
                        >+</button>
                      </div>
                    </div>
                  </div>

                  <div className={styles.priceSection}>
                    <div className={styles.price}>
                      <span className={styles.amount}>{plan.price}</span>
                      <span className={styles.currencySmall}>{plan.currency}</span>
                    </div>
                  </div>

                  <button
                    className={`${styles.buyButton} ${plan.highlighted ? styles.buyButtonHighlighted : ""
                      }`}
                    onClick={() => handleAddToCart(plan)}
                  >
                    {plan.downloadable ? "PŘIDAT DO KOŠÍKU" : "PŘIDAT DO KOŠÍKU"}
                  </button>

                  <button
                    className={styles.featuresToggle}
                    onClick={() => toggleFeatures(plan.id)}
                  >
                    <span>Klíčové funkce</span>
                    <span className={styles.toggleIcon}>
                      {expandedPlan === plan.id ? "−" : "+"}
                    </span>
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
