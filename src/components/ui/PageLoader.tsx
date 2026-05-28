"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";

interface Props {
  onComplete: () => void;
}

export function PageLoader({ onComplete }: Props) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const logoRef    = useRef<HTMLDivElement>(null);
  const lineRef    = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cb = onComplete;
    const ctx = gsap.context(() => {
      gsap.timeline({ onComplete: cb })
        .fromTo(logoRef.current,
          { opacity: 0, scale: 0.78, y: 14 },
          { opacity: 1, scale: 1, y: 0, duration: 0.75, ease: "power3.out" }
        )
        .fromTo(lineRef.current,
          { scaleX: 0 },
          { scaleX: 1, duration: 0.5, ease: "power2.inOut" },
          "-=0.3"
        )
        .to({}, { duration: 0.55 })
        .to(overlayRef.current,
          { opacity: 0, duration: 0.6, ease: "power2.inOut" }
        );
    });
    return () => ctx.revert();
  }, [onComplete]);

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[9990] flex flex-col items-center justify-center bg-black pointer-events-none select-none"
      aria-hidden="true"
    >
      <div ref={logoRef} style={{ opacity: 0 }}>
        <Image
          src="/logo-white.png"
          alt=""
          width={280}
          height={186}
          priority
          style={{ width: "clamp(110px, 16vw, 200px)", height: "auto", display: "block" }}
        />
      </div>
      <div
        ref={lineRef}
        className="mt-5 h-px bg-[#FF0000]"
        style={{ width: "clamp(56px, 7vw, 90px)", transformOrigin: "center" }}
      />
    </div>
  );
}
