# A7 Entertainment — AI Agent Guidelines

## Quick Start

**Tech Stack:** Next.js 16 (app router) · React 19 · TypeScript (strict) · Tailwind CSS v4 · GSAP 3 + ScrollTrigger · Framer Motion 12 · Lenis  
**Brand:** Premium cinematic single-page scroll website — strict red/black/white palette

### Commands
```bash
npm run dev       # Start dev server (http://localhost:3000)
npx next build    # Build for production (preferred — avoids port conflicts)
npm start         # Run production build
npm run lint      # Check code quality
```

> **Note:** `npm run dev` may fail with exit code 1 if port 3000 is already in use. Use `npx next build` to verify correctness.

---

## Architecture

Primary experience is a single-page scroll at `/` with section IDs: `#home`, `#about`, `#gallery`, `#services`, `#contact`.  
Sub-pages exist at `/about`, `/gallery`, `/services`, `/contact` using `HeroScene` — these are stub/placeholder pages, not the main experience.

### File Map

| Path | Purpose |
|------|---------|
| `src/app/layout.tsx` | Root layout — `"use client"`, Lenis smooth-scroll init, Google Fonts (Rethink Sans + Playfair Display), `<CustomCursor />` |
| `src/app/(site)/layout.tsx` | Site layout — renders `<Header />` + children. Server component. |
| `src/app/(site)/page.tsx` | Home — all sections stacked: `HomeHero → AboutSection → GallerySection → ServicesSection → ContactSection → Footer` |
| `src/components/scenes/HomeHero.tsx` | Fullscreen hero (`id="home"`) — clip-path text reveal, red radial glow, corner brackets, floating stats, year stamp |
| `src/components/scenes/HeroScene.tsx` | Generic hero for sub-pages — accepts `title`, `subtitle`, `cta` props |
| `src/components/scenes/StoryScene.tsx` | Content block for sub-pages — text + optional image, GSAP scroll reveal |
| `src/components/sections/AboutSection.tsx` | `bg-white` section (`id="about"`) — word-by-word GSAP scrub reveal, animated counters, `fromTo` pattern |
| `src/components/sections/GallerySection.tsx` | Project list (`id="gallery"`) + modal with vertical image slider (Framer Motion `AnimatePresence`) |
| `src/components/sections/ServicesSection.tsx` | `bg-[#FF0000]` section (`id="services"`) — red marquee banner + sticky card stack with Framer Motion scale shrink |
| `src/components/sections/ContactSection.tsx` | `bg-white` section (`id="contact"`) — contact form, SVG doodle strip with draw-in animation |
| `src/components/ui/Header.tsx` | Fixed bottom nav — scroll-spy via GSAP ScrollTrigger, section-aware color adaptation |
| `src/components/ui/Footer.tsx` | `bg-transparent` footer — logo, copyright, social links |
| `src/components/ui/CustomCursor.tsx` | `mix-blend-difference` dot + ring follower, scales on `[data-cursor-hover]`, hidden on touch |
| `src/components/ui/RunnerDoodle.tsx` | Fixed bottom spotlight doodle — **defined but NOT rendered anywhere currently** |
| `src/components/transitions/PageTransition.tsx` | Framer Motion page transition — **defined but NOT used in any layout** |
| `src/components/sections/Hero.tsx` | Legacy hero — **unused**, superseded by `HomeHero` |
| `src/lib/lenis.ts` | `initLenis()` / `getLenis()` / `destroyLenis()` — singleton, duration 1.2, custom easing |
| `src/lib/utils.ts` | `cn()` — clsx wrapper for class merging |
| `src/styles/globals.css` | CSS vars, `.section-padding`, `.reveal-up` base states, scrollbar hide, cursor hide |
| `tailwind.config.ts` | Brand color tokens + font families |
| `public/gallery/` | 5 static gallery images |

### Unused / Dormant Files

These exist but are **not imported or rendered** anywhere:
- `src/components/ui/RunnerDoodle.tsx` — defined, not in any layout
- `src/components/transitions/PageTransition.tsx` — defined, not wrapping any layout
- `src/components/sections/Hero.tsx` — legacy, replaced by `HomeHero`
- `src/components/animations/` — empty directory

---

## Color Palette (NON-NEGOTIABLE)

| Role | CSS Variable / Value | Usage |
|------|---------------------|-------|
| **Primary Red** | `#FF0000` / `text-primary` | CTAs, accents, highlights, hover states, active indicators |
| **Background** | `#000000` / `bg-background` | Page background, hero, dark sections |
| **Foreground** | `#FFFFFF` / `text-foreground` | Headings, active nav text |
| **Surface** | `#0d0d0d` | Dark card backgrounds (services) |
| **Muted** | `#666666` | Body text, secondary labels |
| **Border** | `rgba(255,255,255,0.08)` | Hairlines, dividers on dark backgrounds |
| **White sections** | `bg-white` | About section, Contact section |
| **Gallery modal** | `#EEEBE4` | Warm cream editorial panel |

