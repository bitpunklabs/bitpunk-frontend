import Image from "next/image";
import type { CSSProperties } from "react";
import type { SceneCrop, WordmarkArtwork } from "@/lib/scene-assets";

/** Official paths and master-space proportions, independent of font line metrics. */
export function Wordmark({ artwork }: { artwork: WordmarkArtwork }) {
  const position = (crop: SceneCrop): CSSProperties => ({
    left: `${crop.x / artwork.width * 100}%`,
    top: `${crop.y / artwork.height * 100}%`,
    width: `${crop.width / artwork.width * 100}%`,
    height: `${crop.height / artwork.height * 100}%`,
  });
  return (
    <span className="wordmark-text" role="img" aria-label="BITPUNK"
      style={{ aspectRatio: `${artwork.width} / ${artwork.height}` }}>
      <Image className="wordmark-lettering" src={artwork.lettering.src} alt=""
        width={artwork.lettering.width} height={artwork.lettering.height}
        style={position(artwork.lettering)} unoptimized loading="eager" draggable={false} />
      <picture className="wordmark-star" style={position(artwork.star)}>
        <source media="(prefers-reduced-motion: reduce)" srcSet={artwork.star.staticSrc} />
        <Image src={artwork.star.src} alt="" width={64} height={64}
          unoptimized loading="eager" draggable={false} />
      </picture>
    </span>
  );
}
