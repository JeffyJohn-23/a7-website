import { HeroScene } from "@/components/scenes/HeroScene";

export default function Contact() {
  return (
    <main className="bg-background">
      <HeroScene
        title="Let's Create Something Unforgettable"
        subtitle="Get in touch with our team to discuss your next production"
      />
      {/* Contact form section to be added */}
      <section className="w-full px-6 py-20 bg-background">
        <div className="max-w-2xl mx-auto">
          <form className="space-y-6 bg-accent p-8 rounded-lg">
            <input
              type="text"
              placeholder="Your Name"
              className="w-full px-4 py-3 bg-background text-white placeholder-gray-500 border border-primary/20 rounded-lg focus:border-primary focus:outline-none transition"
            />
            <input
              type="email"
              placeholder="Your Email"
              className="w-full px-4 py-3 bg-background text-white placeholder-gray-500 border border-primary/20 rounded-lg focus:border-primary focus:outline-none transition"
            />
            <textarea
              placeholder="Your Message"
              rows={6}
              className="w-full px-4 py-3 bg-background text-white placeholder-gray-500 border border-primary/20 rounded-lg focus:border-primary focus:outline-none transition"
            />
            <button className="w-full px-6 py-3 bg-primary text-white font-semibold hover:brightness-110 transition-all">
              Send Message
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
