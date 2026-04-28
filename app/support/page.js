"use client";
import React, { useState } from "react";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import styles from "./support.module.css";
import { useLanguage } from "@/lib/i18n";
import { useToast } from "@/app/components/Toast";

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

export default function Support() {
  const { t } = useLanguage();
  const toast = useToast();

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
            <h1 className={styles.heroTitle}>{t("qna.contactTitle")}</h1>
            <p className={styles.heroSubtitle}>
              {t("qna.contactSubtitle")}
            </p>
          </div>

          <section className={styles.supportSection}>

            <div className={styles.supportLayout}>
              {/* Left — Contact Form */}
              <div className={styles.formPanel}>
                <div className={styles.sectionBadge}>
                  <span>🛠️</span> Submit a Ticket
                </div>
                <p className={styles.sectionDesc}>
                  Describe the problem and our team will get back to you as soon as possible.
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
                <div className={styles.sectionBadge}>
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

        </div>
      </main>
      <Footer />
    </div>
  );
}
