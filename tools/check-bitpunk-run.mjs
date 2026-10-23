import assert from 'node:assert/strict';
import { RUN, KINDS, makeChunk, newPlayer, jumpPlayer, enemyRect, enemyBoxes } from '../src/lib/bitpunk-run/core.mjs';
import { resolveEncounters } from '../src/lib/bitpunk-run/encounters.mjs';
import { placeGroundedEgg } from '../src/lib/bitpunk-run/grounded-decor.mjs';

let checks = 0;
function check(name, test) { test(); checks++; console.log(`✓ ${name}`); }
const enemy = (type = 'bear') => ({ type, x: 100, y: 264, w: 30, h: 24, ampX: 0, ampY: 0, frequency: 1.7, phase: 0, origin: 0, motion: 'patrol' });
function landing(e) {
  const previous = { ...newPlayer(98.6), y: enemyRect(e, 98.6 / RUN.speed).y - 31, vy: 200, grounded: false, jumps: 2 };
  const player = { ...previous, x: 100, y: enemyRect(e, 100 / RUN.speed).y - 29 };
  return { player, previous };
}

check('bear and moving swan: descending feet kill, rebound and restore one air jump', () => {
  for (const type of ['bear', 'swan']) {
    const e = enemy(type); if (type === 'swan') Object.assign(e, { y: 190, ampX: 12, ampY: 20 });
    const { player, previous } = landing(e);
    const result = resolveEncounters(player, previous, [e]);
    assert.equal(result.reason, null); assert.equal(result.stomp.points, type === 'bear' ? 10 : 20);
    assert.equal(e.defeated, true); assert.ok(player.vy < 0); assert.equal(player.grounded, false);
    assert.equal(player.jumps, 1); assert.equal(jumpPlayer(player), true); assert.equal(jumpPlayer(player), false);
    assert.equal(resolveEncounters(player, previous, [e]).stomp, null);
  }
});
check('side and underside contacts remain fatal; grazing outside the head gives no kill', () => {
  const e = enemy(), base = newPlayer(100);
  assert.equal(resolveEncounters({ ...base, y: 229 }, { ...base, y: 229 }, [e]).reason, 'bear');
  assert.equal(resolveEncounters({ ...base, y: 214, vy: -200 }, { ...base, y: 220 }, [e]).reason, 'bear');
  const { player, previous } = landing(e); player.x = 128; previous.x = 126.6;
  assert.equal(resolveEncounters(player, previous, [e]).stomp, null); assert.ok(!e.defeated);
});
check('swept feet crossing catches a fast fall without allowing a below-head stomp', () => {
  const e = enemy(), { player, previous } = landing(e);
  previous.y -= 16; player.y += 10;
  assert.ok(resolveEncounters(player, previous, [e]).stomp);
  const other = enemy(), pair = landing(other); pair.previous.y += 8; pair.player.y += 3;
  assert.equal(resolveEncounters(pair.player, pair.previous, [other]).reason, 'bear');
});
check('airborne scoring multiplies to a bounded 3×; a fresh chain starts at base points', () => {
  for (let chain = 0; chain < 8; chain++) {
    const e = enemy('swan'), { player, previous } = landing(e);
    assert.equal(resolveEncounters(player, previous, [e], chain).stomp.points, 20 * Math.min(3, chain + 1));
  }
});
check('candle spikes remain hazardous, including a downward head contact', () => {
  for (const type of ['redwick', 'greenwick']) {
    const e = { ...enemy(type), w: 26, actionPhase: 2.2 };
    const { player, previous } = landing(e); player.y += 4;
    assert.ok(enemyBoxes(e, player.x / RUN.speed).length);
    assert.equal(resolveEncounters(player, previous, [e]).reason, type); assert.ok(!e.defeated);
  }
});
check('another hazard at a stomp contact wins; no points or kill are awarded', () => {
  const e = enemy(), hazard = { ...enemy('swan'), y: 248, h: 30 };
  const { player, previous } = landing(e), result = resolveEncounters(player, previous, [e, hazard]);
  assert.equal(result.reason, 'swan'); assert.equal(result.stomp, null); assert.ok(!e.defeated);
});
check('pits and walls remain fatal', () => {
  const p = newPlayer(); assert.equal(resolveEncounters({ ...p, y: 360 }, p, []).reason, 'pit');
  assert.equal(resolveEncounters({ ...p, blocked: true }, p, []).reason, 'wall');
});

