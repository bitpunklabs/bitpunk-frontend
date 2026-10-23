"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { destinations, navigation } from "@/lib/showcase";
import type { WordmarkArtwork } from "@/lib/scene-assets";
import { ScrollBrand } from "./scroll-brand";
import styles from "./site-header.module.css";

// Substack / TradingView / GitHub paths: Simple Icons (CC0).
const socialPlatforms = [
  { name: "X", path: "M18.9 2H22l-6.8 7.8L23.2 22h-6.3L12 14.6 5.5 22H2.4l8.2-9.4L2 2h6.5l4.4 6.7L18.9 2Zm-1.1 18h1.7L7.6 3.9H5.8L17.8 20Z" },
  { name: "TradingView", path: "M15.8654 8.2789c0 1.3541-1.0978 2.4519-2.452 2.4519-1.354 0-2.4519-1.0978-2.4519-2.452 0-1.354 1.0978-2.4518 2.452-2.4518 1.3541 0 2.4519 1.0977 2.4519 2.4519zM9.75 6H0v4.9038h4.8462v7.2692H9.75Zm8.5962 0H24l-5.1058 12.173h-5.6538z" },
  { name: "Substack", path: "M22.539 8.242H1.46V5.406h21.08v2.836zM1.46 10.812V24L12 18.11 22.54 24V10.812H1.46zM22.54 0H1.46v2.836h21.08V0z" },
  { name: "GitHub", path: "M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" },
  { name: "Discord", path: "M19.7 5.1a18 18 0 0 0-4.5-1.4l-.6 1.2a16 16 0 0 0-5.2 0l-.6-1.2a18 18 0 0 0-4.5 1.4C1.5 9.2.7 13.2 1.1 17.1a18 18 0 0 0 5.5 2.8l1.1-1.8-1.7-.8.4-.3a13 13 0 0 0 11.2 0l.4.3-1.7.8 1.1 1.8a18 18 0 0 0 5.5-2.8c.5-4.5-.8-8.5-3.2-12ZM8.6 14.7c-1 0-1.8-.9-1.8-2s.8-2 1.8-2 1.8.9 1.8 2-.8 2-1.8 2Zm6.8 0c-1 0-1.8-.9-1.8-2s.8-2 1.8-2 1.8.9 1.8 2-.8 2-1.8 2Z" },
];

function SocialPlaceholders() {
  const links: Record<string, string | null> = { X: destinations.x, TradingView: destinations.tradingview, Substack: destinations.substack, GitHub: destinations.github };
  return (
    <div className={styles.socials} aria-label="Social media">
      {socialPlatforms.map(({ name, path }) => links[name] ? (
        <a key={name} className={styles.social} href={links[name]!}
          target="_blank" rel="noopener noreferrer" aria-label={`Bitpunk on ${name}`}>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d={path} /></svg>
          <span className={styles.tooltip} aria-hidden="true">{name}</span>
        </a>
      ) : (
        <button key={name} type="button" className={styles.social}
          aria-disabled="true" aria-label={`${name} — coming soon`}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path fill="currentColor" d={path} />
          </svg>
          <span className={styles.tooltip} aria-hidden="true">{name} · Coming soon</span>
        </button>
      ))}
    </div>
  );
}

export function SiteHeader({ wordmark }: { wordmark: WordmarkArtwork }) {
  const pathname = usePathname();
  // An open menu belongs to this route. Back/forward navigation also closes it.
  const [menuRoute, setMenuRoute] = useState<string | null>(null);
  const open = menuRoute === pathname;
  const toggle = useRef<HTMLButtonElement>(null);
  const header = useRef<HTMLElement>(null);
  function goHome() {
    setMenuRoute(null);
    window.scrollTo({ top: 0, behavior: "instant" });
  }
  useEffect(() => {
    function escape(event: KeyboardEvent) {
      if (event.key === "Escape" && open) {
        setMenuRoute(null);
        toggle.current?.focus();
      }
    }
    function outside(event: PointerEvent) {
      if (open && event.target instanceof Node && !header.current?.contains(event.target)) {
        setMenuRoute(null);
      }
    }
    const desktop = window.matchMedia("(min-width: 961px)");
    function closeOnDesktop() {
      if (desktop.matches) setMenuRoute(null);
    }
    function closeOnHistory() { setMenuRoute(null); }
    window.addEventListener("keydown", escape);
    window.addEventListener("popstate", closeOnHistory);
    document.addEventListener("pointerdown", outside);
    desktop.addEventListener("change", closeOnDesktop);
    return () => {
      window.removeEventListener("keydown", escape);
      window.removeEventListener("popstate", closeOnHistory);
      document.removeEventListener("pointerdown", outside);
      desktop.removeEventListener("change", closeOnDesktop);
    };
  }, [open]);
  return (
    <header ref={header} className={styles.header} data-site-header>
      <ScrollBrand artwork={wordmark} onNavigate={goHome} />
      <button
        ref={toggle}
        className={styles.toggle}
        type="button"
        aria-expanded={open}
        aria-controls="site-navigation"
        onClick={() => setMenuRoute(open ? null : pathname)}
      >
        {open ? "Close" : "Menu"}
      </button>
      <nav
        id="site-navigation"
        className={styles.nav}
        data-open={open || undefined}
        aria-label="Main navigation"
      >
        {navigation.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            aria-current={
              pathname === href || (href !== "/" && pathname.startsWith(`${href}/`))
                ? "page"
                : undefined
            }
            onClick={href === "/" ? goHome : () => setMenuRoute(null)}
          >
            {label}
          </Link>
        ))}
        <SocialPlaceholders />
      </nav>
    </header>
  );
}
