import type { Metadata } from "next";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getSiteUrl } from "@/lib/seo";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: "Bitpunk — Independent market research and tools",
    template: "%s — Bitpunk",
  },
  description:
    "Independent market research, a free Playbook, member community and TradingView tools.",
  openGraph: {
    type: "website",
    title: "Bitpunk — Independent market research and tools",
    description:
      "Read the free Playbook. Join the community. Use the tools when you need them.",
    images: [
      {
        url: "/brand/hero-system-v1.png",
        width: 1535,
        height: 1024,
        alt: "Bitpunk research system",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Bitpunk — Independent market research and tools",
    description:
      "Read the free Playbook. Join the community. Use the tools when you need them.",
    images: ["/brand/hero-system-v1.png"],
  },
  icons: {
    icon: [
      {
        url: "/brand/favicon-light.png",
        media: "(prefers-color-scheme: light)",
      },
      { url: "/brand/favicon-dark.png", media: "(prefers-color-scheme: dark)" },
    ],
    shortcut: "/brand/favicon-dark.png",
    apple: "/brand/favicon-dark.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <div className="frame">
          <SiteHeader />
          <main>{children}</main>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
