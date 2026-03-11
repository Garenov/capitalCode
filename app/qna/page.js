"use client";
import React, { useState } from "react";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import styles from "./qna.module.css";
import { useLanguage } from "@/lib/i18n";
import { useToast } from "@/app/components/Toast";

const faqItems = [
  {
    id: 1,
    question: "What is The Capital Code?",
    answer: "The Capital Code is a comprehensive guide to financial strategies, investing, and building long-term wealth. It combines theory with practical advice for disciplined investors.",
  },
  {
    id: 2,
    question: "What's the difference between digital and physical editions?",
    answer: "The digital edition is a downloadable PDF available immediately after payment. The physical edition is a printed book shipped to your address. The bundle includes both.",
  },
  {
    id: 3,
    question: "How does payment work?",
    answer: "Payments are processed securely via Stripe. We accept most credit and debit cards. You'll receive a confirmation email after successful payment.",
  },
  {
    id: 4,
    question: "How do I download the digital edition?",
    answer: "After payment, log in to your account and navigate to 'My Orders'. You'll find a download button for the PDF there.",
  },
  {
    id: 5,
    question: "Can I get a refund?",
    answer: "Digital products cannot be refunded once downloaded. Physical books can be returned within 14 days of delivery in original condition.",
  },
  {
    id: 6,
    question: "Do I need an account to purchase?",
    answer: "Yes, you need to create an account and verify your email to make a purchase. This gives you access to your orders and downloads.",
  },
  {
    id: 7,
    question: "How long does physical delivery take?",
    answer: "Standard delivery takes 3–7 business days within Czech Republic. You'll receive an email with tracking information when your order ships.",
  },
  {
    id: 8,
    question: "How do I subscribe to updates?",
    answer: "You can find the newsletter subscription form on the homepage. Enter your email and we'll keep you updated about new chapters and exclusive content.",
  },
];

export default function QnA() {
  const { t } = useLanguage();
  const toast = useToast();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    category: "--None--",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    setSubmitted(true);
    toast.success(t("qna.sent"));
    setTimeout(() => {
      setFormData({
        name: "",
        email: "",
        subject: "",
        category: "--None--",
        message: "",
      });
      setSubmitted(false);
    }, 3000);
  };

  return (
    <div className={styles.page}>
      <Header />
      <main className={styles.mainContent}>
        <div className={styles.container}>
          <section className={styles.contactSection}>
            <div className={styles.formContainer}>
              <h1 className={styles.title}>{t("qna.contactTitle")}</h1>
              <p className={styles.subtitle}>{t("qna.contactSubtitle")}</p>

              {submitted && (
                <div className={styles.successMessage}>
                  {t("qna.sent")}
                </div>
              )}

              <form className={styles.form} onSubmit={handleSubmit}>
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

                <div className={styles.formGroup}>
                  <label htmlFor="subject" className={styles.label}>
                    {t("qna.subjectLabel")}
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    className={styles.input}
                    placeholder="What is this about?"
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
                    <option>--None--</option>
                    <option>Billing & Payments</option>
                    <option>Technical Support</option>
                    <option>Product Inquiry</option>
                    <option>Partnership</option>
                    <option>Bug Report</option>
                    <option>Other</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="message" className={styles.label}>
                    {t("qna.messageLabel")}
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    className={styles.textarea}
                    placeholder="Tell us what you need..."
                    rows="6"
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

            <div className={styles.faqContainer}>
              <h2 className={styles.faqTitle}>{t("faq.title")}</h2>
              <p className={styles.faqSubtitle}>{t("faq.subtitle")}</p>

              <div className={styles.faqList}>
                {faqItems.map((item) => (
                  <div
                    key={item.id}
                    className={`${styles.faqItem} ${
                      expandedFaq === item.id ? styles.expanded : ""
                    }`}
                  >
                    <button
                      className={styles.faqQuestion}
                      onClick={() =>
                        setExpandedFaq(expandedFaq === item.id ? null : item.id)
                      }
                    >
                      <span>{item.question}</span>
                      <span className={styles.faqIcon}>
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
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
