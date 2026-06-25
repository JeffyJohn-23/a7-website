"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";

gsap.registerPlugin(ScrollTrigger);

const stats = [
  { count: 200, suffix: "+",  label: "Events Produced" },
  { count: 50,  suffix: "+",  label: "Artists Managed" },
  { count: 10,  suffix: "+",  label: "Years Active"    },
  { count: 15,  suffix: "M+", label: "Audience Reached"},
];

const pillars = [
  {
    num: "01",
    title: "Proven at Scale",
    body: "200+ events delivered — from intimate corporate summits to 50,000-person concerts across India and the UAE.",
  },
  {
    num: "02",
    title: "End-to-End Thinking",
    body: "Concept, talent, production, and digital amplification — all under one roof, all moving in the same direction.",
  },
  {
    num: "03",
    title: "A Decade of Trust",
    body: "10+ years building landmark experiences for brands that refuse to settle for ordinary.",
  },
];

export function AboutSection() {
  const sectionRef  = useRef<HTMLElement>(null);
  const quoteRef    = useRef<HTMLDivElement>(null);
  const openerRef   = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Reveal-up scroll entries
      sectionRef.current?.querySelectorAll(".reveal-up").forEach((el) => {
        gsap.fromTo(el,
          { opacity: 0, y: 30 },
          {
            opacity: 1, y: 0, duration: 0.85, ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 88%" },
          }
        );
      });

      // Word-by-word scrub heading
      const words = sectionRef.current?.querySelectorAll(".word-reveal");
      if (words?.length) {
        gsap.fromTo(words,
          { opacity: 0.2 },
          {
            opacity: 1, stagger: 0.1,
            scrollTrigger: {
              trigger: sectionRef.current?.querySelector(".heading-wrap"),
              start: "top 80%", end: "top 35%", scrub: 1,
            },
          }
        );
      }

      // Opening belief statement — clip reveal from below
      if (openerRef.current) {
        gsap.fromTo(openerRef.current,
          { opacity: 0, y: 40, clipPath: "inset(0 0 100% 0)" },
          {
            opacity: 1, y: 0, clipPath: "inset(0 0 0% 0)",
            duration: 1.1, ease: "power3.out",
            scrollTrigger: { trigger: openerRef.current, start: "top 88%" },
          }
        );
      }

      // Pull quote fade in
      if (quoteRef.current) {
        gsap.fromTo(quoteRef.current,
          { opacity: 0, y: 24 },
          {
            opacity: 1, y: 0, duration: 1, ease: "power2.out",
            scrollTrigger: { trigger: quoteRef.current, start: "top 85%" },
          }
        );
      }

      // Counter animation — restarts on re-enter
      const counters = sectionRef.current?.querySelectorAll("[data-count]");
      let tweens: gsap.core.Tween[] = [];
      const startCounters = () => {
        tweens.forEach((t) => t.kill());
        tweens = [];
        counters?.forEach((el) => {
          const elH = el as HTMLElement;
          elH.textContent = "0";
          const target = parseInt(elH.getAttribute("data-count") || "0", 10);
          const proxy = { val: 0 };
          tweens.push(
            gsap.to(proxy, {
              val: target, duration: 2.2, ease: "power2.out",
              onUpdate: () => { elH.textContent = Math.round(proxy.val).toString(); },
            })
          );
        });
      };
      if (sectionRef.current) {
        ScrollTrigger.create({
          trigger: sectionRef.current, start: "top 80%",
          onEnter: startCounters, onEnterBack: startCounters,
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative w-full bg-white overflow-hidden"
      style={{ paddingTop: "7rem", paddingBottom: "6rem" }}
    >
      {/* Dot grid texture — Strawberry Group "dot motif" */}
      <div
        className="absolute inset-0 pointer-events-none select-none"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(0,0,0,0.055) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          zIndex: 0,
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 section-padding max-w-7xl mx-auto">

        {/* ── Section label + rule ── */}
        <div className="reveal-up flex items-center gap-6 mb-16">
          <span className="text-[11px] tracking-[0.5em] uppercase text-[#FF0000] font-sans shrink-0">
            About A7
          </span>
          <div className="flex-1 h-px bg-black/10" />
        </div>

        {/* ── Opening belief statement ── */}
        <div ref={openerRef} className="mb-20" style={{ opacity: 0 }}>
          <p
            className="font-display font-black text-[#0a0a0a] leading-[1.05]"
            style={{ fontSize: "clamp(2.4rem, 6.5vw, 5rem)" }}
          >
            Architects of
            <br />
            {/* can fill a stadium.
            <br /> */}
            <span className="text-[#FF0000]">Extraordinary Experiences.</span>
          </p>
        </div>

        {/* ── Word-by-word heading ── */}
        <div className="heading-wrap mb-12 max-w-3xl">
          <h2
            className="font-display font-bold leading-[1.05] text-[#0a0a0a]"
            style={{ fontSize: "clamp(2.2rem, 5vw, 4.2rem)" }}
          >
            {"Who We Are".split(" ").map((word, i, arr) => (
              <span key={i}>
                <span className="word-reveal">{word}</span>
                {i < arr.length - 1 ? " " : ""}
              </span>
            ))}
          </h2>
        </div>

        {/* ── 2-col text + image ── */}
        <div
          className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-12 lg:gap-30 items-start"
          style={{ marginBottom: "2rem", marginTop: "3rem" }}
        >
          <div className="space-y-6">
            <p className="reveal-up text-[#3a3a3a] text-base md:text-lg leading-[1.9]">
              A7 Entertainment is a globally connected experiential marketing and event management powerhouse trusted by brands that refuse to blend in.
              <br />
              <br />
              For over fifteen years, we have designed immersive experiences, orchestrated iconic events, secured influential partnerships, and delivered strategic marketing campaigns that captivate audiences and elevate brand perception.
              
            </p>
            {/* <p className="reveal-up text-[#666] text-base leading-[1.85]">
              <br />
              From concept to execution, we turn ideas into experiences that
              connect, engage, and leave a mark. Our work spans - India
              and Globally.
            </p> */}
          </div>

          {/* Image panel */}
          <div className="reveal-up hidden lg:block relative" style={{ minHeight: "280px" }}>
            <div
              className="relative w-full h-full overflow-hidden"
              style={{ minHeight: "340px", borderRadius: "2px" }}
            >
              <Image
                src="/gallery/red-silhouettes.jpg"
                alt="Live event production by A7 Entertainment"
                fill
                className="object-cover grayscale hover:grayscale-0 transition-all duration-700"
                sizes="(min-width: 1024px) 45vw, 100vw"
              />
              <div className="absolute inset-0 bg-black/20 pointer-events-none" />
              {/* Corner bracket accent */}
              <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-white/40 pointer-events-none" />
              <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-white/40 pointer-events-none" />
              <div className="absolute bottom-4 left-4 z-10">
                {/* <span className="text-[9px] tracking-[0.4em] uppercase text-white/55 font-sans bg-black/30 px-2 py-0.5">
                  Live Production
                </span> */}
              </div>
            </div>
          </div>
        </div>

        {/* ── Pull quote — editorial break ── */}
        {/* <div
          ref={quoteRef}
          className="relative border-l-[3px] border-[#FF0000] pl-8 py-3 mt-20 mb-14"
          style={{ opacity: 0 }}
        >
          <p
            className="font-serif italic font-bold text-[#0a0a0a] leading-[1.35]"
            style={{ fontSize: "clamp(1.3rem, 3vw, 2.2rem)" , marginTop: "4rem" }}
          >
            &ldquo;From concept to curtain call, we are with you at every step —
            because the details are everything.&rdquo;
          </p>
          <p className="mt-4 text-[10px] tracking-[0.4em] uppercase text-[#999] font-sans">
            A7 Entertainment — Est. 2016
          </p>
        </div> */}

        {/* ── Editorial pillar list ── */}
        {/* <div className="mb-20 divide-y divide-black/[0.07]">
          {pillars.map((p, i) => (
            <motion.div
              key={p.num}
              className="group flex flex-col sm:flex-row items-start sm:items-center gap-5 py-7"
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.52, delay: i * 0.1, ease: "easeOut" }}
            > */}
              {/* Number */}
              {/* <span
                className="font-display font-bold text-[#FF0000] shrink-0 tabular-nums"
                style={{ fontSize: "clamp(0.7rem, 1.1vw, 0.8rem)", letterSpacing: "0.15em", minWidth: "2.5rem" }}
              >
                {p.num}
              </span> */}
              {/* Animated divider line */}
              {/* <div className="w-6 h-px bg-black/15 shrink-0 hidden sm:block group-hover:w-14 group-hover:bg-[#FF0000] transition-all duration-350" /> */}
              {/* Content */}
              {/* <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-10 flex-1">
                <p
                  className="font-display font-bold text-[#0a0a0a] shrink-0 group-hover:text-[#FF0000] transition-colors duration-300"
                  style={{ fontSize: "clamp(1rem, 2vw, 1.2rem)" }}
                >
                  {p.title}
                </p>
                <p className="text-[#777] leading-[1.75]" style={{ fontSize: "clamp(0.8rem, 1.3vw, 0.9rem)" }}>
                  {p.body}
                </p>
              </div> */}
              {/* Arrow indicator */}
              {/* <span className="text-black/15 group-hover:text-[#FF0000] group-hover:translate-x-1 transition-all duration-300 hidden sm:block">
                →
              </span>
            </motion.div>
          ))}
        </div> */}

        {/* ── Stats — large editorial numbers ── */}
        <div
          className="grid grid-cols-2 md:grid-cols-4 border-t border-black/[0.08]"
          style={{ paddingTop: "4rem" }}
        >
          {stats.map(({ count, suffix, label }, i) => (
            <motion.div
              key={label}
              className="reveal-up flex flex-col gap-4 pr-6 md:pr-12 pb-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.55, delay: i * 0.08, ease: "easeOut" }}
            >
              <div
                className="font-display font-black leading-none tabular-nums text-[#0a0a0a]"
                style={{ fontSize: "clamp(3.2rem, 8vw, 6rem)" }}
              >
                <span data-count={count}>0</span>
                <span className="text-[#FF0000]">{suffix}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-5 h-[2px] bg-[#FF0000]" />
                <p className="text-[10px] tracking-[0.28em] uppercase text-[#888] font-sans">{label}</p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
