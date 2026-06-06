"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { AnimatePresence, motion } from "framer-motion";
import { PageLoader } from "@/components/ui/PageLoader";

// Framer Motion cubic-bezier tuple (avoids TS number[] inference error)
const EASE: [number, number, number, number] = [0.76, 0, 0.24, 1];

const PARTICLES: { left: string; size: number; duration: number; delay: number }[] = [
  { left: "8%",  size: 2,   duration: 5.2, delay: 0   },
  { left: "18%", size: 1.5, duration: 6.8, delay: 1.1 },
  { left: "32%", size: 1.5, duration: 4.9, delay: 2.4 },
  { left: "47%", size: 2,   duration: 7.1, delay: 0.7 },
  { left: "61%", size: 1.5, duration: 5.6, delay: 3.0 },
  { left: "74%", size: 2,   duration: 6.3, delay: 1.8 },
  { left: "88%", size: 1.5, duration: 4.7, delay: 0.3 },
];

// Cycling headline words — Strawberry Group-style morphing text
const HERO_WORDS = [
  "Event & Entertainment",
  "Concert Production",
  "Celebrity Management",
  "Brand Experience",
  "Live Experiences",
];

// Bottom marquee items
const MARQUEE_ITEMS = [
  "Event Production",
  "Celebrity Management",
  "Concert Booking",
  "Brand Activation",
  "Corporate Events",
  "Award Galas",
  "Digital Marketing",
  "Live Experiences",
];

