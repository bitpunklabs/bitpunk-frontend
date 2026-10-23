import { existsSync, readFileSync } from "node:fs";
import { join, resolve, sep } from "node:path";
import type { MarketScreenshot } from "./alpha-showcase";
import type { ImageShowcaseSlide } from "./image-showcase";
import type { GameArtwork } from "./bitpunk-run/types";
import { aboutPlaceholder, alphaPlaceholders, channelPlaceholder, homePlaceholder, missingArtwork, openSourcePlaceholders, studyPlaceholders } from "./asset-placeholders";

export type SceneCrop = {
  src: string;
  x: number;
  y: number;
  width: number;
  height: number;
};
type EntryId = "indicators" | "research" | "opensource" | "about";
type MotionCrop = SceneCrop & { origin: [number, number]; glow: SceneCrop };
export type WordmarkArtwork = {
  width: number;
  height: number;
  lettering: SceneCrop;
  star: SceneCrop & { staticSrc: string };
};
export type HomeArtwork = {
  plates: Record<"desktop" | "mobile", { src: string; width: number; height: number }>;
  motion: Record<"desktop" | "mobile", Record<EntryId, MotionCrop>>;
  wordmark: WordmarkArtwork;
};

type AssetPack = { home?: HomeArtwork; channels?: ChannelArtwork; about?: AboutArtwork; files?: { path: string }[]; showcases?: { alpha?: MarketScreenshot[]; alphaStudies?: ImageShowcaseSlide[]; openSource?: ImageShowcaseSlide[] } };
function readPack(): AssetPack | null {
  if (process.env.BITPUNK_ASSET_MODE === "placeholder") return null;
  try { return JSON.parse(readFileSync(join(process.cwd(), "public/art/site-assets.json"), "utf8")); }
  catch { return null; }
}
function hasAsset(path: string): boolean {
  if (typeof path !== "string" || !path.startsWith("/")) return false;
  const root = resolve(process.cwd(), "public"), file = resolve(root, "." + path);
  return file.startsWith(root + sep) && existsSync(file);
}
/** Repair missing image deliveries without exposing source paths or inventing charts. */
function delivered<T>(value: T): T {
  if (Array.isArray(value)) return value.map(delivered) as T;
  if (!value || typeof value !== "object") return value;
  return Object.fromEntries(Object.entries(value).map(([key, item]) => {
    if (["src", "staticSrc", "logoSrc", "iconSrc"].includes(key) && typeof item === "string" && /^\/(art|brand)\//.test(item) && !hasAsset(item)) {
      return [key, missingArtwork + (/mask|glow|wall-grain/.test(item) ? "?variant=transparent" : "")];
    }
    return [key, delivered(item)];
  })) as T;
}
function withDefaults<T>(base: T, value: unknown): T {
  if (!value || typeof value !== "object" || Array.isArray(value)) return base;
  const result = { ...base } as Record<string, unknown>;
  for (const [key, fallback] of Object.entries(base as object)) {
    const item = (value as Record<string, unknown>)[key];
    if (Array.isArray(fallback)) result[key] = Array.isArray(item) ? item : fallback;
    else if (fallback && typeof fallback === "object") result[key] = withDefaults(fallback, item);
    else result[key] = typeof item === typeof fallback ? item : fallback;
  }
  return result as T;
}
export function getArtworkStatus() {
  const pack = readPack();
  return { missing: !pack || !pack.home || !pack.about || !pack.channels || !pack.files?.length || pack.files.some(file => !hasAsset(file.path)) };
}

/** Original artwork stays private; a source checkout uses explicit placeholders. */
export function getHomeArtwork(): HomeArtwork {
  return delivered(withDefaults(homePlaceholder, readPack()?.home));
}

/** Screenshots and third-party marks are delivered through the private asset pack. */
export function getAlphaScreenshots(): MarketScreenshot[] {
  const slides = readPack()?.showcases?.alpha;
  return delivered(Array.isArray(slides) && slides.length >= 2 ? slides : alphaPlaceholders);
}

export function getAlphaCaseStudies(): ImageShowcaseSlide[] {
  const slides = readPack()?.showcases?.alphaStudies;
  if (!Array.isArray(slides) || slides.length !== 3 ||
      !["momentum", "trend", "market-structure"].every(id => slides.some(slide => slide.id === id))) {
    return studyPlaceholders;
  }
  return delivered(slides);
}

export function getOpenSourceScreenshots(): ImageShowcaseSlide[] {
  const slides = readPack()?.showcases?.openSource;
  return delivered(Array.isArray(slides) && slides.length >= 2 ? slides : openSourcePlaceholders);
}

export type ChannelImage = { src: string; width: number; height: number };
export type AboutArtwork = {
  persona: Record<"thinking" | "building" | "stonks", ChannelImage>;
  game: GameArtwork | null;
};

export function getAboutArtwork(): AboutArtwork {
  const about = readPack()?.about;
  const ids = ["player", "world", "greek", "wallstreet", "cyberpunk", "punkstreet", "exchange", "reserve", "harbor", "moon", "memes-market", "memes-world"] as const;
  const game = about?.game;
  return {
    persona: delivered(withDefaults(aboutPlaceholder.persona, about?.persona)),
    game: game?.images && ids.every(id => hasAsset(game.images[id])) ? game : null,
  };
}
export type ChannelArtwork = {
  avatar: ChannelImage;
  x: { header: ChannelImage; avatar: ChannelImage };
  substack: { logo: ChannelImage; wordmark: ChannelImage; research: ChannelImage; marketNotes: ChannelImage };
  github: ChannelImage & { staticSrc: string };
};

export function getChannelArtwork(): ChannelArtwork {
  return delivered(withDefaults(channelPlaceholder, readPack()?.channels));
}
