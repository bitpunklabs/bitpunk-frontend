import Link from "next/link";
import { Wordmark } from "@/components/wordmark";
import { BLOG_URL } from "@/lib/links";

const primaryNav = [
  { href: "/indicators", label: "Indicators" },
  { href: "/agentics", label: "Agentics" },
  { href: "/blog", label: "Blog", external: BLOG_URL.length > 0 },
  { href: "/open-source", label: "Open Source" },
  { href: "/docs", label: "Docs" },
  { href: "/pricing", label: "Pricing" },
];

export function SiteHeader() {
  return (
    <header className="site-header">
      <Link className="wordmark" href="/" aria-label="Bitpunk home">
        <Wordmark />
      </Link>
      <nav className="primary-nav" aria-label="Primary">
        {primaryNav.map((item) => (
          <Link key={item.href} href={item.href}>
            {item.label}
            {item.external ? <span aria-hidden="true"> ↗</span> : null}
          </Link>
        ))}
      </nav>
      <Link className="account-link" href="/login">
        Sign in
      </Link>
    </header>
  );
}
