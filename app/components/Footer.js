"use client";
import React from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n";
import styles from "./footer.module.css";

export default function Footer() {
  const { t } = useLanguage();
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.footerInner}>
        {/* Brand */}
        <div className={styles.footerBrand}>
          <span className={styles.footerBrandName}>The Capital Code</span>
          <p className={styles.footerCopy}>© {year} The Capital Code. {t("footer.rights")}</p>
        </div>

        {/* Contact / Phone — centered, prominent */}
        <div className={styles.contact}>
          <span className={styles.contactLabel}>Support</span>
          <a href="tel:+420732298550" className={styles.phone}>
            📞 +420 732 298 550
          </a>
        </div>

        {/* Nav links */}
        <nav className={styles.footerLinks}>
          <Link href="/privacy" className={styles.footerLink}>{t("footer.privacy")}</Link>
          <Link href="/terms" className={styles.footerLink}>{t("footer.terms")}</Link>
          <Link href="/gdpr" className={styles.footerLink}>{t("footer.gdpr")}</Link>
        </nav>
      </div>
    </footer>
  );
}
