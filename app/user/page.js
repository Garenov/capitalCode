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

    const downloadPDF = () => {
        window.open('/ccBook.pdf', '_blank');
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
                            Odhlásit se
                        </button>
                    </div>

                    <div className={styles.section}>
                        <h2>Moje objednávky</h2>
                        {loading ? (
                            <p className={styles.loading}>Načítání...</p>
                        ) : purchases.length === 0 ? (
                            <div className={styles.emptyState}>
                                <p>Zatím nemáte žádné objednávky</p>
                                <button
                                    onClick={() => router.push('/pricing')}
                                    className={styles.shopButton}
                                >
                                    Prohlédnout nabídku
                                </button>
                            </div>
                        ) : (
                            <div className={styles.purchasesList}>
                                {purchases.map((purchase) => (
                                    <div key={purchase.id} className={styles.purchaseCard}>
                                        <div className={styles.purchaseHeader}>
                                            <h3>{purchase.planName} Edice</h3>
                                            <span className={`${styles.status} ${styles[purchase.status]}`}>
                                                {purchase.status === 'completed' ? 'Dokončeno' :
                                                    purchase.status === 'pending' ? 'Čeká' : 'Zrušeno'}
                                            </span>
                                        </div>
                                        <div className={styles.purchaseDetails}>
                                            <div className={styles.detail}>
                                                <span className={styles.label}>Cena:</span>
                                                <span className={styles.value}>{purchase.price} {purchase.currency}</span>
                                            </div>
                                            <div className={styles.detail}>
                                                <span className={styles.label}>Datum:</span>
                                                <span className={styles.value}>
                                                    {new Date(purchase.purchaseDate).toLocaleDateString('cs-CZ')}
                                                </span>
                                            </div>
                                            <div className={styles.detail}>
                                                <span className={styles.label}>Počet kusů:</span>
                                                <span className={styles.value}>{purchase.devices}</span>
                                            </div>
                                        </div>
                                        {(purchase.planName === 'DIGITAL' || purchase.planName === 'BUNDLE') &&
                                            purchase.status === 'completed' && (
                                                <button
                                                    onClick={downloadPDF}
                                                    className={styles.downloadButton}
                                                >
                                                    📥 Stáhnout PDF
                                                </button>
                                            )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className={styles.section}>
                        <h2>Informace o účtu</h2>
                        <div className={styles.accountInfo}>
                            <div className={styles.infoRow}>
                                <span className={styles.label}>Jméno:</span>
                                <span className={styles.value}>{user.name}</span>
                            </div>
                            <div className={styles.infoRow}>
                                <span className={styles.label}>Email:</span>
                                <span className={styles.value}>{user.email}</span>
                            </div>
                            {user.phone && (
                                <div className={styles.infoRow}>
                                    <span className={styles.label}>Telefon:</span>
                                    <span className={styles.value}>{user.phone}</span>
                                </div>
                            )}
                            <div className={styles.infoRow}>
                                <span className={styles.label}>Registrován:</span>
                                <span className={styles.value}>
                                    {new Date(user.createdAt).toLocaleDateString('cs-CZ')}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
