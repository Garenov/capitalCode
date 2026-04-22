import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import Link from "next/link";
import styles from "../legal.module.css";

export const metadata = {
  title: "Privacy Policy – The Capital Code",
  description: "Privacy policy for The Capital Code website and services.",
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
            The Capital Code is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or purchase our products.
          </p>
        </div>

        <div className={styles.section}>
          <h2>2. Information We Collect</h2>
          <ul>
            <li><strong>Personal data:</strong> Name, email address, phone number (optional), and shipping address when you create an account or make a purchase</li>
            <li><strong>Payment data:</strong> Payment information is processed securely via Stripe — we do not store your card details</li>
            <li><strong>Usage data:</strong> Pages visited, time spent on the site, browser type, and device information</li>
            <li><strong>Cookies:</strong> Essential cookies for language preference and consent status stored in localStorage</li>
          </ul>
        </div>

        <div className={styles.section}>
          <h2>3. How We Use Your Information</h2>
          <ul>
            <li>To process and fulfill your orders</li>
            <li>To manage your account and provide customer support</li>
            <li>To send transactional emails (order confirmations, verification)</li>
            <li>To send marketing communications (only with your explicit consent)</li>
            <li>To improve our website and services</li>
          </ul>
        </div>

        <div className={styles.section}>
          <h2>4. Data Sharing</h2>
          <p>
            We do not sell or rent your personal data. We may share your information with trusted third-party services necessary to operate our business:
          </p>
          <ul>
            <li><strong>Stripe:</strong> Secure payment processing</li>
            <li><strong>Resend:</strong> Transactional and marketing email delivery</li>
            <li><strong>Turso:</strong> Database hosting (EU region)</li>
          </ul>
        </div>

        <div className={styles.section}>
          <h2>5. Data Retention</h2>
          <p>
            We retain your personal data only for as long as necessary to fulfill the purposes described in this policy, or as required by law. You may request deletion of your data at any time.
          </p>
        </div>

        <div className={styles.section}>
          <h2>6. Data Security</h2>
          <p>
            We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet is 100% secure.
          </p>
        </div>

        <div className={styles.section}>
          <h2>7. Your Rights</h2>
          <ul>
            <li>Access the personal data we hold about you</li>
            <li>Request correction of inaccurate data</li>
            <li>Request deletion of your data</li>
            <li>Withdraw consent for marketing communications at any time</li>
            <li>Object to processing of your data</li>
            <li>Request data portability</li>
          </ul>
          <p>
            For more details on your rights under GDPR, please see our <Link href="/gdpr">GDPR page</Link>.
          </p>
        </div>

        <div className={styles.section}>
          <h2>8. Cookies</h2>
          <p>
            This website uses a cookie consent mechanism. We store only essential cookies (language preference, consent status) in localStorage. No third-party tracking cookies are used without your explicit consent.
          </p>
        </div>

        <div className={styles.section}>
          <h2>9. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated revision date. We encourage you to review this policy periodically.
          </p>
        </div>

        <div className={styles.section}>
          <h2>10. Contact</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us via the <Link href="/qna">Q&A page</Link>.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
