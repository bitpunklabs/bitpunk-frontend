import { destinations } from "./showcase";

// Curated public copy only; no source or internal documentation is imported.
// Screener is not published and has no public catalog entry.
export const alphaIndicator = {
  name: "Alpha",
  description: "Read market context alongside trend, momentum, and structures.",
  overviewUrl: "/indicators/alpha",
  documentationUrl: null as string | null,
  tradingViewUrl: null as string | null,
};

// One collection entry: individual open studies are maintained on TradingView.
export const openIndicatorCollection = {
  name: "Open-source indicators",
  description: "Explore the latest open chart studies on TradingView.",
  tradingViewUrl: destinations.tradingview,
};
