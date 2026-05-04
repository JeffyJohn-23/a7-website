"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!headingRef.current || !buttonRef.current) return;

    const heading = headingRef.current;
    const button = buttonRef.current;

    // Animate heading
    gsap.fromTo(
      heading,
      {
        opacity: 0,
        y: 40,
      },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power3.out",
      }
    );

    // Animate button
    gsap.fromTo(
      button,
      {
        opacity: 0,
        y: 20,
      },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        delay: 0.3,
        ease: "power3.out",
      }
    );
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative w-full h-screen flex items-center justify-center overflow-hidden bg-background"
    >
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 text-center px-8 max-w-4xl">
        <h1
          ref={headingRef}
          className="text-6xl md:text-7xl lg:text-8xl font-display font-bold tracking-tighter leading-none mb-8"
        >
          WE CREATE{" "}
          <span className="text-primary inline-block">EXPERIENCES</span>
        </h1>

        <button
          ref={buttonRef}
          className="px-8 py-4 bg-primary text-white font-semibold rounded-sm hover:bg-primary/90 transition-colors duration-300"
        >
          Explore Now
        </button>
      </div>

      {/* Scroll indicator */}
      <div
        className={`absolute bottom-10 left-1/2 -translate-x-1/2 transition-opacity duration-500 ${
          scrolled ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      >
        <style>{`
          @keyframes scroll-line {
            0% { transform: scaleY(0); transform-origin: top; opacity: 1; }
            100% { transform: scaleY(1); transform-origin: top; opacity: 0; }
          }
        `}</style>
        <span className="text-[9px] tracking-[0.4em] uppercase text-white/40 font-sans block text-center mb-3">
          SCROLL
        </span>
        <div className="w-px h-8 bg-white/20 mx-auto">
          <div style={{ animation: "scroll-line 1.6s ease-in-out infinite", height: "100%" }} />
        </div>
      </div>

      {/* Animated background elements */}
      <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-primary/5 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-primary/5 rounded-full blur-3xl animate-pulse" />
    </section>
  );
}
