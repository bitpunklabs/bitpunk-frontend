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
    </div>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [sourceOpen, setSourceOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  const sourceToggle = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    function escape(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      if (sourceOpen) {
        setSourceOpen(false);
        sourceToggle.current?.focus();
      } else if (open) {
        setOpen(false);
        toggle.current?.focus();
      }
    }
    window.addEventListener("keydown", escape);
    return () => window.removeEventListener("keydown", escape);
  }, [open, sourceOpen]);
  function closeNavigation() {
    setOpen(false);
    setSourceOpen(false);
  }
  return (
    <header className="site-header">
      <Link
        className="wordmark"
        href="/"
        aria-label="Bitpunk home"
        onClick={closeNavigation}
      >
        <Wordmark />
      </Link>
      <button
        ref={toggle}
        className="menu-toggle"
        type="button"
        aria-expanded={open}
        aria-controls="site-navigation"
        onClick={() => {
          setOpen(!open);
          setSourceOpen(false);
        }}
      >
        {open ? "Close −" : "Menu +"}
      </button>
      <nav
        id="site-navigation"
        className={open ? "site-nav is-open" : "site-nav"}
        aria-label="Main navigation"
      >
        {navigation.map(({ href, label }) =>
          href === "/open-source" ? (
            <div
              key={href}
              className="nav-source"
              onPointerEnter={(event) => {
                if (
                  event.pointerType === "mouse" &&
                  window.matchMedia("(min-width: 701px) and (hover: hover)")
                    .matches
                )
                  setSourceOpen(true);
              }}
              onPointerLeave={(event) => {
                if (
                  event.pointerType === "mouse" &&
                  window.matchMedia("(min-width: 701px) and (hover: hover)")
                    .matches
                )
                  setSourceOpen(false);
              }}
              onBlur={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget))
                  setSourceOpen(false);
              }}
            >
              <div className="nav-source-heading">
                <Link
                  href={href}
                  aria-current={pathname === href ? "page" : undefined}
                  onClick={closeNavigation}
                >
                  {label}
                </Link>
                <button
                  ref={sourceToggle}
                  type="button"
                  className="source-toggle"
                  aria-label="Open source links"
                  aria-expanded={sourceOpen}
                  aria-controls="source-destinations"
                  onClick={() => setSourceOpen(!sourceOpen)}
                >
                  <svg viewBox="0 0 12 12" aria-hidden="true">
                    <path
                      d="m3 4.5 3 3 3-3"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.4"
                    />
                  </svg>
                </button>
              </div>
              <div
                id="source-destinations"
                className="source-dropdown"
                hidden={!sourceOpen}
              >
                <span
                  className="source-option is-placeholder"
                  role="link"
                  aria-disabled="true"
                >
                  <span>TradingView</span>
                  <span className="source-status">Coming soon</span>
                </span>
                <a
                  className="source-option"
                  href={destinations.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={closeNavigation}
                >
                  <span>GitHub</span>
                  <span aria-hidden="true">↗</span>
                </a>
              </div>
            </div>
          ) : (
            <Link
              key={href}
              href={href}
              aria-current={pathname === href ? "page" : undefined}
              onClick={closeNavigation}
            >
              {label}
            </Link>
          ),
        )}
        <SocialPlaceholders />
      </nav>
    </header>
  );
}
