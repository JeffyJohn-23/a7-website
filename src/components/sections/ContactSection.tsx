"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";

gsap.registerPlugin(ScrollTrigger);

const doodles = [
  {
    id: "stage",
    label: "Live Stage",
    viewBox: "0 0 100 90",
    paths: [
      "M5 72 L95 72 L95 82 L5 82 Z",
      "M5 5 Q10 30 5 55 Q18 42 22 72",
      "M95 5 Q90 30 95 55 Q82 42 78 72",
      "M18 8 L32 70 L8 70 Z",
      "M82 8 L68 70 L92 70 Z",
      "M50 4 L60 70 L40 70 Z",
      "M50 46 Q50 40 56 40 Q62 40 62 46 Q62 52 56 52 Q50 52 50 46 Z",
      "M53 52 L53 66 M59 52 L59 66",
      "M53 56 L42 62 M59 56 L70 62",
      "M28 20 L29 16 L30 20 L34 21 L30 22 L29 26 L28 22 L24 21 Z",
      "M68 14 L69 11 L70 14 L73 15 L70 16 L69 19 L68 16 L65 15 Z",
    ],
  },
  {
    id: "toast",
    label: "Celebration",
    viewBox: "0 0 90 90",
    paths: [
      "M20 8 L14 46 Q14 50 22 50 L28 50 Q36 50 36 46 L30 8 Z",
      "M25 50 L25 70",
      "M16 70 L34 70",
      "M60 8 L54 46 Q54 50 62 50 L68 50 Q76 50 76 46 L70 8 Z",
      "M65 50 L65 70",
      "M56 70 L74 70",
      "M43 6 L45 2 M47 6 L45 2",
      "M22 44 Q22 40 25 40 Q28 40 28 44",
      "M23 35 Q23 32 25 32 Q27 32 27 35",
      "M24 26 Q24 24 25 24 Q26 24 26 26",
      "M62 44 Q62 40 65 40 Q68 40 68 44",
      "M63 35 Q63 32 65 32 Q67 32 67 35",
      "M45 18 L46.2 14 L47.4 18 L51 19 L47.4 20 L46.2 24 L45 20 L41 19 Z",
    ],
  },
  {
    id: "camera",
    label: "Film & Media",
    viewBox: "0 0 100 80",
    paths: [
      "M8 22 Q8 16 14 16 L66 16 Q72 16 72 22 L72 62 Q72 68 66 68 L14 68 Q8 68 8 62 Z",
      "M24 16 L24 10 L42 10 L42 16",
      "M28 42 Q28 26 40 26 Q52 26 52 42 Q52 58 40 58 Q28 58 28 42 Z",
      "M32 42 Q32 30 40 30 Q48 30 48 42 Q48 54 40 54 Q32 54 32 42 Z",
      "M36 42 Q36 35 40 35 Q44 35 44 42 Q44 49 40 49 Q36 49 36 42 Z",
      "M72 26 L88 20 L88 64 L72 58",
      "M76 28 L80 28 L80 32 L76 32 Z",
      "M76 38 L80 38 L80 42 L76 42 Z",
      "M76 48 L80 48 L80 52 L76 52 Z",
    ],
  },
  {
    id: "trophy",
    label: "Awards & Gala",
    viewBox: "0 0 90 100",
    paths: [
      "M20 8 L70 8 L70 44 Q70 64 45 64 Q20 64 20 44 Z",
      "M20 16 Q8 16 8 28 Q8 40 20 40",
      "M70 16 Q82 16 82 28 Q82 40 70 40",
      "M36 64 L36 76 M54 64 L54 76",
      "M36 76 L54 76",
      "M24 76 L66 76 L66 86 L24 86 Z",
      "M18 86 L72 86 L72 94 L18 94 Z",
      "M45 28 L47.2 21 L49.4 28 L56 28 L50.8 32.4 L53 39 L45 35 L37 39 L39.2 32.4 L34 28 Z",
      "M32 14 Q30 22 30 30",
    ],
  },
];

const fields = [
  { name: "name", label: "Your Name", type: "text" },
  { name: "email", label: "Your Email", type: "email" },
  { name: "subject", label: "Subject", type: "text" },
];

