import { destinations } from "./showcase";
import { brandDescription } from "./brand-copy";

export type ResearchPost = {
  id: string;
  title: string;
  copy: string;
  artwork?: "chart" | "research" | "marketNotes";
  image?: { src: string; width: number; height: number; alt?: string };
  /** Set published and the original URL when replacing a preview. */
  published: boolean;
  href?: string;
  date?: string;
};

export type ResearchChannel = {
  id: "x" | "substack";
  platform: "X" | "Substack";
  description: string;
  detail: string;
  name: string;
  handle?: string;
  bio: string;
  action: string;
  href: string | null;
  posts: readonly ResearchPost[];
};

/** Owner-approved public profile copy. No audience or account metadata. */
export const platformProfiles = {
  x: {
    name: "bitpunk", handle: "bitpunklabs",
    bio: `${brandDescription}\nExplore the work at ↓`,
  },
  substack: {
    name: "bitpunk", handle: "bitpunk",
    bio: `${brandDescription} Explore the works at bitpunk.io`,
  },
  tradingview: {
    name: "Bitpunk", handle: "bitpunk_labs",
    bio: "Indicators and open-source chart studies.",
  },
} as const;

// X supplies its own timeline. Substack articles come from the publication RSS.
export const researchChannels: readonly ResearchChannel[] = [
  {
    id: "x", platform: "X", ...platformProfiles.x,
    description: "Charts, market notes and ideas as they develop.",
    detail: "A closer look at what stands out, what could change the view and what to watch next.",
    action: "Follow on X", href: destinations.x,
    posts: [],
  },
  {
    id: "substack", platform: "Substack", ...platformProfiles.substack,
    description: "Deeper reads on market context.",
    detail: "More room for the reasoning behind a market view, the scenarios worth considering and the evidence that could change the picture.",
    action: "Follow on Substack", href: destinations.substack,
    posts: [],
  },
];
