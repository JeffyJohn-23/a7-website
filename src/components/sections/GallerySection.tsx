"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import Image from "next/image";

const FILTERS = ["All", "Events", "Brand", "Celebrity"] as const;
type Filter = typeof FILTERS[number];

const projects = [
  {
    id: 1,
    filter: "Events" as Filter,
    title: "World Tennis League",
    category: "Sports & Live Events",
    year: "2024",
    date: "December 2024",
    place: "Dubai, UAE",
    description: "A global spectacle of elite tennis and entertainment, brought to life with full-scale production management. From artist performances between sets to precision court-side staging, A7 delivered an experience that matched the scale of the sport.",
    images: ["/gallery/team-experts.jpg", "/gallery/red-silhouettes.jpg"],
  },
  {
    id: 2,
    filter: "Celebrity" as Filter,
    title: "Ben Bhomer",
    category: "Celebrity Management",
    year: "2024",
    date: "2024",
    place: "India",
    description: "End-to-end celebrity engagement and talent management for Ben Bhomer — coordinating appearances, endorsements, and media interactions to build a commanding and consistent public presence.",
    images: ["/gallery/red-silhouettes.jpg", "/gallery/brand-design.jpg"],
  },
  {
    id: 3,
    filter: "Events" as Filter,
    title: "Dil Se Diwali 2025",
    category: "Festival Production",
    year: "2025",
    date: "October 2025",
    place: "India",
    description: "A grand festival celebration blending cultural tradition with high-energy entertainment. Dil Se Diwali 2025 brought thousands together in a meticulously produced live experience — lights, performances, and moments that resonated.",
    images: ["/gallery/invitation-event.jpg", "/gallery/red-silhouettes.jpg"],
  },
  {
    id: 4,
    filter: "Events" as Filter,
    title: "Dandiya 2025",
    category: "Cultural Experience",
    year: "2025",
    date: "October 2025",
    place: "India",
    description: "A vibrant celebration of Navratri culture scaled into a premium live experience. Dandiya 2025 combined traditional energy with modern production to create an electric evening that left audiences wanting more.",
    images: ["/gallery/invitation-event.jpg", "/gallery/team-innovation.jpg"],
  },
  {
    id: 5,
    filter: "Brand" as Filter,
    title: "Vesparo Launch",
    category: "Brand Launch",
    year: "2025",
    date: "2025",
    place: "India",
    description: "Making a first impression that lasts. The Vesparo brand launch was designed as an immersive unveiling experience — from spatial design to curated guest journeys, every detail positioned the brand with precision and elegance.",
    images: ["/gallery/brand-design.jpg", "/gallery/team-experts.jpg"],
  },
  {
    id: 6,
    filter: "Brand" as Filter,
    title: "Dhamree Launch",
    category: "Brand Launch",
    year: "2025",
    date: "2025",
    place: "India",
    description: "A bold debut for Dhamree — executed with cinematic production value and strategic storytelling. The launch experience captivated media, influencers, and consumers alike, turning a product reveal into a cultural moment.",
    images: ["/gallery/brand-design.jpg", "/gallery/team-innovation.jpg"],
  },
];

/* ─── ImageSlider ─────────────────────────────────────────────── */

