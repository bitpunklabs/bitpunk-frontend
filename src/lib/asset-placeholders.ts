import type { HomeArtwork, AboutArtwork, ChannelArtwork, ChannelImage } from "./scene-assets";
import type { MarketScreenshot } from "./alpha-showcase";
import type { ImageShowcaseSlide } from "./image-showcase";

export const missingArtwork = "/asset-placeholder";
const transparent = missingArtwork + "?variant=transparent";
const image = (width = 960, height = 540): ChannelImage => ({ src: missingArtwork, width, height });
const crop = { src: transparent, x: 0, y: 0, width: 1585, height: 992 };
const motionCrop = { ...crop, origin: [792, 496] as [number, number], glow: crop };
const motion = { indicators: motionCrop, research: motionCrop, opensource: motionCrop, about: motionCrop };

export const homePlaceholder: HomeArtwork = {
  plates: { desktop: image(1585, 992), mobile: image(640, 960) },
  motion: { desktop: motion, mobile: motion },
  wordmark: {
    width: 460, height: 100,
    lettering: { src: missingArtwork + "?variant=wordmark", x: 0, y: 0, width: 460, height: 100 },
    star: { src: transparent, staticSrc: transparent, x: 459, y: 0, width: 1, height: 1 },
  },
};

export const channelPlaceholder: ChannelArtwork = {
  avatar: image(512, 512),
  x: { header: image(1500, 500), avatar: image(512, 512) },
  substack: { logo: image(256, 256), wordmark: image(600, 120), research: image(), marketNotes: image() },
  github: { ...image(1520, 600), staticSrc: missingArtwork },
};
export const aboutPlaceholder: AboutArtwork = {
  persona: { thinking: image(512, 512), building: image(512, 512), stonks: image(), stonksUnmasked: image() },
  game: null,
};

export const alphaPlaceholders: MarketScreenshot[] = [
  { id: "btc", ticker: "BTCUSD", label: "BTC", name: "Bitcoin", timeframe: "1D", ...image(), logoSrc: transparent },
  { id: "gold", ticker: "XAUUSD", label: "Gold", name: "Gold", timeframe: "4H", ...image(), logoSrc: transparent },
  { id: "nvda", ticker: "NVDA", label: "NVDA", name: "NVIDIA", timeframe: "4H", ...image(), logoSrc: transparent },
];
const slide = (id: string, label: string): ImageShowcaseSlide => ({
  id, label, ...image(), alt: "Chart artwork is not included in this open-source build.",
});
export const studyPlaceholders = [slide("momentum", "Momentum"), slide("trend", "Trend"), slide("market-structure", "Market Structure")];
export const openSourcePlaceholders = [slide("trend-following", "Trend-following"), slide("pullback-reclaim", "Pullback-reclaim"), slide("session-drive", "Session-drive")];