**Forbidden:** Green, blue, teal, purple, multi-color gradients, tech/SaaS aesthetic.

---

## Typography

| Class | Font | Usage |
|-------|------|-------|
| `font-display` | Rethink Sans | Section headings, display text |
| `font-sans` | Rethink Sans | Body text, labels, UI elements |
| `font-serif` | Playfair Display | Gallery modal titles (italic) |

- Weights loaded: 400, 500, 600, 700, 800 (Rethink Sans) + italic 400/500/700/900 (Playfair Display)
- Loaded via Google Fonts `<link>` tags in `src/app/layout.tsx`

---

## Layout System

- **`.section-padding`**: Horizontal padding `2rem` → `4rem` (md) → `6rem` (xl) — defined in `globals.css`
- **`max-w-7xl mx-auto`**: Content container on all sections
- **Inline `style={{ paddingTop, paddingBottom }}`**: Vertical section spacing (not Tailwind classes)
- **`min-h-screen`**: Hero fills viewport; other sections size to content
- **Path alias:** `@/*` → `src/*`

---

## Header — Current State

The header is a **fixed bottom nav** (`fixed bottom-8 left-0 right-0 z-50 flex justify-center`).

- **No background** — fully transparent, no backdrop blur
- **Scroll-spy:** GSAP `ScrollTrigger.create` watches each section ID
- **Color adaptation:** `lightSections = new Set(["about", "contact"])` — text switches to dark colors over white sections, white over dark sections
- **Active indicator:** 2px red `bg-[#FF0000]` underline beneath active item, width animates `w-0 → w-6`
- **Entrance animation:** GSAP `gsap.from()` — y:30→0, opacity 0→1, delay 0.4s
- **Logo:** "A7" text in `#FF0000`, `font-display font-black`
- **Nav items:** Home, About, Gallery, Services, Contact — `scrollIntoView({ behavior: "smooth" })`
- **No "Let's Talk" CTA** in current build
- **Hidden on mobile:** Nav links use `hidden md:flex`

---

## Animation Techniques

### GSAP + ScrollTrigger
Used in: `Header`, `HomeHero`, `AboutSection`, `ContactSection`, `RunnerDoodle`

- **Critical: always use `gsap.fromTo()`** for `.reveal-up` elements — never `gsap.to()` alone  
  _Reason:_ `globals.css` sets `.reveal-up { opacity: 0; transform: translateY(50px); }`. `gsap.to()` can't override CSS starting state.
- **Always wrap in `gsap.context()`** + `ctx.revert()` in `useEffect` cleanup
- Word-reveal: `stagger: 0.1`, scrub, `start: "top 80%"`, `end: "top 40%"`
- Counter animation: `gsap.to({ val: 0 }, { val: target, onUpdate })` with ScrollTrigger

### Framer Motion
Used in: `ServicesSection`, `GallerySection`, `ContactSection`

- **Services cards:** Sticky containers (`height: calc(100vh - 200px)`), `useScroll` + `useTransform` for scale shrink, `targetScale = 1 - (n - i) * 0.02`, card offset: `top: calc(-3vh + i*12px)`
- **Gallery modal:** `AnimatePresence` controls modal open/close. `ImageSlider` uses vertical slide animation (y axis, not horizontal). Wheel events are trapped to drive image transitions.
- **Framer Motion v12 TypeScript caveat:** Bezier ease arrays `[0.76, 0, 0.24, 1]` must be typed as `[number,number,number,number]` tuples or use a const. Alternatively, use direct `animate`/`transition` props instead of `variants` objects to avoid `Variants` type issues.
- **`"use client"`** required on all Framer Motion components

### Lenis (Global)
- `initLenis()` called once in root layout `useEffect`
- Singleton pattern — module-level instance
- Hidden scrollbar via CSS (`scrollbar-width: none`)

---

## GallerySection — Modal Structure

```
ProjectModal (fixed inset-0 z-[60])
├── Backdrop (bg-black/75 backdrop-blur-sm)
└── Modal card (1100px max, 50/50 split, md:rounded-2xl)
    ├── Left: ImageSlider (50% width)
    │   ├── Vertical wheel-trapped image slides (AnimatePresence)
    │   ├── Project counter badge (top-left)
    │   └── Image dots (bottom-right)
    └── Right: Editorial panel (bg-[#EEEBE4])
        ├── Breadcrumb bar (A7 / Gallery / Category) + close X
        ├── Content: category label, serif italic title, red rule, description, metadata
        └── Bottom: prev/next navigation with arrows
```

- 5 projects: Brand Vision, Team Innovation, Invitation Gala, Crimson Experience, Corporate Summit
- Keyboard nav: Arrow keys cycle projects, Escape closes
- Inline `style={{}}` used for padding (guarantees rendering vs Tailwind class issues)

---

## ContactSection — Structure

