import { ImageShowcase } from "./image-showcase";
import type { AlphaShowcaseVariant, MarketScreenshot } from "@/lib/alpha-showcase";

/** Product copy and private screenshot metadata stay outside the reusable gallery. */
export function AlphaShowcase({ slides, variant = "stack" }: {
  slides: MarketScreenshot[];
  variant?: AlphaShowcaseVariant;
}) {
  return (
    <ImageShowcase variant={variant} label="Alpha chart gallery"
      selectionLabel="Choose a market" fullViewLabel="View full chart"
      slides={slides.map(slide => ({
        id: slide.id, src: slide.src, width: slide.width, height: slide.height,
        alt: `${slide.name} ${slide.timeframe} chart with bitpunk.alpha`,
        label: slide.label, title: slide.ticker, subtitle: slide.name,
        iconSrc: slide.logoSrc, meta: slide.timeframe, badge: "Alpha",
      }))} />
  );
}
