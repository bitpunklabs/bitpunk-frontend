import Image from "next/image";

/** Still lettering with the same solid, six-second Y rotation as the GitHub mark. */
export function Wordmark() {
  return (
    <span className="wordmark-text">
      BITPUNK
      <picture className="wordmark-star">
        <source media="(prefers-reduced-motion: reduce)" srcSet="/brand/asterisk-solid-static-v1.svg" />
        <Image src="/brand/asterisk-solid-y-v1.webp" alt="" width={64} height={64}
          unoptimized loading="eager" draggable={false} />
      </picture>
    </span>
  );
}