function supported(egg, surfaces) {
  if (!egg) return;
  for (let x = egg.x - egg.width / 2; x <= egg.x + egg.width / 2; x += 1) {
    assert.ok(surfaces.some(s => s.ground && s.y === egg.foot - 2 && x >= s.x + .01 && x <= s.x + s.w - .01), `unsupported prop at ${x}`);
  }
}
function unobstructed(egg, surfaces) {
  if (!egg) return;
  for (const s of surfaces.filter(s => !s.ground)) {
    assert.ok(egg.x + egg.width / 2 <= s.x - 8 || egg.x - egg.width / 2 >= s.x + s.w + 8 ||
      egg.foot <= s.y - 3 - 8 || egg.foot - egg.height >= s.y + 12 + 8, 'platform obscures prop or its clearance');
  }
}
check('props avoid gaps, sit on raised ground and reject ledges too narrow to support them', () => {
  const surfaces = [{ x: 0, y: 264, w: 180, ground: true }, { x: 300, y: 216, w: 340, ground: true }];
  const chunk = { index: 0, start: 0, surfaces };
  const egg = placeGroundedEgg('PIT', chunk, 'fine'); supported(egg, surfaces); assert.equal(egg.foot, 218);
  assert.equal(placeGroundedEgg('PIT', { ...chunk, surfaces: [{ x: 0, y: 264, w: 80, ground: true }] }, 'fine'), null);
  const platform = { x: 180, y: 100, w: 400, ground: false };
  assert.equal(placeGroundedEgg('PIT', { ...chunk, surfaces: [platform] }, 'fine'), null);
});
check('low platforms move props into clear intervals; fully obstructed ground skips the prop', () => {
  const ground = { x: 0, y: 264, w: 640, ground: true };
  const chunk = { index: 0, start: 0, surfaces: [ground] };
  const original = placeGroundedEgg('OVERLAP', chunk, 'fine');
  const platform = { x: original.x - 70, y: 220, w: 140, ground: false };
  const moved = placeGroundedEgg('OVERLAP', { ...chunk, surfaces: [ground, platform] }, 'fine');
  assert.ok(moved); assert.notEqual(moved.x, original.x); supported(moved, [ground]); unobstructed(moved, [platform]);
  assert.equal(placeGroundedEgg('OVERLAP', { ...chunk, surfaces: [ground, { ...platform, x: 0, w: 640 }] }, 'fine'), null);
});
check('high platforms stay usable overhead; painted lips and nearby platforms are avoided', () => {
  const ground = { x: 0, y: 264, w: 640, ground: true }, chunk = { index: 0, start: 0, surfaces: [ground] };
  const original = placeGroundedEgg('HEIGHT', chunk, 'fine');
  const high = { x: 0, y: 100, w: 640, ground: false };
  assert.deepEqual(placeGroundedEgg('HEIGHT', { ...chunk, surfaces: [ground, high] }, 'fine'), original);
  const platforms = [{ x: 180, y: 184, w: 120, ground: false }, { x: 400, y: 224, w: 140, ground: false }];
  const placed = placeGroundedEgg('HEIGHT', { ...chunk, surfaces: [ground, ...platforms] }, 'fine');
  assert.ok(placed); supported(placed, [ground]); unobstructed(placed, platforms);
});
check('procedural map props are supported and deterministic without mutating map or coins', () => {
  for (const seed of ['GAPS', 'TERRACES', 'PROPS']) for (const [i, kind] of KINDS.entries()) {
    const chunk = makeChunk(seed, i + 8, kind), before = JSON.stringify(chunk);
    const egg = placeGroundedEgg(seed, chunk, 'stonks'); supported(egg, chunk.surfaces); unobstructed(egg, chunk.surfaces);
    assert.deepEqual(egg, placeGroundedEgg(seed, chunk, 'stonks')); assert.equal(JSON.stringify(chunk), before);
  }
});
console.log(`${checks} deterministic checks passed. No browser gameplay or performance benchmark.`);
