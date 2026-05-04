"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const navLinks = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "gallery", label: "Gallery" },
  { id: "services", label: "Services" },
  { id: "contact", label: "Contact" },
];

export function Header() {
  const headerRef = useRef<HTMLElement>(null);
  const [activeSection, setActiveSection] = useState("home");

  const lightSections = new Set(["about", "contact"]);
  const isLight = lightSections.has(activeSection);

  useEffect(() => {
    navLinks.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;
      ScrollTrigger.create({
        trigger: el,
        start: "top center",
        end: "bottom center",
        onEnter: () => setActiveSection(id),
        onEnterBack: () => setActiveSection(id),
      });
    });

    gsap.from(headerRef.current, {
      y: 30,
      opacity: 0,
      duration: 1,
      delay: 0.4,
      ease: "power3.out",
    });

    return () => {
    };
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    el?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header
      ref={headerRef}
      className="fixed bottom-8 left-0 right-0 z-50 flex justify-center"
    >
      <div className="flex items-center gap-8">

        {/* Logo — A7 wordmark */}
        <button
          onClick={() => scrollTo("home")}
          data-cursor-hover
          className="hidden md:flex items-center justify-center h-10 shrink-0 transition-opacity duration-200 hover:opacity-70"
        >
          <span
            className="font-display font-black text-xl tracking-tight leading-none select-none"
            style={{ color: "#FF0000", letterSpacing: "-0.02em" }}
          >
            A7
          </span>
        </button>

        {/* Nav links — plain text, centered, with underline active indicator. Colors adapt to light sections. */}
        <nav className="hidden md:flex items-center h-12 gap-10 px-12">
          {navLinks.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              data-cursor-hover
              className={`relative h-10 px-8 flex items-center justify-center text-[11px] tracking-[0.25em] uppercase font-sans transition-all duration-200`}
              style={{ color: isLight ? (activeSection === id ? '#000000' : 'rgba(0,0,0,0.6)') : (activeSection === id ? '#FFFFFF' : 'rgba(255,255,255,0.65)') }}
            >
              {label}
              <span
                className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] rounded-full bg-[#FF0000] transition-all duration-300 ${
                  activeSection === id ? 'w-6 opacity-100' : 'w-0 opacity-0'
                }`}
              />
            </button>
          ))}
        </nav>

      </div>
    </header>
  );
}
