"use client";
import React, { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function VerifyContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get("token");
    const [status, setStatus] = React.useState("loading"); // loading | success | error
    const [message, setMessage] = React.useState("");

    React.useEffect(() => {
        if (!token) {
            setStatus("error");
            setMessage("Missing verification token.");
            return;
        }

        fetch(`/api/auth/verify?token=${encodeURIComponent(token)}`)
            .then((r) => r.json())
            .then((data) => {
                if (data.success) {
                    setStatus("success");
                    setMessage(data.message);
                    setTimeout(() => router.push("/"), 3000);
                } else {
                    setStatus("error");
                    setMessage(data.message || "Verification failed.");
                }
            })
            .catch(() => {
                setStatus("error");
                setMessage("Network error. Please try again.");
            });
    }, [token, router]);

    return (
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
            {status === "loading" && (
                <>
                    <div style={{ fontSize: 48, marginBottom: 16 }}>⏳</div>
                    <h1 style={{ color: "#e0c73a", marginBottom: 8 }}>Verifying…</h1>
                    <p style={{ color: "#aaa" }}>Please wait.</p>
                </>
            )}
            {status === "success" && (
                <>
                    <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
                    <h1 style={{ color: "#e0c73a", marginBottom: 8 }}>Email Verified!</h1>
                    <p style={{ color: "#d0d0d0", lineHeight: 1.7 }}>{message}</p>
                    <p style={{ color: "#888", fontSize: 14, marginTop: 12 }}>
                        Redirecting in 3 seconds…
                    </p>
                </>
            )}
            {status === "error" && (
                <>
                    <div style={{ fontSize: 48, marginBottom: 16 }}>❌</div>
                    <h1 style={{ color: "#e0c73a", marginBottom: 8 }}>Verification Failed</h1>
                    <p style={{ color: "#d0d0d0", lineHeight: 1.7 }}>{message}</p>
                    <Link
                        href="/"
                        style={{
                            display: "inline-block",
                            marginTop: 20,
                            padding: "12px 24px",
                            background: "#e0c73a",
                            color: "#0a1428",
                            borderRadius: 8,
                            textDecoration: "none",
                            fontWeight: 700,
                        }}
                    >
                        Back to Home
                    </Link>
                </>
            )}
        </div>
    );
}

export default function VerifyPage() {
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
                <VerifyContent />
            </Suspense>
        </div>
    );
}
