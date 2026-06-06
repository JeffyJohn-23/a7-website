# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Dev server at http://localhost:3000
npx next build       # Build for production (preferred — avoids port conflicts)
npm start            # Run production build
npm run lint         # Lint check
```

> If `npm run dev` fails with exit code 1, port 3000 is already in use. Use `npx next build` to verify correctness instead.

**Environment variable required for the contact form:**
```
RESEND_API_KEY=<your-resend-api-key>
```

---

## Tech Stack

Next.js 16 (App Router) · React 19 · TypeScript (strict) · Tailwind CSS v4 · GSAP 3 + ScrollTrigger · Framer Motion 12 · Lenis

---

## Architecture

Single-page scroll experience at `/`. Section order in `src/app/(site)/page.tsx`:

```
HomeHero → AboutSection → ServicesSection → GallerySection → ContactSection → FAQSection → Footer
```

`HomeHero` is rendered directly; all other sections are lazy-loaded via `next/dynamic` with `ssr: false`.

Sub-pages at `/about`, `/gallery`, `/services`, `/contact` use `HeroScene` and are stubs — not the main experience.

### Key Architectural Seams

| Path | Purpose |
|------|---------|
| `src/app/layout.tsx` | Root **Server Component** — metadata, Google Fonts, JSON-LD schema, wraps children in `<ClientShell>` + Vercel Analytics |
| `src/app/(site)/layout.tsx` | Renders `<Header />` + children. Server component. |
| `src/components/ui/ClientShell.tsx` | `"use client"` boundary — initialises Lenis singleton, renders `<CustomCursor />` |
| `src/components/scenes/HomeHero.tsx` | Fullscreen hero — gated behind `PageLoader` via `loaderDone` state |
| `src/components/ui/PageLoader.tsx` | GSAP fullscreen intro overlay (`z-[200]`); calls `onComplete()` prop when exit finishes |
| `src/app/api/contact/route.ts` | Contact form API — sends email via Resend (`RESEND_API_KEY` env var) |
| `src/lib/lenis.ts` | Lenis singleton — `initLenis()` / `getLenis()` / `destroyLenis()` |
| `src/styles/globals.css` | CSS vars, `.section-padding`, reveal base states, keyframes |

### Unused / Dormant Files

Not imported or rendered anywhere:
- `src/components/ui/RunnerDoodle.tsx`
- `src/components/transitions/PageTransition.tsx`
- `src/components/sections/Hero.tsx` (replaced by `HomeHero`)
- `src/components/animations/` (empty directory)

---

## Color Palette (NON-NEGOTIABLE)

| Role | Value | Usage |
|------|-------|-------|
| Primary Red | `#FF0000` | CTAs, accents, highlights, active indicators |
| Background | `#000000` | Page background, hero, dark sections |
| Foreground | `#FFFFFF` | Headings, active text |
| Surface | `#0d0d0d` | Dark card backgrounds |
| Muted | `#666666` | Body text, secondary labels |
| Border | `rgba(255,255,255,0.08)` | Hairlines on dark backgrounds |
| White sections | `bg-white` | AboutSection, ContactSection |
| Gallery modal | `#EEEBE4` | Warm cream editorial panel |

**Forbidden:** Green, blue, teal, purple, multi-colour gradients, tech/SaaS aesthetic.

---

## Typography

| Class | Font | Usage |
|-------|------|-------|
| `font-display` / `font-sans` | Rethink Sans | All headings and body |
| `font-serif` | Playfair Display (italic) | Gallery modal titles |

Loaded via Google Fonts `<link>` tags in `src/app/layout.tsx`.

---

## Layout System

- **`.section-padding`** — fluid horizontal padding via `clamp(1.25rem, 5vw, 6rem)`, defined in `globals.css`
- **`max-w-7xl mx-auto`** — content container on all sections
- **Inline `style={{ paddingTop, paddingBottom }}`** — vertical spacing (not Tailwind, avoids purge issues)
- **`min-h-screen`** — hero only; other sections size to content
- **Path alias:** `@/*` → `src/*`

---

## Header

Fixed top-right dark capsule — `fixed top-5 right-5 z-50`.

- **Always dark** — `rgba(8,8,8,0.92)` background + `blur(20px)` backdrop. No color adaptation for underlying sections.
- **Collapse:** Expands on scroll-up or `scrollY < 80`; collapses (logo only) on scroll-down. Uses `requestAnimationFrame` scroll listener + `isExpanded` state.
- **Scroll-spy:** `getBoundingClientRect().top <= 50% viewport height` — pure scroll event, no GSAP.
- **Active indicator:** `w-1 h-1 rounded-full bg-[#FF0000]` dot below active link.
- **Nav links:** Home · About · Services · Gallery · Contact · FAQ
- **Logo:** `A7Mark` inline SVG (`viewBox="0 0 38 26"`) — local function inside `Header.tsx`.
- **Mobile:** Separate pill button (`fixed top-4 right-4`), hamburger opens full dropdown sheet.

### A7Mark SVG — Canonical Paths

```tsx
// viewBox="0 0 38 26"
<path fillRule="evenodd" d="M 1,25 L 11,1 L 21,25 Z M 4,25 L 11,5 L 18,25 Z" fill="rgba(255,255,255,0.88)" />
<rect x="5.5" y="14" width="11" height="3.5" fill="rgba(255,255,255,0.88)" />
<rect x="14" y="1" width="15" height="4.5" fill="#FF0000" />
<path d="M 23,5.5 L 29,5.5 L 18,25 L 12,25 Z" fill="#FF0000" />
```

