"use client";

import Image from "next/image";

const socials = [
  { label: "INSTAGRAM", href: "#" },
  { label: "LINKEDIN",  href: "#" },
];

export function Footer() {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer className="w-full section-padding bg-transparent">
      <div className="max-w-7xl mx-auto h-12 flex items-center justify-between gap-6">

        {/* Left — logo + copyright */}
        <div className="flex items-center gap-3 shrink-0">
          <Image
            src="/logo-white.png"
            alt="A7 Entertainment"
            width={80}
            height={24}
            className="h-5 w-auto object-contain opacity-50 hover:opacity-80 transition-opacity duration-200"
          />
          <span className="hidden lg:block text-[10px] tracking-[0.2em] text-white/20 font-sans">© 2026</span>
        </div>

        {/* Center — social links */}
        <div className="hidden md:flex items-center gap-0">
          {socials.map((s, i) => (
            <span key={s.label} className="flex items-center">
              {i > 0 && <span className="text-white/10 mx-3 text-[10px]">|</span>}
              <a
                href={s.href}
                data-cursor-hover
                className="text-[10px] tracking-[0.25em] uppercase text-white/30 hover:text-white transition-colors duration-200 font-sans"
              >
                {s.label}
              </a>
            </span>
          ))}
        </div>

        {/* Right — To Top */}
        <button
          onClick={scrollToTop}
          data-cursor-hover
          className="text-[10px] tracking-[0.25em] uppercase text-white/30 hover:text-white transition-colors duration-200 font-sans shrink-0"
        >
          To Top
        </button>

      </div>
    </footer>
  );
}
