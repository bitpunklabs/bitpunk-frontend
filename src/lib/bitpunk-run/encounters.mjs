import { RUN, enemyBoxes, enemyRect, overlaps } from './core.mjs';

export const STOMP = Object.freeze({ bear: 10, swan: 20, maxMultiplier: 3, bounce: -300 });

/** Swept feet/head crossing: moving birds count; side hits and upward hits never do. */
export function resolveEncounters(player, previous, enemies, chain = 0) {
  if (player.y > RUN.height + 32) return { reason: 'pit', stomp: null };
  if (player.blocked) return { reason: 'wall', stomp: null };
  const time = player.x / RUN.speed, before = previous.x / RUN.speed;
  const oldFoot = previous.y + previous.h, foot = player.y + player.h;
  let target = null, crossing = Infinity;
  if (foot > oldFoot && player.vy >= 0) for (const enemy of enemies) {
    if (enemy.defeated || !(enemy.type === 'bear' || enemy.type === 'swan')) continue;
    if (Math.abs(player.x - enemy.x) > enemy.ampX + enemy.w + player.w) continue;
    const oldBox = enemyRect(enemy, before), box = enemyRect(enemy, time);
    const from = oldFoot - oldBox.y, to = foot - box.y;
    if (from > 2 || to < 0 || to <= from) continue;
    const fraction = Math.max(0, -from / (to - from));
    const x = previous.x + (player.x - previous.x) * fraction;
    const left = oldBox.x + (box.x - oldBox.x) * fraction;
    const half = player.w / 2 - 2;
    if (x + half <= left + 2 || x - half >= left + box.w - 2 || fraction >= crossing) continue;
    target = { enemy, box }; crossing = fraction;
  }
  const body = { x: player.x - player.w / 2 + 2, y: player.y + 3, w: player.w - 4, h: player.h - 4 };
  for (const enemy of enemies) {
    if (enemy.defeated || enemy === target?.enemy) continue;
    if (Math.abs(player.x - enemy.x) > enemy.ampX + enemy.w / 2 + player.w / 2) continue;
    if (enemyBoxes(enemy, time).some(box => overlaps(body, box))) return { reason: enemy.type, stomp: null };
  }
  if (!target) return { reason: null, stomp: null };
  const { enemy, box } = target, multiplier = Math.min(STOMP.maxMultiplier, chain + 1);
  enemy.defeated = true;
  player.y = box.y - player.h - .5; player.vy = STOMP.bounce;
  player.grounded = false; player.coyote = 0; player.jumps = 1;
  return { reason: null, stomp: { type: enemy.type, x: box.x + box.w / 2, y: box.y, foot: box.y + box.h, points: STOMP[enemy.type] * multiplier, multiplier } };
}
