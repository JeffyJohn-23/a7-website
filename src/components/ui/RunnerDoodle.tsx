"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function RunnerDoodle() {
  const spotRef = useRef<HTMLDivElement>(null);
  const beamRef = useRef<SVGGElement>(null);
  const lensRef = useRef<SVGCircleElement>(null);
  const glowRef = useRef<SVGEllipseElement>(null);

  useEffect(() => {
    const spot = spotRef.current;
    if (!spot) return;

    gsap.set(beamRef.current, { svgOrigin: "28 8" });
    const sway = gsap.to(beamRef.current, {
      rotation: 8,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });

    const flicker = gsap.to(lensRef.current, {
      opacity: 0.4,
      duration: 0.1,
      repeat: -1,
      yoyo: true,
      ease: "none",
      repeatDelay: 2.2,
    });

    gsap.set(glowRef.current, { transformOrigin: "28px 70px" });
    const pulse = gsap.to(glowRef.current, {
      scaleX: 1.4,
      opacity: 0.8,
      duration: 1,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });

    gsap.set(spot, { x: 0 });

    const getMax = () => Math.max(window.innerWidth - 60, 0);
    const getEnd = () => {
      const contact = document.getElementById("contact");
      return contact ? contact.offsetTop : document.body.scrollHeight;
    };

    const st = ScrollTrigger.create({
      trigger: document.body,
      start: "top top",
      end: getEnd,
      scrub: 1.2,
      onUpdate: (self) => {
        gsap.set(spot, { x: self.progress * getMax() });
      },
    });

    const onResize = () => st.refresh();
    window.addEventListener("resize", onResize);

    return () => {
      sway.kill();
      flicker.kill();
      pulse.kill();
      st.kill();
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div
      className="pointer-events-none fixed bottom-0 left-0 right-0 z-50 hidden sm:block"
      aria-hidden
    >
      <div
        style={{
          height: "1px",
          background:
            "linear-gradient(to right, transparent 0%, #FF0000 6%, #FF0000 94%, transparent 100%)",
          opacity: 0.28,
        }}
      />
      <div
        ref={spotRef}
        style={{ position: "absolute", bottom: "1px", left: "0px", width: "56px" }}
      >
        <svg
          width="56"
          height="76"
          viewBox="0 0 56 76"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          overflow="visible"
        >
          <defs>
            <linearGradient id="spBeam" x1="0.5" y1="0" x2="0.5" y2="1">
              <stop offset="0%" stopColor="#FF0000" stopOpacity="0.03" />
              <stop offset="100%" stopColor="#FF0000" stopOpacity="0.22" />
            </linearGradient>
            <radialGradient id="spGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FF0000" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#FF0000" stopOpacity="0" />
            </radialGradient>
          </defs>
          <g ref={beamRef}>
            <polygon points="28,10 2,74 54,74" fill="url(#spBeam)" />
          </g>
          <ellipse ref={glowRef} cx="28" cy="74" rx="26" ry="5" fill="url(#spGlow)" />
          <rect x="14" y="1" width="28" height="14" rx="5" stroke="#FF0000" strokeWidth="1.4" />
          <circle cx="19" cy="8" r="1.2" fill="#FF0000" opacity="0.5" />
          <circle cx="37" cy="8" r="1.2" fill="#FF0000" opacity="0.5" />
          <circle cx="28" cy="8" r="5.5" stroke="#FF0000" strokeWidth="1.2" />
          <circle ref={lensRef} cx="28" cy="8" r="3" fill="#FF0000" />
          <line x1="19" y1="1" x2="17" y2="-4" stroke="#FF0000" strokeWidth="1" strokeOpacity="0.35" />
          <line x1="37" y1="1" x2="39" y2="-4" stroke="#FF0000" strokeWidth="1" strokeOpacity="0.35" />
          <line x1="28" y1="1" x2="28" y2="-5" stroke="#FF0000" strokeWidth="1" strokeOpacity="0.35" />
        </svg>
      </div>
    </div>
  );
}