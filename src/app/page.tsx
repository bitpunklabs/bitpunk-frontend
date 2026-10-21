import type { Metadata } from "next";
import { MarbleScene } from "@/components/marble-scene";
import { HomeJournal } from "@/components/home-journal";
import { HomePresentation } from "@/components/home-presentation";
import { isHomeTransition, type HomeTransition } from "@/lib/home-transitions";

export const metadata: Metadata = { alternates: { canonical: "/" } };
export const revalidate = 1800;

export default async function HomePage({ searchParams }: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  let variant: HomeTransition = "gallery";
  let review = false;
  let feedTheme: "light" | "dark" = "dark";
  if (process.env.NODE_ENV === "development") {
    const query = await searchParams;
    feedTheme = query.feed === "light" ? "light" : "dark";
    if (isHomeTransition(query.transition)) {
      variant = query.transition;
      review = true;
    }
  }
  return <HomePresentation variant={variant} review={review} art={<MarbleScene />}>
    <HomeJournal feedTheme={feedTheme} />
  </HomePresentation>;
}
