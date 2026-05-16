"use client";

import Image from "next/image";

const socials = [
  { label: "Instagram", href: "https://www.instagram.com/a7entertainment/" },
  { label: "LinkedIn",  href: "https://www.linkedin.com/company/a7entertainment" },
];

export function Footer() {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer className="w-full section-padding" style={{ background: "transparent", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
      <div className="max-w-7xl mx-auto h-14 flex items-center justify-between gap-6">

        {/* Left — logo + copyright */}
        <div className="flex items-center gap-3 shrink-0">
          <Image
            src="/logo-white.png"
            alt="A7 Entertainment"
            width={80}
            height={24}
            className="h-5 w-auto object-contain opacity-90 hover:opacity-100 transition-opacity duration-200"
          />
          <span className="hidden lg:block text-[10px] tracking-[0.2em] font-sans" style={{ color: "rgba(255,255,255,0.55)" }}>
            © 2026
          </span>
        </div>

        {/* Center — social links */}
        <div className="flex items-center gap-6">
          {socials.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor-hover
              className="text-[11px] tracking-[0.25em] uppercase font-sans font-medium transition-colors duration-200"
              style={{ color: "rgba(255,255,255,0.75)" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#FFFFFF")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.75)")}
            >
              {s.label}
            </a>
          ))}
        </div>

        {/* Right — To Top */}
        <button
          onClick={scrollToTop}
          data-cursor-hover
          className="text-[11px] tracking-[0.25em] uppercase font-sans font-medium shrink-0 transition-colors duration-200"
          style={{ color: "rgba(255,255,255,0.75)" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#FFFFFF")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.75)")}
        >
          To Top ↑
        </button>

      </div>
    </footer>
  );
}
