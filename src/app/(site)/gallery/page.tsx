import type { Metadata } from "next";
import { HeroScene } from "@/components/scenes/HeroScene";
import { GallerySection } from "@/components/sections/GallerySection";

export const metadata: Metadata = {
  title: "Portfolio & Projects",
  description:
    "Explore A7 Entertainment's portfolio — from the World Tennis League in Dubai to festival productions, celebrity engagements, and brand launches across India.",
  alternates: { canonical: "https://www.a7entertainment.in/gallery" },
  openGraph: {
    url: "https://www.a7entertainment.in/gallery",
    title: "Portfolio & Projects | A7 Entertainment",
    description:
      "Visual chronicles of our greatest productions — sports events, cultural festivals, brand launches, and celebrity management across India and UAE.",
  },
};

export default function Gallery() {
  return (
    <main className="bg-background">
      <HeroScene
        title="Gallery"
        subtitle="Visual Chronicles of Our Greatest Productions"
        cta={{ primary: "View All Events" }}
      />
      <GallerySection />
    </main>
  );
}
