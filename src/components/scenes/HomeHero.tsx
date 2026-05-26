"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export function HomeHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const labelRef   = useRef<HTMLDivElement>(null);
  const line1Ref   = useRef<HTMLDivElement>(null);
  const line2Ref   = useRef<HTMLDivElement>(null);
  const line3Ref   = useRef<HTMLDivElement>(null);
  const subRef     = useRef<HTMLParagraphElement>(null);
  const ctaRef     = useRef<HTMLDivElement>(null);
  const statsRef   = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.25 });

      tl.fromTo(labelRef.current,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.55, ease: "power3.out" }
      )
        .fromTo(line1Ref.current,
          { opacity: 0, y: 28 },
          { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
          "-=0.2"
        )
        .fromTo(line2Ref.current,
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
        .fromTo(statsRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.6 },
          "-=0.3"
        );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="home"
      className="relative w-full flex flex-col overflow-hidden"
      style={{ minHeight: "100svh", background: "#000000" }}
    >
      {/* ── Ghost "A7" background watermark (like Rig.ai's ghost number) ── */}
      <div
        className="absolute right-0 top-1/2 -translate-y-[45%] pointer-events-none select-none overflow-hidden"
        style={{ zIndex: 0 }}
        aria-hidden="true"
      >
        <span
          className="font-display font-black text-white block leading-none"
          style={{
            fontSize: "clamp(14rem, 48vw, 60rem)",
            opacity: 0.028,
            letterSpacing: "-0.06em",
            userSelect: "none",
            lineHeight: 1,
          }}
        >
          A7
        </span>
      </div>

      {/* ── Subtle red radial accent — bottom-left corner ── */}
      <div
        className="absolute bottom-0 left-0 pointer-events-none"
        style={{
          zIndex: 0,
          width: "clamp(240px, 35vw, 500px)",
          height: "clamp(240px, 35vw, 500px)",
          background:
            "radial-gradient(circle at 0% 100%, rgba(255,0,0,0.09) 0%, transparent 65%)",
        }}
      />

      {/* ── Main content ── */}
      <div
        className="relative flex flex-col section-padding w-full max-w-7xl mx-auto"
        style={{ zIndex: 10, minHeight: "100svh" }}
      >
        {/* Spacer — gives nav room at the top */}
        <div style={{ height: "clamp(5rem, 12vh, 9rem)" }} />

        {/* Hero text block */}
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

          {/* Headline — 3 lines, staggered */}
          <div className="overflow-hidden">
            <div ref={line1Ref} style={{ opacity: 0 }}>
              <h1
                className="font-display font-extrabold text-white block leading-[1.04]"
                style={{ fontSize: "clamp(2.5rem, 7vw, 6.2rem)" }}
              >
                India&apos;s Premier
              </h1>
            </div>
          </div>
          <div className="overflow-hidden">
            <div ref={line2Ref} style={{ opacity: 0 }}>
              <p
                className="font-display font-extrabold text-white block leading-[1.04]"
                style={{ fontSize: "clamp(2.5rem, 7vw, 6.2rem)" }}
              >
                Event &amp; Entertainment
              </p>
            </div>
          </div>
          <div className="overflow-hidden">
            <div ref={line3Ref} style={{ opacity: 0 }}>
              <p
                className="font-display font-extrabold block leading-[1.04]"
                style={{ fontSize: "clamp(2.5rem, 7vw, 6.2rem)", color: "#FF0000" }}
              >
                Agency.
              </p>
            </div>
          </div>

          {/* Sub copy */}
          <p
            ref={subRef}
            className="mt-7 md:mt-9 text-white/48 font-sans leading-[1.8] max-w-lg"
            style={{ fontSize: "clamp(0.88rem, 1.5vw, 1rem)", opacity: 0 }}
          >
            We produce concerts, manage celebrities, and build brands — delivering
            end-to-end event management and digital marketing across India and UAE.
          </p>

          {/* CTA row */}
          <div
            ref={ctaRef}
            className="mt-10 md:mt-12 flex flex-wrap items-center gap-4"
            style={{ opacity: 0 }}
          >
            {/* Primary CTA */}
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

            {/* Ghost CTA */}
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

        {/* ── Bottom stats bar ── */}
        <div
          ref={statsRef}
          className="flex flex-wrap items-center gap-x-8 gap-y-3 border-t py-6"
          style={{ borderColor: "rgba(255,255,255,0.07)", opacity: 0 }}
        >
          {[
            { num: "200+", label: "Events Produced" },
            { num: "50+",  label: "Artists Managed" },
            { num: "10+",  label: "Years Experience" },
            { num: "15M+", label: "Audience Reached" },
          ].map((s, i) => (
            <div key={s.label} className="flex items-baseline gap-2">
              {i > 0 && (
                <span
                  className="mr-6 text-white/12 hidden sm:block select-none"
                  aria-hidden="true"
                >
                  ·
                </span>
              )}
              <span
                className="font-display font-bold text-white/70"
                style={{ fontSize: "clamp(1rem, 2vw, 1.35rem)" }}
              >
                {s.num}
              </span>
              <span
                className="font-sans uppercase text-white/28"
                style={{ fontSize: "clamp(0.58rem, 0.9vw, 0.68rem)", letterSpacing: "0.22em" }}
              >
                {s.label}
              </span>
            </div>
          ))}

          {/* Scroll hint — right-aligned on desktop */}
          <div className="ml-auto hidden lg:flex items-center gap-2.5 text-white/22">
            <span
              className="font-sans uppercase"
              style={{ fontSize: "9px", letterSpacing: "0.42em" }}
            >
              Scroll
            </span>
            <div className="w-px h-6 bg-gradient-to-b from-white/22 to-transparent" />
          </div>
        </div>
      </div>
    </section>
  );
}
