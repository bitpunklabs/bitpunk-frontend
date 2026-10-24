import type { Chunk, DecorRect, Egg } from './types';
export declare function placeGroundedEgg(seed: string, chunk: Chunk, id: string): Egg | null;
export declare function paintGroundedEgg(context: CanvasRenderingContext2D, images: Record<string, CanvasImageSource>, definitions: Record<string, DecorRect>, egg: Egg, camera: number, viewportWidth: number): void;
