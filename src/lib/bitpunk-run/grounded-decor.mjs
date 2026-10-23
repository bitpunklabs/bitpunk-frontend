import { randomFor } from './core.mjs';

/** Place a whole prop on clear, continuous ground, once per generated chunk. */
export function placeGroundedEgg(seed, chunk, id) {
  const rng = randomFor(seed + ':grounded-decor', chunk.index);
  const width = 88 + Math.floor(rng() * 17), height = 84, clearance = 8, inset = width / 2 + 12;
  const preferred = chunk.start + 200 + rng() * 240;
  const ledges = [];
  for (const surface of chunk.surfaces.filter(s => s.ground).sort((a, b) => a.x - b.x)) {
    const last = ledges.at(-1);
    if (last && last.y === surface.y && surface.x <= last.x + last.w) {
      last.w = Math.max(last.w, surface.x + surface.w - last.x);
    } else ledges.push({ x: surface.x, y: surface.y, w: surface.w });
  }
  let placement = null, distance = Infinity;
  for (const ledge of ledges) {
    if (ledge.w < inset * 2) continue;
    const foot = ledge.y + 2;
    let intervals = [[ledge.x + inset, ledge.x + ledge.w - inset]];
    for (const platform of chunk.surfaces) {
      // Include the painted 3px lip and 12px platform body, plus visual breathing room.
      if (platform.ground || platform.y + 12 < foot - height - clearance || platform.y - 3 > foot + clearance) continue;
      const left = platform.x - width / 2 - clearance, right = platform.x + platform.w + width / 2 + clearance;
      const clear = [];
      for (const [start, end] of intervals) {
        if (right <= start || left >= end) clear.push([start, end]);
        else {
          if (left >= start) clear.push([start, left]);
          if (right <= end) clear.push([right, end]);
        }
      }
      intervals = clear;
      if (!intervals.length) break;
    }
    for (const [start, end] of intervals) {
      const x = Math.max(start, Math.min(preferred, end));
      if (Math.abs(x - preferred) >= distance) continue;
      distance = Math.abs(x - preferred);
      // Last two pixels tuck under the foreground lip, including raised ground.
      placement = { id, x, foot, width, height };
    }
  }
  return placement;
}
