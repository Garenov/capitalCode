"use client";
import Image from "next/image";
import styles from "./page.module.css";
import React from "react";
import Link from "next/link";
import Header from "@/app/components/Header";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [index, setIndex] = React.useState(0);

  const pages = [
    "/images/bookPages/page1.jpg",
    "/images/bookPages/page2.jpg",
    "/images/bookPages/page3.jpg",
    "/images/bookPages/page4.jpg",
    "/images/bookPages/page5.jpg",
  ];

  const handleClick = () => {
    setIndex((prev) => (prev + 1) % pages.length);
  };

  const handleBuyClick = () => {
    router.push("/pricing");
  };

  return (
    <div className={styles.page}>
      <Header />

      <main className={styles.main}>

        <div className={styles.mainBox}>
          <div className={styles.projectDescription}>

            <h3>Behind The Capital Code</h3>
            <h5>The Capital Code was born out of curiosity — a relentless drive to understand how money truly works and what separates speculation from strategy.</h5>
            <h5>After years immersed in economics, investing, and financial analysis, I’ve witnessed both the allure of quick profits and clarity that comes from genuine financial insight. My mission is to bridge theory and practice — building tools that empower people to make decisions grounded in logic, not noise.</h5>
            <h5>Through experience in financial consulting and startup management, I’ve learned that clarity and structure outweigh vanity. That’s what The Capital Code stands for — disciplined thinking and long-term value creation.
            </h5>

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


            <div>

            </div>
            
          </div>
        </div>
        
      </main>
    </div>
  );
}
