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

/* ─── generic hook: items-per-page carousel with touch swipe ─── */
function useCarousel(total, perPage) {
  const [index, setIndex] = React.useState(0);
  const touchStartX = React.useRef(null);
  const pageCount = Math.ceil(total / perPage);

  const prev = () => setIndex(i => (i - 1 + pageCount) % pageCount);
  const next = () => setIndex(i => (i + 1) % pageCount);

  const onTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; };
  const onTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (dx < -40) next();
    if (dx >  40) prev();
    touchStartX.current = null;
  };

  return { index, setIndex, prev, next, pageCount, onTouchStart, onTouchEnd };
}

const renderStars = (count) => "★".repeat(count) + "☆".repeat(5 - count);

export default function Home() {
  const router = useRouter();
  const [reviews, setReviews] = React.useState(fallbackReviews);
  const [lightboxSrc, setLightboxSrc] = React.useState(null);

  // Responsive reviews per page
  const [reviewsPerPage, setReviewsPerPage] = React.useState(3);
  React.useEffect(() => {
    const update = () => setReviewsPerPage(window.innerWidth < 640 ? 1 : window.innerWidth < 1024 ? 2 : 3);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const reviewCarousel = useCarousel(reviews.length, reviewsPerPage);
  const discordCarousel = useCarousel(discordScreenshots.length, 1);

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

  // Slice reviews for the current page
  const visibleReviews = reviews.slice(
    reviewCarousel.index * reviewsPerPage,
    reviewCarousel.index * reviewsPerPage + reviewsPerPage
  );

  const currentShot = discordScreenshots[discordCarousel.index];

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
            <button className={styles.buyButton} onClick={() => router.push("/pricing")}>
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
                    title="Capital Code Book PDF"
                    className={styles.pdfViewer}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ─── Reviews Carousel ─── */}
        <section className={styles.reviewsSection}>
          <h3 className={styles.sectionTitle}>What Readers Say</h3>

          <div
            className={styles.carouselWrapper}
            onTouchStart={reviewCarousel.onTouchStart}
            onTouchEnd={reviewCarousel.onTouchEnd}
          >
            {/* Prev arrow */}
            <button
              className={`${styles.carouselArrow} ${styles.carouselArrowLeft}`}
              onClick={reviewCarousel.prev}
              aria-label="Previous reviews"
            >
              ‹
            </button>

            {/* Slide viewport */}
            <div className={styles.carouselViewport}>
              <div
                className={styles.carouselTrack}
                style={{ transform: `translateX(-${reviewCarousel.index * 100}%)` }}
              >
                {/* render all pages, each page is a flex row of cards */}
                {Array.from({ length: reviewCarousel.pageCount }).map((_, pageIdx) => (
                  <div className={styles.carouselPage} key={pageIdx}>
                    {reviews
                      .slice(pageIdx * reviewsPerPage, pageIdx * reviewsPerPage + reviewsPerPage)
                      .map((r, i) => (
                        <div className={styles.reviewCard} key={i}>
                          <span className={styles.reviewStars}>{renderStars(r.stars)}</span>
                          <p className={styles.reviewText}>&ldquo;{r.text}&rdquo;</p>
                          <span className={styles.reviewAuthor}>— {r.author}</span>
                        </div>
                      ))}
                  </div>
                ))}
              </div>
            </div>

            {/* Next arrow */}
            <button
              className={`${styles.carouselArrow} ${styles.carouselArrowRight}`}
              onClick={reviewCarousel.next}
              aria-label="Next reviews"
            >
              ›
            </button>
          </div>

          {/* Dots */}
          <div className={styles.carouselDots}>
            {Array.from({ length: reviewCarousel.pageCount }).map((_, i) => (
              <button
                key={i}
                className={`${styles.dot} ${i === reviewCarousel.index ? styles.dotActive : ""}`}
                onClick={() => reviewCarousel.setIndex(i)}
                aria-label={`Go to page ${i + 1}`}
              />
            ))}
          </div>
        </section>

        {/* ─── Discord Screenshots Carousel ─── */}
        <section className={styles.discordSection}>
          <h3 className={styles.sectionTitle}>From Our Discord Community</h3>

          <div
            className={styles.carouselWrapper}
            onTouchStart={discordCarousel.onTouchStart}
            onTouchEnd={discordCarousel.onTouchEnd}
          >
            {/* Prev */}
            <button
              className={`${styles.carouselArrow} ${styles.carouselArrowLeft}`}
              onClick={discordCarousel.prev}
              aria-label="Previous screenshot"
            >
              ‹
            </button>

            {/* Slides */}
            <div className={styles.carouselViewport}>
              <div
                className={styles.carouselTrack}
                style={{ transform: `translateX(-${discordCarousel.index * 100}%)` }}
              >
                {discordScreenshots.map((shot, i) => (
                  <div className={styles.carouselPage} key={i}>
                    <div
                      className={styles.discordImageWrap}
                      onClick={() => setLightboxSrc(shot.src)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => { if (e.key === "Enter") setLightboxSrc(shot.src); }}
                      title="Click to enlarge"
                    >
                      <Image
                        src={shot.src}
                        alt={shot.alt}
                        width={900}
                        height={520}
                        className={styles.discordImage}
                        priority={i === 0}
                      />
                      <span className={styles.discordZoom}>🔍 Click to enlarge</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Next */}
            <button
              className={`${styles.carouselArrow} ${styles.carouselArrowRight}`}
              onClick={discordCarousel.next}
              aria-label="Next screenshot"
            >
              ›
            </button>
          </div>

          {/* Dots */}
          <div className={styles.carouselDots}>
            {discordScreenshots.map((_, i) => (
              <button
                key={i}
                className={`${styles.dot} ${i === discordCarousel.index ? styles.dotActive : ""}`}
                onClick={() => discordCarousel.setIndex(i)}
                aria-label={`Go to screenshot ${i + 1}`}
              />
            ))}
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
