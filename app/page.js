"use client";
import Image from "next/image";
import styles from "./page.module.css";
import React from "react";
import Link from "next/link";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import Newsletter from "@/app/components/Newsletter";
import { useRouter } from "next/navigation";

const fallbackReviews = [
  { stars: 5, author: "Alex M.", text: "This book completely changed how I think about investing. Highly recommended!" },
  { stars: 5, author: "Sarah K.", text: "Clear, practical, and insightful. A must-read for anyone serious about finance." },
  { stars: 4, author: "James R.", text: "Great framework for understanding capital markets. Very well structured." },
  { stars: 5, author: "Olivia T.", text: "Finally a finance book that bridges theory and practice beautifully." },
  { stars: 5, author: "Daniel P.", text: "Disciplined thinking at its finest. I've already applied several strategies." },
  { stars: 4, author: "Emma L.", text: "Engaging writing style and actionable advice. Worth every penny." },
  { stars: 5, author: "Michael B.", text: "The Capital Code is the real deal — no fluff, just value." },
  { stars: 5, author: "Lisa W.", text: "I bought copies for my entire team. Transformative content!" },
];

const discordScreenshots = [
  { src: "/images/discordScreen.png", alt: "Discord chat — trading signals" },
  { src: "/images/discordScreen.png", alt: "Discord chat — market analysis" },
  { src: "/images/discordScreen.png", alt: "Discord chat — community discussion" },
  { src: "/images/discordScreen.png", alt: "Discord chat — live alerts" },
];

const renderStars = (count) => "★".repeat(count) + "☆".repeat(5 - count);