export function HomeHero() {
  const sectionRef  = useRef<HTMLElement>(null);
  const labelRef    = useRef<HTMLDivElement>(null);
  const line1Ref    = useRef<HTMLDivElement>(null);
  const rotateRef   = useRef<HTMLDivElement>(null);
  const line3Ref    = useRef<HTMLDivElement>(null);
  const subRef      = useRef<HTMLParagraphElement>(null);
  const ctaRef      = useRef<HTMLDivElement>(null);
  const marqueeRef  = useRef<HTMLDivElement>(null);

  const [loaderDone, setLoaderDone] = useState(false);
  const [wordIndex,  setWordIndex]  = useState(0);

  const handleLoaderComplete = useCallback(() => setLoaderDone(true), []);

  // Start cycling words 2.4 s after loader exits (lets hero entrance finish first)
  useEffect(() => {
    if (!loaderDone) return;
    let interval: ReturnType<typeof setInterval>;
    const timeout = setTimeout(() => {
      interval = setInterval(() => {
        setWordIndex((i) => (i + 1) % HERO_WORDS.length);
      }, 3000);
    }, 2400);
    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, [loaderDone]);

  // Hero entrance — fires after loader completes
  useEffect(() => {
    if (!loaderDone) return;
    const ctx = gsap.context(() => {
      gsap.timeline({ delay: 0.1 })
        .fromTo(labelRef.current,
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.55, ease: "power3.out" }
        )
        .fromTo(line1Ref.current,
          { opacity: 0, y: 28 },
          { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
          "-=0.2"
        )
        .fromTo(rotateRef.current,
          { opacity: 0, y: 28 },
          { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
          "-=0.6"
        )
        .fromTo(line3Ref.current,
          { opacity: 0, y: 28 },
          { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
          "-=0.6"
        )
        .fromTo(subRef.current,
          { opacity: 0, y: 14 },
          { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" },
          "-=0.45"
        )
        .fromTo(ctaRef.current,
          { opacity: 0, y: 14 },
          { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" },
          "-=0.4"
        )
        .fromTo(marqueeRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.7 },
          "-=0.3"
        );
    }, sectionRef);
    return () => ctx.revert();
  }, [loaderDone]);

  return (
    <>
      {!loaderDone && <PageLoader onComplete={handleLoaderComplete} />}

      <section
        ref={sectionRef}
        id="home"
        className="relative w-full flex flex-col overflow-hidden"
        style={{ minHeight: "100svh", background: "#000000" }}
      >
        {/* ── Stage spotlight beams ── */}
        <div
          className="absolute inset-0 pointer-events-none overflow-hidden"
          style={{ zIndex: 1 }}
          aria-hidden="true"
        >
          <div style={{
            position: "absolute", top: 0, left: "12%",
            width: "clamp(180px, 22vw, 320px)", height: "70%",
            background: "linear-gradient(180deg, rgba(255,255,255,0.045) 0%, transparent 100%)",
            clipPath: "polygon(42% 0%, 58% 0%, 100% 100%, 0% 100%)",
            animation: "beam-pulse 4.5s ease-in-out infinite",
          }} />
          <div style={{
            position: "absolute", top: 0, left: "44%",
            width: "clamp(140px, 16vw, 240px)", height: "55%",
            background: "linear-gradient(180deg, rgba(255,255,255,0.03) 0%, transparent 100%)",
            clipPath: "polygon(42% 0%, 58% 0%, 100% 100%, 0% 100%)",
            animation: "beam-pulse 6s ease-in-out infinite",
            animationDelay: "2.2s",
          }} />
          <div style={{
            position: "absolute", top: 0, left: "68%",
            width: "clamp(120px, 14vw, 200px)", height: "45%",
            background: "linear-gradient(180deg, rgba(255,0,0,0.035) 0%, transparent 100%)",
            clipPath: "polygon(40% 0%, 60% 0%, 100% 100%, 0% 100%)",
            animation: "beam-pulse 5.2s ease-in-out infinite",
            animationDelay: "1.0s",
          }} />
        </div>

        {/* ── Floating stage particles ── */}
        <div
          className="absolute inset-0 pointer-events-none overflow-hidden"
          style={{ zIndex: 1 }}
          aria-hidden="true"
        >
          {PARTICLES.map((p, i) => (
            <div key={i} style={{
              position: "absolute", bottom: "4%", left: p.left,
              width: `${p.size}px`, height: `${p.size}px`,
              borderRadius: "9999px", background: "#ffffff",
              animation: `float-up ${p.duration}s ease-in-out infinite`,
              animationDelay: `${p.delay}s`,
            }} />
          ))}
        </div>

        {/* ── Red radial accent — bottom-left ── */}
        <div
          className="absolute bottom-0 left-0 pointer-events-none"
          style={{
            zIndex: 0,
            width: "clamp(240px, 38vw, 520px)",
            height: "clamp(240px, 38vw, 520px)",
            background: "radial-gradient(circle at 0% 100%, rgba(255,0,0,0.1) 0%, transparent 65%)",
            animation: "glow-breathe 6s ease-in-out infinite",
          }}
        />

        {/* ── Main content ── */}
        <div
          className="relative flex flex-col section-padding w-full max-w-7xl mx-auto"
          style={{ zIndex: 10, minHeight: "100svh" }}
        >
          <div style={{ height: "clamp(1.5rem, 3vh, 2.5rem)" }} />

          <div className="flex-1 flex flex-col justify-center">

            {/* Label row */}
            <div
              ref={labelRef}
              className="flex items-center gap-3 mb-8 md:mb-10"
              style={{ opacity: 0 }}
            >
              <div className="w-5 h-px bg-[#FF0000]" />
              <span
                className="font-sans uppercase text-white/38"
                style={{ fontSize: "clamp(0.6rem, 1vw, 0.72rem)", letterSpacing: "0.45em" }}
              >
                Est. 2016 · India &amp; UAE
              </span>
            </div>

            {/* Line 1 — static */}
            <div className="overflow-hidden">
              <div ref={line1Ref} style={{ opacity: 0 }}>
                <h1
                  className="font-display font-extrabold text-white block leading-[1.04]"
                  style={{ fontSize: "clamp(1.4rem, 6vw, 6.2rem)" }}
                >
                  India&apos;s Premier
                </h1>
              </div>
            </div>

            {/* Line 2 — rotating words (Strawberry Group-style clip reveal) */}
            <div
              className="overflow-hidden"
              style={{ height: "clamp(1.5rem, 6.3vw, 6.5rem)" }}
            >
              <div ref={rotateRef} style={{ opacity: 0, height: "100%" }}>
                <AnimatePresence mode="wait">
                  <motion.p
                    key={wordIndex}
                    initial={{ y: "100%" }}
                    animate={{ y: "0%" }}
                    exit={{ y: "-100%" }}
                    transition={{ duration: 0.52, ease: EASE }}
                    className="font-display font-extrabold text-white block leading-[1.04] whitespace-nowrap"
                    style={{ fontSize: "clamp(1.4rem, 6vw, 6.2rem)" }}
                  >
                    {HERO_WORDS[wordIndex]}
                  </motion.p>
                </AnimatePresence>
              </div>
            </div>

            {/* Line 3 — Agency. (red) */}
            <div className="overflow-hidden">
              <div ref={line3Ref} style={{ opacity: 0 }}>
                <p
                  className="font-display font-extrabold block leading-[1.04]"
                  style={{ fontSize: "clamp(1.4rem, 6vw, 6.2rem)", color: "#FF0000" }}
                >
                  Agency.
                </p>
              </div>
            </div>

            {/* Sub copy */}
            <p
              ref={subRef}
              className="mt-5 md:mt-9 text-white/48 font-sans leading-[1.8] max-w-lg"
              style={{ fontSize: "clamp(0.82rem, 1.5vw, 1rem)", opacity: 0 }}
            >
              We produce concerts, manage celebrities, and build brands — delivering
              end-to-end event management and digital marketing across India and UAE.
            </p>

            {/* CTA row */}
            <div
              ref={ctaRef}
              className="mt-7 md:mt-12 flex flex-wrap items-center gap-4"
              style={{ opacity: 0 }}
            >
              <button
                data-cursor-hover
                onClick={() =>
                  document.getElementById("gallery")?.scrollIntoView({ behavior: "smooth" })
                }
                className="group relative overflow-hidden bg-white text-black font-sans font-semibold uppercase px-7 py-4 transition-colors duration-300"
                style={{ fontSize: "clamp(0.62rem, 1vw, 0.7rem)", letterSpacing: "0.22em" }}
              >
                <span
                  className="absolute inset-0 bg-[#FF0000] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-350 ease-out"
                  aria-hidden="true"
                />
                <span className="relative group-hover:text-white transition-colors duration-350">
                  Explore Our Work
                </span>
              </button>

              <button
                data-cursor-hover
                onClick={() =>
                  document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })
                }
                className="group flex items-center gap-2.5 font-sans font-medium uppercase text-white/50 hover:text-white transition-colors duration-300"
                style={{ fontSize: "clamp(0.62rem, 1vw, 0.7rem)", letterSpacing: "0.22em" }}
              >
                Get in Touch
                <span className="group-hover:translate-x-1.5 transition-transform duration-300 inline-block">
                  →
                </span>
              </button>
            </div>
          </div>

          {/* ── Marquee ticker — scrolling services strip ── */}
          <div
            ref={marqueeRef}
            className="border-t overflow-hidden"
            style={{ borderColor: "rgba(255,255,255,0.07)", opacity: 0 }}
          >
            <div className="flex py-5">
              <div className="animate-marquee flex items-center whitespace-nowrap">
                {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
                  <span key={i} className="flex items-center flex-shrink-0">
                    <span
                      className="font-sans uppercase text-white/25"
                      style={{
                        fontSize: "clamp(0.55rem, 0.85vw, 0.65rem)",
                        letterSpacing: "0.32em",
                      }}
                    >
                      {item}
                    </span>
                    <span
                      className="mx-7 text-[#FF0000]"
                      style={{ fontSize: "4px", lineHeight: 1 }}
                      aria-hidden="true"
                    >
                      ●
                    </span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
