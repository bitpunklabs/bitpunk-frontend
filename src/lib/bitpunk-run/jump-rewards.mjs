import { RUN, touchesCoin } from './core.mjs';

/** Reserve coins for elevated routes, above the full 48px runner sprite. */
export function jumpRewards(chunk) {
  const standingHeight = 48;
  return {
    ...chunk,
    coins: chunk.coins.filter(coin => !touchesCoin({
      x: coin.x, y: RUN.floor - standingHeight, w: RUN.playerW, h: standingHeight,
    }, coin)),
  };
}
