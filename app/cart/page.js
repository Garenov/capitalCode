"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/app/components/Header";
import styles from "./cart.module.css";

export default function Cart() {
    const router = useRouter();
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(false);

    // Load cart from localStorage on mount
    useEffect(() => {
        const savedCart = localStorage.getItem("cart");
        if (savedCart) {
            try {
                setCartItems(JSON.parse(savedCart));
            } catch (e) {
                console.error("Failed to parse cart:", e);
            }
        }
    }, []);

    // Save cart to localStorage whenever it changes
    useEffect(() => {
        if (cartItems.length > 0) {
            localStorage.setItem("cart", JSON.stringify(cartItems));
        } else {
            localStorage.removeItem("cart");
        }
    }, [cartItems]);

    const updateQuantity = (id, delta) => {
        setCartItems(prev =>
            prev.map(item =>
                item.id === id
                    ? { ...item, quantity: Math.max(1, item.quantity + delta) }
                    : item
            )
        );
    };

    const removeItem = (id) => {
        setCartItems(prev => prev.filter(item => item.id !== id));
    };

    const clearCart = () => {
        setCartItems([]);
        localStorage.removeItem("cart");
    };

    const getTotalPrice = () => {
        return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    };

    const handleCheckout = async () => {
        const token = localStorage.getItem('authToken');

        if (!token) {
            alert("Přihlaste se prosím pro dokončení nákupu");
            return;
        }

        if (cartItems.length === 0) {
            alert("Váš košík je prázdný");
            return;
        }

        setLoading(true);

        try {
            // Process each item in cart
            for (const item of cartItems) {
                const response = await fetch('/api/purchases', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        planName: item.name,
                        price: item.price,
                        devices: item.quantity,
                        years: 1,
                        currency: 'Kč',
                    }),
                });

                const data = await response.json();
                if (!data.success) {
                    throw new Error(data.message || 'Purchase failed');
                }

                // Auto-download for digital items
                if (item.downloadable) {
                    setTimeout(() => {
                        window.open('/ccBook.pdf', '_blank');
                    }, 500);
                }
            }

            alert(`Objednávka úspěšně dokončena! Celkem: ${getTotalPrice()} Kč`);
            clearCart();
            router.push('/');
        } catch (error) {
            console.error('Checkout error:', error);
            alert('Chyba při zpracování objednávky: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.page}>
            <Header />
            <main className={styles.mainContent}>
                <div className={styles.container}>
                    <div className={styles.header}>
                        <h1>Nákupní košík</h1>
                        {cartItems.length > 0 && (
                            <button onClick={clearCart} className={styles.clearButton}>
                                Vyprázdnit košík
                            </button>
                        )}
                    </div>

                    {cartItems.length === 0 ? (
                        <div className={styles.emptyCart}>
                            <div className={styles.emptyIcon}>🛒</div>
                            <h2>Váš košík je prázdný</h2>
                            <p>Přidejte knihy do košíku a vraťte se sem pro dokončení nákupu</p>
                            <button
                                onClick={() => router.push('/pricing')}
                                className={styles.shopButton}
                            >
                                Prohlédnout nabídku
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className={styles.cartItems}>
                                {cartItems.map((item) => (
                                    <div key={item.id} className={styles.cartItem}>
                                        <div className={styles.itemInfo}>
                                            <h3>{item.name} Edice</h3>
                                            <p className={styles.itemDescription}>{item.description}</p>
                                            {item.downloadable && (
                                                <span className={styles.digitalBadge}>📥 Digitální stažení</span>
                                            )}
                                        </div>

                                        <div className={styles.itemControls}>
                                            <div className={styles.quantityControl}>
                                                <button
                                                    onClick={() => updateQuantity(item.id, -1)}
                                                    className={styles.quantityButton}
                                                    disabled={item.quantity <= 1}
                                                >
                                                    −
                                                </button>
                                                <span className={styles.quantity}>{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, 1)}
                                                    className={styles.quantityButton}
                                                >
                                                    +
                                                </button>
                                            </div>

                                            <div className={styles.itemPrice}>
                                                <span className={styles.price}>{item.price * item.quantity} Kč</span>
                                                {item.quantity > 1 && (
                                                    <span className={styles.pricePerUnit}>{item.price} Kč/ks</span>
                                                )}
                                            </div>

                                            <button
                                                onClick={() => removeItem(item.id)}
                                                className={styles.removeButton}
                                                title="Odebrat z košíku"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className={styles.summary}>
                                <div className={styles.summaryRow}>
                                    <span>Mezisoučet:</span>
                                    <span>{getTotalPrice()} Kč</span>
                                </div>
                                <div className={styles.summaryRow}>
                                    <span>Doprava:</span>
                                    <span className={styles.free}>Zdarma</span>
                                </div>
                                <div className={`${styles.summaryRow} ${styles.total}`}>
                                    <span>Celkem:</span>
                                    <span className={styles.totalPrice}>{getTotalPrice()} Kč</span>
                                </div>

                                <button
                                    onClick={handleCheckout}
                                    className={styles.checkoutButton}
                                    disabled={loading}
                                >
                                    {loading ? "Zpracování..." : "Dokončit objednávku"}
                                </button>

                                <button
                                    onClick={() => router.push('/pricing')}
                                    className={styles.continueButton}
                                >
                                    Pokračovat v nákupu
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </main>
        </div>
    );
}