export function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const doodleRefs = useRef<(SVGSVGElement | null)[]>([]);
  const doodleStrip = useRef<HTMLDivElement>(null);
  const [focused, setFocused] = useState<string | null>(null);
  const [formState, setFormState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormState('loading');
    await new Promise(resolve => setTimeout(resolve, 1500));
    setFormState('success');
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      sectionRef.current?.querySelectorAll(".reveal-up").forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.85,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 90%" },
          }
        );
      });

      if (doodleStrip.current) {
        gsap.fromTo(
          doodleStrip.current,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: "power2.out",
            scrollTrigger: { trigger: doodleStrip.current, start: "top 92%" },
            onComplete: () => {
              doodleRefs.current.forEach((svg, si) => {
                if (!svg) return;
                svg.querySelectorAll("path").forEach((path, pi) => {
                  const len = path.getTotalLength();
                  gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
                  gsap.to(path, {
                    strokeDashoffset: 0,
                    duration: 1.4,
                    ease: "power2.inOut",
                    delay: si * 0.15 + pi * 0.06,
                  });
                });
              });
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative w-full bg-white section-padding"
      style={{ paddingTop: "9rem", paddingBottom: "7rem" }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="reveal-up flex items-center gap-6 mb-20">
          <span className="text-[11px] tracking-[0.5em] uppercase text-[#FF0000] font-sans shrink-0">
            Contact
          </span>
          <div className="flex-1 h-px bg-black/10" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-start mb-32">
          <div className="reveal-up">
            <h2 className="font-display text-5xl md:text-6xl lg:text-[5rem] font-bold leading-[1.06] text-[#0a0a0a] mb-8">
              Let&apos;s Create
              <br />
              Something
              <br />
              <span className="text-[#FF0000]">Unforgettable</span>
            </h2>

            <div className="w-14 h-[3px] bg-[#FF0000] mb-8" />

            <p className="text-[#3a3a3a] text-[15px] leading-[1.85] mb-12 max-w-[22rem]">
              Ready to transform your vision into an extraordinary experience?
              Reach out and let&apos;s start the conversation.
            </p>

            <div className="space-y-5">
              <a href="mailto:hello@a7entertainment.com" className="flex items-center gap-4 group">
                <div className="w-8 h-px bg-black/25 group-hover:bg-[#FF0000] group-hover:w-12 transition-all duration-300" />
                <span className="text-[13px] text-[#2a2a2a] group-hover:text-black transition-colors duration-300 font-medium">
                  hello@a7entertainment.com
                </span>
              </a>
              <a href="tel:+15550000000" className="flex items-center gap-4 group">
                <div className="w-8 h-px bg-black/25 group-hover:bg-[#FF0000] group-hover:w-12 transition-all duration-300" />
                <span className="text-[13px] text-[#2a2a2a] group-hover:text-black transition-colors duration-300 font-medium">
                  +1 (555) 000-0000
                </span>
              </a>
            </div>
          </div>

          <div className="reveal-up">
            {formState === 'success' ? (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col gap-4 pt-8"
              >
                <div className="w-10 h-px bg-[#FF0000]" />
                <p className="font-display text-2xl font-bold text-[#0a0a0a]">Message received.</p>
                <p className="text-[#666] text-sm leading-[1.8]">We&apos;ll be in touch within 24 hours.</p>
                <button onClick={() => setFormState('idle')} className="text-[11px] tracking-[0.3em] uppercase text-[#FF0000] hover:underline mt-2 text-left">
                  Send another
                </button>
              </motion.div>
            ) : (
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col gap-10">
                {fields.map((field) => (
                  <div key={field.name} className="flex flex-col gap-2">
                    <label className="text-[11px] tracking-[0.25em] uppercase text-[#1a1a1a] font-sans font-semibold">
                      {field.label}
                    </label>
                    <input
                      type={field.type}
                      className="w-full bg-transparent border-b-2 border-black/15 pb-3 pt-1 text-[#111] text-sm focus:outline-none focus:border-[#FF0000] transition-colors duration-300"
                      onFocus={() => setFocused(field.name)}
                      onBlur={() => setFocused(null)}
                    />
                  </div>
                ))}

                <div className="flex flex-col gap-2">
                  <label className="text-[11px] tracking-[0.25em] uppercase text-[#1a1a1a] font-sans font-semibold">
                    Your Message
                  </label>
                  <textarea
                    rows={5}
                    className="w-full bg-transparent border-b-2 border-black/15 pb-3 pt-1 text-[#111] text-sm focus:outline-none focus:border-[#FF0000] transition-colors duration-300 resize-none"
                    onFocus={() => setFocused("message")}
                    onBlur={() => setFocused(null)}
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={formState === 'loading'}
                    className="group relative px-12 py-4 border-2 border-black text-black text-[11px] tracking-[0.3em] uppercase overflow-hidden transition-all duration-500 hover:border-[#FF0000] disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    <span className="relative z-10 group-hover:text-white transition-colors duration-500 flex items-center gap-3">
                      {formState === 'loading' && (
                        <span className="w-4 h-4 rounded-full border-2 border-black/20 border-t-black animate-spin inline-block" />
                      )}
                      {formState === 'loading' ? 'Sending...' : 'Send Message'}
                    </span>
                    <div className="absolute inset-0 bg-[#FF0000] -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out" />
                  </button>
                  {formState === 'error' && (
                    <p className="text-[11px] text-[#FF0000] mt-3">Something went wrong. Please try again.</p>
                  )}
                </div>
              </div>
            </form>
            )}
          </div>
        </div>

        <div ref={doodleStrip} className="border-t border-black/10 pt-40 mt-24">
          <p className="text-[10px] tracking-[0.4em] uppercase text-[#1a1a1a] font-sans mb-16 text-center">
            What We Do
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
            {doodles.map((d, i) => (
              <div
                key={d.id}
                className="group flex flex-col items-center gap-4 p-6 rounded-2xl border border-black/[0.07] bg-[#f8f8f8] hover:border-[#FF0000]/40 hover:bg-white transition-all duration-300 cursor-default"
              >
                <svg
                  ref={(el) => {
                    doodleRefs.current[i] = el;
                  }}
                  viewBox={d.viewBox}
                  className="w-16 h-16"
                  fill="none"
                  stroke="#111"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {d.paths.map((p, j) => (
                    <path key={j} d={p} />
                  ))}
                </svg>
                <span className="text-[10px] tracking-[0.3em] uppercase text-[#1a1a1a] font-sans text-center group-hover:text-[#FF0000] transition-colors duration-300">
                  {d.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}