function ImageSlider({
  images, title, projectNum, totalProjects,
}: {
  images: string[]; title: string; projectNum: number; totalProjects: number;
}) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [direction, setDirection]  = useState<1 | -1>(1);
  const panelRef     = useRef<HTMLDivElement>(null);
  const isAnimating  = useRef(false);
  const accumulator  = useRef(0);
  const THRESHOLD    = 60;

  useEffect(() => {
    setActiveIdx(0);
    setDirection(1);
    isAnimating.current = false;
    accumulator.current = 0;
  }, [images]);

  useEffect(() => {
    const el = panelRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (isAnimating.current) return;
      accumulator.current += e.deltaY;
      if (accumulator.current > THRESHOLD) {
        accumulator.current = 0;
        if (activeIdx < images.length - 1) {
          isAnimating.current = true;
          setDirection(1);
          setActiveIdx((p) => p + 1);
          setTimeout(() => { isAnimating.current = false; }, 700);
        }
      } else if (accumulator.current < -THRESHOLD) {
        accumulator.current = 0;
        if (activeIdx > 0) {
          isAnimating.current = true;
          setDirection(-1);
          setActiveIdx((p) => p - 1);
          setTimeout(() => { isAnimating.current = false; }, 700);
        }
      }
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [activeIdx, images.length]);

  const slideVariants = {
    enter: (dir: number) => ({ y: dir > 0 ? "100%" : "-100%", opacity: 0 }),
    center: { y: "0%", opacity: 1 },
    exit:  (dir: number) => ({ y: dir > 0 ? "-100%" : "100%", opacity: 0 }),
  };

  return (
    <div ref={panelRef} className="relative h-[42vh] md:h-full md:w-[50%] flex-shrink-0 bg-black overflow-hidden select-none">
      <AnimatePresence initial={false} custom={direction} mode="sync">
        <motion.div
          key={activeIdx}
          custom={direction}
          variants={slideVariants}
          initial="enter" animate="center" exit="exit"
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
        >
          <Image
            src={images[activeIdx]}
            alt={`${title} — ${activeIdx + 1} of ${images.length}`}
            fill className="object-cover" sizes="528px" priority={activeIdx === 0}
          />
          <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/40 to-transparent pointer-events-none" />
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
        </motion.div>
      </AnimatePresence>

      <div className="absolute top-4 left-4 z-10">
        <span className="text-[9px] tracking-[0.4em] uppercase text-white/60 font-sans tabular-nums bg-black/50 px-2 py-1 rounded">
          {String(projectNum).padStart(2, "0")} / {String(totalProjects).padStart(2, "0")}
        </span>
      </div>

      <div className="absolute bottom-4 right-4 z-10 flex flex-col gap-1.5 items-center">
        {images.map((_, i) => (
          <button key={i} onClick={() => { if (i === activeIdx) return; setDirection(i > activeIdx ? 1 : -1); setActiveIdx(i); }}
            className={`w-1.5 rounded-full transition-all duration-300 ${i === activeIdx ? "h-5 bg-white" : "h-1.5 bg-white/35 hover:bg-white/60"}`}
          />
        ))}
      </div>

      {images.length > 1 && (
        <div className="absolute bottom-4 left-4 z-10">
          <span className="text-[8px] tracking-[0.35em] uppercase text-white/30 font-sans">
            {activeIdx < images.length - 1 ? "scroll" : ""}
          </span>
        </div>
      )}
    </div>
  );
}

/* ─── ProjectModal ────────────────────────────────────────────── */

