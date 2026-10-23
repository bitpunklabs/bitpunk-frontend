import type { Metadata } from "next";
import { MarblePage, MarbleHero, MarbleContent } from "@/components/marble-page";
import { OpenSourceCatalog } from "@/components/open-source-catalog";

export const metadata: Metadata = {
  title: "Open source",
  description: "Open TradingView scripts and research tools from Bitpunk.",
  alternates: { canonical: "/open-source" },
};

export default function OpenSourcePage() {
  return (
    <MarblePage>
      <MarbleHero scene="opensource" section="Open source"
        title={<>Ideas,{" "}<br /><em>made open.</em></>}
        copy="Chart studies and research tools, shared openly." />
      <MarbleContent>
        <OpenSourceCatalog />
      </MarbleContent>
    </MarblePage>
  );
}
