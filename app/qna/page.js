"use client";
import React, { useState } from "react";
import Header from "@/app/components/Header";
import styles from "./qna.module.css";

export default function QnA() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    category: "--None--",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

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

  const faqItems = [];

  const [expandedFaq, setExpandedFaq] = useState(null);

  return (
    <div className={styles.page}>
      <Header />
      <main className={styles.mainContent}>
        <div className={styles.container}>
          <section className={styles.contactSection}>
            <div className={styles.formContainer}>
              <h1 className={styles.title}>Get In Touch</h1>
              <p className={styles.subtitle}>
                Have questions? We're here to help. Send us a message and we'll
                respond as soon as possible.
              </p>

              {submitted && (
                <div className={styles.successMessage}>
                  ✓ Thank you! We'll get back to you soon.
                </div>
              )}

              <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                  <label htmlFor="name" className={styles.label}>
                    Your Name
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
                    Email Address
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
                    Subject
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
                    Category
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
                    Message
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
                  Send Message
                </button>
              </form>
            </div>

            <div className={styles.faqContainer}>
              <h2 className={styles.faqTitle}>Frequently Asked Questions</h2>
              <p className={styles.faqSubtitle}>
                Find answers to common questions below.
              </p>

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
                        <small className={styles.faqDate}>{item.date}</small>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
