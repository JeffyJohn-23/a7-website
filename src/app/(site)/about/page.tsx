import type { Metadata } from "next";
import { HeroScene } from "@/components/scenes/HeroScene";
import { StoryScene } from "@/components/scenes/StoryScene";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about A7 Entertainment — a fully integrated event management and digital marketing agency with over a decade of experience crafting impactful experiences across events, entertainment, and digital media.",
  alternates: { canonical: "https://www.a7entertainment.in/about" },
  openGraph: {
    url: "https://www.a7entertainment.in/about",
    title: "About A7 Entertainment | Our Story & Mission",
    description:
      "A fully integrated event and media company with 10+ years of industry experience. We specialize in impactful experiences across events, entertainment, and digital media.",
  },
};

export default function About() {
  return (
    <main className="bg-background">
      <HeroScene
        title="About A7 Entertainment"
        subtitle="Crafting Cinematic Moments Since Day One"
        cta={{
          primary: "Our Work",
          secondary: "Get in Touch",
        }}
      />
      <StoryScene
        title="Our Mission"
        content="A7 Entertainment stands at the intersection of luxury production and cinematic storytelling. We believe every event is a chance to create an immersive narrative—one that captivates, inspires, and transforms attendees into part of something extraordinary."
        layout="left"
      />
      <StoryScene
        title="Our Expertise"
        content="With years of experience in event production, concert management, and film promotions, we've mastered the art of translating vision into reality. Our team combines technical precision with creative vision to deliver productions that exceed expectations."
        layout="right"
      />
    </main>
  );
}
