import type { Metadata } from "next";

export const metadata: Metadata = {
  // The root layout appends "· Meet Chauhan" via its title template.
  title: "Full Stack Vibes",
  description:
    "A playlist of everything Meet Chauhan has built — projects, experiments and late-night ideas, laid out like a Spotify playlist.",
  alternates: { canonical: "/playlist" },
};

export default function PlaylistLayout({ children }: { children: React.ReactNode }) {
  return children;
}