export default function Home() {
  const router = useRouter();
  const [reviews, setReviews] = React.useState(fallbackReviews);
  const [lightboxSrc, setLightboxSrc] = React.useState(null);

  // Lazy-load PDF iframe
  const pdfRef = React.useRef(null);
  const [pdfVisible, setPdfVisible] = React.useState(false);
  React.useEffect(() => {
    if (!pdfRef.current) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setPdfVisible(true); obs.disconnect(); } },
      { rootMargin: "200px" }
    );
    obs.observe(pdfRef.current);
    return () => obs.disconnect();
  }, []);

  // Fetch reviews from API
  React.useEffect(() => {
    fetch("/api/reviews")
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.reviews.length > 0) setReviews(data.reviews);
      })
      .catch(() => { /* keep fallback */ });
  }, []);

  // Close lightbox on Escape
  React.useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") setLightboxSrc(null); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className={styles.page}>
      <Header />

      <main className={styles.main}>

        {/* ─── HERO ─── */}
        <section className={styles.heroSection}>
          <div className={styles.heroBadge}>
            <span className={styles.heroBadgeDot} />
            New Edition Available
          </div>

          <h1 className={styles.heroTitle}>
            The Capital Code
          </h1>

          <p className={styles.heroSub}>
            A disciplined guide to financial strategy, investing, and long-term value creation.
            Theory meets practice — no noise, just signal.
          </p>

          <div className={styles.heroActions}>
            <button className={styles.heroCta} onClick={() => router.push("/pricing")}>
              Get Your Copy →
            </button>
            <button className={styles.heroSecondary} onClick={() => router.push("/qna")}>
              Learn More
            </button>
          </div>

          <div className={styles.heroStats}>
            <div className={styles.heroStat}>
              <span className={styles.heroStatNum}>1,200+</span>
              <span className={styles.heroStatLabel}>Readers</span>
            </div>
            <div className={styles.heroStat}>
              <span className={styles.heroStatNum}>4.9★</span>
              <span className={styles.heroStatLabel}>Rating</span>
            </div>
            <div className={styles.heroStat}>
              <span className={styles.heroStatNum}>3 Editions</span>
              <span className={styles.heroStatLabel}>Available</span>
            </div>
          </div>
        </section>

        {/* ─── Main Blocks ─── */}
        <div className={styles.mainBox}>
          <div className={styles.projectDescription}>
            <h3>Behind The Capital Code</h3>
            <h5>The Capital Code was born out of curiosity — a relentless drive to understand how money truly works and what separates speculation from strategy.</h5>
            <h5>After years immersed in economics, investing, and financial analysis, I've witnessed both the allure of quick profits and clarity that comes from genuine financial insight. My mission is to bridge theory and practice — building tools that empower people to make decisions grounded in logic, not noise.</h5>
            <h5>Through experience in financial consulting and startup management, I've learned that clarity and structure outweigh vanity. That's what The Capital Code stands for — disciplined thinking and long-term value creation.</h5>

            <button className={styles.buyButton} onClick={() => router.push("/pricing")}>
              <span className={styles.buyButtonText}>Buy Now</span>
            </button>
          </div>

          <div className={styles.bookDescription}>
            <h3>Book Preview</h3>
            <div className={styles.bookContent}>
              <p>The Capital Code synthesizes years of first-hand financial experience into a structured, actionable framework. From understanding market cycles to building a personal investment thesis, each chapter delivers concrete tools for disciplined decision-making.</p>
              <div className={styles.pdfContainer} ref={pdfRef}>
                <div className={styles.bookClassic}>
                  {pdfVisible ? (
                    <iframe
                      src="/ccBook.pdf#toolbar=0&navpanes=0&view=FitH"
                      title="The Capital Code Book PDF"
                      className={styles.pdfViewer}
                      loading="lazy"
                    />
                  ) : (
                    <div className={styles.pdfPlaceholder}>
                      <span>📖 Loading preview…</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ─── VIDEO AD SLOT ─── */}
        <section className={styles.videoAdSection}>
          <h3 className={styles.sectionTitle}>Watch the Trailer</h3>
          <div className={styles.videoAdSlot}>
            {/*
              📹 DROP YOUR VIDEO AD HERE
              Replace the placeholder below with ONE of:
              • <video src="/ads/promo.mp4" autoPlay muted loop playsInline className={styles.videoAdMedia} />
              • <iframe src="https://www.youtube.com/embed/VIDEO_ID" allow="autoplay; encrypted-media" allowFullScreen className={styles.videoAdMedia} />
              Then delete the videoAdPlaceholder div.
            */}
            <div className={styles.videoAdPlaceholder}>
              <span className={styles.videoAdIcon}>▶</span>
              <span className={styles.videoAdLabel}>Coming Soon</span>
              <span className={styles.videoAdSub}>Promotional video will appear here</span>
            </div>
          </div>
        </section>

        {/* ─── SOCIAL PROOF: Screenshots (left) + Reviews 2×2 (right) ─── */}
        <section className={styles.socialProofSection}>

          {/* LEFT — Discord Screenshots */}
          <div className={styles.socialProofLeft}>
            <h3 className={`${styles.sectionTitle} ${styles.discordTitle}`}>From Our Discord</h3>
            <div className={styles.screenshotStack}>
              {discordScreenshots.map((shot, i) => (
                <div
                  className={styles.discordCard}
                  key={`ds-${i}`}
                  onClick={() => setLightboxSrc(shot.src)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === "Enter") setLightboxSrc(shot.src); }}
                  title="Click to enlarge"
                >
                  <Image
                    src={shot.src}
                    alt={shot.alt}
                    width={560}
                    height={320}
                    className={styles.discordImage}
                    priority={i === 0}
                  />
                  <span className={styles.discordZoom}>🔍 Enlarge</span>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — Reviews 2×2 grid */}
          <div className={styles.socialProofRight}>
            <h3 className={styles.sectionTitle}>What Readers Say</h3>
            <div className={styles.reviewGrid}>
              {reviews.slice(0, 4).map((r, i) => (
                <div className={styles.reviewCard} key={`review-${i}`}>
                  <span className={styles.reviewStars}>{renderStars(r.stars)}</span>
                  <p className={styles.reviewText}>&ldquo;{r.text}&rdquo;</p>
                  <span className={styles.reviewAuthor}>— {r.author}</span>
                </div>
              ))}
            </div>
          </div>

        </section>

        {/* ─── Lightbox ─── */}
        {lightboxSrc && (
          <div className={styles.lightboxOverlay} onClick={() => setLightboxSrc(null)}>
            <button className={styles.lightboxClose} onClick={() => setLightboxSrc(null)} aria-label="Close">✕</button>
            <Image
              src={lightboxSrc}
              alt="Discord screenshot full view"
              width={1400}
              height={800}
              className={styles.lightboxImage}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        )}

      </main>

      <Newsletter />
      <Footer />
    </div>
  );
}
