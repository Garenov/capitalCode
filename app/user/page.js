"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/app/components/Header";
import styles from "./user.module.css";

export default function UserPage() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [purchases, setPurchases] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        const userData = localStorage.getItem('user');

        if (!token || !userData) {
            router.push('/');
            return;
        }

        try {
            setUser(JSON.parse(userData));
            fetchPurchases(token);
        } catch (e) {
            console.error('Failed to parse user data:', e);
            router.push('/');
        }
    }, [router]);

    const fetchPurchases = async (token) => {
        try {
            const response = await fetch('/api/purchases', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            const data = await response.json();
            if (data.success) {
                setPurchases(data.purchases || []);
            }
        } catch (error) {
            console.error('Failed to fetch purchases:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        localStorage.removeItem('cart');
        router.push('/');
    };

    const downloadPDF = async () => {
        const token = localStorage.getItem('authToken');
        if (!token) return;

        try {
            const res = await fetch('/api/download', {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                alert(data.message || 'Download failed.');
                return;
            }

            const blob = await res.blob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'CapitalCode.pdf';
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(url);
        } catch {
            alert('Network error. Please try again.');
        }
    };

    if (!user) {
        return null;
    }

    return (
        <div className={styles.page}>
            <Header />
            <main className={styles.mainContent}>
                <div className={styles.container}>
                    <div className={styles.profileHeader}>
                        <div className={styles.avatar}>
                            {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className={styles.userInfo}>
                            <h1>{user.name}</h1>
                            <p>{user.email}</p>
                            {user.phone && <p>{user.phone}</p>}
                        </div>
                        <button onClick={handleLogout} className={styles.logoutButton}>
                            Log Out
                        </button>
                    </div>

                    <div className={styles.section}>
                        <h2>My Orders</h2>
                        {loading ? (
                            <p className={styles.loading}>Loading...</p>
                        ) : purchases.length === 0 ? (
                            <div className={styles.emptyState}>
                                <p>You don&apos;t have any orders yet</p>
                                <button
                                    onClick={() => router.push('/pricing')}
                                    className={styles.shopButton}
                                >
                                    Browse Products
                                </button>
                            </div>
                        ) : (
                            <div className={styles.purchasesList}>
                                {purchases.map((purchase) => (
                                    <div key={purchase.id} className={styles.purchaseCard}>
                                        <div className={styles.purchaseHeader}>
                                            <h3>{purchase.planName} Edition</h3>
                                            <span className={`${styles.status} ${styles[purchase.status]}`}>
                                                {purchase.status === 'completed' ? 'Completed' :
                                                    purchase.status === 'pending' ? 'Pending' : 'Cancelled'}
                                            </span>
                                        </div>
                                        <div className={styles.purchaseDetails}>
                                            <div className={styles.detail}>
                                                <span className={styles.label}>Price:</span>
                                                <span className={styles.value}>{purchase.price} {purchase.currency}</span>
                                            </div>
                                            <div className={styles.detail}>
                                                <span className={styles.label}>Date:</span>
                                                <span className={styles.value}>
                                                    {new Date(purchase.purchaseDate).toLocaleDateString('en-US')}
                                                </span>
                                            </div>
                                            <div className={styles.detail}>
                                                <span className={styles.label}>Quantity:</span>
                                                <span className={styles.value}>{purchase.devices}</span>
                                            </div>
                                        </div>
                                        {['DIGITAL', 'BUNDLE', 'BOOK', 'PREMIUM'].includes(purchase.planName) &&
                                            purchase.status === 'completed' && (
                                                <button
                                                    onClick={downloadPDF}
                                                    className={styles.downloadButton}
                                                >
                                                    📥 Download PDF
                                                </button>
                                            )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className={styles.section}>
                        <h2>Account Information</h2>
                        <div className={styles.accountInfo}>
                            <div className={styles.infoRow}>
                                <span className={styles.label}>Name:</span>
                                <span className={styles.value}>{user.name}</span>
                            </div>
                            <div className={styles.infoRow}>
                                <span className={styles.label}>Email:</span>
                                <span className={styles.value}>{user.email}</span>
                            </div>
                            {user.phone && (
                                <div className={styles.infoRow}>
                                    <span className={styles.label}>Phone:</span>
                                    <span className={styles.value}>{user.phone}</span>
                                </div>
                            )}
                            <div className={styles.infoRow}>
                                <span className={styles.label}>Registered:</span>
                                <span className={styles.value}>
                                    {new Date(user.createdAt).toLocaleDateString('en-US')}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
