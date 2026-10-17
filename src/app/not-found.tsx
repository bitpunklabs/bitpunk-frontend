import { MarblePage, MarbleHero, PageAction } from "@/components/marble-page";
export default function NotFound() {
  return (
    <MarblePage>
      <MarbleHero scene="opensource" section="Page not found" eyebrow="404 / Outside the collection"
        title={<>A different<br /><em>turn.</em></>} copy="This page isn’t in the collection.">
        <PageAction href="/">Back to Bitpunk</PageAction>
      </MarbleHero>
    </MarblePage>
  );
}
