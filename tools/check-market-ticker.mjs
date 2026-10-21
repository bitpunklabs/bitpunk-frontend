import assert from "node:assert/strict";
import { setImmediate, setTimeout } from "node:timers/promises";
import { observeTickerReadiness } from "../src/lib/market-ticker-readiness.ts";

const flush = () => setImmediate();
function fixture(options = {}) {
  const widget = new EventTarget();
  widget.updateComplete = Promise.resolve(true);
  const states = [];
  const observer = observeTickerReadiness(widget, state => states.push(state), {
    prepared: Promise.resolve(), afterPaint: async () => {}, timeoutMs: 60_000, ...options,
  });
  return { widget, states, observer };
}
function loadingError(widget, priority = "normal") {
  const event = new Event("loading-error");
  Object.defineProperty(event, "detail", { value: { priority } });
  widget.dispatchEvent(event);
}

// Script definition/preparation alone cannot reveal an empty widget.
{
  const f = fixture();
  await flush();
  assert.deepEqual(f.states, []);
  f.observer.dispose();
}

// The provider, local setup, render and final paint must all finish.
{
  const preparation = Promise.withResolvers();
  const render = Promise.withResolvers();
  const paint = Promise.withResolvers();
  const f = fixture({ prepared: preparation.promise, afterPaint: () => paint.promise });
  f.widget.updateComplete = render.promise;
  f.widget.dispatchEvent(new Event("tv-widget-ready"));
  await flush();
  assert.deepEqual(f.states, []);
  preparation.resolve();
  await flush();
  assert.deepEqual(f.states, []);
  render.resolve(true);
  await flush();
  assert.deepEqual(f.states, []);
  paint.resolve();
  await flush();
  assert.deepEqual(f.states, ["ready"]);
  f.widget.dispatchEvent(new Event("tv-widget-ready"));
  await flush();
  assert.deepEqual(f.states, ["ready"]);
  f.observer.dispose();
}

// Blocked scripts, provider failures and partial quote errors cannot be
// overridden by a late ready event, even if painting was already pending.
for (const failure of [f => f.observer.fail(), f => f.widget.dispatchEvent(new Event("tv-widget-error")), f => loadingError(f.widget)]) {
  const paint = Promise.withResolvers();
  const f = fixture({ afterPaint: () => paint.promise });
  f.widget.dispatchEvent(new Event("tv-widget-ready"));
  await flush();
  failure(f);
  paint.resolve();
  f.widget.dispatchEvent(new Event("tv-widget-ready"));
  await flush();
  assert.deepEqual(f.states, ["failed"]);
  f.observer.dispose();
}

{
  const f = fixture({ prepared: Promise.reject(new Error("Preparation unavailable")) });
  await flush();
  assert.deepEqual(f.states, ["failed"]);
  f.observer.dispose();
}

// Optional requests may fail without hiding otherwise complete content.
{
  const f = fixture();
  loadingError(f.widget, "optional");
  f.widget.dispatchEvent(new Event("tv-widget-ready"));
  await flush();
  assert.deepEqual(f.states, ["ready"]);
  loadingError(f.widget);
  assert.deepEqual(f.states, ["ready", "failed"]);
  f.observer.dispose();
}

{
  const f = fixture({ timeoutMs: 5 });
  await setTimeout(15);
  f.widget.dispatchEvent(new Event("tv-widget-ready"));
  await flush();
  assert.deepEqual(f.states, ["failed"]);
  f.observer.dispose();
}

// An unmounted widget cannot update the UI or leave a timeout behind.
{
  const paint = Promise.withResolvers();
  const f = fixture({ timeoutMs: 5, afterPaint: () => paint.promise });
  f.widget.dispatchEvent(new Event("tv-widget-ready"));
  await flush();
  f.observer.dispose();
  paint.resolve();
  loadingError(f.widget);
  await setTimeout(15);
  assert.deepEqual(f.states, []);
}

console.log("PASS: ticker readiness, render/paint gate, partial errors, script/provider failure, timeout, late events and cleanup.");
