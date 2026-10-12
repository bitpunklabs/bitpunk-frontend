/** Public destinations only. Unknown publication/profile URLs stay unset. */
function publicUrl(value: string | undefined): string | null {
  if (!value) return null;
  try {
    const url = new URL(value);
    return url.protocol === "https:" && !url.username && !url.password
      ? url.href
      : null;
  } catch {
    return null;
  }
}
export const destinations = {
  github: "https://github.com/bitpunklabs",
  universe: "https://github.com/bitpunklabs/ticker-universe-builder",
  website: "https://github.com/bitpunklabs/bitpunk-frontend",
  substack: publicUrl(process.env.NEXT_PUBLIC_BLOG_URL),
  tradingview: publicUrl(process.env.NEXT_PUBLIC_TRADINGVIEW_URL),
  discord: publicUrl(
    process.env.NEXT_PUBLIC_DISCORD_INVITE_URL ||
      process.env.NEXT_PUBLIC_DISCORD_SUPPORT_INVITE_URL,
  ),
};
export const navigation = [
  { href: "/indicators", label: "Indicator" },
  { href: "/open-source", label: "Open source" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
];
