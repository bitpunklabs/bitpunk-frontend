import type { Metadata } from "next";
import { MarblePage, MarbleHero, MarbleContent, PageAction } from "@/components/marble-page";
import { IndicatorCatalog } from "@/components/indicator-catalog";

export const metadata: Metadata = {
  title: "Indicators",
  description: "Explore the context and structure beneath the candles with Bitpunk's TradingView indicators.",
  alternates: { canonical: "/indicators" },
};

export default function IndicatorsPage() {
  return (
    <MarblePage>
      <MarbleHero scene="indicators" section="Indicators" eyebrow="TradingView indicators"
        title={<>Price has<br /><em>layers.</em></>}
        copy="Explore the context and structure beneath the candles.">
        <PageAction href="#toolkit">Inside the toolkit</PageAction>
      </MarbleHero>
      <MarbleContent>
        <IndicatorCatalog />
      </MarbleContent>
    </MarblePage>
  );
}
