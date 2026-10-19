import { MarblePage, MarbleHero, MarbleContent } from "./marble-page";
import { IndicatorCatalog } from "./indicator-catalog";
import { defaultIndicatorHeadline, indicatorIntroduction } from "@/lib/indicator-copy";

export function IndicatorOverview() {
  const headline = defaultIndicatorHeadline;
  return (
    <MarblePage>
      <MarbleHero scene="indicators" section="Indicators" eyebrow="TradingView indicators"
        title={<>{headline.lines[0]}{" "}<br /><em>{headline.lines[1]}</em></>}
        copy={indicatorIntroduction} />
      <MarbleContent><IndicatorCatalog /></MarbleContent>
    </MarblePage>
  );
}
