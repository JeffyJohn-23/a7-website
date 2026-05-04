import { HeroScene } from "@/components/scenes/HeroScene";

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
