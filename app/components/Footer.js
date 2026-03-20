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
      <div className={styles.container}>
        {/* Brand */}
        <div className={styles.brand}>
          <span className={styles.logo}>Capital Code</span>
          <p className={styles.copy}>© {year} Capital Code. {t("footer.rights")}</p>
        </div>

        {/* Contact / Phone — centered, prominent */}
        <div className={styles.contact}>
          <span className={styles.contactLabel}>Support</span>
          <a href="tel:+420732298550" className={styles.phone}>
            📞 +420 732 298 550
          </a>
        </div>

        {/* Nav links */}
        <nav className={styles.links}>
          <Link href="/privacy">{t("footer.privacy")}</Link>
          <Link href="/terms">{t("footer.terms")}</Link>
          <Link href="/gdpr">{t("footer.gdpr")}</Link>
        </nav>
      </div>
    </footer>
  );
}
