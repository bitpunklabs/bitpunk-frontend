import { MarblePage, MarbleHero, MarbleContent } from "./marble-page";
import { IndicatorCatalog } from "./indicator-catalog";
import { defaultIndicatorHeadline, indicatorIntroduction, type IndicatorHeadline } from "@/lib/indicator-copy";

export function IndicatorOverview({ headline = defaultIndicatorHeadline }: { headline?: IndicatorHeadline }) {
  return (
    <MarblePage>
      <MarbleHero scene="indicators" section="Indicators" eyebrow="TradingView indicators"
        title={<>{headline.lines[0]}{" "}<br /><em>{headline.lines[1]}</em></>}
        copy={indicatorIntroduction} />
      <MarbleContent><IndicatorCatalog /></MarbleContent>
    </MarblePage>
  );
}
