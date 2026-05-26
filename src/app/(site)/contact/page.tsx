import type { Metadata } from "next";
import { HeroScene } from "@/components/scenes/HeroScene";
import { ContactSection } from "@/components/sections/ContactSection";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with A7 Entertainment. Reach out for event management, celebrity bookings, brand activations, or digital marketing enquiries. We serve clients across India and UAE.",
  alternates: { canonical: "https://www.a7entertainment.in/contact" },
  openGraph: {
    url: "https://www.a7entertainment.in/contact",
    title: "Contact A7 Entertainment | Let's Create Something Unforgettable",
    description:
      "Ready to transform your vision into an extraordinary experience? Contact A7 Entertainment for events, celebrity bookings, brand activations, and digital marketing.",
  },
};

export default function Contact() {
  return (
    <main className="bg-background">
      <HeroScene
        title="Let's Create Something Unforgettable"
        subtitle="Get in touch with our team to discuss your next production"
      />
      <ContactSection />
    </main>
  );
}