```
ContactSection (bg-white, paddingTop: 9rem, paddingBottom: 7rem)
├── "Contact" label + horizontal rule
├── Grid (2 cols on lg)
│   ├── Left: Heading, red bar, body copy, email + phone links
│   └── Right: Form (Name, Email, Subject, Message) + "Send Message" button
└── Doodle strip (border-t border-black/10 pt-40 mt-24)
    ├── "What We Do" heading (text-center)
    └── 4-col doodle grid (Live Stage, Celebration, Film & Media, Awards & Gala)
```

- SVG doodles animate via `strokeDashoffset` draw-in, triggered `onComplete` of strip fade-in
- Doodle strip uses separate `doodleStrip` ref for independent ScrollTrigger targeting
- Form states: `idle | loading | success | error`

---

## Key CSS Rules (globals.css)

```css
overflow-x: clip;           /* NOT hidden — hidden breaks sticky positioning */
scrollbar-width: none;       /* Lenis handles scroll UX */
cursor: none;               /* Custom cursor on desktop */
::selection { background: #FF0000; color: #fff; }
a, button { cursor: none; } /* Touch devices: cursor: pointer via @media (pointer: coarse) */

.section-padding { /* 2rem → 4rem → 6rem responsive horizontal padding */ }

.reveal-up   { opacity: 0; transform: translateY(50px); }  /* GSAP must use fromTo() */
.reveal-left { opacity: 0; transform: translateX(-50px); }
.reveal-right { opacity: 0; transform: translateX(50px); }
.reveal-scale { opacity: 0; transform: scale(0.95); }
```

---

## z-index Stack

| Element | z-index | Notes |
|---------|---------|-------|
| Custom cursor | `z-[9999]` / `z-[9998]` | Dot + ring, always on top |
| Gallery modal | `z-[60]` | Overlays everything except cursor |
| Header | `z-50` | Fixed nav |
| RunnerDoodle | `z-50` | Fixed bottom, `pointer-events-none` (if re-enabled) |

---

## Component Conventions

- **Exports:** Named exports (`export function ComponentName()`) — except `RunnerDoodle` which is default
- **`"use client"`:** Required on any component using hooks, GSAP, or Framer Motion
- **`data-cursor-hover`:** Add to all buttons/links for CustomCursor scale effect
- **Inline styles:** For dynamic/JS-computed values, GSAP targets, and guaranteed padding
- **Tailwind classes:** For static layout, typography, responsive breakpoints
- **Section IDs:** Every main section must have an `id` matching the nav link (`home`, `about`, `gallery`, `services`, `contact`)

---

## Dependencies — Notes

- **Two Lenis packages installed:** `lenis` (v1.3.23, actively used) and `@studio-freight/lenis` (v1.0.42, legacy — can be removed)
- **GSAP 3.15** — not the paid GSAP Club plugins
- **Framer Motion 12** — stricter TypeScript types than v10/v11; avoid `Variants` type for bezier ease, prefer direct `animate` props or typed tuple constants

---

## Common Pitfalls & Fixes

| Problem | Cause | Fix |
|---------|-------|-----|
| GSAP reveal not animating | `.reveal-up` sets `opacity:0` in CSS; `gsap.to()` can't override | Use `gsap.fromTo({opacity:0,y:30}, {opacity:1,y:0})` |
| Framer Motion `ease` type error | `[0.76, 0, 0.24, 1]` inferred as `number[]`, not tuple | Declare `const E: [number,number,number,number] = [...]` or use direct `animate` props |
| File has invalid UTF-8 bytes | PowerShell `Set-Content` default encoding | Use `[System.IO.File]::WriteAllText(path, content, [System.Text.Encoding]::UTF8)` |
| SVG doodles invisible | `.reveal-up` opacity:0 AND `strokeDashoffset` hiding paths | Fade strip first, draw paths in `onComplete` |
| Sticky sections broken | `overflow-x: hidden` on body | Use `overflow-x: clip` instead |
| Tailwind classes not applying padding | Tailwind v4 purge or @theme issues | Use inline `style={{}}` for critical spacing |
| Port conflict on `npm run dev` | Port 3000 already occupied | `npx next build` to verify; kill existing process or use `--port` flag |

---

## Before You Code

1. **Brand colors only** — `#FF0000` red, `#000000` black, `#FFFFFF` white. No exceptions.
2. **Never `overflow-x: hidden`** on html/body — breaks sticky positioning
3. **Always `gsap.fromTo()`** for `.reveal-up` elements, never `gsap.to()`
4. **Always `gsap.context()` + cleanup** — `ctx.revert()` in `useEffect` return
5. **`.section-padding` + `max-w-7xl mx-auto`** for consistent alignment
6. **White sections** (`AboutSection`, `ContactSection`) — use dark text (`#0a0a0a`, `#1a1a1a`, `#3a3a3a`)
7. **`"use client"`** on every component with hooks, GSAP, or Framer Motion
8. **`data-cursor-hover`** on all interactive elements
9. **Test responsive** — mobile-first Tailwind (`sm:`, `md:`, `lg:`, `xl:`)
10. **Run `npx next build`** to confirm zero errors before finishing
