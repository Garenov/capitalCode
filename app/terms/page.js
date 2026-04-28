import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import Link from "next/link";
import styles from "../legal.module.css";

export const metadata = {
  title: "Terms & Conditions – The Capital Code",
  description: "Terms and conditions for using The Capital Code products and services.",
};

export default function TermsPage() {
  return (
    <div className={styles.page}>
      <Header />
      <main className={styles.mainContent}>
        <div className={styles.legalContainer}>
          <Link href="/" className={styles.backLink}>← Back to Home</Link>
        <h1 className={styles.title}>Terms & Conditions</h1>
        <p className={styles.updated}>Last updated: March 10, 2026</p>

        <div className={styles.section}>
          <h2>1. General</h2>
          <p>
            These Terms and Conditions govern your use of The Capital Code website and the purchase of our products. By accessing the site or making a purchase, you agree to be bound by these terms.
          </p>
        </div>

        <div className={styles.section}>
          <h2>2. Products</h2>
          <p>
            The Capital Code offers digital and physical editions of "The Capital Code" book. Product descriptions, prices, and availability are subject to change without notice.
          </p>
        </div>

        <div className={styles.section}>
          <h2>3. Pricing & Payment</h2>
          <ul>
            <li>All prices are displayed in US Dollars (USD) and include applicable taxes</li>
            <li>Payment is processed securely via Stripe</li>
            <li>Access to digital content is granted only after successful payment confirmation</li>
            <li>Prices are validated server-side and cannot be modified by the client</li>
          </ul>
        </div>

        <div className={styles.section}>
          <h2>4. Digital Products</h2>
          <ul>
            <li>Digital editions are delivered as downloadable PDF files</li>
            <li>Download access is available in your account upon confirmed payment</li>
            <li>Digital products are for personal use only and may not be redistributed</li>
          </ul>
        </div>

        <div className={styles.section}>
          <h2>5. Physical Products</h2>
          <ul>
            <li>Physical editions are shipped to the address provided at checkout</li>
            <li>Delivery times may vary depending on location</li>
            <li>We will contact you with shipping information after your order is processed</li>
          </ul>
        </div>

        <div className={styles.section}>
          <h2>6. Refund Policy</h2>
          <p>
            Due to the digital nature of our products, refunds for digital purchases are generally not available once the content has been accessed. For physical products, you may request a refund within 14 days of delivery if the product is returned in original condition.
          </p>
        </div>

        <div className={styles.section}>
          <h2>7. User Accounts</h2>
          <ul>
            <li>You must provide accurate information during registration</li>
            <li>You are responsible for maintaining the security of your account credentials</li>
            <li>Email verification is required before logging in</li>
          </ul>
        </div>

        <div className={styles.section}>
          <h2>8. Intellectual Property</h2>
          <p>
            All content on this website, including the book, graphics, logos, and text, is the property of The Capital Code and is protected by copyright law. Unauthorized reproduction or distribution is prohibited.
          </p>
        </div>

        <div className={styles.section}>
          <h2>9. Limitation of Liability</h2>
          <p>
            The Capital Code is not responsible for any financial decisions made based on the content of our products. The book is for educational purposes only and does not constitute financial advice.
          </p>
        </div>

        <div className={styles.section}>
          <h2>10. Contact</h2>
          <p>
            For any questions about these terms, please contact us via the <Link href="/qna">Q&A page</Link>.
          </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
