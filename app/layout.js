import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/app/components/Toast";
import { LanguageProvider } from "@/lib/i18n";
import CookieConsent from "@/app/components/CookieConsent";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "The Capital Code - Financial Strategy & Analysis",
  description: "Unlock the secrets of financial strategy with The Capital Code. Learn disciplined investing and long-term value creation.",
  keywords: "finance, investing, capital, strategy, trading",
  robots: "index, follow",
  author: "The Capital Code",
  openGraph: {
    title: "The Capital Code - Financial Strategy & Analysis",
    description: "Unlock the secrets of financial strategy",
    type: "website",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1.0,
  maximumScale: 5.0,
  themeColor: "#091141",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <LanguageProvider>
          <ToastProvider>
            {children}
            <CookieConsent />
          </ToastProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}


