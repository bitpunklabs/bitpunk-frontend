"use client";
import Link from "next/link";
import { Wordmark } from "@/components/wordmark";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { destinations, navigation } from "@/lib/showcase";

function SocialPlaceholders() {
  return (
    <div className="nav-socials" aria-label="Social media">
      <button
        type="button"
        className="social-placeholder"
        aria-disabled="true"
        aria-label="X — coming soon"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            fill="currentColor"
            d="M18.9 2H22l-6.8 7.8L23.2 22h-6.3L12 14.6 5.5 22H2.4l8.2-9.4L2 2h6.5l4.4 6.7L18.9 2Zm-1.1 18h1.7L7.6 3.9H5.8L17.8 20Z"
          />
        </svg>
        <span className="social-tooltip" aria-hidden="true">
          X · Coming soon
        </span>
      </button>
      <button
        type="button"
        className="social-placeholder"
        aria-disabled="true"
        aria-label="YouTube — coming soon"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <rect x="2" y="5" width="20" height="14" rx="4" fill="currentColor" />
          <path d="m10 8.5 6 3.5-6 3.5Z" fill="var(--paper)" />
        </svg>
        <span className="social-tooltip" aria-hidden="true">
          YouTube · Coming soon
        </span>
      </button>
      {destinations.discord ? (
        <a
          className="social-placeholder is-available"
          href={destinations.discord}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Join Bitpunk on Discord"
        >
          <DiscordIcon />
          <span className="social-tooltip" aria-hidden="true">
            Discord
          </span>
        </a>
      ) : (
        <button
          type="button"
          className="social-placeholder"
          aria-disabled="true"
          aria-label="Discord — coming soon"
        >
          <DiscordIcon />
          <span className="social-tooltip" aria-hidden="true">
            Discord · Coming soon
          </span>
        </button>
      )}
    </div>
  );
}

function DiscordIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path fill="currentColor" d="M19.7 5.1a18 18 0 0 0-4.5-1.4l-.6 1.2a16 16 0 0 0-5.2 0l-.6-1.2a18 18 0 0 0-4.5 1.4C1.5 9.2.7 13.2 1.1 17.1a18 18 0 0 0 5.5 2.8l1.1-1.8-1.7-.8.4-.3a13 13 0 0 0 11.2 0l.4.3-1.7.8 1.1 1.8a18 18 0 0 0 5.5-2.8c.5-4.5-.8-8.5-3.2-12ZM8.6 14.7c-1 0-1.8-.9-1.8-2s.8-2 1.8-2 1.8.9 1.8 2-.8 2-1.8 2Zm6.8 0c-1 0-1.8-.9-1.8-2s.8-2 1.8-2 1.8.9 1.8 2-.8 2-1.8 2Z" />
    </svg>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    function escape(event: KeyboardEvent) {
      if (event.key === "Escape" && open) {
        setOpen(false);
        toggle.current?.focus();
      }
    }
    window.addEventListener("keydown", escape);
    return () => window.removeEventListener("keydown", escape);
  }, [open]);
  return (
    <header className="site-header">
      <Link
        className="wordmark"
        href="/"
        aria-label="Bitpunk home"
        onClick={() => setOpen(false)}
      >
        <Wordmark />
      </Link>
      <button
        ref={toggle}
        className="menu-toggle"
        type="button"
        aria-expanded={open}
        aria-controls="site-navigation"
        onClick={() => setOpen(!open)}
      >
        {open ? "Close" : "Menu"}
      </button>
      <nav
        id="site-navigation"
        className={open ? "site-nav is-open" : "site-nav"}
        aria-label="Main navigation"
      >
        {navigation.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            aria-current={
              pathname === href || pathname.startsWith(`${href}/`)
                ? "page"
                : undefined
            }
            onClick={() => setOpen(false)}
          >
            {label}
          </Link>
        ))}
        <SocialPlaceholders />
      </nav>
    </header>
  );
}
