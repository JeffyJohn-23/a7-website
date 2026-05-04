"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Reveal-up elements
      const elements = sectionRef.current?.querySelectorAll(".reveal-up");
      elements?.forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 30 },
          {
            scrollTrigger: {
              trigger: el,
              start: "top 88%",
            },
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
          }
        );
      });

      // Heading word-by-word stagger
      const words = sectionRef.current?.querySelectorAll(".word-reveal");
      if (words?.length) {
        gsap.fromTo(
          words,
          { opacity: 0.4 },
          {
            opacity: 1,
            stagger: 0.1,
            scrollTrigger: {
              trigger: sectionRef.current?.querySelector(".heading-wrap"),
              start: "top 80%",
              end: "top 40%",
              scrub: 1,
            },
          }
        );
      }

      // Counter animation — restart every time the section enters the viewport
      const counters = sectionRef.current?.querySelectorAll("[data-count]");
      let counterTweens: gsap.core.Tween[] = [];

      const startCounters = () => {
        // Kill any in-progress counter tweens so values don't overlap
        counterTweens.forEach((t) => t.kill());
        counterTweens = [];

        counters?.forEach((el) => {
          const elH = el as HTMLElement;
          elH.textContent = "0"; // reset display to 0 before animating
          const target = parseInt(elH.getAttribute("data-count") || "0", 10);
          const proxy = { val: 0 };
          const tween = gsap.to(proxy, {
            val: target,
            duration: 2,
            ease: "power2.out",
            onUpdate: () => {
              elH.textContent = Math.round(proxy.val).toString();
            },
          });
          counterTweens.push(tween);
        });
      };

      // Single ScrollTrigger on the section — fires on every enter (down & up)
      if (sectionRef.current) {
        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: "top 80%",
          onEnter: startCounters,
          onEnterBack: startCounters,
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative w-full min-h-screen section-padding bg-white"
      style={{ paddingTop: '7rem', paddingBottom: '5rem' }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Label */}
        <div className="reveal-up mb-6">
          <span className="text-[11px] tracking-[0.4em] uppercase text-primary font-sans">
            About Us
          </span>
        </div>

        {/* Heading — word-by-word opacity reveal */}
        <div className="heading-wrap mb-24 max-w-5xl">
          <h2 className="font-display text-4xl md:text-6xl lg:text-[5rem] font-bold leading-[1.05] text-black">
            {"Who We Are".split(" ").map((word, i, arr) => (
              <span key={i}>
                <span className="word-reveal">{word}</span>
                {i < arr.length - 1 ? " " : ""}
              </span>
            ))}
          </h2>
        </div>

        {/* Content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr_1.2fr] gap-12 lg:gap-8" style={{ marginBottom: '5rem' }}>
          <div className="reveal-up">
            <p className="text-[#444] text-base md:text-lg leading-[1.8]">
              A7 Entertainment is a fully integrated event and media company
              with over a decade of industry experience. We specialize in
              crafting impactful experiences across events, entertainment, and
              digital media — driven by a team of seasoned professionals.
            </p>
          </div>
          <div className="reveal-up">
            <p className="text-[#444] text-base md:text-lg leading-[1.8]">
              From concept to execution, we turn ideas into experiences that
              connect, engage, and leave a mark.
            </p>
          </div>

          {/* Third column: media visual */}
          <div className="reveal-up hidden lg:block relative" style={{ minHeight: '320px' }}>
            <div className="relative w-full h-full rounded-sm overflow-hidden" style={{ minHeight: '320px' }}>
              <Image
                src="/gallery/red-silhouettes.jpg"
                alt="A7 Entertainment event production"
                fill
                className="object-cover grayscale hover:grayscale-0 transition-all duration-700"
                sizes="(min-width: 1024px) 33vw, 100vw"
              />
              <div className="absolute inset-0 bg-black/20 pointer-events-none" />
              <div className="absolute bottom-4 left-4">
                <span className="text-[9px] tracking-[0.4em] uppercase text-white/50 font-sans">Live Production</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-16 border-t border-black/[0.1]" style={{ paddingTop: '4rem', paddingBottom: '2rem' }}>
          {[
            { count: 200, suffix: "+", label: "Events Produced" },
            { count: 50, suffix: "+", label: "Artists Managed" },
            { count: 10, suffix: "+", label: "Years Experience" },
            { count: 15, suffix: "M+", label: "Audience Reached" },
          ].map(({ count, suffix, label }) => (
            <div key={label} className="reveal-up">
              <div className="font-display text-4xl md:text-5xl font-bold text-black">
                <span data-count={count}>0</span>
                <span className="text-[#FF0000]">{suffix}</span>
              </div>
              <p className="mt-3 text-[11px] tracking-[0.2em] uppercase text-[#888]">
                {label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
