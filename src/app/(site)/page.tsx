"use client";

import dynamic from "next/dynamic";
import { HomeHero } from "@/components/scenes/HomeHero";

// Lazy load below-fold sections — they don't need to be in the initial JS bundle.
// ssr: false prevents them from blocking server render / hydration.
const AboutSection    = dynamic(() => import("@/components/sections/AboutSection").then(m => ({ default: m.AboutSection })),    { ssr: false });
const ServicesSection = dynamic(() => import("@/components/sections/ServicesSection").then(m => ({ default: m.ServicesSection })), { ssr: false });
const GallerySection  = dynamic(() => import("@/components/sections/GallerySection").then(m => ({ default: m.GallerySection })),  { ssr: false });
const ContactSection  = dynamic(() => import("@/components/sections/ContactSection").then(m => ({ default: m.ContactSection })),  { ssr: false });
const FAQSection      = dynamic(() => import("@/components/sections/FAQSection").then(m => ({ default: m.FAQSection })),          { ssr: false });
const Footer          = dynamic(() => import("@/components/ui/Footer").then(m => ({ default: m.Footer })),                        { ssr: false });

export default function Home() {
  return (
    <>
      <main>
        <HomeHero />
        <AboutSection />
        <ServicesSection />
        <GallerySection />
        <ContactSection />
        <FAQSection />
      </main>
      <Footer />
    </>
  );
}
