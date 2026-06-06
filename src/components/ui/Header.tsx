"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const navLinks = [
  { id: "home",     label: "Home"     },
  { id: "about",    label: "About"    },
  { id: "services", label: "Services" },
  { id: "gallery",  label: "Gallery"  },
  { id: "contact",  label: "Contact"  },
  { id: "faq",      label: "FAQ"      },
];

// Always-dark capsule — stays readable on both black and white sections
const NAV_BG     = "rgba(8, 8, 8, 0.92)";
const NAV_BORDER = "rgba(255, 255, 255, 0.09)";
const NAV_BLUR   = "blur(20px)";

export function Header() {
  const [activeSection, setActiveSection] = useState("home");
  const [isExpanded,    setIsExpanded]    = useState(true);
  const [mobileOpen,    setMobileOpen]    = useState(false);
  const lastScrollY = useRef(0);
  const ticking    = useRef(false);

  useEffect(() => {
    const getActive = (): string => {
      const threshold = window.innerHeight * 0.5;
      let current = navLinks[0].id;
      for (const { id } of navLinks) {
        const el = document.getElementById(id);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= threshold) current = id;
      }
      return current;
    };

    const onScroll = () => {
      if (ticking.current) return;
      ticking.current = true;
      requestAnimationFrame(() => {
        const currentY = window.scrollY;
        const delta    = currentY - lastScrollY.current;

        if (currentY < 80 || delta < -8)  setIsExpanded(true);
        else if (delta > 8)               setIsExpanded(false);

        lastScrollY.current = currentY;
        setActiveSection(getActive());
        if (currentY > 80) setMobileOpen(false);
        ticking.current = false;
      });
    };

    setActiveSection(getActive());
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = useCallback((id: string) => {
    setMobileOpen(false);
    setActiveSection(id);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    <>
      {/* ── Desktop nav ──────────────────────────────────────── */}
      <motion.header
        className="fixed top-5 right-5 z-50 hidden md:flex items-center gap-2 pointer-events-none"
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, delay: 0.3, ease: [0.23, 1, 0.32, 1] }}
      >
        {/* Logo — circular liquid glass frame, image fills edge-to-edge */}
        <button
          onClick={() => scrollTo("home")}
          data-cursor-hover
          aria-label="Go to top"
          className="pointer-events-auto select-none shrink-0 rounded-full overflow-hidden hover:opacity-80 transition-opacity duration-150"
          style={{
            width: "44px",
            height: "44px",
            border: `1px solid ${NAV_BORDER}`,
            backdropFilter: NAV_BLUR,
            WebkitBackdropFilter: NAV_BLUR,
            boxShadow: "0 4px 24px rgba(0,0,0,0.4), 0 1px 0 rgba(255,255,255,0.04) inset",
          }}
        >
          <Image
            src="/logo-icon.png"
            alt="A7 Entertainment"
            width={44}
            height={44}
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
        </button>

        {/* Glass nav pill — hides when collapsed */}
        <AnimatePresence initial={false}>
          {isExpanded && (
            <motion.div
              key="glass-pill"
              className="pointer-events-auto overflow-hidden"
              style={{
                background: NAV_BG,
                border: `1px solid ${NAV_BORDER}`,
                backdropFilter: NAV_BLUR,
                WebkitBackdropFilter: NAV_BLUR,
                boxShadow: "0 4px 24px rgba(0,0,0,0.4), 0 1px 0 rgba(255,255,255,0.04) inset",
                borderRadius: "9999px",
                height: "44px",
              }}
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: "auto", opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 280, damping: 28 }}
            >
              <nav
                className="flex items-center h-full"
                style={{ padding: "0 16px", gap: "4px" }}
                aria-label="Main navigation"
              >
                {navLinks.map(({ id, label }) => {
                  const isActive = activeSection === id;
                  return (
                    <button
                      key={id}
                      onClick={() => scrollTo(id)}
                      data-cursor-hover
                      className="relative h-full flex items-center justify-center font-sans whitespace-nowrap transition-colors duration-200"
                      style={{
                        padding: "0 16px",
                        fontSize: "11px",
                        letterSpacing: "0.18em",
                        textTransform: "uppercase",
                        color: isActive ? "#FFFFFF" : "rgba(255,255,255,0.45)",
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive)
                          (e.currentTarget as HTMLButtonElement).style.color =
                            "rgba(255,255,255,0.78)";
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive)
                          (e.currentTarget as HTMLButtonElement).style.color =
                            "rgba(255,255,255,0.45)";
                      }}
                    >
                      {label}
                      {isActive && (
                        <motion.span
                          layoutId="nav-active-bar"
                          className="absolute bottom-[5px] left-1/2 -translate-x-1/2 h-[1.5px] rounded-full"
                          style={{ width: "1.1rem", backgroundColor: "#FF0000" }}
                          transition={{ type: "spring", stiffness: 380, damping: 30 }}
                        />
                      )}
                    </button>
                  );
                })}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* ── Mobile nav ─────────────────────────────────────────── */}
      <div className="fixed top-4 right-4 z-50 md:hidden flex items-center gap-2">
        {/* Logo — circular liquid glass, fills edge-to-edge */}
        <motion.button
          onClick={() => scrollTo("home")}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="select-none shrink-0 rounded-full overflow-hidden hover:opacity-80 transition-opacity duration-150"
          aria-label="Go to top"
          style={{
            width: "40px",
            height: "40px",
            border: `1px solid ${NAV_BORDER}`,
            backdropFilter: NAV_BLUR,
            WebkitBackdropFilter: NAV_BLUR,
            boxShadow: "0 4px 20px rgba(0,0,0,0.35)",
          }}
        >
          <Image
            src="/logo-icon.png"
            alt="A7 Entertainment"
            width={40}
            height={40}
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
        </motion.button>

        {/* Hamburger — glass */}
        <motion.button
          onClick={() => setMobileOpen((v) => !v)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
          className="w-9 h-9 flex flex-col items-center justify-center gap-[5px]"
          style={{
            background: NAV_BG,
            border: `1px solid ${NAV_BORDER}`,
            backdropFilter: NAV_BLUR,
            WebkitBackdropFilter: NAV_BLUR,
            borderRadius: "9999px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.35)",
          }}
        >
          <motion.span
            animate={mobileOpen ? { rotate: 45, y: 5 }  : { rotate: 0, y: 0 }}
            className="block w-[14px] h-px rounded-full bg-white"
            transition={{ duration: 0.25 }}
          />
          <motion.span
            animate={mobileOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
            className="block w-[14px] h-px rounded-full bg-white"
            transition={{ duration: 0.15 }}
          />
          <motion.span
            animate={mobileOpen ? { rotate: -45, y: -5 } : { rotate: 0, y: 0 }}
            className="block w-[14px] h-px rounded-full bg-white"
            transition={{ duration: 0.25 }}
          />
        </motion.button>
      </div>

      {/* ── Mobile dropdown ─────────────────────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 md:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              key="menu"
              initial={{ opacity: 0, scale: 0.95, y: -8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -8 }}
              transition={{ type: "spring", stiffness: 380, damping: 30 }}
              className="fixed top-16 right-4 z-50 md:hidden min-w-[180px] overflow-hidden"
              style={{
                background: "rgba(8,8,8,0.97)",
                border: `1px solid ${NAV_BORDER}`,
                backdropFilter: NAV_BLUR,
                WebkitBackdropFilter: NAV_BLUR,
                borderRadius: "16px",
                boxShadow: "0 8px 40px rgba(0,0,0,0.5)",
              }}
            >
              <nav className="flex flex-col py-2" aria-label="Mobile navigation">
                {navLinks.map(({ id, label }, idx) => {
                  const isActive = activeSection === id;
                  return (
                    <motion.button
                      key={id}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.04, duration: 0.22 }}
                      onClick={() => scrollTo(id)}
                      className="px-5 py-4 text-left font-sans font-medium flex items-center justify-between gap-4 uppercase transition-colors duration-150"
                      style={{
                        fontSize: "11px",
                        letterSpacing: "0.22em",
                        color: isActive ? "#FF0000" : "rgba(255,255,255,0.6)",
                      }}
                    >
                      {label}
                      {isActive && (
                        <span className="w-1 h-1 rounded-full flex-shrink-0 bg-[#FF0000]" />
                      )}
                    </motion.button>
                  );
                })}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
