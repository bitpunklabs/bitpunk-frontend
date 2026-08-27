import type { Metadata } from "next";

export const metadata: Metadata = { title: "About" };

export default function AboutPage() {
  return (
    <section className="page-section">
      <p className="eyebrow">About Bitpunk</p>
      <h1>Structure over noise.</h1>
      <p className="lead">
        Bitpunk is a market research and membership brand for systematic traders. It focuses on
        frameworks, evidence, risk boundaries, and disciplined process rather than predictions or
        trade calls.
      </p>
    </section>
  );
}
