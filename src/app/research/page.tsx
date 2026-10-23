import type { Metadata } from "next";
import { MarblePage, MarbleHero, MarbleContent } from "@/components/marble-page";
import { ResearchChannels } from "@/components/research-channels";

export const revalidate = 1800;

export const metadata: Metadata = {
  title: "Research",
  description: "Independent market research, essays and field notes.",
  alternates: { canonical: "/research" },
};

export default function ResearchPage() {
  return (
    <MarblePage>
      <MarbleHero scene="research" section="Research"
        title={<>Room for{" "}<br /><em>another view.</em></>}
        copy="A fresh perspective on the markets." />
      <MarbleContent>
        <ResearchChannels />
      </MarbleContent>
    </MarblePage>
  );
}
