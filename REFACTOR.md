# Refactored Architecture

## Component Hierarchy

```
src/components/
├── transitions/
│   ├── PageTransition.tsx      → Framer Motion page fade+scale (6s, wait mode)
│   └── index.ts                → Exports
├── scenes/
│   ├── HeroScene.tsx           → Full-screen hero with title, subtitle, dual CTA
│   ├── StoryScene.tsx          → Two-column story section, GSAP scroll trigger
│   └── index.ts                → Exports
├── sections/
│   ├── Hero.tsx                → Existing hero component
│   └── [other sections]        → Reusable layout blocks
├── animations/
│   └── [GSAP utilities]        → Animation helpers
└── ui/
    └── [atoms]                 → Buttons, cards, forms
```

## Page Structure

```
src/app/(site)/
├── layout.tsx                  → Wraps children with <PageTransition>
├── page.tsx                    → Home (Hero + 2x StoryScene)
├── about/page.tsx              → About (HeroScene + 2x StoryScene)
├── gallery/page.tsx            → Gallery (HeroScene placeholder)
├── services/page.tsx           → Services (HeroScene + grid)
└── contact/page.tsx            → Contact (HeroScene + form)
```

## Key Changes

### PageTransition (Framer Motion)
- Wraps all page content in `src/app/(site)/layout.tsx`
- Triggers on pathname change
- Animation: fade (0→1) + scale (0.98→1) over 0.6s
- Uses `AnimatePresence` with `mode="wait"` for clean transitions

### Scene Components (GSAP + Tailwind)
- **HeroScene:** Title-driven page entry with optional subtitle + dual CTA
- **StoryScene:** Alternating two-column layout (left/right) with scroll triggers
- Both use `gsap.context()` to avoid memory leaks
- ScrollTrigger for viewport-based animations

### Pages
- Each page imports scene components
- Main wrapper maintains brand colors (`bg-background`)
- Ready for section customization

## Setup Complete

✅ Framer Motion installed  
✅ Page transitions integrated  
✅ Multi-page routing (Home, About, Gallery, Services, Contact)  
✅ Scene component library initialized  
✅ GSAP scroll triggers ready  
✅ Lenis smooth scroll active (unchanged)  
✅ Tailwind theming preserved  

**No breaking changes to existing systems.**
