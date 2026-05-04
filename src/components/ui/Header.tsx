"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

const navLinks = [
  { id: "home",     label: "Home"     },
  { id: "about",    label: "About"    },
  { id: "services", label: "Services" },
  { id: "gallery",  label: "Gallery"  },
  { id: "contact",  label: "Contact"  },
];

const lightSections = new Set(["about", "contact"]);

export function Header() {
  const headerRef    = useRef<HTMLElement>(null);
  const [activeSection, setActiveSection] = useState("home");
  const [expanded,      setExpanded]      = useState(false);
  const [scrolled,      setScrolled]      = useState(false);

  const isLight = lightSections.has(activeSection);
  const activeColor = isLight ? "#000000"          : "#FFFFFF";
  const dimColor    = isLight ? "rgba(0,0,0,0.50)" : "rgba(255,255,255,0.55)";

  useEffect(() => {
    // Pure scroll listener — finds the last section whose top is at or above
    // 50% of viewport height. Works correctly for both scroll directions.
    const getActive = (): string => {
      const threshold = window.innerHeight * 0.5;
      let current = navLinks[0].id;
      for (const { id } of navLinks) {
        const el = document.getElementById(id);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= threshold) current = id;
      }
      return current;
    };

    const onScroll = () => {
      setActiveSection(getActive());
      setScrolled(window.scrollY > 60);
      setExpanded(false);
    };

    setActiveSection(getActive()); // set correct section on mount

    window.addEventListener("scroll", onScroll, { passive: true });

    gsap.from(headerRef.current, {
      y: 30, opacity: 0, duration: 1, delay: 0.4, ease: "power3.out",
    });

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id: string) => {
    setExpanded(false);
    setActiveSection(id);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const activeLink = navLinks.find((l) => l.id === activeSection);

  return (
    <header
      ref={headerRef}
      className="fixed bottom-8 left-0 right-0 z-50 flex justify-center pointer-events-none"
    >
      <div className="flex items-center gap-8 pointer-events-auto">

        {/* Desktop logo */}
        <button
          onClick={() => scrollTo("home")}
          className="hidden md:flex items-center h-10 shrink-0 hover:opacity-70 transition-opacity duration-150"
        >
          <span
            className="font-display font-black text-xl tracking-tight leading-none select-none"
            style={{ color: "#FF0000" }}
          >
            A7
          </span>
        </button>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center h-12 gap-2 px-10">
          {navLinks.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              className="relative h-10 px-6 flex items-center justify-center text-[11px] tracking-[0.25em] uppercase font-sans"
              style={{ color: activeSection === id ? activeColor : dimColor }}
            >
              {label}
              <span
                className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] rounded-full bg-[#FF0000]"
                style={{
                  width:   activeSection === id ? "1.5rem" : 0,
                  opacity: activeSection === id ? 1 : 0,
                  transition: "width 200ms, opacity 200ms",
                }}
              />
            </button>
          ))}
        </nav>

        {/* Mobile nav */}
        <nav className="md:hidden flex items-center gap-1">
          {expanded ? (
            /* Expanded: all links side by side, no background */
            <>
              {navLinks.map(({ id, label }) => (
                <button
                  key={id}
                  onClick={() => scrollTo(id)}
                  className="px-3 py-2 text-[10px] tracking-[0.22em] uppercase font-sans font-medium whitespace-nowrap"
                  style={{ color: activeSection === id ? activeColor : dimColor }}
                >
                  {label}
                  {activeSection === id && (
                    <span
                      className="block mx-auto mt-0.5 h-[2px] rounded-full bg-[#FF0000]"
                      style={{ width: "1.2rem" }}
                    />
                  )}
                </button>
              ))}
            </>
          ) : (
            /* Collapsed: active label + dots to hint it is tappable */
            <button
              onClick={() => setExpanded(true)}
              className="flex items-center gap-2 px-3 py-2"
              aria-label="Open navigation"
            >
              <span
                className="text-[10px] tracking-[0.3em] uppercase font-sans font-semibold"
                style={{ color: activeColor }}
              >
                {activeLink?.label}
              </span>
              <span className="flex items-center gap-[3px]">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="block rounded-full"
                    style={{
                      width: 3,
                      height: 3,
                      background: scrolled ? dimColor : activeColor,
                      opacity: 0.6 + i * 0.15,
                    }}
                  />
                ))}
              </span>
            </button>
          )}
        </nav>

      </div>
    </header>
  );
}
