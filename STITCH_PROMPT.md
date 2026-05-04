# A7 Entertainment — Stitch UI Prompt

Design a **cinematic single-page scroll website** for **A7 Entertainment**, a luxury event production and artist management company. The aesthetic is editorial, dark, and high-end — inspired by award-winning creative studios.

---

## Brand Identity

- **Name:** A7 Entertainment
- **Tagline:** "Creating experiences that move people"
- **Tone:** Cinematic · Luxury · Minimal · Editorial
- **Industry:** Event production, concert management, film promotions, corporate events

---

## Color Palette

| Role | Value |
|---|---|
| Background | `#0A0A0A` (near-black, not pure black) |
| Surface / Cards | `#111111` |
| Elevated Surface | `#161616` |
| Foreground / Text | `#F0F0F0` |
| Muted Text | `#555555` – `#777777` |
| Subtle Text | `#333333` |
| Primary Accent | `#C41E1E` (deep crimson red) |
| Primary Hover | `#FF2A2A` (brighter red) |
| Borders | `rgba(255,255,255, 0.04)` – `rgba(255,255,255, 0.06)` (barely visible) |

Red is used **only as an accent** — for divider lines, label text, hover highlights, and subtle illumination glows. Never as a solid background fill.

---

## Typography

- **Display / Headings:** Playfair Display — serif, weights 400–700
- **Body / UI:** Inter — sans-serif, weights 300–600
- **Label / Tracking text:** Inter, uppercase, letter-spacing `0.3em`–`0.5em`, 10–11px
- **Hero headline:** Playfair Display Bold, very large (up to 12rem on desktop), tight line-height ~0.85
- **Section headings:** Playfair Display Bold, 4rem–5rem desktop, leading ~1.05

---

## Layout System

- **Max content width:** `max-w-7xl` (80rem) centered with `mx-auto`
- **Horizontal padding:** 2rem mobile → 4rem tablet → 6rem desktop (consistent across ALL sections)
- **All sections use identical padding** — no section bleeds to the edge
- **Section spacing:** `py-32` to `py-40` (128px–160px vertical padding per section)
- Subtle gradient section-line dividers between sections (horizontal rule that fades to transparent at edges)

---

## Header / Navigation

Fixed, transparent on load. On scroll: `backdrop-blur-xl` + `bg-[#0A0A0A]/80`.

- **Logo:** "A7" — Playfair Display, tracked, top-left
- **Center nav:** 5 links — Home, About, Gallery, Services, Contact
  - Uppercase, 11px, Inter, wide letter-spacing
  - Active state: small red underline beneath the active item
  - Hover: text brightens to white
- **Right CTA:** "Let's Talk" text + expanding red horizontal line on hover
- Header height: 80px (h-20)
- Scroll-spy: active nav item updates as user scrolls between sections

---

## Section 1 — Hero (Full Screen)

Full viewport height, centered content.

- Massive "A7" in Playfair Display Bold (~12rem desktop), tight leading
- Below it: "Entertainment" in Playfair light weight, wide tracking (~0.2em), ~4.5rem
- Short red horizontal divider line (16px wide, 1px tall) below the text block
- Tagline below: "Creating experiences that move people" — Inter, uppercase, very wide tracking, muted color `#555`
- Faint crimson radial glow behind the text (very subtle, opacity ~0.04)
- Bottom: "SCROLL" label + vertical gradient line as scroll indicator, floating animation

**Animation:** Clip-path text reveal — text unmasks upward from bottom using `polygon()` transition on page load.

---

## Section 2 — About

Two-column text layout + animated statistics.

**Top:**
- Section label: "About Us" — uppercase, `#C41E1E`, tracked
- Large heading spanning left column: "We craft events that define moments" — Playfair Display Bold
- Animation: word-by-word opacity fade-in synced to scroll (each word transitions from dim to full brightness as you scroll)

**Body (2-column grid):**
- Left column: paragraph about cinematic storytelling and luxury production
- Right column: paragraph about technical precision and creative vision
- Both in Inter, `#777`, line-height 1.8

**Stats row (4 columns, below a subtle border):**
- 200+ Events Produced
- 50+ Artists Managed
- 10+ Years Experience
- 15M+ Audience Reached
- Large Playfair Bold numbers, red suffix (+, M+)
- Counter animation: numbers count up when scrolled into view

