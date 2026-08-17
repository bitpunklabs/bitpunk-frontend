import Link from "next/link";

const links = [
  { href: "/playbook", label: "Playbook" },
  { href: "/blog", label: "Blog" },
  { href: "/pricing", label: "Membership" },
  { href: "/about", label: "About" },
];

export function SiteHeader() {
  return (
    <header className="site-header">
      <Link className="wordmark" href="/" aria-label="Bitpunk home">
        bitpunk
      </Link>
      <nav aria-label="Primary navigation">
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