For the ghost watermark in HomeHero, replace all fills with `rgba(255,255,255,0.04)`.

---

## HomeHero

GSAP entrance animations are gated behind `loaderDone` state — nothing plays until `PageLoader` calls `onComplete()`. All GSAP `useEffect` blocks must guard: `if (!loaderDone) return;`.

| Element | Implementation |
|---------|---------------|
| PageLoader gate | `loaderDone` state — hero GSAP fires only when `true` |
| Cycling headline | `HERO_WORDS` array, `wordIndex` cycles every 3 s (2.4 s delay post-loader). Framer Motion `AnimatePresence`. |
| Spotlight beams | 3 `clip-path: polygon(...)` divs with `beam-pulse` CSS keyframe |
| Floating particles | `PARTICLES` array (7 items), `float-up` CSS keyframe |
| Logo watermark | `logo-white.png` at 4% opacity, `clamp(28rem, 52vw, 72rem)` wide, anchored `right-0 bottom-0` |
| EASE constant | `const EASE: [number,number,number,number] = [0.76, 0, 0.24, 1]` |

---

## Animation Techniques

### GSAP + ScrollTrigger

- **Always `gsap.fromTo()`** for `.reveal-up` elements — `globals.css` sets `opacity:0; transform:translateY(50px)`, so `gsap.to()` alone cannot override the CSS starting state.
- **Always `gsap.context()` + `ctx.revert()`** in `useEffect` cleanup.
- Word-reveal pattern: `stagger: 0.1`, `scrub: true`, `start: "top 80%"`, `end: "top 40%"`.

### Framer Motion

- Services sticky cards: `useScroll` + `useTransform` for scale shrink. `targetScale = 1 - (n - i) * 0.02`.
- Gallery modal: `AnimatePresence` for open/close; `ImageSlider` uses vertical (y-axis) slide.
- **TypeScript caveat:** Bezier ease arrays must be typed as `[number,number,number,number]` tuples — `[0.76, 0, 0.24, 1]` alone is inferred as `number[]` and fails.
- **`"use client"`** required on all Framer Motion components.

### Lenis

`initLenis()` called once in `ClientShell` `useEffect`. Singleton pattern — module-level instance. `scrollbar-width: none` hides the native scrollbar.

---

## globals.css — Keyframes

```css
@keyframes beam-pulse   { /* opacity pulse for hero spotlight beams */ }
@keyframes float-up     { /* translateY + opacity for hero particles */ }
@keyframes glow-breathe { /* scale pulse for red radial glow */ }
@keyframes marquee      { /* translateX loop for ServicesSection banner */ }
```

These keyframes are referenced by inline `animation:` style props — they cannot be replicated with Tailwind alone. Keep them in `globals.css`.

`.reveal-up`, `.reveal-left`, `.reveal-right`, `.reveal-scale` set initial hidden states consumed by GSAP `fromTo()`.

---

## Key CSS Rules

```css
overflow-x: clip;    /* NOT hidden — hidden breaks sticky positioning */
cursor: none;        /* Custom cursor; restored on touch via @media (pointer: coarse) */
```

---

## z-index Stack

| Element | z-index |
|---------|---------|
| Custom cursor | `z-[9999]` / `z-[9998]` |
| PageLoader | `z-[200]` |
| Gallery modal | `z-[60]` |
| Header | `z-50` |

---

## Component Conventions

- **Named exports** everywhere except `RunnerDoodle` (default).
- **`"use client"`** on any component with hooks, GSAP, or Framer Motion.
- **`data-cursor-hover`** on all interactive elements for `CustomCursor` scale effect.
- **Inline `style={{}}`** for dynamic/JS-computed values and guaranteed padding.
- **Section IDs** must match nav: `home`, `about`, `services`, `gallery`, `contact`, `faq`.

---

## Common Pitfalls

| Problem | Cause | Fix |
|---------|-------|-----|
| GSAP reveal not animating | `.reveal-up` sets `opacity:0` in CSS | Use `gsap.fromTo({opacity:0,y:50}, {opacity:1,y:0})` |
| Framer Motion `ease` type error | Array inferred as `number[]` | Declare `const E: [number,number,number,number] = [...]` |
| File has invalid UTF-8 bytes | PowerShell `Set-Content` default encoding | Use `[System.IO.File]::WriteAllText(path, content, [System.Text.Encoding]::UTF8)` |
| SVG doodles invisible | `.reveal-up` hides them AND `strokeDashoffset` hides paths | Fade strip in first, draw paths in `onComplete` |
| Sticky sections broken | `overflow-x: hidden` on body | Use `overflow-x: clip` instead |
| Port conflict on `npm run dev` | Port 3000 already occupied | `npx next build` to verify; kill existing process |

---

## Before You Code

1. Brand colors only — `#FF0000`, `#000000`, `#FFFFFF`. No exceptions.
2. Never `overflow-x: hidden` on html/body — breaks sticky.
3. Always `gsap.fromTo()` for `.reveal-up`, never `gsap.to()`.
4. Always `gsap.context()` + `ctx.revert()` cleanup.
5. White sections (`AboutSection`, `ContactSection`) — dark text (`#0a0a0a`, `#1a1a1a`, `#3a3a3a`).
6. Run `npx next build` to confirm zero errors before finishing.
