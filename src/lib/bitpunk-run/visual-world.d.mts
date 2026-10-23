import type { DecorRect, Egg, SceneId } from "./types";
export declare const WORLD_SCENES: SceneId[];
export declare const SCENE_TEXT_PANELS: SceneId[];
export declare function createVisualWorld(seed: string): { scene(index: number): SceneId; egg(slot: number): string; nearby(camera: number, width: number): Egg[] };
export declare function paintEgg(context: CanvasRenderingContext2D, images: Record<string, CanvasImageSource>, definitions: Record<string, DecorRect>, id: string, x: number, foot: number, width?: number, height?: number): number;
