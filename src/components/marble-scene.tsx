import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { Wordmark } from "@/components/wordmark";
import styles from "./marble-scene.module.css";
import glowAssets from "./marble-glow-assets.json";
import motionAssets from "./marble-motion-assets.json";
import { marbleMotionVariants, type MarbleMotionVariant } from "@/lib/marble-motion";

const portraitMedia = "(max-width: 700px), (max-aspect-ratio: 6/5)";

const plates = {
  desktop: { src: "/art/marble-scene/panorama.webp", width: 2170, height: 725 },
  mobile: { src: "/art/marble-scene/mobile.webp", width: 971, height: 1620 },
};

type Region = readonly [number, number, number, number];
const entries = [
  { id: "indicators", href: "/indicators", label: "Indicators", anchor: "indicators",
    desktop: [0, .33, .41, .67], mobile: [0, .63, .67, .37] },
  { id: "research", href: "/blog", label: "Research", anchor: "blog",
    desktop: [.69, .02, .31, .50], mobile: [.50, 0, .50, .33] },
  { id: "opensource", href: "/open-source", label: "Open source", anchor: "work",
    desktop: [.035, .02, .32, .34], mobile: [0, 0, .50, .31] },
  { id: "about", href: "/about", label: "About Bitpunk", anchor: "about",
    desktop: [.67, .52, .40, .48], mobile: [.64, .65, .36, .35] },
] as const;

type Entry = typeof entries[number];
type MovingMotion = Exclude<MarbleMotionVariant, "baseline">;
type GlowStyle = CSSProperties & Record<`--${string}`, string>;
type SceneCrop = { src: string; x: number; y: number; width: number; height: number };
type ResponsiveCrops = { desktop: SceneCrop; mobile: SceneCrop };

/** Cropped, pre-baked light shares the background's original pixel coordinates. */
function cropStyle(entry: Entry, crops: ResponsiveCrops) {
  const style = {} as GlowStyle;
  for (const mode of ["desktop", "mobile"] as const) {
    const plate = plates[mode];
    const crop = crops[mode];
    const coreWidth = mode === "mobile" ? plate.width : plate.height * 1585 / 992;
    const coreX = (plate.width - coreWidth) / 2;
    const [x, y, width, height]: Region = entry[mode];
    const values = {
      x: (crop.x - coreX - x * coreWidth) / (width * coreWidth),
      y: (crop.y - y * plate.height) / (height * plate.height),
      width: crop.width / (width * coreWidth),
      height: crop.height / (height * plate.height),
    };
    for (const [key, value] of Object.entries(values)) {
      style[`--${mode}-${key}`] = `${(value * 100).toFixed(6)}%`;
    }
  }
  return style;
}

function LightCrop({ entry, motion }: { entry: Entry; motion: MarbleMotionVariant }) {
  const crops = {
    desktop: motion === "baseline" ? glowAssets.desktop[entry.id] : motionAssets.variants[motion].desktop[entry.id].glow,
    mobile: motion === "baseline" ? glowAssets.mobile[entry.id] : motionAssets.variants[motion].mobile[entry.id].glow,
  };
  const desktop = crops.desktop;
  return (
    <picture className={styles.lightCrop} style={cropStyle(entry, crops)}>
      <source media={portraitMedia} srcSet={crops.mobile.src} />
      <Image className={styles.lightImage} src={desktop.src} alt=""
        width={desktop.width} height={desktop.height}
        unoptimized loading="eager" decoding="async" />
    </picture>
  );
}

/** Static alpha mask + the already loaded plate; no second sculpture bitmap. */
function MotionArt({ entry, motion }: { entry: Entry; motion: MovingMotion }) {
  const assets = motionAssets.variants[motion];
  const style = cropStyle(entry, { desktop: assets.desktop[entry.id], mobile: assets.mobile[entry.id] });
  for (const mode of ["desktop", "mobile"] as const) {
    const plate = plates[mode], crop = assets[mode][entry.id];
    style[`--${mode}-mask`] = `url("${crop.src}")`;
    style[`--${mode}-plate-x`] = `${-crop.x / crop.width * 100}%`;
    style[`--${mode}-plate-y`] = `${-crop.y / crop.height * 100}%`;
    style[`--${mode}-plate-width`] = `${plate.width / crop.width * 100}%`;
    style[`--${mode}-plate-height`] = `${plate.height / crop.height * 100}%`;
  }
  return (
    <span className={styles.motionCrop} style={style} aria-hidden="true">
      <picture>
        <source media={portraitMedia} srcSet={plates.mobile.src} />
        <Image className={styles.motionPlate} src={plates.desktop.src} alt=""
          width={plates.desktop.width} height={plates.desktop.height}
          unoptimized loading="eager" decoding="async" />
      </picture>
    </span>
  );
}

function motionOrigin(entry: Entry, motion: MovingMotion) {
  const style = {} as GlowStyle;
  for (const mode of ["desktop", "mobile"] as const) {
    const plate = plates[mode];
    const coreWidth = mode === "mobile" ? plate.width : plate.height * 1585 / 992;
    const coreX = (plate.width - coreWidth) / 2;
    const [x, y, width, height] = entry[mode];
    const [px, py] = motionAssets.variants[motion][mode][entry.id].origin;
    style[`--${mode}-origin`] = `${(px - coreX - x * coreWidth) / (width * coreWidth) * 100}% ${(py - y * plate.height) / (height * plate.height) * 100}%`;
  }
  return style;
}

export function MarbleScene({ motion = "baseline" }: { motion?: MarbleMotionVariant }) {
  const setting = marbleMotionVariants[motion];
  const motionStyle = {
    "--hover-scale": setting.scale,
    "--motion-duration": `${setting.duration}ms`,
    "--hover-lift": setting.lift,
  } as CSSProperties;
  const moving = motion !== "baseline";
  return (
    <section className={styles.home} style={moving ? motionStyle : undefined}
      aria-labelledby="home-title" data-home-scene data-label-style="ink" data-motion={motion}>
      <picture>
        <source media={portraitMedia} srcSet={plates.mobile.src} />
        <Image className={styles.plate} src={plates.desktop.src} alt="" aria-hidden="true"
          width={plates.desktop.width} height={plates.desktop.height}
          unoptimized loading="eager" fetchPriority="high" />
      </picture>
      <div className={styles.scene}>
        <div className={styles.identity}>
          <div className={styles.brand} aria-label="Bitpunk"><Wordmark /></div>
          <h1 id="home-title" className={styles.description}>
            <span>Research, indicators and open-source tools</span>{" "}
            <em>for those who read the market.</em>
          </h1>
        </div>
        <nav aria-label="Explore Bitpunk" className={styles.entries}>
          {entries.map(entry => {
            const contents = <>
              {motion !== "baseline" && <MotionArt entry={entry} motion={motion} />}
              <LightCrop entry={entry} motion={motion} />
              <span className={styles.label}>
                <span className={styles.labelGlow} aria-hidden="true">{entry.label}</span>
                {entry.label}
              </span>
            </>;
            return <Link key={entry.id} id={entry.anchor} href={entry.href}
              className={`${styles.entry} ${styles[entry.id]}`}>
              {motion !== "baseline" ? <span className={styles.motionItem} style={motionOrigin(entry, motion)}>{contents}</span> : contents}
            </Link>
          })}
        </nav>
      </div>
    </section>
  );
}
