import type { Metadata } from "next";
import { HeroScene } from "@/components/scenes/HeroScene";

export const metadata: Metadata = {
  title: "Our Services",
  description:
    "A7 Entertainment offers end-to-end event management, celebrity management, brand activations, film promotions, influencer marketing, corporate events, wedding entertainment, and digital marketing services across India and UAE.",
  keywords: [
    "event management services India",
    "celebrity management agency",
    "brand activation services",
    "corporate event management India",
    "wedding entertainment agency",
    "film promotions India",
    "influencer marketing services",
    "digital marketing agency",
    "stage show production",
  ],
  alternates: { canonical: "https://www.a7entertainment.in/services" },
  openGraph: {
    url: "https://www.a7entertainment.in/services",
    title: "Event Management & Marketing Services | A7 Entertainment",
    description:
      "End-to-end solutions across entertainment, events, and media. Celebrity management, brand launches, film promotions, corporate events, and more.",
  },
};

export default function Services() {
  return (
    <main className="bg-background">
      <HeroScene
        title="Our Services"
        subtitle="Full-Spectrum Event & Entertainment Production"
      />
      {/* Services grid section to be added */}
      <section className="w-full px-6 py-20 bg-background">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              "Event Planning",
              "Concert Management",
              "Film Promotions",
              "Corporate Events",
            ].map((service) => (
              <div
                key={service}
                className="p-6 bg-accent border border-primary/20 rounded-lg"
              >
                <h3 className="text-xl font-bold text-white">{service}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
