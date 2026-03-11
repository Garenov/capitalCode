"use client";
import React, { createContext, useContext, useState, useCallback, useRef } from "react";

const ToastContext = createContext(null);

let _toastIdCounter = 0;

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);

    const dismiss = useCallback((id) => {
        setToasts((prev) =>
            prev.map((t) => (t.id === id ? { ...t, leaving: true } : t))
        );
        // Remove from DOM after animation completes
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 380);
    }, []);

    const addToast = useCallback(
        ({ message, type = "info", duration = 4000 }) => {
            const id = ++_toastIdCounter;
            setToasts((prev) => [...prev, { id, message, type, leaving: false }]);
            if (duration > 0) {
                setTimeout(() => dismiss(id), duration);
            }
            return id;
        },
        [dismiss]
    );

    const toast = {
        success: (msg, opts) => addToast({ message: msg, type: "success", ...opts }),
        error: (msg, opts) => addToast({ message: msg, type: "error", ...opts }),
        info: (msg, opts) => addToast({ message: msg, type: "info", ...opts }),
        warning: (msg, opts) => addToast({ message: msg, type: "warning", ...opts }),
    };

    return (
        <ToastContext.Provider value={toast}>
            {children}
            <ToastContainer toasts={toasts} onDismiss={dismiss} />
        </ToastContext.Provider>
    );
}

export function useToast() {
    const ctx = useContext(ToastContext);
    if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
    return ctx;
}

// ─── Icons ─────────────────────────────────────────────────────
const ICONS = {
    success: "✓",
    error: "✕",
    warning: "⚠",
    info: "ℹ",
};

const COLORS = {
    success: { bg: "rgba(34,197,94,0.15)", border: "rgba(34,197,94,0.35)", icon: "#22c55e", bar: "#22c55e" },
    error: { bg: "rgba(239,68,68,0.15)", border: "rgba(239,68,68,0.35)", icon: "#ef4444", bar: "#ef4444" },
    warning: { bg: "rgba(234,179,8,0.15)", border: "rgba(234,179,8,0.35)", icon: "#eab308", bar: "#eab308" },
    info: { bg: "rgba(99,102,241,0.15)", border: "rgba(99,102,241,0.35)", icon: "#818cf8", bar: "#818cf8" },
};

// ─── Container ─────────────────────────────────────────────────
function ToastContainer({ toasts, onDismiss }) {
    if (toasts.length === 0) return null;

    return (
        <>
            <style>{`
        @keyframes _toast_in {
          from { opacity: 0; transform: translateX(110%); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes _toast_out {
          from { opacity: 1; transform: translateX(0); }
          to   { opacity: 0; transform: translateX(110%); }
        }
        ._toast_item {
          animation: _toast_in 0.35s cubic-bezier(0.34,1.56,0.64,1) forwards;
          pointer-events: all;
        }
        ._toast_item._toast_leaving {
          animation: _toast_out 0.35s ease-in forwards;
        }
      `}</style>
            <div
                style={{
                    position: "fixed",
                    bottom: "1.5rem",
                    right: "1.5rem",
                    zIndex: 9999,
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.6rem",
                    alignItems: "flex-end",
                    pointerEvents: "none",
                    maxWidth: "min(380px, calc(100vw - 2rem))",
                }}
            >
                {toasts.map((t) => {
                    const c = COLORS[t.type] || COLORS.info;
                    return (
                        <div
                            key={t.id}
                            className={`_toast_item${t.leaving ? " _toast_leaving" : ""}`}
                            style={{
                                width: "100%",
                                background: c.bg,
                                border: `1px solid ${c.border}`,
                                borderRadius: 12,
                                backdropFilter: "blur(12px)",
                                boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
                                overflow: "hidden",
                                position: "relative",
                            }}
                        >
                            {/* Content row */}
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "flex-start",
                                    gap: "0.75rem",
                                    padding: "0.85rem 1rem 0.85rem 0.9rem",
                                }}
                            >
                                {/* Icon badge */}
                                <div
                                    style={{
                                        flexShrink: 0,
                                        width: 28,
                                        height: 28,
                                        borderRadius: "50%",
                                        background: c.icon + "25",
                                        color: c.icon,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontWeight: 700,
                                        fontSize: 14,
                                        marginTop: 1,
                                    }}
                                >
                                    {ICONS[t.type]}
                                </div>

                                {/* Message */}
                                <span
                                    style={{
                                        flex: 1,
                                        color: "#f0f0f0",
                                        fontSize: 14,
                                        lineHeight: 1.5,
                                        fontFamily: "sans-serif",
                                        wordBreak: "break-word",
                                    }}
                                >
                                    {t.message}
                                </span>

                                {/* Close button */}
                                <button
                                    onClick={() => onDismiss(t.id)}
                                    style={{
                                        flexShrink: 0,
                                        background: "none",
                                        border: "none",
                                        color: "#888",
                                        cursor: "pointer",
                                        fontSize: 16,
                                        padding: "0 0 0 4px",
                                        lineHeight: 1,
                                        marginTop: 1,
                                        transition: "color 0.2s",
                                    }}
                                    onMouseEnter={(e) => (e.currentTarget.style.color = "#f0f0f0")}
                                    onMouseLeave={(e) => (e.currentTarget.style.color = "#888")}
                                    aria-label="Dismiss"
                                >
                                    ✕
                                </button>
                            </div>

                            {/* Accent bar at bottom */}
                            <div
                                style={{
                                    height: 3,
                                    background: c.bar,
                                    opacity: 0.7,
                                    borderRadius: "0 0 12px 12px",
                                }}
                            />
                        </div>
                    );
                })}
            </div>
        </>
    );
}
