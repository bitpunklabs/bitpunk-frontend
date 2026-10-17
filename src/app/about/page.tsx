import type { Metadata } from "next";
import { MarblePage, MarbleHero, MarbleContent } from "@/components/marble-page";
import { aboutContent } from "@/lib/about";
import styles from "./about.module.css";

export const metadata: Metadata = {
  title: "About",
  description: "Bitpunk. Independent market research, indicators and open-source tools.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <MarblePage>
      <MarbleHero scene="about" section="About"
        title={<>A mind{" "}<br /><em>of our own.</em></>}
        copy={aboutContent.introduction} />
      <MarbleContent>
        <div className={styles.prose}>
          {aboutContent.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
        </div>
      </MarbleContent>
    </MarblePage>
  );
}
