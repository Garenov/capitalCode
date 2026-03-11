"use client";
import React, { useState } from "react";
import { useLanguage } from "@/lib/i18n";
import { useToast } from "@/app/components/Toast";
import styles from "./newsletter.module.css";

export default function Newsletter() {
  const { t } = useLanguage();
  const toast = useToast();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);

    try {
      const res = await fetch("/api/notify/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), name: name.trim() || undefined }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success(
          data.message === "Already subscribed"
            ? t("newsletter.alreadySub")
            : t("newsletter.success")
        );
        setEmail("");
        setName("");
      } else {
        toast.error(data.message || t("newsletter.error"));
      }
    } catch {
      toast.error(t("newsletter.error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.title}>{t("newsletter.title")}</h2>
        <p className={styles.subtitle}>{t("newsletter.subtitle")}</p>
        <form className={styles.form} onSubmit={handleSubscribe}>
          <input
            type="email"
            placeholder={t("newsletter.email")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={styles.input}
          />
          <input
            type="text"
            placeholder={t("newsletter.name")}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={styles.input}
          />
          <button type="submit" disabled={loading} className={styles.submitBtn}>
            {loading ? t("newsletter.subscribing") : t("newsletter.subscribe")}
          </button>
        </form>
      </div>
    </section>
  );
}
