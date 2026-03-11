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

export default function Home() {
  const router = useRouter();
  const [isPaused, setIsPaused] = React.useState(false);
  const [isDiscordPaused, setIsDiscordPaused] = React.useState(false);
  const [lightboxSrc, setLightboxSrc] = React.useState(null);
  const [reviews, setReviews] = React.useState(fallbackReviews);

  // Fetch reviews from API
  React.useEffect(() => {
    fetch("/api/reviews")
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.reviews.length > 0) {
          setReviews(data.reviews);
        }
      })
      .catch(() => { /* keep fallback */ });
  }, []);

  const handleBuyClick = () => {
    router.push("/pricing");
  };

  const renderStars = (count) => "★".repeat(count) + "☆".repeat(5 - count);

  // Close lightbox on Escape
  React.useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") setLightboxSrc(null); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Need at least 2× copies for seamless loop
  const displayReviews = reviews.length < 4 ? [...reviews, ...reviews, ...reviews, ...reviews] : [...reviews, ...reviews];
  const displayScreenshots = [...discordScreenshots, ...discordScreenshots];

  return (
    <div className={styles.page}>
      <Header />

      <main className={styles.main}>

        {/* ─── Main Blocks ─── */}
        <div className={styles.mainBox}>
          <div className={styles.projectDescription}>
            <h3>Behind The Capital Code</h3>
            <h5>The Capital Code was born out of curiosity — a relentless drive to understand how money truly works and what separates speculation from strategy.</h5>
            <h5>After years immersed in economics, investing, and financial analysis, I've witnessed both the allure of quick profits and clarity that comes from genuine financial insight. My mission is to bridge theory and practice — building tools that empower people to make decisions grounded in logic, not noise.</h5>
            <h5>Through experience in financial consulting and startup management, I've learned that clarity and structure outweigh vanity. That's what The Capital Code stands for — disciplined thinking and long-term value creation.</h5>

            <Link href="/buy">        </Link>
            <button className={styles.buyButton} onClick={handleBuyClick}>
              <span className={styles.buyButtonText}>Buy Now</span>
            </button>
          </div>

          <div className={styles.bookDescription}>
            <h3>Book Description</h3>
            <div className={styles.bookContent}>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
              <div className={styles.pdfContainer}>
                <div className={styles.bookClassic}>
                  <iframe
                    src="/ccBook.pdf#toolbar=0&navpanes=0&view=FitH"
                    alt="Capital Code Book PDF"
                    className={styles.pdfViewer}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ─── Reviews Marquee ─── */}
        <section className={styles.reviewsSection}>
          <h3 className={styles.sectionTitle}>What Readers Say</h3>
          <div
            className={styles.reviewsOverflow}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <div
              className={styles.reviewsTrack}
              style={{ animationPlayState: isPaused ? "paused" : "running" }}
            >
              {displayReviews.map((r, i) => (
                <div className={styles.reviewCard} key={i}>
                  <span className={styles.reviewStars}>{renderStars(r.stars)}</span>
                  <p className={styles.reviewText}>&ldquo;{r.text}&rdquo;</p>
                  <span className={styles.reviewAuthor}>— {r.author}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Discord Screenshots Marquee ─── */}
        <section className={styles.discordSection}>
          <h3 className={styles.sectionTitle}>From Our Discord Community</h3>
          <div
            className={styles.discordOverflow}
            onMouseEnter={() => setIsDiscordPaused(true)}
            onMouseLeave={() => setIsDiscordPaused(false)}
          >
            <div
              className={styles.discordTrack}
              style={{ animationPlayState: isDiscordPaused ? "paused" : "running" }}
            >
              {displayScreenshots.map((shot, i) => (
                <div
                  className={styles.discordImageWrap}
                  key={i}
                  onClick={() => setLightboxSrc(shot.src)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === "Enter") setLightboxSrc(shot.src); }}
                >
                  <Image
                    src={shot.src}
                    alt={shot.alt}
                    width={600}
                    height={340}
                    className={styles.discordImage}
                  />
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
