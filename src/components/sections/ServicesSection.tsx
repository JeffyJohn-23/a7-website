"use client";

import { useRef } from "react";
import { useScroll, useTransform, motion, MotionValue } from "framer-motion";

const services = [
  {
    number: "01",
    title: "Celebrity Management",
    tag: "Talent & Brand",
    description:
      "We connect your brand with the right faces. From talent identification and contract negotiations to on-ground coordination, our celebrity management arm ensures seamless, impactful engagements — for events, endorsements, and large-scale campaigns.",
    highlights: [
      "Talent sourcing & contract management",
      "National & international artist booking",
      "On-site celebrity coordination",
      "Celebrity booking for corporate events",
    ],
    color: "#000000",
    accentHue: "60, 0, 0",
  },
  {
    number: "02",
    title: "Movie Promotions",
    tag: "Film & Media",
    description:
      "We turn film releases into cultural moments. From press meets and city tours to digital campaigns and fan events, our promotional strategies are engineered for maximum reach and genuine audience connection.",
    highlights: [
      "Press meets & media events",
      "Pan-India city promotional tours",
      "Digital & social media campaigns",
      "Fan engagement & theatrical experiences",
    ],
    color: "#050505",
    accentHue: "80, 0, 0",
  },
  {
    number: "03",
    title: "Influencer Marketing",
    tag: "Digital & Social",
    description:
      "Real voices. Authentic reach. We collaborate with carefully selected influencers across Instagram, YouTube, and emerging platforms to build brand stories that resonate. Every campaign is measurable and built for real ROI.",
    highlights: [
      "Influencer identification & vetting",
      "Campaign strategy & creative briefs",
      "Multi-platform content execution",
      "Performance tracking & analytics",
    ],
    color: "#090909",
    accentHue: "60, 0, 0",
  },
  {
    number: "04",
    title: "Corporate Events",
    tag: "Corporate & B2B",
    description:
      "From boardroom to ballroom. We design and execute end-to-end corporate experiences — conferences, product launches, award ceremonies, and leadership summits — that drive engagement and reinforce your brand's authority and prestige.",
    highlights: [
      "Corporate conference management",
      "Product launch events",
      "Award ceremonies & gala dinners",
      "Corporate event management in Kerala",
    ],
    color: "#0d0d0d",
    accentHue: "70, 0, 0",
  },
  {
    number: "05",
    title: "Brand Activations",
    tag: "Brand Experience",
    description:
      "First impressions last. We design immersive brand activation experiences — experiential pop-ups, interactive installations, and sponsored activations — that create genuine emotional connections between your brand and your audience.",
    highlights: [
      "Experiential pop-up events",
      "Interactive brand installations",
      "Retail & mall activations",
      "Brand activation campaigns for businesses",
    ],
    color: "#111111",
    accentHue: "80, 0, 0",
  },
  {
    number: "06",
    title: "A7 Studio",
    tag: "Studio & Content",
    description:
      "A professional creative space built for brands and creators. A7 Studio offers high-quality shoot spaces, podcast recording setups, and post-production support — giving your content the production value it deserves.",
    highlights: [
      "Professional photography & video shoots",
      "Podcast & audio production",
      "Post-production & editing",
      "Brand content creation services",
    ],
    color: "#141414",
    accentHue: "60, 0, 0",
  },
  {
    number: "07",
    title: "Digital Marketing",
    tag: "Digital Acceleration",
    description:
      "Driving measurable growth through data-led strategy. From performance marketing and SEO to social media and content campaigns, we build digital ecosystems that amplify your brand and deliver results you can actually track.",
    highlights: [
      "Performance marketing (Meta, Google)",
      "SEO & content marketing",
      "Social media management",
      "Digital marketing for event brands",
    ],
    color: "#171717",
    accentHue: "70, 0, 0",
  },
  {
    number: "08",
    title: "Wedding Entertainment",
    tag: "Weddings & Celebrations",
    description:
      "Your biggest day, flawlessly produced. We orchestrate premium wedding entertainment — from curated artist performances and stage design to full-scale event production — ensuring every detail creates memories that last a lifetime.",
    highlights: [
      "Artist & performer booking",
      "Stage & sound design",
      "Full event production & coordination",
      "Premium wedding entertainment in Kerala",
    ],
    color: "#1a1a1a",
    accentHue: "80, 0, 0",
  },
  {
    number: "09",
    title: "Stage Production",
    tag: "Live Production",
    description:
      "Full-scale live production, executed flawlessly. Lighting, sound, staging, rigging, and crew coordination — we handle every technical element of your show so the performance always takes centre stage.",
    highlights: [
      "Lighting & sound engineering",
      "Stage design & rigging",
      "Production crew management",
      "Event production and promotion services",
    ],
    color: "#1d1d1d",
    accentHue: "60, 0, 0",
  },
];

