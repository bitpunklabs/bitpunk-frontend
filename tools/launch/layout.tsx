import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import "./typography.css";

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
const description = "Research, indicators and open source. Where market ideas take shape.";
export const metadata: Metadata = {
  metadataBase: new URL("https://bitpunk.io"),
  title: "Bitpunk — Coming soon.",
  description,
  alternates: { canonical: "/" },
  openGraph: { type: "website", url: "https://bitpunk.io", siteName: "Bitpunk", title: "Bitpunk — Coming soon.", description },
  twitter: { card: "summary", title: "Bitpunk — Coming soon.", description },
  icons: {
    icon: [
      { url: "/brand/favicon-light-16.png", type: "image/png", sizes: "16x16" },
      { url: "/brand/favicon-light-32.png", type: "image/png", sizes: "32x32" },
      { url: "/brand/favicon-light.svg", type: "image/svg+xml", sizes: "any" },
    ],
    shortcut: "/favicon.ico",
    apple: { url: "/brand/apple-touch-icon-light.png", sizes: "180x180" },
  },
};
export default function LaunchLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en" className={`${sans.variable} ${emphasis.variable}`}><body>
    <a className="skip-link" href="#main-content">Skip to content</a>
    {children}
  </body></html>;
}
