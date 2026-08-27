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
    "A free market Playbook, member community and TradingView tools for systematic traders.",
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
