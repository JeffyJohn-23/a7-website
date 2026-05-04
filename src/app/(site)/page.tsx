import { HomeHero } from "@/components/scenes/HomeHero";
import { AboutSection } from "@/components/sections/AboutSection";
import { GallerySection } from "@/components/sections/GallerySection";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { Footer } from "@/components/ui/Footer";

function SectionDivider() {
  return (
    <div
      className="section-padding"
      style={{ paddingTop: "5rem", paddingBottom: "5rem" }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="section-line" />
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <>
      <main>
        <HomeHero />
        <AboutSection />
        <ServicesSection />
        <GallerySection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
