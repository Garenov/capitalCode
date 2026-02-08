import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

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
  title: "Capital Code - Financial Strategy & Analysis",
  description: "Unlock the secrets of financial strategy with The Capital Code. Learn disciplined investing and long-term value creation.",
  keywords: "finance, investing, capital, strategy, trading",
  viewport: "width=device-width, initial-scale=1.0, maximum-scale=5.0",
  themeColor: "#091141",
  robots: "index, follow",
  author: "Capital Code",
  openGraph: {
    title: "Capital Code - Financial Strategy & Analysis",
    description: "Unlock the secrets of financial strategy",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
        <meta name="theme-color" content="#091141" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
      </body>
    </html>
  );
}
