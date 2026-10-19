import type { Metadata } from "next";
import { MarbleScene } from "@/components/marble-scene";

export const metadata: Metadata = { alternates: { canonical: "/" } };

export default function HomePage() {
  return <MarbleScene />;
}
