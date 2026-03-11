import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import Link from "next/link";
import styles from "../legal.module.css";

export const metadata = {
  title: "Privacy Policy – Capital Code",
  description: "Privacy policy for Capital Code - how we handle and protect your personal data.",
};

export default function PrivacyPage() {
  return (
    <div className={styles.page}>
      <Header />
      <main className={styles.mainContent}>
        <Link href="/" className={styles.backLink}>← Back to Home</Link>
        <h1 className={styles.title}>Privacy Policy</h1>
        <p className={styles.updated}>Last updated: March 10, 2026</p>

        <div className={styles.section}>
          <h2>1. Introduction</h2>
          <p>
            Capital Code ("we", "us", or "our") respects your privacy and is committed to protecting your personal data. This privacy policy explains how we collect, use, and safeguard your information when you visit our website or purchase our products.
          </p>
        </div>

        <div className={styles.section}>
          <h2>2. Data We Collect</h2>
          <p>We may collect the following categories of personal data:</p>
          <ul>
            <li>Identity data: name, email address, phone number</li>
            <li>Account data: login credentials (password stored as a secure hash)</li>
            <li>Transaction data: purchase history, payment method (processed via Stripe)</li>
            <li>Technical data: IP address, browser type, device information</li>
            <li>Communication data: newsletter subscription preferences</li>
          </ul>
        </div>

        <div className={styles.section}>
          <h2>3. How We Use Your Data</h2>
          <p>We use your personal data for the following purposes:</p>
          <ul>
            <li>To process and fulfill your orders</li>
            <li>To manage your account and provide customer support</li>
            <li>To send transactional emails (order confirmation, email verification)</li>
            <li>To send marketing communications (only with your consent)</li>
            <li>To improve our website and services</li>
          </ul>
        </div>

        <div className={styles.section}>
          <h2>4. Payment Processing</h2>
          <p>
            All payments are processed securely through Stripe. We do not store your credit card details on our servers. Stripe's privacy policy applies to payment data processing.
          </p>
        </div>

        <div className={styles.section}>
          <h2>5. Data Retention</h2>
          <p>
            We retain your personal data only for as long as necessary to fulfill the purposes outlined in this policy. Account data is kept while your account is active. You may request deletion at any time.
          </p>
        </div>

        <div className={styles.section}>
          <h2>6. Your Rights</h2>
          <p>Under applicable data protection laws, you have the right to:</p>
          <ul>
            <li>Access your personal data</li>
            <li>Correct inaccurate data</li>
            <li>Request deletion of your data</li>
            <li>Withdraw consent for marketing communications</li>
            <li>Data portability</li>
          </ul>
        </div>

        <div className={styles.section}>
          <h2>7. Cookies</h2>
          <p>
            We use essential cookies for website functionality and to remember your preferences (such as language and cookie consent). We do not use third-party tracking cookies without your consent.
          </p>
        </div>

        <div className={styles.section}>
          <h2>8. Contact</h2>
          <p>
            For any privacy-related questions, please contact us via the <Link href="/qna">Q&A page</Link>.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