function ProjectModal({ projectIndex, onClose, onPrev, onNext }: {
  projectIndex: number; onClose: () => void; onPrev: () => void; onNext: () => void;
}) {
  const project = projects[projectIndex];
  const isFirst = projectIndex === 0;
  const isLast  = projectIndex === projects.length - 1;

  useEffect(() => {
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = prev;
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if ((e.key === "ArrowRight" || e.key === "ArrowDown") && !isLast) onNext();
      if ((e.key === "ArrowLeft"  || e.key === "ArrowUp")   && !isFirst) onPrev();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose, onNext, onPrev, isFirst, isLast]);

  return (
    <motion.div
      className="fixed inset-0 z-[60] flex items-center justify-center p-0 md:p-8"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={onClose} />

      <motion.div
        className="relative z-10 flex flex-col md:flex-row w-full h-full md:w-[1100px] md:max-w-[94vw] md:h-[90vh] md:max-h-[780px] md:rounded-2xl overflow-hidden"
        style={{ boxShadow: "0 32px 100px rgba(0,0,0,0.7)" }}
        initial={{ scale: 0.95, opacity: 0, y: 36 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.97, opacity: 0, y: 24 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      >
        <ImageSlider key={project.id} images={project.images} title={project.title}
          projectNum={projectIndex + 1} totalProjects={projects.length} />

        <div className="flex-1 flex flex-col min-h-0 overflow-hidden" style={{ background: "#EEEBE4" }}>
          <motion.div className="flex items-center justify-between flex-shrink-0 px-4 py-4 md:px-10 md:py-6"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.05 }}
          >
            <div className="flex items-center gap-2.5">
              <span className="text-[10px] tracking-[0.35em] uppercase text-black/60 font-sans font-semibold">A7</span>
              <span className="text-black/30 text-[10px] font-sans">/</span>
              <span className="text-[10px] tracking-[0.35em] uppercase text-black/60 font-sans font-semibold">Gallery</span>
              <span className="text-black/30 text-[10px] font-sans">/</span>
              <AnimatePresence mode="wait">
                <motion.span key={project.category}
                  className="text-[10px] tracking-[0.35em] uppercase text-black/90 font-bold font-sans"
                  initial={{ opacity: 0, x: 6 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}>
                  {project.category}
                </motion.span>
              </AnimatePresence>
            </div>
            <button onClick={onClose} aria-label="Close"
              className="flex items-center justify-center w-9 h-9 text-black/60 hover:text-black transition-colors duration-200 flex-shrink-0">
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <path d="M1.5 1.5l10 10M11.5 1.5l-10 10" />
              </svg>
            </button>
          </motion.div>

          <div className="flex-1 overflow-y-auto overscroll-contain">
            <div className="w-full px-4 pt-3 pb-8 md:px-10 md:pt-6 md:pb-12">
              <AnimatePresence mode="wait">
                <motion.div key={project.id} initial="hidden" animate="visible" exit="exit"
                  variants={{
                    hidden: {},
                    visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
                    exit: { opacity: 0, transition: { duration: 0.2 } },
                  }}
                >
                  <motion.span className="text-[11px] tracking-[0.5em] uppercase font-sans font-bold block"
                    style={{ color: "rgba(0,0,0,0.55)", marginBottom: "1.75rem", marginTop: "0.25rem" }}
                    variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } } }}>
                    {project.category}
                  </motion.span>

                  <div style={{ marginBottom: "2rem" }}>
                    {project.title.split(" ").map((word, i) => (
                      <div key={i} className="overflow-hidden inline-block mr-[0.25em] last:mr-0">
                        <motion.span className="font-serif italic font-bold text-black leading-[1.05] inline-block"
                          style={{ fontSize: "clamp(1.8rem, 5.5vw, 4rem)" }}
                          variants={{ hidden: { y: "110%", opacity: 0 }, visible: { y: "0%", opacity: 1, transition: { duration: 0.65, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] } } }}>
                          {word}
                        </motion.span>
                      </div>
                    ))}
                  </div>

                  <motion.div className="h-px flex-shrink-0"
                    style={{ background: "#FF0000", width: "2.5rem", marginBottom: "2rem" }}
                    variants={{ hidden: { scaleX: 0, originX: 0 }, visible: { scaleX: 1, originX: 0, transition: { duration: 0.5 } } }} />

                  <motion.p className="font-sans font-normal"
                    style={{ fontSize: "15px", lineHeight: 1.85, color: "rgba(0,0,0,0.72)", marginBottom: "2.5rem" }}
                    variants={{ hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } }}>
                    {project.description}
                  </motion.p>

                  <motion.div className="space-y-2.5"
                    variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.4 } } }}>
                    {[{ label: "Date", value: project.date }, { label: "Place", value: project.place }].map(({ label, value }) => (
                      <div key={label} className="flex items-baseline" style={{ gap: "1.5rem" }}>
                        <span className="font-sans font-bold flex-shrink-0" style={{ fontSize: "10px", letterSpacing: "0.4em", textTransform: "uppercase", color: "rgba(0,0,0,0.4)", width: "3.5rem" }}>{label}</span>
                        <span className="font-sans font-semibold" style={{ fontSize: "13px", letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(0,0,0,0.75)" }}>{value}</span>
                      </div>
                    ))}
                  </motion.div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          <div className="flex-shrink-0 flex items-center justify-between border-t border-black/[0.12] px-4 py-3 md:px-10 md:py-5">
            <button onClick={onPrev} disabled={isFirst}
              className={`group flex items-center gap-3 transition-all duration-200 ${isFirst ? "opacity-20 cursor-not-allowed" : "opacity-70 hover:opacity-100"}`}>
              <svg width="20" height="10" viewBox="0 0 20 10" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="text-black transition-transform duration-200 group-hover:-translate-x-1">
                <path d="M7 1L1 5l6 4M1 5h18" />
              </svg>
              <span className="text-[10px] tracking-[0.35em] uppercase font-sans text-black font-semibold">Prev</span>
            </button>
            <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "#FF0000" }} />
            <button onClick={onNext} disabled={isLast}
              className={`group flex items-center gap-3 transition-all duration-200 ${isLast ? "opacity-20 cursor-not-allowed" : "opacity-70 hover:opacity-100"}`}>
              <span className="text-[10px] tracking-[0.35em] uppercase font-sans text-black font-semibold">Next</span>
              <svg width="20" height="10" viewBox="0 0 20 10" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="text-black transition-transform duration-200 group-hover:translate-x-1">
                <path d="M13 1l6 4-6 4M19 5H1" />
              </svg>
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── GallerySection ──────────────────────────────────────────── */

