"use client";
import React, { useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import styles from "./header.module.css";
import { useToast } from "@/app/components/Toast";
import { useLanguage } from "@/lib/i18n";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [opacity, setOpacity] = useState(1);
  const [user, setUser] = useState(null);
  const router = useRouter();
  const { t } = useLanguage();

  const navigationLinks = useMemo(() => [
    { label: t("nav.home"), href: "/" },
    { label: t("nav.pricing"), href: "/pricing" },
    { label: t("nav.qna"), href: "/qna" },
  ], [t]);

  React.useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const maxScroll = 300;
      const newOpacity = Math.max(1 - scrollY / maxScroll, 0.3);
      setOpacity(newOpacity);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Check if user is logged in
  React.useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('authToken');
      const userData = localStorage.getItem('user');
      if (token && userData) {
        try {
          setUser(JSON.parse(userData));
        } catch (e) {
          console.error('Failed to parse user data:', e);
        }
      }
    };

    checkAuth();
    // Listen for storage changes (login/logout in other tabs)
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  const handleMenuClick = useCallback(() => {
    setMenuOpen(prev => !prev);
  }, []);

  const handleLoginClick = useCallback(() => {
    setLoginOpen(prev => !prev);
  }, []);

  const handleLogout = useCallback(() => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setUser(null);
    router.push('/');
  }, [router]);

  const handleNavClick = useCallback((href) => {
    setMenuOpen(false);
    router.push(href);
  }, [router]);

  const headerBgColor = useMemo(() => `rgba(15, 37, 63, ${0.92 * opacity})`, [opacity]);

  return (
    <>
      <header
        className={styles.header}
        style={{
          backgroundColor: headerBgColor,
        }}
      >
        <div className={styles.headerBox}>
          <button
            className={styles.headerLeftButtons}
            onClick={handleMenuClick}
            title="Menu"
            aria-label="Toggle navigation menu"
            aria-expanded={menuOpen}
          >
            <img src="/images/burger.png" width={27} height={27} alt="Menu" />
          </button>
          <button
            className={styles.headerLeftButtons}
            onClick={() => router.push("/qna")}
            aria-label="Go to Q&A page"
            title="Questions & Answers"
          >
            <img src="/images/QnA.png" width={27} height={27} alt="Q&A" />
          </button>

          <h1 className={styles.titleHeader} onClick={() => router.push("/")} style={{ cursor: "pointer" }} role="button" tabIndex={0}>The Capital Code</h1>

          <button
            className={styles.headerRightButton}
            title="View Pricing"
            onClick={() => router.push("/pricing")}
            aria-label="Go to pricing page"
          >
            <img src="/images/shoppingCart.png" width={27} height={27} alt="Pricing" />
          </button>
          <button
            className={styles.headerRightButton}
            aria-label="View cart"
            title="Shopping Cart"
            onClick={() => router.push("/cart")}
          >
            <img src="/images/pricing.png" width={27} height={27} alt="Cart" />
          </button>

          {user ? (
            <button
              className={styles.logInButton}
              onClick={() => router.push("/user")}
              aria-label="Go to user page"
              title={user.name}
            >
              {user.name}
            </button>
          ) : (
            <button
              className={styles.logInButton}
              onClick={handleLoginClick}
              aria-label="Open login form"
            >
              {t("nav.login")}
            </button>
          )}
        </div>
      </header>

      {/* Burger Menu */}
      <div
        className={`${styles.burgerMenu} ${menuOpen ? styles.menuOpen : ""}`}
      >
        <div className={styles.menuHeader}>
          <h2>Menu</h2>
          <button
            className={styles.closeButton}
            onClick={() => setMenuOpen(false)}
          >
            ✕
          </button>
        </div>
        <nav className={styles.menuNav}>
          {navigationLinks.map((link) => (
            <button
              key={link.href}
              className={styles.menuLink}
              onClick={() => handleNavClick(link.href)}
            >
              {link.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Login Modal */}
      {loginOpen && (
        <div className={styles.loginOverlay} onClick={() => setLoginOpen(false)}>
          <div className={styles.loginModal} onClick={(e) => e.stopPropagation()}>
            <LoginForm onSuccess={() => {
              setLoginOpen(false);
            }} />
          </div>
        </div>
      )}

      {/* Menu Backdrop */}
      {menuOpen && (
        <div
          className={styles.backdrop}
          onClick={() => setMenuOpen(false)}
        ></div>
      )}
    </>
  );
}

function LoginForm({ onSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const endpoint = isSignUp ? "/api/auth/register" : "/api/auth/login";
      const body = isSignUp
        ? { name, email, password, phone }
        : { email, password };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (data.success) {
        if (isSignUp) {
          toast.success("Registration successful! Please check your email to verify your account.", { duration: 6000 });
          setEmail(""); setPassword(""); setName(""); setPhone("");
          onSuccess();
        } else {
          localStorage.setItem("authToken", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
          toast.success("Login successful!");
          setEmail(""); setPassword(""); setName(""); setPhone("");
          onSuccess();
          window.location.reload();
        }
      } else {
        toast.error(data.message || "Authentication failed");
      }
    } catch (error) {
      console.error("Auth error:", error);
      toast.error("Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className={styles.loginHeader}>
        <h2>{isSignUp ? "Sign Up" : "Log In"}</h2>
        <button
          className={styles.closeButton}
          onClick={() => {
            // Close modal by clicking parent
            document.querySelector(`.${styles.loginOverlay}`)?.click();
          }}
        >
          ✕
        </button>
      </div>
      <form className={styles.loginForm} onSubmit={handleSubmit}>
        {isSignUp && (
          <div className={styles.formGroup}>
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required={isSignUp}
            />
          </div>
        )}
        <div className={styles.formGroup}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        {isSignUp && (
          <div className={styles.formGroup}>
            <label htmlFor="phone">Phone (optional)</label>
            <input
              type="tel"
              id="phone"
              placeholder="Your phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
        )}
        <div className={styles.formGroup}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className={styles.loginSubmit} disabled={loading}>
          {loading ? "Please wait..." : isSignUp ? "Sign Up" : "Log In"}
        </button>
        <p className={styles.signupText}>
          {isSignUp ? "Already have an account? " : "Don't have an account? "}
          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            style={{ background: "none", border: "none", color: "rgb(224, 199, 58)", cursor: "pointer", textDecoration: "underline" }}
          >
            {isSignUp ? "Log In" : "Sign Up"}
          </button>
        </p>
      </form>
    </>
  );
}
