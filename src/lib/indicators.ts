import { destinations } from "./showcase";

// Curated public copy only; no source or internal documentation is imported.
// Screener is not published and has no public catalog entry.
export const alphaIndicator = {
  name: 'The "bitpunk.alpha" indicator',
  description: "Read market context alongside trend, momentum, and structures.",
  documentationUrl: "/indicators/alpha",
  tradingViewUrl: "https://www.tradingview.com/script/SGxnp5Zk/",
};

// One collection entry: individual open studies are maintained on TradingView.
export const openIndicatorCollection = {
  name: "Open-source indicators",
  description: "Explore the latest open chart studies on TradingView.",
  tradingViewUrl: destinations.tradingview,
};