interface CardProps {
  number: string;
  title: string;
  description: string;
  tag: string;
  highlights: string[];
  color: string;
  accentHue: string;
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
  highlights,
  color,
  accentHue,
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

  const scale     = useTransform(progress, range, [1, targetScale]);
  const lineWidth = useTransform(cardProgress, [0, 1], ["0%", "100%"]);
  const imgOpacity = useTransform(cardProgress, [0, 0.6], [0.3, 0.7]);

  return (
    <div
      ref={container}
      style={{
        height: "calc(100vh - 280px)",
        minHeight: "400px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "sticky",
        top: "clamp(40px, 8vh, 100px)",
      }}
    >
      <motion.div
        style={{
          scale,
          backgroundColor: color,
          position: "relative",
          transformOrigin: "center top",
          width: "100%",
          maxWidth: "1200px",
          borderRadius: "clamp(8px, 1.2vw, 16px)",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          boxShadow: "0 4px 40px rgba(0,0,0,0.6), 0 1px 0 rgba(255,255,255,0.04) inset",
        }}
      >
        {/* Animated top progress line */}
        <motion.div
          style={{
            width: lineWidth,
            position: "absolute",
            top: 0,
            left: 0,
            height: "2px",
            backgroundColor: "#FF0000",
            zIndex: 2,
          }}
        />

        {/* Subtle ambient glow based on accent */}
        <div
          style={{
            position: "absolute",
            top: "-40%",
            right: "-10%",
            width: "50%",
            height: "150%",
            background: `radial-gradient(circle at 60% 40%, rgba(${accentHue}, 0.12) 0%, transparent 65%)`,
            pointerEvents: "none",
            zIndex: 1,
          }}
        />

        {/* Main card layout — left content + right visual */}
        <div
          className="grid grid-cols-1 md:grid-cols-[1fr_auto] h-full"
          style={{ position: "relative", zIndex: 2 }}
        >
          {/* Left: content */}
          <div
            className="flex flex-col justify-center"
            style={{
              padding: "clamp(1.5rem, 4vw, 3.5rem)",
              paddingRight: "clamp(1.5rem, 3vw, 2.5rem)",
            }}
          >
            {/* Service number + tag row */}
            <div className="flex items-center gap-4 mb-5">
              <span
                className="font-display font-bold text-[#FF0000] tabular-nums"
                style={{ fontSize: "clamp(0.7rem, 1.2vw, 0.8rem)", letterSpacing: "0.1em" }}
              >
                {number}
              </span>
              <div className="h-px flex-1 max-w-[2rem] bg-white/10" />
              <span
                className="text-[#C41E1E] font-sans uppercase"
                style={{ fontSize: "clamp(0.6rem, 1vw, 0.7rem)", letterSpacing: "0.4em" }}
              >
                {tag}
              </span>
            </div>

            {/* Title */}
            <h3
              className="font-display font-bold leading-tight text-[#F0F0F0] mb-4"
              style={{ fontSize: "clamp(1.6rem, 4vw, 3.2rem)" }}
            >
              {title}
            </h3>

            {/* Description */}
            <p
              className="text-[#888] leading-[1.85] mb-6 max-w-xl"
              style={{ fontSize: "clamp(0.8rem, 1.4vw, 1rem)" }}
            >
              {description}
            </p>

            {/* Highlights */}
            <ul className="space-y-2">
              {highlights.map((h) => (
                <li key={h} className="flex items-start gap-3">
                  <span className="mt-[6px] w-1 h-1 rounded-full bg-[#FF0000] flex-shrink-0" />
                  <span
                    className="text-[#666] leading-snug"
                    style={{ fontSize: "clamp(0.7rem, 1.1vw, 0.8rem)" }}
                  >
                    {h}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right: abstract visual panel */}
          <motion.div
            style={{ opacity: imgOpacity }}
            className="hidden md:flex items-center justify-center flex-shrink-0"
            aria-hidden="true"
          >
            <div
              style={{
                width: "clamp(160px, 22vw, 280px)",
                height: "100%",
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {/* Abstract number sculpture */}
              <div
                style={{
                  position: "relative",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <span
                  className="font-display font-black text-white/[0.04] leading-none select-none"
                  style={{ fontSize: "clamp(6rem, 12vw, 10rem)" }}
                >
                  {number}
                </span>
                <div
                  style={{
                    width: "2px",
                    height: "clamp(40px, 6vw, 80px)",
                    background: "linear-gradient(to bottom, #FF0000, transparent)",
                    borderRadius: "1px",
                  }}
                />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom hairline */}
        <div
          style={{
            position: "absolute",
            bottom: 0, left: 0, right: 0,
            height: "1px",
            backgroundColor: "rgba(255,255,255,0.04)",
          }}
        />

        {/* Left accent border */}
        <div
          style={{
            position: "absolute",
            top: 0, left: 0, bottom: 0,
            width: "3px",
            backgroundColor: `rgba(255,0,0,${0.7 - i * 0.06})`,
            borderRadius: "3px 0 0 3px",
          }}
        />
      </motion.div>
    </div>
  );
}

export function ServicesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const stackRef   = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: stackRef,
    offset: ["start start", "end end"],
  });

  return (
    <section
      ref={sectionRef}
      id="services"
      className="relative w-full bg-[#FF0000]"
      style={{ zIndex: 1, paddingBottom: "6rem" }}
    >
      {/* Scrolling marquee banner */}
      <div className="w-full overflow-hidden bg-[#FF0000] py-4" aria-hidden="true">
        <div className="animate-marquee whitespace-nowrap flex gap-16">
          {Array(8)
            .fill(null)
            .map((_, i) => (
              <span key={i} className="text-[10px] tracking-[0.5em] uppercase text-white/60 font-sans">
                Events &nbsp;·&nbsp; Concerts &nbsp;·&nbsp; Weddings &nbsp;·&nbsp; Film
                &nbsp;·&nbsp; Corporate &nbsp;·&nbsp; Production &nbsp;·&nbsp; Management
              </span>
            ))}
        </div>
      </div>

      {/* Section heading */}
      <div className="section-padding" style={{ paddingTop: "3.5rem", paddingBottom: "1rem" }}>
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h2
              className="font-display font-bold leading-[1.04] text-white"
              style={{ fontSize: "clamp(2.2rem, 7vw, 5rem)" }}
            >
              What We
              <br />
              Deliver
            </h2>
            <p className="mt-3 text-white/55 font-sans" style={{ fontSize: "clamp(0.85rem, 1.5vw, 1.05rem)" }}>
              End-to-end solutions across entertainment, events, and media.
            </p>
          </div>
          <p className="text-[10px] tracking-[0.3em] uppercase text-white/35 font-sans shrink-0 pb-1">
            {services.length} services
          </p>
        </div>
      </div>

      {/* Card stack */}
      <div ref={stackRef} className="section-padding">
        <div className="max-w-7xl mx-auto">
          {services.map((service, i) => {
            const targetScale = 1 - (services.length - i) * 0.018;
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
      </div>
    </section>
  );
}
