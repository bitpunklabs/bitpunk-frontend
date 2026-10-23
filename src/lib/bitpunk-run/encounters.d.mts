import type { DeathReason, Enemy, Player, StompHit } from './types';
export declare const STOMP: Readonly<{ bear: number; swan: number; maxMultiplier: number; bounce: number }>;
export declare function resolveEncounters(player: Player, previous: Player, enemies: Enemy[], chain?: number): { reason: DeathReason | null; stomp: StompHit | null };
