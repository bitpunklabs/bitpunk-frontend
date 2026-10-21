export const homeTransitions = [
  { id: "gallery", family: "A", label: "A0 · 原版展板", description: "完整浮雕轻微收束，阅读内容从下方接续。" },
  { id: "gallery-depth", family: "A", label: "A1 · 回廊退景", description: "浮雕退入空间，保留石材的重量与展厅的纵深。" },
  { id: "gallery-offset", family: "A", label: "A2 · 偏轴展板", description: "一点偏轴、一条橙色边缘，用不对称表达克制的朋克气质。" },
  { id: "folio", family: "B", label: "B · 石页翻转", description: "上一轮的侧向翻页，保留作为对照。" },
  { id: "curtain", family: "C", label: "C0 · 原版帷幕", description: "从中央打开，两侧保留原有布料。" },
  { id: "curtain-fold", family: "C", label: "C1 · 褶线揭幕", description: "沿柔和曲线显露内容，呼应布褶；雕塑保持原有形态。" },
  { id: "curtain-observe", family: "C", label: "C2 · 观察视窗", description: "视域向两侧不等速展开，让左侧内容先进入视线。" },
] as const;

export type HomeTransition = typeof homeTransitions[number]["id"];

export function isHomeTransition(value: unknown): value is HomeTransition {
  return homeTransitions.some(concept => concept.id === value);
}

/** Normalised mask geometry: the original relief itself never bends or stretches. */
export function foldOpeningPath(progress: number, spread = 1) {
  if (progress >= .999) return "M-.1 -.1H1.1V1.1H-.1Z";
  const t = Math.max(0, Math.min(1, (progress - .015) / .97));
  const p = t * t * (3 - 2 * t);
  const release = Math.max(0, Math.min(1, (progress - .68) / .32));
  const gap = (p * .66 + release * release * (3 - 2 * release) * .20) * spread;
  const curve = Math.sin(Math.PI * p) * .038;
  const n = (value: number) => value.toFixed(5);
  return [
    `M${n(.5 - gap * .86)} -.06`,
    `C${n(.5 - gap * 1.18 - curve)} .12 ${n(.5 - gap * .72 + curve)} .25 ${n(.5 - gap * .94)} .40`,
    `C${n(.5 - gap * 1.10 - curve)} .55 ${n(.5 - gap * .74 + curve)} .76 ${n(.5 - gap * .98)} 1.06`,
    `L${n(.5 + gap * .96)} 1.06`,
    `C${n(.5 + gap * .76 - curve)} .80 ${n(.5 + gap * 1.15 + curve)} .64 ${n(.5 + gap * .96)} .50`,
    `C${n(.5 + gap * .73 - curve)} .32 ${n(.5 + gap * 1.20 + curve)} .12 ${n(.5 + gap * .90)} -.06Z`,
  ].join(" ");
}
