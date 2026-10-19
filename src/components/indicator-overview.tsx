import { MarblePage, MarbleHero, MarbleContent } from "./marble-page";
import { IndicatorCatalog } from "./indicator-catalog";
import { defaultIndicatorHeadline, indicatorIntroduction } from "@/lib/indicator-copy";
import { AlphaShowcaseReview } from "./alpha-showcase-review";
import type { AlphaShowcaseVariant } from "@/lib/alpha-showcase";

export function IndicatorOverview({ variant = "stack", review = false }: {
  variant?: AlphaShowcaseVariant;
  review?: boolean;
}) {
  const headline = defaultIndicatorHeadline;
  return (
    <MarblePage>
      <MarbleHero scene="indicators" section="Indicators" eyebrow="TradingView indicators"
        title={<>{headline.lines[0]}{" "}<br /><em>{headline.lines[1]}</em></>}
        copy={indicatorIntroduction} />
      <MarbleContent>
        {review && <AlphaShowcaseReview variant={variant} />}
        <IndicatorCatalog variant={variant} />
      </MarbleContent>
    </MarblePage>
  );
}
