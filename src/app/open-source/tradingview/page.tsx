import type { Metadata } from "next";
import { MarblePage, MarbleHero, PageAction, Availability } from "@/components/marble-page";
import { destinations } from "@/lib/showcase";

export const metadata: Metadata = {
  title: "TradingView",
  description: "Open-source chart studies from Bitpunk.",
  alternates: { canonical: "/open-source/tradingview" },
};

export default function TradingViewPage() {
  return (
    <MarblePage>
      <MarbleHero scene="indicators" section="TradingView" parent={{href:"/open-source", label:"Open source"}}
        title={<>Studies to{" "}<br /><em>build on.</em></>}
        copy="Open Pine Script studies to read and explore.">
        {destinations.tradingview
          ? <PageAction href={destinations.tradingview} external>Visit TradingView</PageAction>
          : <Availability>TradingView coming soon</Availability>}
      </MarbleHero>
    </MarblePage>
  );
}
