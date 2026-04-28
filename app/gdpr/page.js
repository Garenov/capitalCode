import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import Link from "next/link";
import styles from "../legal.module.css";

export const metadata = {
  title: "GDPR – The Capital Code",
  description: "GDPR and data protection information for The Capital Code users.",
};

export default function GdprPage() {
  return (
    <div className={styles.page}>
      <Header />
      <main className={styles.mainContent}>
        <div className={styles.legalContainer}>
          <Link href="/" className={styles.backLink}>← Back to Home</Link>
        <h1 className={styles.title}>GDPR & Data Protection</h1>
        <p className={styles.updated}>Last updated: March 10, 2026</p>

        <div className={styles.section}>
          <h2>1. Data Controller</h2>
          <p>
            The Capital Code acts as the data controller for personal data collected through this website. We are committed to processing your data in compliance with the General Data Protection Regulation (GDPR) and applicable Czech data protection laws.
          </p>
        </div>

        <div className={styles.section}>
          <h2>2. Legal Basis for Processing</h2>
          <p>We process your personal data based on the following legal grounds:</p>
          <ul>
            <li><strong>Contract performance:</strong> Processing necessary to fulfill our obligations when you purchase a product or create an account</li>
            <li><strong>Consent:</strong> Marketing emails and newsletter subscriptions (you can withdraw consent at any time)</li>
            <li><strong>Legitimate interest:</strong> Website analytics, fraud prevention, and service improvement</li>
          </ul>
        </div>

        <div className={styles.section}>
          <h2>3. Your GDPR Rights</h2>
          <p>As a data subject under the GDPR, you have the following rights:</p>
          <ul>
            <li><strong>Right of access:</strong> Request a copy of the personal data we hold about you</li>
            <li><strong>Right to rectification:</strong> Request correction of inaccurate or incomplete data</li>
            <li><strong>Right to erasure:</strong> Request deletion of your personal data ("right to be forgotten")</li>
            <li><strong>Right to restrict processing:</strong> Limit how we use your data</li>
            <li><strong>Right to data portability:</strong> Receive your data in a structured, machine-readable format</li>
            <li><strong>Right to object:</strong> Object to processing based on legitimate interests</li>
            <li><strong>Right to withdraw consent:</strong> Withdraw consent at any time for consent-based processing</li>
          </ul>
        </div>

        <div className={styles.section}>
          <h2>4. Data Transfers</h2>
          <p>
            Your data may be processed by third-party services (e.g., Stripe for payments, Resend for transactional emails). These services comply with GDPR and provide adequate data protection safeguards. Data is primarily stored in the EU region via our database provider (Turso).
          </p>
        </div>

        <div className={styles.section}>
          <h2>5. Data Breach Notification</h2>
          <p>
            In the event of a personal data breach that is likely to result in a risk to your rights and freedoms, we will notify the relevant supervisory authority within 72 hours and inform affected users without undue delay.
          </p>
        </div>

        <div className={styles.section}>
          <h2>6. Newsletter & Marketing</h2>
          <ul>
            <li>Newsletter subscriptions require explicit opt-in</li>
            <li>Every marketing email includes an unsubscribe link</li>
            <li>We do not share subscriber data with third parties</li>
            <li>Unsubscription is immediate and permanent</li>
          </ul>
        </div>

        <div className={styles.section}>
          <h2>7. Cookies</h2>
          <p>
            This website uses a cookie consent mechanism. We store only essential cookies (language preference, consent status) in localStorage. No third-party tracking cookies are used without your explicit consent.
          </p>
        </div>

        <div className={styles.section}>
          <h2>8. Exercising Your Rights</h2>
          <p>
            To exercise any of your GDPR rights, please contact us through the <Link href="/qna">Q&A page</Link>. We will respond to your request within 30 days.
          </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
