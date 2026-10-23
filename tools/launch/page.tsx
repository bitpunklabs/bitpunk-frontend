import { ComingSoon } from "@/components/coming-soon";
import { getHomeArtwork } from "@/lib/scene-assets";

export default function LaunchPage() {
  return <main id="main-content"><ComingSoon variant="atrium" artwork={getHomeArtwork()} /></main>;
}
