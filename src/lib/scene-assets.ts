import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { MarketScreenshot } from "./alpha-showcase";
import type { ImageShowcaseSlide } from "./image-showcase";
import type { GameArtwork } from "./bitpunk-run/types";

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

/** Proprietary artwork metadata is supplied locally, outside the Git repository. */
export function getHomeArtwork(): HomeArtwork {
  try {
    const file = join(process.cwd(), "public/art/site-assets.json");
    return JSON.parse(readFileSync(file, "utf8")).home as HomeArtwork;
  } catch {
    throw new Error("Private artwork is missing. Restore the authorised asset pack described in RUNNING.md.");
  }
}

/** Screenshots and third-party marks are delivered through the private asset pack. */
export function getAlphaScreenshots(): MarketScreenshot[] {
  const file = join(process.cwd(), "public/art/site-assets.json");
  const slides = JSON.parse(readFileSync(file, "utf8")).showcases?.alpha;
  if (!Array.isArray(slides) || slides.length < 2) {
    throw new Error("Alpha screenshots are missing. Restore the current authorised asset pack.");
  }
  return slides as MarketScreenshot[];
}

export function getAlphaCaseStudies(): ImageShowcaseSlide[] {
  const file = join(process.cwd(), "public/art/site-assets.json");
  const slides = JSON.parse(readFileSync(file, "utf8")).showcases?.alphaStudies;
  if (!Array.isArray(slides) || slides.length !== 3 ||
      !["momentum", "trend", "market-structure"].every(id => slides.some(slide => slide.id === id))) {
    throw new Error("Alpha case studies are missing. Restore the current authorised asset pack.");
  }
  return slides as ImageShowcaseSlide[];
}

export function getOpenSourceScreenshots(): ImageShowcaseSlide[] {
  const file = join(process.cwd(), "public/art/site-assets.json");
  const slides = JSON.parse(readFileSync(file, "utf8")).showcases?.openSource;
  if (!Array.isArray(slides) || slides.length < 2) {
    throw new Error("Open-source screenshots are missing. Restore the current authorised asset pack.");
  }
  return slides as ImageShowcaseSlide[];
}

export type ChannelImage = { src: string; width: number; height: number };
export type AboutArtwork = {
  persona: Record<"thinking" | "building", ChannelImage>;
  game: GameArtwork;
};

export function getAboutArtwork(): AboutArtwork {
  const file = join(process.cwd(), "public/art/site-assets.json");
  const about = JSON.parse(readFileSync(file, "utf8")).about;
  if (!about?.persona?.thinking?.src || !about?.persona?.building?.src || !about?.game?.images?.player) {
    throw new Error("About artwork is missing. Restore the current authorised asset pack.");
  }
  return about as AboutArtwork;
}