export function GallerySection() {
  const [activeFilter,    setActiveFilter]    = useState<Filter>("All");
  const [activeIndex,     setActiveIndex]     = useState<number | null>(null);
  const [hoveredProject,  setHoveredProject]  = useState<typeof projects[number] | null>(null);
  const [mousePos,        setMousePos]        = useState({ x: 0, y: 0 });
  const [isTouch,         setIsTouch]         = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  const PREVIEW_W = 208;
  const PREVIEW_H = 144;

  useEffect(() => {
    setIsTouch(window.matchMedia("(hover: none) and (pointer: coarse)").matches);
  }, []);

  const filtered = activeFilter === "All"
    ? projects
    : projects.filter((p) => p.filter === activeFilter);

  const openProject  = useCallback((originalIdx: number) => setActiveIndex(originalIdx), []);
  const closeViewer  = useCallback(() => setActiveIndex(null), []);
  const goPrev       = useCallback(() => setActiveIndex((p) => (p !== null && p > 0 ? p - 1 : p)), []);
  const goNext       = useCallback(() => setActiveIndex((p) => (p !== null && p < projects.length - 1 ? p + 1 : p)), []);

  const getPreviewPos = () => {
    const rawX = mousePos.x + 20;
    const rawY = mousePos.y - PREVIEW_H / 2;
    if (!sectionRef.current) return { x: rawX, y: rawY };
    const rect = sectionRef.current.getBoundingClientRect();
    return {
      x: Math.min(Math.max(rawX, rect.left + 8), rect.right - PREVIEW_W - 8),
      y: Math.min(Math.max(rawY, rect.top + 8), rect.bottom - PREVIEW_H - 8),
    };
  };
  const previewPos = getPreviewPos();

  return (
    <section
      ref={sectionRef}
      id="gallery"
      className="relative w-full min-h-screen section-padding"
      style={{ paddingTop: "8rem", paddingBottom: "7rem" }}
    >
      <div className="max-w-7xl mx-auto">

        {/* ── Section header ── */}
        <div className="mb-16">
          {/* Label */}
          <motion.div
            className="flex items-center gap-6 mb-10"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <span className="text-[11px] tracking-[0.5em] uppercase text-[#FF0000] font-sans shrink-0">
              Our Work
            </span>
            <div className="flex-1 h-px bg-white/10" />
          </motion.div>

          {/* Heading + philosophy split */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-8 items-end">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              <h2
                className="font-display font-bold leading-[1.04] text-white"
                style={{ fontSize: "clamp(2.8rem, 7vw, 5.5rem)" }}
              >
                Projects That
                <br />
                <span className="text-[#FF0000]">Moved People.</span>
              </h2>
            </motion.div>

            <motion.p
              className="font-sans text-white/35 max-w-xs text-right hidden lg:block"
              style={{ fontSize: "clamp(0.78rem, 1.2vw, 0.9rem)", lineHeight: 1.8 }}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
            >
              From intimate brand launches to<br />50,000-person spectacles —
              <br />every project, executed with intent.
            </motion.p>
          </div>
        </div>

        {/* ── Filter tabs ── */}
        <motion.div
          className="flex items-center gap-1 mb-12"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <LayoutGroup id="gallery-filter">
            {FILTERS.map((f) => (
              <button
                key={f}
                data-cursor-hover
                onClick={() => setActiveFilter(f)}
                className="relative px-5 py-2.5 font-sans transition-colors duration-200"
                style={{
                  fontSize: "clamp(0.62rem, 1vw, 0.72rem)",
                  letterSpacing: "0.28em",
                  textTransform: "uppercase",
                  color: activeFilter === f ? "#FFFFFF" : "rgba(255,255,255,0.32)",
                }}
              >
                {f}
                {activeFilter === f && (
                  <motion.div
                    layoutId="filter-underline"
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[1.5px] rounded-full bg-[#FF0000]"
                    style={{ width: "1.2rem" }}
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </LayoutGroup>

          {/* Live count */}
          <span
            className="ml-auto font-sans text-white/20 tabular-nums"
            style={{ fontSize: "clamp(0.6rem, 0.9vw, 0.65rem)", letterSpacing: "0.2em" }}
          >
            {filtered.length} / {projects.length}
          </span>
        </motion.div>

        {/* ── Project list — animated filter ── */}
        <div className="relative">
          <AnimatePresence mode="popLayout">
            {filtered.map((project, displayIdx) => {
              const originalIdx = projects.findIndex((p) => p.id === project.id);
              return (
                <motion.div
                  key={project.id}
                  layout
                  onClick={() => openProject(originalIdx)}
                  onMouseEnter={isTouch ? undefined : () => setHoveredProject(project)}
                  onMouseLeave={isTouch ? undefined : () => setHoveredProject(null)}
                  onMouseMove={isTouch ? undefined : (e) => setMousePos({ x: e.clientX, y: e.clientY })}
                  className="group border-t border-white/[0.1] transition-colors duration-300 hover:bg-white/[0.035] cursor-pointer"
                  style={{ paddingTop: "1.75rem", paddingBottom: "1.75rem" }}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8, transition: { duration: 0.18 } }}
                  transition={{ duration: 0.32, delay: displayIdx * 0.05, ease: "easeOut" }}
                >
                  <div className="grid grid-cols-[auto_1fr_auto] md:grid-cols-[3rem_1fr_1fr_auto] items-center gap-4 md:gap-8">
                    <span className="text-sm text-white/30 group-hover:text-[#FF0000] transition-colors duration-400 font-sans tabular-nums">
                      {String(originalIdx + 1).padStart(2, "0")}
                    </span>
                    <h3 className="font-display text-lg md:text-2xl lg:text-3xl font-bold leading-tight text-white/70 group-hover:text-white transition-colors duration-300">
                      {project.title}
                    </h3>
                    <span className="hidden md:block text-sm text-white/35 group-hover:text-white/60 transition-colors duration-300">
                      {project.category}
                    </span>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-white/25 group-hover:text-white/50 transition-colors duration-300 tabular-nums">
                        {project.year}
                      </span>
                      <svg className="w-4 h-4 text-white/25 group-hover:text-[#FF0000] transition-all duration-400 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                  {/* Thin red bottom line — draws in on hover */}
                  <div
                    className="mt-4 h-px bg-[#FF0000] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"
                    style={{ maxWidth: "4rem" }}
                    aria-hidden="true"
                  />
                </motion.div>
              );
            })}
          </AnimatePresence>
          <div className="border-t border-white/[0.1]" />
        </div>

        {/* Hover image preview */}
        <AnimatePresence mode="wait">
          {hoveredProject && !isTouch && (
            <motion.div
              className="fixed z-40 pointer-events-none rounded-xl overflow-hidden"
              style={{ left: previewPos.x, top: previewPos.y, width: PREVIEW_W, height: PREVIEW_H }}
              initial={{ opacity: 0, scale: 0.88 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.88 }}
              transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            >
              <Image src={hoveredProject.images[0]} alt={hoveredProject.title} fill className="object-cover" sizes="208px" />
              <div className="absolute inset-0 border border-white/10 rounded-xl pointer-events-none" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {activeIndex !== null && (
          <ProjectModal projectIndex={activeIndex} onClose={closeViewer} onPrev={goPrev} onNext={goNext} />
        )}
      </AnimatePresence>
    </section>
  );
}
