import { RUN, newPlayer, jumpPlayer, stepPlayer, takeCoin, makeChunkSteps, enemyPosition, wickState } from "./core.mjs";
import { WORLD_SCENES, SCENE_TEXT_PANELS, createVisualWorld, paintEgg } from "./visual-world.mjs";
import { paintWick } from "./wick-art.mjs";
import { placeGroundedEgg } from "./grounded-decor.mjs";
import { resolveEncounters } from "./encounters.mjs";
import { createWorkQueue } from "./work-queue.mjs";
import type { JobHandle } from "./work-queue.mjs";
import type { Chunk, Counts, DeathReason, Egg, GameArtwork, GameImageId, GameMode, GameSnapshot, RunController, SceneId, StompHit } from "./types";

const endings: Record<DeathReason, readonly [string, string][]> = {
  pit: [["Liquidity dried up.", "No bids below."], ["Buy the dip?", "This one kept dipping."]],
  wall: [["Resistance held.", "Even this chart has a ceiling."], ["Rejected at resistance.", "A little more height next time."]],
  bear: [["Bear market confirmed.", "You were bullish. The bear wasn’t."], ["Bears took control.", "Your bull case met a very real bear."]],
  swan: [["Not priced in.", "The swan had other plans."], ["A tail-risk event.", "Apparently, the tail had wings."]],
  redwick: [["Liquidated.", "That red candle closed the position."], ["Catching falling knives.", "This one came with a wick."]],
  greenwick: [["Bull trap.", "Small body. Expensive wick."], ["Exit liquidity.", "The breakout had other plans."]],
};
const themes: Record<SceneId, { fill: string; line: string; cap: string; edge: string }> = {
  greek: { fill: "#a88c67", line: "#7d735e", cap: "#eadbb6", edge: "#738958" },
  wallstreet: { fill: "#80796b", line: "#5a5b55", cap: "#d4c6a6", edge: "#9d8454" },
  cyberpunk: { fill: "#303e49", line: "#1e2932", cap: "#8aada9", edge: "#3b797b" },
  punkstreet: { fill: "#87694f", line: "#574d43", cap: "#c4b6a0", edge: "#767d5b" },
  exchange: { fill: "#9b8c72", line: "#746c5d", cap: "#e6d8b7", edge: "#7f8a76" },
  reserve: { fill: "#7e9188", line: "#5b736d", cap: "#d5dbc5", edge: "#819d8b" },
  harbor: { fill: "#7a8078", line: "#535f5b", cap: "#d0c6a9", edge: "#83927e" },
  moon: { fill: "#8c91a5", line: "#626a7b", cap: "#d8d5d0", edge: "#a3a5b1" },
};
const newSeed = () => "BP-" + Math.floor(Math.random() * 0xffffff).toString(16).toUpperCase().padStart(6, "0");
const emptyCounts = (): Counts => ({ btc: 0, eth: 0, sol: 0 });

