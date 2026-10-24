import type { Metadata } from "next";
import { ComingSoon, isComingSoonVariant } from "@/components/coming-soon";
import { getHomeArtwork } from "@/lib/scene-assets";
import { brandSlogan } from "@/lib/brand-copy";

export const metadata: Metadata = {
  title: "Coming soon",
  description: `${brandSlogan} Coming soon from Bitpunk.`,
  robots: { index: false, follow: false },
};

export default async function ComingSoonPage({ searchParams }: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const development = process.env.NODE_ENV === "development";
  const query = development ? await searchParams : {};
  const review = development && query.review !== "off";
  const requested = development ? query.view : process.env.COMING_SOON_VARIANT;
  const variant = isComingSoonVariant(requested) ? requested : "atrium";
  return <ComingSoon variant={variant} artwork={getHomeArtwork()} review={review} />;
}
