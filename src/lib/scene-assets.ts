import { readFileSync } from "node:fs";
import { join } from "node:path";

export type SceneCrop = {
  src: string;
  x: number;
  y: number;
  width: number;
  height: number;
};
type EntryId = "indicators" | "research" | "opensource" | "about";
type MotionCrop = SceneCrop & { origin: [number, number]; glow: SceneCrop };
export type HomeArtwork = {
  plates: Record<"desktop" | "mobile", { src: string; width: number; height: number }>;
  motion: Record<"desktop" | "mobile", Record<EntryId, MotionCrop>>;
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
