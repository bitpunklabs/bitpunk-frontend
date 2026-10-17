export type AboutPerson = {
  name: string;
  role: string;
  bio: string;
  profileUrl: string | null;
};

// Owner-editable copy. Empty factual sections stay hidden until supplied.
// Filling guide: design/about-content-framework-2026-10-17.md.
export const aboutContent: {
  introduction: string;
  principles: readonly { title: string; copy: string }[];
  origin: string | null;
  people: readonly AboutPerson[];
  contact: { label: string; href: string } | null;
} = {
  introduction: "Independent research. Curious minds. A different perspective.",
  principles: [
    { title: "Think independently.", copy: "Form a view. Stay open to being wrong." },
    { title: "Show the reasoning.", copy: "Make the ideas and assumptions clear." },
    { title: "Keep questioning.", copy: "Look closely. Revisit what you think you know." },
  ],
  origin: null,
  people: [],
  contact: null,
};
