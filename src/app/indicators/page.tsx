import type { Metadata } from "next";
import { IndicatorOverview } from "@/components/indicator-overview";
import { alphaShowcaseVariant } from "@/lib/alpha-showcase";

export const metadata: Metadata = {
  title: "Indicators",
  description: "TradingView indicators for a clearer view of momentum, trends and key price areas.",
  alternates: { canonical: "/indicators" },
};

export default async function IndicatorsPage({ searchParams }: {
  searchParams: Promise<{ showcase?: string }>;
}) {
  const preview = process.env.NODE_ENV === "development" ? (await searchParams).showcase : undefined;
  return <IndicatorOverview variant={alphaShowcaseVariant(preview)} review={!!preview} />;
}
