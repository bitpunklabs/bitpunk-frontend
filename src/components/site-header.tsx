import Image from "next/image";
import Link from "next/link";
import { PLAYBOOK_URL } from "@/lib/links";

const links = [
  { href: "/pricing", label: "Membership" },
  { href: "/about", label: "About" },
];

export function SiteHeader() {
  return (
    <header className="site-header">
      <Link className="wordmark" href="/" aria-label="Bitpunk home">
        <Image src="/brand/logo-dark.png" alt="" width={100} height={30} priority />
      </Link>
      <nav aria-label="Primary navigation">
        {PLAYBOOK_URL ? (
          <a href={PLAYBOOK_URL} target="_blank" rel="noopener noreferrer">
            Playbook <span aria-hidden="true">↗</span>
          </a>
        ) : null}
        {links.map((link) => (
          <Link key={link.href} href={link.href}>
            {link.label}
          </Link>
        ))}
      </nav>
      <Link className="account-link" href="/login">
        Sign in
      </Link>
    </header>
  );
}
