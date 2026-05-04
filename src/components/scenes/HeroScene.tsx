"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

interface HeroSceneProps {
  title: string;
  subtitle?: string;
  cta?: {
    primary: string;
    secondary?: string;
  };
}

export function HeroScene({ title, subtitle, cta }: HeroSceneProps) {
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const ctaRef = useRef(null);

  useEffect(() => {
    const timeline = gsap.timeline();

    timeline
      .from(titleRef.current, {
        opacity: 0,
        y: 30,
        duration: 0.8,
      })
      .from(
        subtitleRef.current,
        {
          opacity: 0,
          y: 20,
          duration: 0.6,
        },
        "-=0.4"
      )
      .from(
        ctaRef.current,
        {
          opacity: 0,
          y: 20,
          duration: 0.6,
        },
        "-=0.4"
      );
  }, []);

  return (
    <section className="min-h-screen w-full bg-background text-white flex flex-col items-center justify-center px-6">
      <div className="max-w-4xl text-center">
        <h1
          ref={titleRef}
          className="text-6xl md:text-7xl font-bold mb-6 leading-tight"
        >
          {title}
        </h1>
        {subtitle && (
          <p
            ref={subtitleRef}
            className="text-xl md:text-2xl text-gray-300 mb-8"
          >
            {subtitle}
          </p>
        )}
        {cta && (
          <div ref={ctaRef} className="flex gap-4 justify-center flex-wrap">
            <button className="px-8 py-4 bg-primary text-white font-semibold hover:brightness-110 transition-all">
              {cta.primary}
            </button>
            {cta.secondary && (
              <button className="px-8 py-4 bg-accent text-white font-semibold border border-primary hover:bg-primary transition-all">
                {cta.secondary}
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
