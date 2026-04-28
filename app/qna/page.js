"use client";
import React, { useState } from "react";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import styles from "./qna.module.css";
import { useLanguage } from "@/lib/i18n";
import { useToast } from "@/app/components/Toast";

/* ── General Product Q&A ── */
const generalFaq = [
  {
    id: "g1",
    question: "What is The Capital Code?",
    answer:
      "The Capital Code is a comprehensive guide to financial strategies, investing, and building long-term wealth. It combines theory with practical advice for disciplined investors.",
  },
  {
    id: "g2",
    question: "What's the difference between digital and physical editions?",
    answer:
      "The digital edition is a downloadable PDF available immediately after purchase. The physical edition is a printed book shipped to your address. The bundle includes both at a discounted price.",
  },
  {
    id: "g3",
    question: "How does payment work?",
    answer:
      "Payments are processed securely via Stripe. We accept most major credit and debit cards. You'll receive a confirmation email after successful payment.",
  },
  {
    id: "g4",
    question: "Can I get a refund?",
    answer:
      "Digital products cannot be refunded once downloaded. Physical books can be returned within 14 days of delivery in original condition.",
  },
  {
    id: "g5",
    question: "Do I need an account to purchase?",
    answer:
      "Yes, you need to create an account and verify your email before making a purchase. This ensures you have access to your orders and downloads.",
  },
  {
    id: "g6",
    question: "How long does physical delivery take?",
    answer:
      "Standard delivery takes 3–7 business days within the Czech Republic. You'll receive an email with tracking information once your order ships.",
  },
  {
    id: "g7",
    question: "How do I subscribe to updates?",
    answer:
      "You can find the newsletter subscription form on the homepage. Enter your email and we'll keep you updated about new chapters and exclusive content.",
  },
];

/* ── Technical Support FAQ ── */
const techFaq = [
  {
    id: "t1",
    question: "I can't log in to my account. What should I do?",
    answer:
      "First, make sure you're using the correct email address. Try resetting your password via the login form. If you still can't access your account, submit a ticket below with your registered email.",
  },
  {
    id: "t2",
    question: "My PDF download isn't working. How do I fix it?",
    answer:
      "Ensure you're logged into the account that made the purchase. Go to 'My Orders' and click the download button. If the download fails, try a different browser or disable ad-blockers. Contact us if the issue persists.",
  },
  {
    id: "t3",
    question: "I didn't receive my verification email.",
    answer:
      "Check your spam/junk folder first. Verification emails are sent immediately after registration. If you still can't find it, submit a ticket and we'll manually verify your account.",
  },
  {
    id: "t4",
    question: "The website isn't loading properly on my device.",
    answer:
      "We support the latest versions of Chrome, Firefox, Safari, and Edge. Try clearing your browser cache and cookies, or use incognito/private mode. If the problem continues, let us know your device and browser version.",
  },
  {
    id: "t5",
    question: "My payment went through but I don't see my order.",
    answer:
      "Orders can take up to a few minutes to appear. Try refreshing your account page. If the order still doesn't show after 15 minutes, contact us with your payment confirmation email.",
  },
  {
    id: "t6",
    question: "The PDF file appears corrupted or won't open.",
    answer:
      "Try downloading the file again. Make sure you have a PDF reader installed (Adobe Acrobat Reader is recommended). If the file is still corrupted, contact us and we'll provide a fresh download link.",
  },
  {
    id: "t7",
    question: "I'm getting an error during checkout.",
    answer:
      "Ensure your card details are correct and that your bank isn't blocking the transaction. Try a different payment method. If you continue to see errors, send us a screenshot of the error through the form below.",
  },
];

