"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/app/components/Header";
import styles from "./cart.module.css";
import { useToast } from "@/app/components/Toast";

export default function Cart() {
    const router = useRouter();
    const toast = useToast();
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
            toast.warning("Please log in to complete your purchase");
            return;
        }

        if (cartItems.length === 0) {
            toast.warning("Your cart is empty");
            return;
        }

        setLoading(true);

        try {
            // Use the first cart item — Stripe checkout handles one plan at a time
            const item = cartItems[0];

            const response = await fetch('/api/stripe/checkout', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ planName: item.name }),
            });

            const data = await response.json();

            if (!data.success) {
                toast.error(data.message || 'Failed to start payment.');
                return;
            }

            // Clear cart before redirecting to Stripe
            clearCart();

            // Redirect to Stripe Checkout
            window.location.href = data.url;
        } catch (error) {
            console.error('Checkout error:', error);
            toast.error('Error processing order: ' + error.message);
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
                        <h1>Shopping Cart</h1>
                        {cartItems.length > 0 && (
                            <button onClick={clearCart} className={styles.clearButton}>
                                Clear Cart
                            </button>
                        )}
                    </div>

                    {cartItems.length === 0 ? (
                        <div className={styles.emptyCart}>
                            <div className={styles.emptyIcon}>🛒</div>
                            <h2>Your cart is empty</h2>
                            <p>Add books to your cart and come back here to complete your purchase</p>
                            <button
                                onClick={() => router.push('/pricing')}
                                className={styles.shopButton}
                            >
                                Browse Products
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className={styles.cartItems}>
                                {cartItems.map((item) => (
                                    <div key={item.id} className={styles.cartItem}>
                                        <div className={styles.itemInfo}>
                                            <h3>{item.name} Edition</h3>
                                            <p className={styles.itemDescription}>{item.description}</p>
                                            {item.downloadable && (
                                                <span className={styles.digitalBadge}>📥 Digital Download</span>
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
                                                <span className={styles.price}>${item.price * item.quantity}</span>
                                                {item.quantity > 1 && (
                                                    <span className={styles.pricePerUnit}>${item.price}/ea</span>
                                                )}
                                            </div>

                                            <button
                                                onClick={() => removeItem(item.id)}
                                                className={styles.removeButton}
                                                title="Remove from cart"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className={styles.summary}>
                                <div className={styles.summaryRow}>
                                    <span>Subtotal:</span>
                                    <span>${getTotalPrice()}</span>
                                </div>
                                <div className={styles.summaryRow}>
                                    <span>Shipping:</span>
                                    <span className={styles.free}>Free</span>
                                </div>
                                <div className={`${styles.summaryRow} ${styles.total}`}>
                                    <span>Total:</span>
                                    <span className={styles.totalPrice}>${getTotalPrice()}</span>
                                </div>

                                <button
                                    onClick={handleCheckout}
                                    className={styles.checkoutButton}
                                    disabled={loading}
                                >
                                    {loading ? "Processing..." : "Complete Order"}
                                </button>

                                <button
                                    onClick={() => router.push('/pricing')}
                                    className={styles.continueButton}
                                >
                                    Continue Shopping
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </main>
        </div>
    );
}
