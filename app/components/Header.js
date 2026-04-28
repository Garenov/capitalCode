"use client";
import React, { useState, useCallback, useMemo, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import styles from "./header.module.css";
import { useToast } from "@/app/components/Toast";
import { useLanguage } from "@/lib/i18n";

export default function Header() {
  const [loginOpen, setLoginOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { t } = useLanguage();

  const navigationLinks = useMemo(() => [
    { label: t("nav.home"),    href: "/" },
    { label: t("nav.pricing"), href: "/pricing" },
    { label: t("nav.qna"),     href: "/qna" },
  ], [t]);

  // Shrink header on scroll
  // Debounced scroll: only update state when crossing the 40px threshold.
  // Avoids up to 60 setState calls/sec during scroll on low-end devices.
  useEffect(() => {
    let rafId = null;
    let lastScrolled = false;

    const onScroll = () => {
      if (rafId) return; // already scheduled
      rafId = requestAnimationFrame(() => {
        rafId = null;
        const nowScrolled = window.scrollY > 40;
        if (nowScrolled !== lastScrolled) {
          lastScrolled = nowScrolled;
          setScrolled(nowScrolled);
        }
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  // Check auth
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("authToken");
      const userData = localStorage.getItem("user");
      if (token && userData) {
        try { setUser(JSON.parse(userData)); } catch { /* ignore */ }
      } else {
        setUser(null);
      }
    };
    checkAuth();
    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setMobileMenuOpen(false); }, [pathname]);

  const handleLogout = useCallback(() => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    setUser(null);
    router.push("/");
  }, [router]);

  return (
    <>
      <header className={`${styles.header} ${scrolled ? styles.scrolled : ""}`}>
        <div className={styles.headerBox}>

          {/* ── Logo ── */}
          <button
            className={styles.logo}
            onClick={() => router.push("/")}
            aria-label="Go to homepage"
          >
            The Capital Code
          </button>

          {/* ── Desktop inline nav ── */}
          <nav className={styles.desktopNav} aria-label="Main navigation">
            {navigationLinks.map((link) => (
              <button
                key={link.href}
                className={`${styles.navLink} ${pathname === link.href ? styles.navLinkActive : ""}`}
                onClick={() => router.push(link.href)}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* ── Right actions ── */}
          <div className={styles.actions}>
            <button
              className={styles.supportBtn}
              onClick={() => router.push("/support")}
              aria-label="Get tech support"
              title="Technical Support"
            >
              <span className={styles.supportIcon}>🛠️</span>
              <span className={styles.supportLabel}>Tech Support</span>
            </button>

            {/* Cart */}
            <button
              className={styles.iconBtn}
              onClick={() => router.push("/cart")}
              aria-label="Shopping Cart"
              title="View Cart"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/>
              </svg>
            </button>

            {/* Auth */}
            {user ? (
              <div className={styles.userMenu}>
                <button
                  className={styles.userBtn}
                  onClick={() => router.push("/user")}
                  title={user.name}
                >
                  <span className={styles.userAvatar}>
                    {user.name?.charAt(0)?.toUpperCase() || "U"}
                  </span>
                  <span className={styles.userName}>{user.name}</span>
                </button>
              </div>
            ) : (
              <button
                className={styles.loginBtn}
                onClick={() => setLoginOpen(true)}
                aria-label="Log in"
              >
                {t("nav.login")}
              </button>
            )}

            {/* Hamburger — mobile only */}
            <button
              className={styles.hamburger}
              onClick={() => setMobileMenuOpen(prev => !prev)}
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
            >
              <span className={`${styles.bar} ${mobileMenuOpen ? styles.barOpen1 : ""}`} />
              <span className={`${styles.bar} ${mobileMenuOpen ? styles.barOpen2 : ""}`} />
              <span className={`${styles.bar} ${mobileMenuOpen ? styles.barOpen3 : ""}`} />
            </button>
          </div>
        </div>

        {/* ── Mobile nav dropdown ── */}
        <div className={`${styles.mobileNav} ${mobileMenuOpen ? styles.mobileNavOpen : ""}`}>
          {navigationLinks.map((link) => (
            <button
              key={link.href}
              className={`${styles.mobileLink} ${pathname === link.href ? styles.mobileLinkActive : ""}`}
              onClick={() => { router.push(link.href); setMobileMenuOpen(false); }}
            >
              {link.label}
            </button>
          ))}
          <button
            className={styles.mobileSupportLink}
            onClick={() => { router.push("/support"); setMobileMenuOpen(false); }}
          >
            🛠️ Tech Support
          </button>
        </div>
      </header>

      {/* ── Login Modal ── */}
      {loginOpen && (
        <div className={styles.loginOverlay} onClick={() => setLoginOpen(false)}>
          <div className={styles.loginModal} onClick={(e) => e.stopPropagation()}>
            <LoginForm onSuccess={() => setLoginOpen(false)} />
          </div>
        </div>
      )}

      {/* Overlay for mobile menu */}
      {mobileMenuOpen && (
        <div
          className={styles.backdrop}
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </>
  );
}

/* ─── Login / Sign-up Form ─────────────────────────────────── */
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
      const body = isSignUp ? { name, email, password, phone } : { email, password };
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
    } catch {
      toast.error("Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className={styles.loginHeader}>
        <div>
          <h2 className={styles.loginTitle}>{isSignUp ? "Create Account" : "Welcome Back"}</h2>
          <p className={styles.loginSubtitle}>{isSignUp ? "Join The Capital Code" : "Sign in to your account"}</p>
        </div>
        <button
          className={styles.closeButton}
          onClick={onSuccess}
          aria-label="Close"
        >✕</button>
      </div>

      <form className={styles.loginForm} onSubmit={handleSubmit}>
        {isSignUp && (
          <div className={styles.formGroup}>
            <label htmlFor="name">Name</label>
            <input type="text" id="name" placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} required={isSignUp} />
          </div>
        )}
        <div className={styles.formGroup}>
          <label htmlFor="email">Email</label>
          <input type="email" id="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        {isSignUp && (
          <div className={styles.formGroup}>
            <label htmlFor="phone">Phone (optional)</label>
            <input type="tel" id="phone" placeholder="Your phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
        )}
        <div className={styles.formGroup}>
          <label htmlFor="password">Password</label>
          <input type="password" id="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>

        <button type="submit" className={styles.loginSubmit} disabled={loading}>
          {loading ? "Please wait..." : isSignUp ? "Create Account" : "Sign In"}
        </button>

        <p className={styles.signupText}>
          {isSignUp ? "Already have an account? " : "Don't have an account? "}
          <button type="button" onClick={() => setIsSignUp(!isSignUp)}>
            {isSignUp ? "Log In" : "Sign Up"}
          </button>
        </p>
      </form>
    </>
  );
}
