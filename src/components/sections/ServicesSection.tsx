"use client";

import { useRef } from "react";
import { useScroll, useTransform, motion, MotionValue } from "framer-motion";

const cardBorderColors = [
  'rgba(255,0,0,0.70)',
  'rgba(255,0,0,0.55)',
  'rgba(255,0,0,0.42)',
  'rgba(255,0,0,0.32)',
  'rgba(255,0,0,0.24)',
  'rgba(255,0,0,0.18)',
  'rgba(255,0,0,0.13)',
  'rgba(255,0,0,0.09)',
  'rgba(255,0,0,0.06)',
];

const services = [
  { number: "01", title: "Celebrity Management",  description: "Connecting brands with the right faces. We manage talent, curate collaborations, and execute seamless celebrity engagements for events, endorsements, and campaigns.",                                                                         tag: "Talent & Brand",       color: "#000000" },
  { number: "02", title: "Movie Promotions",       description: "Creating buzz that converts into audience. From press meets to city tours and digital campaigns, we design promotional strategies that maximise reach and impact.",                                                                                  tag: "Film & Media",         color: "#050505" },
  { number: "03", title: "Influencer Marketing",   description: "Real voices. Real reach. We collaborate with influencers across platforms to build authentic brand stories through content, campaigns, and collaborations.",                                                                                          tag: "Digital & Social",     color: "#090909" },
  { number: "04", title: "Experiences That Scale", description: "From large-scale concerts to premium launches, we create high-energy experiences that bring audiences together. Every event is designed to engage, excite, and leave a lasting impression.",                                                         tag: "Live Events",          color: "#0d0d0d" },
  { number: "05", title: "Brand Launches",         description: "Making first impressions unforgettable. We design and execute launch experiences that position your brand exactly where it needs to be.",                                                                                                          tag: "Brand Experience",     color: "#111111" },
  { number: "06", title: "A7 Studio",              description: "A space built for creators. From professional shoots to podcast setups, our studio offers the perfect environment for high-quality content production.",                                                                                           tag: "Studio & Content",     color: "#141414" },
  { number: "07", title: "Content Production",     description: "Crafting visuals that stand out. From fashion campaigns to personal portfolios, we create content that reflects style, personality, and brand identity.",                                                                                         tag: "Creative Production",  color: "#171717" },
  { number: "08", title: "In The Spotlight",       description: "Our work has been featured across leading publications and media platforms, showcasing our impact across the industry.",                                                                                                                          tag: "Media & Press",        color: "#1a1a1a" },
  { number: "09", title: "Beyond Entertainment",   description: "We believe in giving back. Through collaborations and initiatives, we actively contribute to meaningful causes and community impact.",                                                                                                             tag: "Social Impact",        color: "#1d1d1d" },
];

interface CardProps {
  number: string;
  title: string;
  description: string;
  tag: string;
  color: string;
  i: number;
  progress: MotionValue<number>;
  range: [number, number];
  targetScale: number;
}

function ServiceCard({
  number,
  title,
  description,
  tag,
  color,
  i,
  progress,
  range,
  targetScale,
}: CardProps) {
  const container = useRef<HTMLDivElement>(null);

  const { scrollYProgress: cardProgress } = useScroll({
    target: container,
    offset: ["start end", "start start"],
  });

  const scale = useTransform(progress, range, [1, targetScale]);
  const lineWidth = useTransform(cardProgress, [0, 1], ["0%", "100%"]);

  return (
    <div
      ref={container}
      style={{
        height: "calc(100vh - 320px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "sticky",
        top: "0px",
      }}
    >
      <motion.div
        style={{
          scale,
          backgroundColor: color,
          position: "relative",
          transformOrigin: "center center",
          width: "100%",
          maxWidth: "1200px",
          borderRadius: "12px",
          padding: "3rem 3rem",
          minHeight: "360px",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          borderLeft: `4px solid ${cardBorderColors[i]}`,
        }}
        className="section-padding"
      >
        {/* Animated top accent line */}
        <motion.div
          style={{
            width: lineWidth,
            position: "absolute",
            top: 0,
            left: 0,
            height: "2px",
            backgroundColor: "#FF0000",
            borderRadius: "2px 0 0 0",
          }}
        />

        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] items-start gap-8 h-full">
          {/* Left: content */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <span className="text-[11px] tracking-[0.4em] uppercase text-[#C41E1E] font-sans">
                {tag}
              </span>
            </div>

            <h3 className="font-display text-3xl md:text-5xl lg:text-[3.2rem] font-bold leading-tight mb-4 text-[#F0F0F0]">
              {title}
            </h3>

            <p className="text-[#999] text-base md:text-lg leading-[1.9] max-w-2xl">
              {description}
            </p>
          </div>

          {/* Right: arrow */}
          <div className="hidden md:flex items-center gap-3 text-[#333] pb-2">
            <div className="w-8 h-px bg-[#2a2a2a]" />
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1}
            >
              <path d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>

        {/* Bottom hairline */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "1px",
            backgroundColor: "rgba(255, 255, 255, 0.04)",
          }}
        />
      </motion.div>
    </div>
  );
}

export function ServicesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const stackRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: stackRef,
    offset: ["start start", "end end"],
  });

  return (
    <section ref={sectionRef} id="services" className="relative w-full bg-[#FF0000]" style={{ zIndex: 1, paddingBottom: "8rem" }}>
      {/* Red marquee banner */}
      <div className="w-full overflow-hidden bg-[#FF0000] py-5">
        <div className="animate-marquee whitespace-nowrap flex gap-16">
          {Array(8)
            .fill(null)
            .map((_, i) => (
              <span
                key={i}
                className="text-[11px] tracking-[0.5em] uppercase text-white/70 font-sans"
              >
                Events &nbsp;&#183;&nbsp; Concerts &nbsp;&#183;&nbsp; Film
                &nbsp;&#183;&nbsp; Corporate &nbsp;&#183;&nbsp; Production
                &nbsp;&#183;&nbsp; Management
              </span>
            ))}
        </div>
      </div>

      {/* Section heading */}
      <div
        className="section-padding"
        style={{ paddingTop: "4rem", paddingBottom: "1.5rem" }}
      >
        <div className="max-w-7xl mx-auto">
          <span className="text-[11px] tracking-[0.4em] uppercase text-white/80 font-sans block mb-3">
            Services
          </span>
          <h2 className="font-display text-4xl md:text-6xl lg:text-[5rem] font-bold leading-[1.05] text-white">
            What We
            <br />
            Deliver
          </h2>
          <p className="mt-4 text-white/60 text-base md:text-lg font-sans">
            End-to-end solutions across entertainment, events, and media.
          </p>
        </div>
      </div>

      {/* Card stack */}
      <div ref={stackRef}>
        {services.map((service, i) => {
          const targetScale = 1 - (services.length - i) * 0.02;
          return (
            <ServiceCard
              key={service.number}
              {...service}
              i={i}
              progress={scrollYProgress}
              range={[i / services.length, 1]}
              targetScale={targetScale}
            />
          );
        })}
      </div>
    </section>
  );
}
