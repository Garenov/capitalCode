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
        <div className={styles.brand}>
          <span className={styles.logo}>Capital Code</span>
          <p className={styles.copy}>© {year} Capital Code. {t("footer.rights")}</p>
        </div>

        <nav className={styles.links}>
          <Link href="/privacy">{t("footer.privacy")}</Link>
          <Link href="/terms">{t("footer.terms")}</Link>
          <Link href="/gdpr">{t("footer.gdpr")}</Link>
        </nav>
      </div>
    </footer>
  );
}
