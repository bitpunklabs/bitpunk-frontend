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
};
export const navigation = [
  { href: "/open-source", label: "Open source" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
];
