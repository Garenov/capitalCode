"use client";
import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function SuccessContent() {
    const searchParams = useSearchParams();
    const sessionId = searchParams.get("session_id");

    return (
        <div style={{
            background: "rgba(255,255,255,0.07)",
            border: "1px solid rgba(255,255,255,0.15)",
            borderRadius: 16,
            padding: "2.5rem",
            maxWidth: 520,
            width: "100%",
            textAlign: "center",
            color: "#f0f0f0",
            backdropFilter: "blur(10px)",
        }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>🎉</div>
            <h1 style={{ color: "#e0c73a", marginBottom: 12, fontSize: "1.8rem" }}>
                Payment Successful!
            </h1>
            <p style={{ color: "#d0d0d0", lineHeight: 1.7, marginBottom: 8 }}>
                Thank you for your purchase. A confirmation has been sent to your email.
            </p>
            <p style={{ color: "#aaa", fontSize: 14, marginBottom: 28 }}>
                Digital content is available in your{" "}
                <strong style={{ color: "#e0c73a" }}>My Orders</strong> section.
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
                <Link href="/user" style={{
                    padding: "12px 24px",
                    background: "#e0c73a",
                    color: "#0a1428",
                    borderRadius: 8,
                    textDecoration: "none",
                    fontWeight: 700,
                }}>
                    My Orders
                </Link>
                <Link href="/" style={{
                    padding: "12px 24px",
                    background: "rgba(255,255,255,0.1)",
                    color: "#f0f0f0",
                    borderRadius: 8,
                    textDecoration: "none",
                    border: "1px solid rgba(255,255,255,0.2)",
                }}>
                    Back to Home
                </Link>
            </div>
        </div>
    );
}

export default function CheckoutSuccess() {
    return (
        <div style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(135deg,#0d1b35 0%,#273d69 55%,#0d1b35 100%)",
            fontFamily: "sans-serif",
            padding: "1rem",
        }}>
            <Suspense fallback={<p style={{ color: "#aaa" }}>Loading...</p>}>
                <SuccessContent />
            </Suspense>
        </div>
    );
}
