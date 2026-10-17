import type { Metadata } from "next";
import { IndicatorOverview } from "@/components/indicator-overview";

export const metadata: Metadata = {
  title: "Indicators",
  description: "Explore the context and structure beneath the candles with Bitpunk's TradingView indicators.",
  alternates: { canonical: "/indicators" },
};

export default function IndicatorsPage() {
  return <IndicatorOverview />;
}
