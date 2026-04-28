"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import styles from "./qna.module.css";
import { useLanguage } from "@/lib/i18n";

const faqItems = [
  {
    id: 1,
    question: "What is The Capital Code?",
    answer:
      "The Capital Code is a comprehensive guide to financial strategies, investing, and building long-term wealth. It combines theory with practical advice for disciplined investors.",
  },
  {
    id: 2,
    question: "What's the difference between digital and physical editions?",
    answer:
      "The digital edition is a downloadable PDF available immediately after purchase. The physical edition is a printed book shipped to your address. The bundle includes both at a discounted price.",
  },
  {
    id: 3,
    question: "How does payment work?",
    answer:
      "Payments are processed securely via Stripe. We accept most major credit and debit cards. You'll receive a confirmation email after successful payment.",
  },
  {
    id: 4,
    question: "How do I download the digital edition?",
    answer:
      "After payment, log in to your account and navigate to 'My Orders'. You'll find a download button for the PDF there.",
  },
  {
    id: 5,
    question: "Can I get a refund?",
    answer:
      "Digital products cannot be refunded once downloaded. Physical books can be returned within 14 days of delivery in original condition.",
  },
  {
    id: 6,
    question: "Do I need an account to purchase?",
    answer:
      "Yes, you need to create an account and verify your email before making a purchase. This ensures you have access to your orders and downloads.",
  },
  {
    id: 7,
    question: "How long does physical delivery take?",
    answer:
      "Standard delivery takes 3–7 business days within the Czech Republic. You'll receive an email with tracking information once your order ships.",
  },
  {
    id: 8,
    question: "How do I subscribe to updates?",
    answer:
      "You can find the newsletter subscription form on the homepage. Enter your email and we'll keep you updated about new chapters and exclusive content.",
  },
];

export default function QnA() {
  const { t } = useLanguage();
  const router = useRouter();
  const [expandedFaq, setExpandedFaq] = useState(null);

  const toggleFaq = (id) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  return (
    <div className={styles.page}>
      <Header />
      <main className={styles.mainContent}>
        <div className={styles.container}>

          {/* ── Hero ── */}
          <div className={styles.heroHeader}>
            <h1 className={styles.heroTitle}>Questions & Answers</h1>
            <p className={styles.heroSubtitle}>
              Everything you need to know about The Capital Code — editions, payments, delivery, and more.
            </p>
          </div>

          {/* ── FAQ List ── */}
          <section className={styles.faqSection}>
            <div className={styles.faqList}>
              {faqItems.map((item) => (
                <div
                  key={item.id}
                  className={`${styles.faqItem} ${expandedFaq === item.id ? styles.faqItemExpanded : ""}`}
                >
                  <button
                    className={styles.faqQuestion}
                    onClick={() => toggleFaq(item.id)}
                    aria-expanded={expandedFaq === item.id}
                  >
                    <span>{item.question}</span>
                    <span className={styles.faqChevron}>
                      {expandedFaq === item.id ? "−" : "+"}
                    </span>
                  </button>
                  {expandedFaq === item.id && (
                    <div className={styles.faqAnswer}>
                      <p>{item.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* ── CTA to Tech Support ── */}
          <div className={styles.ctaBanner}>
            <div className={styles.ctaContent}>
              <span className={styles.ctaIcon}>🛠️</span>
              <div>
                <p className={styles.ctaTitle}>Having a technical issue?</p>
                <p className={styles.ctaDesc}>Our tech support team is ready to help you resolve any problems.</p>
              </div>
            </div>
            <button
              className={styles.ctaButton}
              onClick={() => router.push("/support")}
            >
              Go to Tech Support →
            </button>
          </div>

        </div>
      </main>
      <Footer />
    </div>
  );
}