/** A page-owned controller. It never reads or modifies DOM outside its canvas. */
export function mountBitpunkRun(canvas: HTMLCanvasElement, artwork: GameArtwork, onChange: (snapshot: GameSnapshot) => void): RunController {
  const context = canvas.getContext("2d", { alpha: false });
  if (!context) throw new Error("Canvas is unavailable");
  const ctx = context;
  const events = new AbortController();
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  const chunks = new Map<number, Chunk>(), terrain = new Map<number, HTMLCanvasElement>();
  const eggs = new Map<number, Egg | null>();
  const previous = newPlayer();
  const pending = new Map<number, { promise: Promise<Chunk | null>; handle: JobHandle }>();
  const pendingImages = new Set<HTMLImageElement>();
  let imageTimeout: ReturnType<typeof setTimeout> | undefined;
  const timers = new Map<ReturnType<typeof setTimeout>, () => void>();
  const queue = createWorkQueue({ budgetMs: 2, canRun: () => !disposed && !document.hidden });
  let disposed = false, epoch = 0, imageTicket = 0, raf = 0, last = 0, lastPaint: number | null = null, accumulator = 0;
  let width = 640, mode: GameMode = "loading", seed = newSeed(), player = newPlayer(), visual = createVisualWorld(seed);
  let images: Record<GameImageId, HTMLImageElement> | null = null;
  let score = 0, best = 0, counts = emptyCounts(), elapsed = 0, queuedJump = 0, worldIndex = -1;
  let stompChain = 0;
  let visible = false, buffering = false, title = "", copy = "", snapshotKey = "";
  let live = { surfaces: [] as Chunk["surfaces"], enemies: [] as Chunk["enemies"] };
  let particles: { x: number; y: number; ttl: number; value: number; multiplier?: number }[] = [];
  let defeats: (StompHit & { ttl: number })[] = [];
  const endingCounts: Partial<Record<DeathReason, number>> = {};
  try { best = Number(localStorage.getItem("bitpunk-run-best-v2")) || 0; } catch { /* Local scores are optional. */ }

  function emit() {
    if (disposed) return;
    const key = `${mode}:${score}:${best}:${title}:${copy}`;
    if (key === snapshotKey) return;
    snapshotKey = key; onChange({ mode, score, best, counts: { ...counts }, title, copy });
  }
  function setMode(next: GameMode) { mode = next; emit(); queue.wake(); }
  function stopFrame() { if (raf) cancelAnimationFrame(raf); raf = 0; }
  function cancelWork() { queue.clear(); pending.clear(); }
  function refreshLive() {
    const index = Math.floor(player.x / RUN.chunk);
    for (const i of chunks.keys()) if (i < index - 1 || i > index + 2) { chunks.delete(i); terrain.delete(i); eggs.delete(i); }
    live = { surfaces: [...chunks.values()].flatMap(chunk => chunk.surfaces), enemies: [...chunks.values()].flatMap(chunk => chunk.enemies) };
  }
  function* paintTerrain(chunk: Chunk): Generator<void, HTMLCanvasElement, unknown> {
    const layer = document.createElement("canvas"); layer.width = 640; layer.height = 320;
    const q = layer.getContext("2d")!;
    const theme = themes[visual.scene(chunk.index)]; q.imageSmoothingEnabled = false;
    for (const surface of chunk.surfaces) {
      const x = Math.round(surface.x - chunk.start), y = surface.y, h = surface.ground ? 320 - y : 12;
      q.fillStyle = theme.fill; q.fillRect(x, y, surface.w, h);
      let row = 0;
      for (let yy = y + 6; yy < y + h; yy += 12) {
        q.fillStyle = theme.line; q.fillRect(x, yy, surface.w, 1);
        for (let xx = x + ((yy / 12 | 0) % 2 ? 8 : 0); xx < x + surface.w; xx += 24) q.fillRect(xx, yy, 1, 12);
        if (++row % 4 === 0) yield;
      }
      q.fillStyle = theme.cap; q.fillRect(x, y, surface.w, 4);
      q.fillStyle = theme.edge; q.fillRect(x, y - 3, surface.w, 3);
      q.fillStyle = theme.line; q.fillRect(x, y + 4, surface.w, 2);
      if (surface.ground && surface.w < 640) { q.fillStyle = theme.cap; q.fillRect(x, y, 2, Math.min(h, 18)); q.fillRect(x + surface.w - 2, y, 2, Math.min(h, 18)); }
      yield;
    }
    return layer;
  }
  function requestChunk(index: number): Promise<Chunk | null> {
    const cached = chunks.get(index); if (cached) return Promise.resolve(cached);
    const queued = pending.get(index); if (queued) return queued.promise;
    const stamp = epoch;
    let resolve!: (chunk: Chunk | null) => void, reject!: (error: unknown) => void;
    const promise = new Promise<Chunk | null>((yes, no) => { resolve = yes; reject = no; });
    function* prepare(): Generator<void, { chunk: Chunk; layer: HTMLCanvasElement }, unknown> {
      const chunk = yield* makeChunkSteps(seed, index);
      chunk.routePreviews = []; // The public game has no map-preview UI.
      const layer = yield* paintTerrain(chunk);
      return { chunk, layer };
    }
    const handle = queue.add(prepare(), {
      priority: 0,
      onComplete({ chunk, layer }) {
        pending.delete(index); if (disposed || stamp !== epoch) { resolve(null); return; }
        chunks.set(index, chunk); terrain.set(index, layer);
        eggs.set(index, placeGroundedEgg(seed, chunk, visual.egg(index)));
        refreshLive(); resolve(chunk);
      },
      onError(error) { pending.delete(index); reject(error); },
      onCancel() { pending.delete(index); resolve(null); },
    });
    pending.set(index, { promise, handle }); return promise;
  }
  function fail() {
    if (disposed) return;
    for (const image of pendingImages) image.src = ""; pendingImages.clear();
    stopFrame(); cancelWork(); title = "The little world needs a moment."; copy = "Try loading it again."; setMode("error");
  }
  function prefetch(index: number) {
    const stamp = epoch;
    requestChunk(index + 2).catch(() => { if (stamp === epoch) fail(); });
  }
  async function reset(startAfter = false) {
    const stamp = ++epoch; stopFrame(); cancelWork(); chunks.clear(); terrain.clear(); eggs.clear(); refreshLive();
    seed = newSeed(); player = newPlayer(); visual = createVisualWorld(seed); worldIndex = -1;
    score = 0; counts = emptyCounts(); elapsed = 0; queuedJump = 0; stompChain = 0; particles = []; defeats = []; buffering = false;
    last = 0; lastPaint = null; accumulator = 0; title = ""; copy = ""; setMode("preparing");
    try {
      const ready = await Promise.all([requestChunk(0), requestChunk(1)]);
      if (disposed || stamp !== epoch || ready.some(chunk => !chunk)) return;
      worldIndex = 0; prefetch(0); setMode("ready"); draw();
      if (startAfter && visible && !document.hidden) start();
    } catch { if (stamp === epoch) fail(); }
  }
  function schedule() { if (!raf && !disposed) raf = requestAnimationFrame(frame); }
  function start() {
    if (disposed || mode !== "ready" || !visible || document.hidden) return;
    jumpPlayer(player); last = 0; lastPaint = null; accumulator = 0; setMode("running"); canvas.focus({ preventScroll: true }); schedule();
  }
  function resume() {
    if (disposed || mode !== "paused" || !visible || document.hidden || buffering) return;
    title = ""; copy = ""; last = 0; lastPaint = null; accumulator = 0; setMode("running"); canvas.focus({ preventScroll: true }); schedule();
  }
  function pause() {
    if (disposed || mode !== "running") return;
    stopFrame(); title = "A moment of calm."; copy = "Your run is waiting here."; setMode("paused"); draw();
  }
  function finish(reason: DeathReason) {
    const count = endingCounts[reason] || 0; endingCounts[reason] = count + 1;
    [title, copy] = endings[reason][count % endings[reason].length];
    if (score > best) { best = score; try { localStorage.setItem("bitpunk-run-best-v2", String(best)); } catch { /* Optional. */ } }
    setMode("over");
  }
  function jump() {
    if (mode === "ready") { start(); return; }
    if (mode === "paused") { resume(); return; }
    if (mode === "over") { void reset(true); return; }
    if (mode === "error") { if (images) void reset(); else void load(); return; }
    if (mode !== "running") return;
    canvas.focus({ preventScroll: true }); if (!jumpPlayer(player)) queuedJump = elapsed + .1;
  }
  function worldReady(): boolean {
    const index = Math.floor(player.x / 640);
    if (!chunks.has(index) || !chunks.has(index + 1)) {
      if (!buffering) {
        const stamp = epoch; buffering = true; setMode("preparing");
        Promise.all([requestChunk(index), requestChunk(index + 1)]).then(ready => {
          if (disposed || stamp !== epoch || ready.some(chunk => !chunk) || !buffering) return;
          buffering = false; refreshLive(); worldIndex = index; prefetch(index);
          title = "A moment of calm."; copy = "Your run is waiting here."; setMode("paused");
          if (visible && !document.hidden) resume();
        }).catch(() => { if (stamp === epoch) fail(); });
      }
      return false;
    }
    if (index !== worldIndex) { worldIndex = index; refreshLive(); prefetch(index); }
    return true;
  }
  function step(): boolean {
    if (!worldReady()) return false;
    if (queuedJump >= elapsed && queuedJump > 0 && player.grounded) { jumpPlayer(player); queuedJump = 0; }
    Object.assign(previous, player);
    stepPlayer(player, live.surfaces); elapsed += RUN.dt;
    for (const chunk of chunks.values()) for (const coin of chunk.coins) {
      if (coin.taken || Math.abs(coin.x - player.x) > 22) continue;
      const added = takeCoin(player, coin, counts);
      if (added) { score += added; particles.push({ x: coin.x, y: coin.y, ttl: .28, value: added }); if (particles.length > 12) particles.shift(); }
    }
    let liveParticles = 0;
    for (const particle of particles) { particle.ttl -= RUN.dt; particle.y -= 25 * RUN.dt; if (particle.ttl > 0) particles[liveParticles++] = particle; }
    particles.length = liveParticles;
    let liveDefeats = 0;
    for (const effect of defeats) { effect.ttl -= RUN.dt; if (effect.ttl > 0) defeats[liveDefeats++] = effect; }
    defeats.length = liveDefeats;
    const { reason, stomp } = resolveEncounters(player, previous, live.enemies, stompChain);
    if (stomp) {
      stompChain++; score += stomp.points; queuedJump = 0;
      particles.push({ x: stomp.x, y: stomp.y - 8, ttl: .8, value: stomp.points, multiplier: stomp.multiplier });
      if (particles.length > 12) particles.shift();
      defeats.push({ ...stomp, ttl: .32 }); if (defeats.length > 4) defeats.shift();
    } else if (player.grounded) stompChain = 0;
    if (reason) finish(reason); else emit();
    return true;
  }
  function frame(timestamp: number) {
    raf = 0; if (disposed || mode !== "running" || !visible || document.hidden) return;
    if (!last) last = timestamp;
    accumulator += Math.min((timestamp - last) / 1000, .067); last = timestamp;
    let ticks = 0;
    while (accumulator >= RUN.dt && ticks < 8 && mode === "running") { if (!step()) { accumulator = 0; break; } accumulator -= RUN.dt; ticks++; }
    if (ticks === 8) accumulator = 0;
    const delta = lastPaint === null ? 1000 / 60 : timestamp - lastPaint;
    if (lastPaint === null || delta + .1 >= 1000 / 60 || mode !== "running") {
      lastPaint = lastPaint === null ? timestamp : lastPaint + Math.max(1, Math.floor((delta + .1) / (1000 / 60))) * (1000 / 60);
      draw();
    }
    if (mode === "running") schedule();
  }
  function background(scene: SceneId, camera: number, alpha = 1) {
    if (!images) return;
    const offset = Math.max(0, camera) * .14, tile = Math.floor(offset / 640), inside = Math.round(offset % 640);
    ctx.save(); ctx.globalAlpha = alpha;
    for (let n = 0; n < 2; n++) {
      const x = n * 640 - inside;
      if ((tile + n) % 2 && !SCENE_TEXT_PANELS.includes(scene)) { ctx.save(); ctx.translate(x + 640, 0); ctx.scale(-1, 1); ctx.drawImage(images[scene], 0, 0, 640, 320); ctx.restore(); }
      else ctx.drawImage(images[scene], x, 0, 640, 320);
    }
    ctx.restore();
  }
  function draw() {
    if (disposed) return;
    if (!images) { ctx.fillStyle = "#f1ece2"; ctx.fillRect(0, 0, width, 320); return; }
    const art = images, camera = player.x - 100, index = Math.floor(player.x / 640), scene = visual.scene(index);
    const chapter = Math.floor(index / 4), chapterX = player.x - chapter * 4 * 640;
    ctx.imageSmoothingEnabled = false;
    if (!reduced.matches && chapter > 0 && chapterX < 200) { background(visual.scene((chapter - 1) * 4), camera); background(scene, camera, chapterX / 200); }
    else background(scene, camera);
    for (const egg of eggs.values()) {
      if (!egg || egg.x + egg.width / 2 < camera || egg.x - egg.width / 2 > camera + width) continue;
      paintEgg(ctx, art, artwork.decor, egg.id, egg.x - camera, egg.foot, egg.width, egg.height);
    }
    for (const chunk of chunks.values()) {
      const x = Math.round(chunk.start - camera); if (x > width || x + 640 < 0) continue;
      const layer = terrain.get(chunk.index); if (layer) ctx.drawImage(layer, x, 0);
    }
    for (const chunk of chunks.values()) {
      for (const coin of chunk.coins) {
        if (coin.taken || coin.x - camera < -20 || coin.x - camera > width + 20) continue;
        const rect = artwork.sprites[coin.type], bob = reduced.matches ? 0 : Math.sin(elapsed * 3 + coin.x);
        ctx.drawImage(art.world, rect.x, rect.y, rect.w, rect.h, Math.round(coin.x - camera - 9), Math.round(coin.y - 9 + bob), 18, 18);
      }
      for (const enemy of chunk.enemies) {
        if (enemy.defeated) continue;
        const position = enemyPosition(enemy, player.x / RUN.speed), x = position.x - camera;
        if (x < -60 || x > width + 60) continue;
        if (enemy.type === "redwick" || enemy.type === "greenwick") { paintWick(ctx, wickState(enemy, player.x / RUN.speed), x, position.y, 1, { particles: !reduced.matches }); continue; }
        const rect = artwork.sprites[enemy.type], w = enemy.type === "bear" ? 42 : 46, h = enemy.type === "bear" ? 31 : 31 + Math.round(Math.sin(elapsed * 10) * 2);
        const flip = Math.cos((player.x / RUN.speed - enemy.origin) * enemy.frequency + enemy.phase) > 0;
        ctx.save(); ctx.translate(Math.round(x + (flip ? w / 2 : -w / 2)), Math.round(position.y - h)); if (flip) ctx.scale(-1, 1);
        ctx.drawImage(art.world, rect.x, rect.y, rect.w, rect.h, 0, 0, w, h); ctx.restore();
      }
    }
    for (const effect of defeats) {
      const age = 1 - effect.ttl / .32, x = Math.round(effect.x - camera);
      if (x < -60 || x > width + 60) continue;
      if (age < .6) {
        const rect = artwork.sprites[effect.type], w = effect.type === "bear" ? 48 : 52, h = Math.max(2, Math.round(9 * (1 - age)));
        ctx.drawImage(art.world, rect.x, rect.y, rect.w, rect.h, x - w / 2, Math.round(effect.foot - h), w, h);
      }
      if (!reduced.matches) {
        ctx.fillStyle = "#d97757";
        for (let n = 0; n < 4; n++) {
          const direction = n % 2 ? 1 : -1, distance = 5 + age * (n < 2 ? 12 : 22);
          ctx.fillRect(Math.round(x + direction * distance), Math.round(effect.y - 3 - Math.sin(age * Math.PI) * (n < 2 ? 8 : 15)), 3, 3);
        }
      }
    }
    const animation = mode === "over" ? 7 : !player.grounded ? player.jumps === 2 ? 6 : 5 : mode === "running" ? 1 + Math.floor(elapsed * 11) % 4 : 0;
    ctx.drawImage(art.player, animation % 4 * 40, Math.floor(animation / 4) * 48, 40, 48, Math.round(player.x - camera - 20), Math.round(player.y + player.h - 48), 40, 48);
    ctx.font = "bold 9px monospace"; ctx.textAlign = "center";
    for (const particle of particles) {
      const label = `+${particle.value}`;
      const x = Math.round(particle.x - camera), y = Math.round(particle.y);
      if (particle.multiplier) { ctx.strokeStyle = "#f1ece2"; ctx.lineWidth = 3; ctx.strokeText(label, x, y); }
      ctx.fillStyle = particle.multiplier || particle.value === 10 ? "#8b5518" : "#171b1c"; ctx.fillText(label, x, y);
      if (particle.multiplier) {
        ctx.font = "bold 7px monospace";
        const detail = particle.multiplier > 1 ? `${particle.multiplier}× CHAIN` : "STOMP";
        ctx.strokeText(detail, x, y + 10); ctx.fillText(detail, x, y + 10); ctx.font = "bold 9px monospace";
      }
    }
  }
  function resize() {
    const next = innerWidth < 650 && innerHeight >= innerWidth ? 384 : 640;
    if (next !== width) pause();
    width = next; canvas.width = width; canvas.height = 320; canvas.style.aspectRatio = `${width}/320`; ctx.imageSmoothingEnabled = false; draw();
  }
  function delay(ms: number): Promise<void> {
    return new Promise(resolve => { const timer = setTimeout(() => { timers.delete(timer); resolve(); }, ms); timers.set(timer, resolve); });
  }
  async function load() {
    const ticket = ++imageTicket; setMode("loading");
    const begin = performance.now();
    let timeout: ReturnType<typeof setTimeout> | undefined;
    try {
      const loaded = await Promise.race([
        Promise.all((["player", "world", ...WORLD_SCENES, "memes-market", "memes-world"] as GameImageId[]).map(async id => {
          const image = new Image(); pendingImages.add(image); image.src = artwork.images[id]; await image.decode(); pendingImages.delete(image); return [id, image] as const;
        })),
        new Promise<never>((_, reject) => { timeout = setTimeout(() => reject(new Error("Image timeout")), 6000); imageTimeout = timeout; }),
      ]);
      if (disposed || ticket !== imageTicket) return;
      images = Object.fromEntries(loaded) as Record<GameImageId, HTMLImageElement>;
      await delay(Math.max(0, (reduced.matches ? 0 : 350) - (performance.now() - begin)));
      if (!disposed && ticket === imageTicket) await reset();
    } catch { if (!disposed && ticket === imageTicket) fail(); }
    finally { if (timeout) clearTimeout(timeout); if (imageTimeout === timeout) imageTimeout = undefined; }
  }
  const visibility = new IntersectionObserver(entries => { visible = entries.at(-1)!.intersectionRatio >= .08; if (!visible) pause(); }, { threshold: [0, .08] });
  visibility.observe(canvas);
  document.addEventListener("visibilitychange", () => { if (document.hidden) pause(); else queue.wake(); }, { signal: events.signal });
  window.addEventListener("resize", resize, { signal: events.signal });
  resize(); emit(); void load();
  return {
    jump, pause,
    togglePause() { if (mode === "paused") resume(); else pause(); },
    restart() { if (!disposed && images) void reset(); },
    destroy() {
      if (disposed) return;
      disposed = true; epoch++; imageTicket++; stopFrame(); cancelWork(); events.abort(); visibility.disconnect();
      if (imageTimeout) clearTimeout(imageTimeout); imageTimeout = undefined;
      for (const [timer, resolve] of timers) { clearTimeout(timer); resolve(); } timers.clear();
      for (const image of pendingImages) image.src = ""; pendingImages.clear();
      chunks.clear(); terrain.clear(); eggs.clear(); images = null; live = { surfaces: [], enemies: [] }; particles = []; defeats = [];
      canvas.width = 0; canvas.height = 0;
    },
  };
}
