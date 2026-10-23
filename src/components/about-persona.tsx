"use client";

import Image from "next/image";
import { useState } from "react";
import type { AboutArtwork } from "@/lib/scene-assets";
import styles from "./about-persona.module.css";

const states = [
  { id: "thinking", label: "Thinking", description: "The Bitpunk persona, seated in thought." },
  { id: "building", label: "Building", description: "The same masked persona working at a laptop." },
] as const;

export function AboutPersona({ artwork }: { artwork: AboutArtwork["persona"] }) {
  const [selected, setSelected] = useState<"thinking" | "building">("thinking");
  return <figure className={styles.persona}>
    <div className={styles.artwork}>
      {states.map(state => <Image key={state.id} src={artwork[state.id].src} alt={state.description}
        width={512} height={512} unoptimized loading={state.id === "thinking" ? "eager" : "lazy"}
        className={styles.image} data-visible={selected === state.id} aria-hidden={selected !== state.id} />)}
    </div>
    <figcaption className={styles.states} role="group" aria-label="Persona at work">
      {states.map(state => <button key={state.id} type="button" aria-pressed={selected === state.id}
        onClick={() => setSelected(state.id)}>{state.label}</button>)}
    </figcaption>
  </figure>;
}
