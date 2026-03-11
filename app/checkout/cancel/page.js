"use client";
import Link from "next/link";

export default function CheckoutCancel() {
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
            <div style={{
                background: "rgba(255,255,255,0.07)",
                border: "1px solid rgba(255,255,255,0.15)",
                borderRadius: 16,
                padding: "2.5rem",
                maxWidth: 480,
                width: "100%",
                textAlign: "center",
                color: "#f0f0f0",
                backdropFilter: "blur(10px)",
            }}>
                <div style={{ fontSize: 56, marginBottom: 16 }}>🛒</div>
                <h1 style={{ color: "#e0c73a", marginBottom: 12, fontSize: "1.8rem" }}>
                    Payment Cancelled
                </h1>
                <p style={{ color: "#d0d0d0", lineHeight: 1.7, marginBottom: 24 }}>
                    Your payment was not completed. You have not been charged.
                    You can come back and complete your order at any time.
                </p>
                <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
                    <Link href="/pricing" style={{
                        padding: "12px 24px",
                        background: "#e0c73a",
                        color: "#0a1428",
                        borderRadius: 8,
                        textDecoration: "none",
                        fontWeight: 700,
                    }}>
                        Back to Pricing
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
        </div>
    );
}
