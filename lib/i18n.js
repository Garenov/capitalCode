"use client";
import React, { createContext, useContext, useCallback } from "react";

// ── English-only translation dictionary ───────────────────────
const translations = {
  // Header / Nav
  "nav.home": "Home",
  "nav.pricing": "Pricing",
  "nav.qna": "Q&A",
  "nav.menu": "Menu",
  "nav.login": "Log In",
  "nav.logout": "Log Out",
  "nav.cart": "Cart",

  // Auth
  "auth.login": "Log In",
  "auth.signup": "Sign Up",
  "auth.email": "Email",
  "auth.password": "Password",
  "auth.name": "Name",
  "auth.phone": "Phone (optional)",
  "auth.loginBtn": "Log In",
  "auth.signupBtn": "Sign Up",
  "auth.noAccount": "Don't have an account?",
  "auth.hasAccount": "Already have an account?",
  "auth.pleaseWait": "Please wait...",
  "auth.registerSuccess": "Registration successful! Please check your email to verify your account.",
  "auth.loginSuccess": "Login successful!",
  "auth.failed": "Authentication failed",

  // Pricing
  "pricing.title": "Choose Your Edition",
  "pricing.subtitle": "Invest in your financial education",
  "pricing.buy": "BUY NOW",
  "pricing.termsNote": "By purchasing you agree to our",
  "pricing.terms": "Terms and Conditions",
  "pricing.and": "and",
  "pricing.privacy": "Privacy Policy",
  "pricing.popular": "Most Popular",

  // Footer
  "footer.privacy": "Privacy Policy",
  "footer.terms": "Terms & Conditions",
  "footer.gdpr": "GDPR",
  "footer.rights": "All rights reserved.",

  // Cookie consent
  "cookie.message": "This website uses cookies to ensure the best experience. By using the site you agree to our",
  "cookie.policy": "Privacy Policy",
  "cookie.accept": "Accept",
  "cookie.reject": "Reject",

  // Newsletter
  "newsletter.title": "Stay Updated",
  "newsletter.subtitle": "Subscribe to get notified about new chapters and exclusive content.",
  "newsletter.email": "Your email",
  "newsletter.name": "Name (optional)",
  "newsletter.subscribe": "Subscribe",
  "newsletter.subscribing": "Subscribing...",
  "newsletter.success": "Successfully subscribed!",
  "newsletter.alreadySub": "Already subscribed.",
  "newsletter.error": "Failed to subscribe.",

  // FAQ
  "faq.title": "Frequently Asked Questions",
  "faq.subtitle": "Find answers to the most common questions.",

  // User page
  "user.orders": "My Orders",
  "user.noOrders": "You don't have any orders yet",
  "user.browse": "Browse Products",
  "user.accountInfo": "Account Information",
  "user.download": "📥 Download PDF",
  "user.loading": "Loading...",

  // Cart
  "cart.title": "Shopping Cart",
  "cart.empty": "Your cart is empty",
  "cart.emptyDesc": "Add books to your cart and come back here to complete your purchase",
  "cart.clear": "Clear cart",
  "cart.subtotal": "Subtotal:",
  "cart.shipping": "Shipping:",
  "cart.free": "Free",
  "cart.total": "Total:",
  "cart.checkout": "Complete Order",
  "cart.continue": "Continue Shopping",
  "cart.processing": "Processing...",
  "cart.loginRequired": "Please log in to complete your purchase",

  // QnA
  "qna.contactTitle": "Get In Touch",
  "qna.contactSubtitle": "Have questions? We're here to help. Send us a message and we'll respond as soon as possible.",
  "qna.nameLabel": "Your Name",
  "qna.emailLabel": "Email Address",
  "qna.subjectLabel": "Subject",
  "qna.categoryLabel": "Category",
  "qna.messageLabel": "Message",
  "qna.send": "Send Message",
  "qna.sent": "✓ Thank you! We'll get back to you soon.",

  // Legal navigation
  "legal.backHome": "← Back to Home",
};

// ── Context ───────────────────────────────────────────────────
const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  // Always English — no language switching needed
  const lang = "en";

  const switchLanguage = useCallback(() => {
    // No-op — site is English-only
  }, []);

  const t = useCallback(
    (key) => translations[key] || key,
    []
  );

  return (
    <LanguageContext.Provider value={{ lang, switchLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used inside <LanguageProvider>");
  return ctx;
}

export { translations };
