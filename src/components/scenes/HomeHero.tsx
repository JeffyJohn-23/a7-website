"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export function HomeHero() {
  const sectionRef    = useRef<HTMLElement>(null);
  const titleWrapRef  = useRef<HTMLDivElement>(null);
  const line1Ref      = useRef<HTMLDivElement>(null);
  const line2Ref      = useRef<HTMLDivElement>(null);
  const tagRef        = useRef<HTMLParagraphElement>(null);
  const scrollRef     = useRef<HTMLDivElement>(null);
  const dividerRef    = useRef<HTMLDivElement>(null);

  // Delay video injection so it doesn't block first contentful paint
  const [showVideo, setShowVideo] = useState(false);

  useEffect(() => {
    // Inject video after first paint via requestIdleCallback / rAF fallback
    const id = typeof requestIdleCallback !== "undefined"
      ? requestIdleCallback(() => setShowVideo(true))
      : undefined;
    const raf = id === undefined
      ? requestAnimationFrame(() => setShowVideo(true))
      : undefined;

    return () => {
      if (id !== undefined) cancelIdleCallback(id);
      if (raf !== undefined) cancelAnimationFrame(raf);
    };
  }, []);

  // Defer GSAP animations until after mount — they are non-critical to FCP
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.3 });

      tl.fromTo(
        line1Ref.current,
        { clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0% 100%)" },
        { clipPath: "polygon(0 0, 100% 0, 100% 100%, 0% 100%)", duration: 1.2, ease: "power4.inOut" }
      )
        .fromTo(
          line2Ref.current,
          { clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0% 100%)" },
          { clipPath: "polygon(0 0, 100% 0, 100% 100%, 0% 100%)", duration: 1.2, ease: "power4.inOut" },
          "-=0.9"
        )
        .fromTo(dividerRef.current, { scaleX: 0 }, { scaleX: 1, duration: 1, ease: "power3.inOut" }, "-=0.6")
        .fromTo(tagRef.current,     { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, "-=0.4")
        .fromTo(scrollRef.current,  { opacity: 0 }, { opacity: 1, duration: 0.6 }, "-=0.2");

      gsap.to(scrollRef.current, { y: 8, repeat: -1, yoyo: true, duration: 2, ease: "sine.inOut" });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="home"
      className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Video background — injected after first paint to avoid blocking FCP/LCP */}
      {showVideo && (
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="none"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ zIndex: 0, objectPosition: "center center" }}
        >
          <source src="/hero.mp4" type="video/mp4" />
        </video>
      )}

      {/* Static dark background — visible instantly while video loads */}
      {!showVideo && (
        <div
          className="absolute inset-0"
          style={{ zIndex: 0, background: "#000000" }}
        />
      )}

      {/* â”€â”€ Dark overlay â€” keeps text legible over the video â”€â”€â”€â”€â”€â”€â”€ */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 1,
          background: "linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.45) 50%, rgba(0,0,0,0.65) 100%)",
        }}
      />

      {/* â”€â”€ Ambient red glow (kept subtle under video) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full pointer-events-none"
        style={{
          zIndex: 2,
          background: "radial-gradient(circle, #FF0000 0%, transparent 65%)",
          opacity: 0.06,
        }}
      />

      {/* â”€â”€ Black cinematic border frame (the radga.com effect) â”€â”€â”€â”€â”€ */}
      {/* An inset border on all 4 sides creates the cinema-frame look */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 30,
          border: "clamp(10px, 1.6vw, 22px) solid #000000",
        }}
      />

      {/* â”€â”€ Corner accent brackets (inside the frame) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <div className="absolute pointer-events-none" style={{ top: "clamp(18px, 3vw, 40px)", left: "clamp(18px, 3vw, 40px)", width: 36, height: 36, borderTop: "1px solid rgba(255,255,255,0.25)", borderLeft: "1px solid rgba(255,255,255,0.25)", zIndex: 31 }} />
      <div className="absolute pointer-events-none" style={{ top: "clamp(18px, 3vw, 40px)", right: "clamp(18px, 3vw, 40px)", width: 36, height: 36, borderTop: "1px solid rgba(255,255,255,0.25)", borderRight: "1px solid rgba(255,255,255,0.25)", zIndex: 31 }} />
      <div className="absolute pointer-events-none" style={{ bottom: "clamp(18px, 3vw, 40px)", right: "clamp(18px, 3vw, 40px)", width: 36, height: 36, borderBottom: "1px solid rgba(255,255,255,0.25)", borderRight: "1px solid rgba(255,255,255,0.25)", zIndex: 31 }} />
      <div className="absolute pointer-events-none" style={{ bottom: "clamp(18px, 3vw, 40px)", left: "clamp(18px, 3vw, 40px)", width: 36, height: 36, borderBottom: "1px solid rgba(255,255,255,0.25)", borderLeft: "1px solid rgba(255,255,255,0.25)", zIndex: 31 }} />

      {/* â”€â”€ Year stamp â€” bottom left (inside frame) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <div className="absolute flex flex-col gap-1 pointer-events-none" style={{ bottom: "clamp(28px, 4vw, 52px)", left: "clamp(28px, 4vw, 52px)", zIndex: 31 }}>
        <span className="text-[9px] tracking-[0.4em] uppercase font-sans" style={{ color: "rgba(255,255,255,0.2)" }}>Est.</span>
        <span className="text-[11px] tracking-[0.2em] font-sans font-medium" style={{ color: "rgba(255,255,255,0.28)" }}>2016</span>
      </div>

      {/* â”€â”€ Floating stats â€” bottom right (inside frame) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <div className="absolute flex flex-col items-end gap-4 pointer-events-none" style={{ bottom: "clamp(28px, 4vw, 52px)", right: "clamp(28px, 4vw, 52px)", zIndex: 31 }}>
        {[
          { num: "200+", label: "Events"  },
          { num: "50+",  label: "Artists" },
          { num: "10+",  label: "Years"   },
        ].map((s) => (
          <div key={s.label} className="flex items-baseline gap-2">
            <span className="font-display text-base font-bold" style={{ color: "rgba(255,255,255,0.6)" }}>{s.num}</span>
            <span className="text-[9px] tracking-[0.25em] uppercase font-sans" style={{ color: "rgba(255,255,255,0.25)" }}>{s.label}</span>
          </div>
        ))}
      </div>

      {/* Main text content  */}
      <div
        ref={titleWrapRef}
        className="relative section-padding max-w-7xl mx-auto w-full text-center"
        style={{ zIndex: 20, display: "none" }}
      >
        {/* A7 */}
        <div ref={line1Ref} className="overflow-hidden">
          <h1 className="font-display font-bold tracking-tight leading-[0.85] text-foreground"
            style={{ fontSize: "clamp(5rem, 14vw, 12rem)" }}>
            A7
          </h1>
        </div>

        {/* Entertainment */}
        <div ref={line2Ref} className="overflow-hidden">
          <p className="font-display font-light text-foreground/90 uppercase leading-none mt-2 tracking-[0.2em]"
            style={{ fontSize: "clamp(1.5rem, 4.5vw, 4.5rem)" }}>
            Entertainment
          </p>
        </div>

        {/* Red divider */}
        <div
          ref={dividerRef}
          className="mx-auto mt-10 w-16 h-px bg-primary origin-center"
        />

        {/* Tagline */}
        <p
          ref={tagRef}
          className="mt-6 text-xs md:text-sm font-sans uppercase tracking-[0.35em]"
          style={{ color: "rgba(255,255,255,0.4)" }}
        >
          Creating experiences that move people
        </p>
      </div>

      {/*  Scroll indicator */}
      <div
        ref={scrollRef}
        className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 pointer-events-none"
        style={{ bottom: "clamp(28px, 4vw, 52px)", zIndex: 31 }}
      >
        <span className="text-[9px] tracking-[0.4em] uppercase font-sans" style={{ color: "rgba(255,255,255,0.3)" }}>
          Scroll
        </span>
        <div className="w-px h-10 bg-gradient-to-b from-white/30 to-transparent" />
      </div>
    </section>
  );
}