---

## Section 3 — Gallery / Portfolio

**Header:**
- Left: "Portfolio" label (red) + "Selected / Works" heading
- Right: short description text, right-aligned

**Grid:** 3-column (desktop), 2-col (tablet), 1-col (mobile) — 6 cards

**Each card:**
- Aspect ratio 4:5 (portrait)
- Dark background `#111`
- Category label top-left (uppercase, muted)
- Item number top-right (very dim)
- Giant ghost number centered (e.g. "01", "02") — barely visible, opacity ~0.02
- Bottom: project title (Playfair Bold) + hidden description

**Hover state (per card):**
- Red-tinted gradient overlay appears at top (subtle, `rgba(196,30,30, 0.12)`)
- 1px red vertical accent line animates down the left edge of the card
- Ghost number tints to dim red
- Description text slides in beneath title
- Arrow ( — View ) slides in from left

**Animation:** Cards stagger-reveal on scroll entry

---

## Section 4 — Services

**Full-width animated marquee** at the top (before section content):
- Text: "Events · Concerts · Film · Corporate · Production · Management" — repeating, very dark (`#2a2a2a`), uppercase, infinite scroll
- Sits between two very subtle horizontal borders

**Below marquee (inside content container):**
- "Services" label (red, uppercase)
- Heading: "What We / Deliver" — Playfair Bold

**Service list (4 items, separated by hairline borders):**

Each row:
- Service number (01–04) — left, very dim, turns red on hover
- Service title — center, Playfair Bold, large (2xl–4xl)
- Description — right, Inter, muted, max ~320px wide
- Arrow icon — far right, hidden → slides in on hover

**Hover state (entire row):**
- Very subtle background highlight (`rgba(255,255,255, 0.015)`)
- Number turns red
- Arrow slides in from left

---

## Section 5 — Contact

Two-column layout (info left, form right).

**Left column:**
- "Contact" label (red)
- Heading: "Let's Create / Something / Unforgettable" — Playfair Bold, 5rem desktop
- Description paragraph — muted
- Two contact links (email, phone):
  - Short horizontal line + text
  - On hover: line expands and turns red, text brightens

**Right column — Form:**
- 4 fields: Name, Email, Subject, Message (textarea)
- Floating label inputs — label floats up on focus (transforms to tiny uppercase red label)
- Underline-only input style (no border box) — `border-b` only, turns red on focus
- Submit button: bordered rectangle, **red fill slides in from left on hover**, text turns white

**Footer (below both columns):**
- Hairline divider
- "© 2026 A7 Entertainment" — left
- "All rights reserved" — right
- Both in tiny tracked uppercase, very dark

---

## Interactions & Animations

| Element | Behavior |
|---|---|
| **Custom cursor** | Small white dot + larger ring follower. `mix-blend-difference` so it inverts color on hover. Scales on interactive elements. Hidden on mobile/touch. |
| **Smooth scroll** | Lenis smooth scroll library — eased, momentum-based page scrolling |
| **Hero text reveal** | Clip-path `polygon()` mask — text unmasks upward on page load |
| **About heading** | Per-word opacity stagger, scrub-linked to scroll position |
| **Section labels** | Fade + slide up on scroll entry |
| **Gallery cards** | Stagger reveal on scroll, hover transforms per card |
| **Service rows** | Stagger fade-in, hover row highlight + arrow slide |
| **Contact reveals** | Fade + translate-Y on scroll entry |
| **Marquee** | Infinite horizontal ticker, 25s loop, very dark text |
| **Section dividers** | 1px gradient line, fades to transparent on both ends |
| **Nav scroll-spy** | Active section auto-detects via ScrollTrigger, updates nav underline |

---

## Overall Feel

Think: **Awwwards-worthy dark editorial**. Long vertical scroll. Very generous whitespace. Typography does the heavy lifting. Red is used like a spotlight — it draws attention to exactly one thing at a time, never overwhelming. The palette has depth through surface layering (`#0A0A0A` → `#111` → `#161616`) rather than adding bright colors. The experience should feel like walking into an exclusive private preview of something very carefully made.
