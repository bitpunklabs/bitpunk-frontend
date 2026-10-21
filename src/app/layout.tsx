import type { Metadata } from "next";
import localFont from "next/font/local";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { MarketTicker } from "@/components/market-ticker";
import { getSiteUrl } from "@/lib/seo";
import { getHomeArtwork } from "@/lib/scene-assets";
import "./globals.css";
import "./typography.css";
import "./marble-chrome.css";
const display = localFont({
  src: "../fonts/barlow-condensed-bold.ttf",
  variable: "--font-display",
  display: "swap",
  weight: "700",
});
const sans = localFont({
  src: [
    { path: "../fonts/instrument-sans-regular.ttf", weight: "400" },
    { path: "../fonts/instrument-sans-semibold.ttf", weight: "600" },
  ],
  variable: "--font-sans",
  display: "swap",
});
const emphasis = localFont({
  src: "../fonts/cormorant-garamond-latin-italic.woff2",
  variable: "--font-emphasis",
  weight: "500 600",
  style: "italic",
  display: "swap",
  adjustFontFallback: "Times New Roman",
  preload: false,
});
export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: "Bitpunk — Independent market research.",
    template: "%s — Bitpunk",
  },
  description:
    "Research, indicators and open-source tools for a clearer view of the market.",
  openGraph: {
    type: "website",
    siteName: "Bitpunk",
    title: "Bitpunk — Independent market research.",
    description:
      "Research, indicators and open-source tools for a clearer view of the market.",
  },
  twitter: { card: "summary_large_image" },
  icons: {
    icon: [
      ...[16, 32, 64].map((size) => ({
        url: `/brand/favicon-dark${size === 64 ? "" : `-${size}`}.png?v=black-3`,
        type: "image/png",
        sizes: `${size}x${size}`,
      })),
      {
        url: "/brand/favicon.svg?v=black-3",
        type: "image/svg+xml",
        sizes: "any",
      },
    ],
    shortcut: "/favicon.ico?v=black-3",
    apple: {
      url: "/brand/apple-touch-icon.png?v=black-3",
      sizes: "180x180",
    },
  },
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${display.variable} ${sans.variable} ${emphasis.variable}`}
    >
      <body id="top">
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        <div className="frame">
          <div className="site-chrome" data-site-chrome>
            <SiteHeader wordmark={getHomeArtwork().wordmark} />
            <MarketTicker />
          </div>
          <main id="main-content">{children}</main>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
