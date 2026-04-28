"use client";
import React, { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import styles from "./verify.module.css";

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
        <div className={styles.verifyCard}>
            {status === "loading" && (
                <>
                    <div className={styles.icon}>⏳</div>
                    <h1 className={`${styles.title} ${styles.titleLoading}`}>Verifying…</h1>
                    <p className={styles.message}>Please wait while we verify your account.</p>
                </>
            )}
            {status === "success" && (
                <>
                    <div className={styles.icon}>✅</div>
                    <h1 className={`${styles.title} ${styles.titleSuccess}`}>Email Verified!</h1>
                    <p className={styles.message}>{message}</p>
                    <p className={styles.redirectMsg}>
                        Redirecting in 3 seconds…
                    </p>
                </>
            )}
            {status === "error" && (
                <>
                    <div className={styles.icon}>❌</div>
                    <h1 className={`${styles.title} ${styles.titleError}`}>Verification Failed</h1>
                    <p className={styles.message}>{message}</p>
                    <Link href="/" className={styles.homeButton}>
                        Back to Home
                    </Link>
                </>
            )}
        </div>
    );
}

export default function VerifyPage() {
    return (
        <div className={styles.page}>
            <Suspense fallback={<p style={{ color: "#8fa8c8" }}>Loading...</p>}>
                <VerifyContent />
            </Suspense>
        </div>
    );
}
