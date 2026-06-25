"use client";

import Image from "next/image";
import Link from "next/link";

const socials = [
  { label: "Instagram", href: "https://www.instagram.com/a7entertainment/" },
  { label: "LinkedIn",  href: "https://www.linkedin.com/company/a7entertainment" },
];

const legalLinks = [
  { label: "Privacy", href: "/privacy-policy" },
  { label: "Terms", href: "/terms-and-conditions" },
  { label: "Refund", href: "/refund-policy" },
];

export function Footer() {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer
      className="w-full section-padding"
      style={{ background: "transparent", borderTop: "1px solid rgba(255,255,255,0.08)" }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Main row — always one line: logo left, social center (sm+), To Top right */}
        <div className="flex items-center justify-between gap-4 h-12 sm:h-14">

          {/* Left — logo mark */}
          <div className="flex items-center gap-3 shrink-0 min-w-0">
            <Image
              src="/logo-white.png"
              alt="A7 Entertainment"
              width={80}
              height={24}
              className="h-4 sm:h-5 w-auto object-contain opacity-90 hover:opacity-100 transition-opacity duration-200 shrink-0"
            />
            <span
              className="hidden lg:block text-[10px] tracking-[0.2em] font-sans truncate"
              style={{ color: "rgba(255,255,255,0.55)" }}
            >
              © {new Date().getFullYear()} · India &amp; UAE
            </span>
          </div>

          {/* Center — social + legal links, hidden on small mobile */}
          <div className="hidden sm:flex items-center gap-6">
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
            <span aria-hidden="true" style={{ color: "rgba(255,255,255,0.2)" }}>·</span>
            {legalLinks.map((l) => (
              <Link
                key={l.label}
                href={l.href}
                data-cursor-hover
                className="text-[11px] tracking-[0.25em] uppercase font-sans font-medium transition-colors duration-200"
                style={{ color: "rgba(255,255,255,0.55)" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#FFFFFF")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.55)")}
              >
                {l.label}
              </Link>
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

        {/* Mobile-only sub-row: social links + copyright */}
        <div className="sm:hidden flex items-center justify-between pb-3 pt-0.5">
          <div className="flex items-center gap-5">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] tracking-[0.22em] uppercase font-sans font-medium"
                style={{ color: "rgba(255,255,255,0.55)" }}
              >
                {s.label}
              </a>
            ))}
          </div>
          <span
            className="text-[9px] tracking-[0.15em] font-sans shrink-0"
            style={{ color: "rgba(255,255,255,0.35)" }}
          >
            © {new Date().getFullYear()}
          </span>
        </div>

        {/* Mobile-only legal links row */}
        <div className="sm:hidden flex items-center gap-5 pb-3">
          {legalLinks.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              className="text-[10px] tracking-[0.22em] uppercase font-sans font-medium"
              style={{ color: "rgba(255,255,255,0.4)" }}
            >
              {l.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
