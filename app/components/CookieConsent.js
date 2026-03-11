"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n";
import styles from "./cookieConsent.module.css";

export default function CookieConsent() {
  const { t } = useLanguage();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie_consent");
    if (!consent) {
      // Small delay so it doesn't flash during page load
      const timer = setTimeout(() => setVisible(true), 800);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookie_consent", "accepted");
    setVisible(false);
  };

  const handleReject = () => {
    localStorage.setItem("cookie_consent", "rejected");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className={styles.banner}>
      <div className={styles.content}>
        <p className={styles.message}>
          {t("cookie.message")}{" "}
          <Link href="/privacy" className={styles.link}>
            {t("cookie.policy")}
          </Link>
          .
        </p>
        <div className={styles.actions}>
          <button className={styles.acceptBtn} onClick={handleAccept}>
            {t("cookie.accept")}
          </button>
          <button className={styles.rejectBtn} onClick={handleReject}>
            {t("cookie.reject")}
          </button>
        </div>
      </div>
    </div>
  );
}