export default function QnA() {
  const { t } = useLanguage();
  const toast = useToast();

  const [activeTab, setActiveTab] = useState("qna"); // "qna" | "support"
  const [expandedFaq, setExpandedFaq] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    category: "--Select Issue--",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Ticket submitted:", formData);
    setSubmitted(true);
    toast.success(t("qna.sent"));
    setTimeout(() => {
      setFormData({
        name: "",
        email: "",
        subject: "",
        category: "--Select Issue--",
        message: "",
      });
      setSubmitted(false);
    }, 3000);
  };

  const toggleFaq = (id) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  return (
    <div className={styles.page}>
      <Header />
      <main className={styles.mainContent}>
        <div className={styles.container}>

          {/* ── Hero header ── */}
          <div className={styles.heroHeader}>
            <h1 className={styles.heroTitle}>Help Center</h1>
            <p className={styles.heroSubtitle}>
              Find answers to common questions or reach our technical support team
            </p>
          </div>

          {/* ── Tab switcher ── */}
          <div className={styles.tabBar}>
            <button
              className={`${styles.tab} ${activeTab === "qna" ? styles.tabActive : ""}`}
              onClick={() => { setActiveTab("qna"); setExpandedFaq(null); }}
            >
              <span className={styles.tabIcon}>📖</span>
              <span className={styles.tabText}>
                <span className={styles.tabLabel}>Q&A</span>
                <span className={styles.tabDesc}>Product & General</span>
              </span>
            </button>
            <button
              className={`${styles.tab} ${activeTab === "support" ? styles.tabActive : ""}`}
              onClick={() => { setActiveTab("support"); setExpandedFaq(null); }}
            >
              <span className={styles.tabIcon}>🛠️</span>
              <span className={styles.tabText}>
                <span className={styles.tabLabel}>Tech Support</span>
                <span className={styles.tabDesc}>Issues & Bug Reports</span>
              </span>
            </button>
          </div>

          {/* ══════════════════════════════════
              TAB 1: Q&A — Product Questions
              ══════════════════════════════════ */}
          {activeTab === "qna" && (
            <section className={styles.qnaSection} key="qna">
              <div className={styles.sectionHeader}>
                <div className={styles.sectionBadge} data-variant="cyan">
                  <span>📖</span> Frequently Asked Questions
                </div>
                <p className={styles.sectionDesc}>
                  Everything you need to know about The Capital Code — editions, payments, delivery, and more.
                </p>
              </div>

              <div className={styles.faqGrid}>
                {generalFaq.map((item) => (
                  <div
                    key={item.id}
                    className={`${styles.faqItem} ${expandedFaq === item.id ? styles.faqItemExpanded : ""}`}
                    data-variant="cyan"
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

              {/* CTA to switch to support */}
              <div className={styles.ctaBanner}>
                <p>Can't find what you're looking for?</p>
                <button
                  className={styles.ctaButton}
                  onClick={() => { setActiveTab("support"); setExpandedFaq(null); }}
                >
                  Contact Tech Support →
                </button>
              </div>
            </section>
          )}

          {/* ══════════════════════════════════
              TAB 2: Tech Support
              ══════════════════════════════════ */}
          {activeTab === "support" && (
            <section className={styles.supportSection} key="support">

              <div className={styles.supportLayout}>
                {/* Left — Contact Form */}
                <div className={styles.formPanel}>
                  <div className={styles.sectionBadge} data-variant="gold">
                    <span>🛠️</span> Submit a Ticket
                  </div>
                  <p className={styles.sectionDesc}>
                    Having a technical issue? Describe the problem and our team will get back to you as soon as possible.
                  </p>

                  {submitted && (
                    <div className={styles.successMessage}>
                      {t("qna.sent")}
                    </div>
                  )}

                  <form className={styles.form} onSubmit={handleSubmit}>
                    <div className={styles.formRow}>
                      <div className={styles.formGroup}>
                        <label htmlFor="name" className={styles.label}>
                          {t("qna.nameLabel")}
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          className={styles.input}
                          placeholder="John Doe"
                          value={formData.name}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label htmlFor="email" className={styles.label}>
                          {t("qna.emailLabel")}
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          className={styles.input}
                          placeholder="john@example.com"
                          value={formData.email}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    <div className={styles.formRow}>
                      <div className={styles.formGroup}>
                        <label htmlFor="subject" className={styles.label}>
                          {t("qna.subjectLabel")}
                        </label>
                        <input
                          type="text"
                          id="subject"
                          name="subject"
                          className={styles.input}
                          placeholder="Brief description of the issue"
                          value={formData.subject}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label htmlFor="category" className={styles.label}>
                          {t("qna.categoryLabel")}
                        </label>
                        <select
                          id="category"
                          name="category"
                          className={styles.select}
                          value={formData.category}
                          onChange={handleChange}
                        >
                          <option>--Select Issue--</option>
                          <option>Login &amp; Account Issues</option>
                          <option>Download Problems</option>
                          <option>Payment &amp; Order Errors</option>
                          <option>Website / Browser Issues</option>
                          <option>Bug Report</option>
                          <option>Other Technical Issue</option>
                        </select>
                      </div>
                    </div>

                    <div className={styles.formGroup}>
                      <label htmlFor="message" className={styles.label}>
                        {t("qna.messageLabel")}
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        className={styles.textarea}
                        placeholder="Describe the problem in detail. Include steps to reproduce, error messages, screenshots, etc."
                        rows="5"
                        value={formData.message}
                        onChange={handleChange}
                        required
                      ></textarea>
                    </div>

                    <button type="submit" className={styles.submitButton}>
                      {t("qna.send")}
                    </button>
                  </form>
                </div>

                {/* Right — Tech FAQ */}
                <div className={styles.techFaqPanel}>
                  <div className={styles.sectionBadge} data-variant="gold">
                    <span>⚡</span> Common Issues
                  </div>
                  <p className={styles.sectionDesc}>
                    Quick fixes for the most reported problems.
                  </p>

                  <div className={styles.faqGrid}>
                    {techFaq.map((item) => (
                      <div
                        key={item.id}
                        className={`${styles.faqItem} ${expandedFaq === item.id ? styles.faqItemExpanded : ""}`}
                        data-variant="gold"
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
                </div>
              </div>

            </section>
          )}

        </div>
      </main>
      <Footer />
    </div>
  );
}
