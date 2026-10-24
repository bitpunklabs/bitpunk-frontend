import { newPlayer, touchesCoin } from './core.mjs';

/** Preserve required-route rewards; optional jumps must beat an empty bypass. */
export function jumpRewards(chunk) {
  const hasWalkingBypass = chunk.routes.some(route => route.actions.length === 0);
  const coins = chunk.coins.filter(coin => !hasWalkingBypass || !touchesCoin(newPlayer(coin.x), coin));
  if (!coins.length) return { ...chunk, coins };

  // Preserve the validated positions. Keep at most one original BTC peak,
  // with ETH around a quarter of the trail and SOL making up the majority.
  const byHeight = (a, b) => a.y - b.y || a.x - b.x;
  const btc = coins.length >= 6 ? coins.filter(coin => coin.type === 'btc').sort(byHeight)[0] : undefined;
  const btcCount = btc ? 1 : 0;
  const ethCount = Math.min(
    Math.max(btcCount + 1, Math.round(coins.length / 4)),
    Math.floor((coins.length - btcCount - 1) / 2),
  );
  const eth = new Set(coins.filter(coin => coin !== btc).sort((a, b) =>
    Number(a.type === 'sol') - Number(b.type === 'sol') || byHeight(a, b),
  ).slice(0, ethCount));
  return {
    ...chunk,
    coins: coins.map(coin => ({ ...coin, type: coin === btc ? 'btc' : eth.has(coin) ? 'eth' : 'sol' })),
  };
}
