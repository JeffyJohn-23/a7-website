import { HeroScene } from "@/components/scenes/HeroScene";

export default function Gallery() {
  return (
    <main className="bg-background">
      <HeroScene
        title="Gallery"
        subtitle="Visual Chronicles of Our Greatest Productions"
        cta={{
          primary: "View All Events",
        }}
      />
      {/* Gallery grid section to be added */}
      <section className="w-full px-6 py-20 bg-background">
        <div className="max-w-6xl mx-auto">
          <p className="text-center text-gray-400">
            Gallery components coming soon
          </p>
        </div>
      </section>
    </main>
  );
}
