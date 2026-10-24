import { xProfileEmbed } from "./post-embeds";

/** Confirmed public destinations. Environment variables are optional overrides. */
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
  x: xProfileEmbed(process.env.NEXT_PUBLIC_X_URL)?.url ?? "https://x.com/bitpunklabs",
  github: "https://github.com/bitpunklabs",
  universe: "https://github.com/bitpunklabs/ticker-universe-builder",
  website: "https://github.com/bitpunklabs/bitpunk-frontend",
  substack: publicUrl(process.env.NEXT_PUBLIC_SUBSTACK_PROFILE_URL) ?? "https://substack.com/@bitpunk",
  substackPublication: publicUrl(process.env.NEXT_PUBLIC_BLOG_URL) ?? "https://bitpunklabs.substack.com/",
  tradingview: publicUrl(process.env.NEXT_PUBLIC_TRADINGVIEW_URL) ?? "https://tradingview.com/u/bitpunk_labs/",
  discord: publicUrl(
    process.env.NEXT_PUBLIC_DISCORD_INVITE_URL ||
      process.env.NEXT_PUBLIC_DISCORD_SUPPORT_INVITE_URL,
  ),
};
export const navigation = [
  { href: "/", label: "Home" },
  { href: "/indicators", label: "Indicators" },
  { href: "/research", label: "Research" },
  { href: "/open-source", label: "Open source" },
  { href: "/about", label: "About" },
];
