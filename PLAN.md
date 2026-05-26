# A7 Entertainment — Premium Redesign & SEO Implementation Plan

## Context
The website has a strong cinematic foundation but is commercially incomplete. Three critical problems:
1. **SEO is almost nonexistent** — only a 2-field metadata export, no schema, no sitemap, no robots.txt, no OG tags. Google cannot properly index or preview the site.
2. **Conversion flow is broken** — no CTA in the hero, no WhatsApp contact (essential for the Indian market), sub-page contact form is not wired to the API.
3. **Content depth is thin** — Services section skips "04", is missing Wedding/Corporate/Stage services, and has no FAQ (huge SEO opportunity).

The implementation is organized into 5 phases, smallest blast radius first.

---

## Audit Summary

### What's Working Well
- Cinematic aesthetic, GSAP + Framer Motion animations, sticky card stack, gallery modal, custom cursor, Lenis scroll
- 6 real projects in gallery with strong narrative descriptions
- Contact API handler is fully implemented (Resend, validation, HTML email)
- Video hero with post-FCP deferred injection
- Mobile nav with color-adaptive scroll-spy

### Critical Gaps
| Area | Issue |
|------|-------|
| SEO | Root metadata: only `title` + `description`. No OG, no Twitter, no schema, no canonical |
| SEO | No `robots.txt`, no `sitemap.xml`, no favicon |
| SEO | Sub-pages (about, services, gallery, contact) have zero metadata exports |
| SEO | No JSON-LD schema (Organization, LocalBusiness, Service) |
| SEO | Gallery images have no alt text |
| Conversion | Hero section has no CTA button — visitors have no obvious next action |
| Conversion | No WhatsApp contact (critical in Indian market) |
| Conversion | Sub-page `/contact` form is NOT wired to `/api/contact` |
| Content | Services jump 01→02→03→05→06→07 (missing "04") |
| Content | Missing services: Wedding Entertainment, Corporate Events, Stage Shows |
| Content | No FAQ section (major SEO + conversion opportunity) |
| Technical | `next.config.ts` is empty — no image optimization, no headers |
| Technical | Hero video is 29.7 MB (needs WebM alternative + poster image) |
| Technical | Footer copyright year is hardcoded "2026" |

---

## Phase 1 — SEO Foundation (Highest Impact, Least Risk)

### 1A. Comprehensive Root Metadata (`src/app/layout.tsx`)
Replace the 2-field metadata object with a full Next.js `Metadata` export:

```typescript
export const metadata: Metadata = {
  metadataBase: new URL("https://www.a7entertainment.in"),
  title: {
    default: "A7 Entertainment | Event Management & Digital Marketing Agency",
    template: "%s | A7 Entertainment",
  },
  description: "A7 Entertainment is a premium event management and digital marketing agency in India. We specialize in celebrity management, brand launches, film promotions, corporate events, and influencer marketing.",
  keywords: [
    "event management company India",
    "event management agency Kerala",
    "celebrity management India",
    "brand activation agency",
    "film promotions India",
    "influencer marketing agency",
    "corporate event management",
    "digital marketing agency India",
    "wedding entertainment India",
    "stage show production",
    "event planner India",
    "A7 Entertainment",
  ],
  openGraph: {
    type: "website",
    url: "https://www.a7entertainment.in",
    siteName: "A7 Entertainment",
    title: "A7 Entertainment | Event Management & Digital Marketing Agency",
    description: "Premium event management and digital marketing agency. Celebrity management, brand launches, film promotions, and more.",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "A7 Entertainment" }],
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "A7 Entertainment | Event Management & Digital Marketing Agency",
    description: "Premium event management and digital marketing agency in India.",
    images: ["/og-image.jpg"],
  },
  robots: { index: true, follow: true },
  alternates: { canonical: "https://www.a7entertainment.in" },
};
```

### 1B. JSON-LD Organization + LocalBusiness Schema (`src/app/layout.tsx`)
Add a `<script type="application/ld+json">` block inside `<body>` (before `{children}`):

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["Organization", "LocalBusiness"],
      "@id": "https://www.a7entertainment.in/#organization",
      "name": "A7 Entertainment",
      "url": "https://www.a7entertainment.in",
      "logo": "https://www.a7entertainment.in/logo-white.png",
      "description": "Premium event management and digital marketing agency...",
      "foundingDate": "2016",
      "telephone": "+919886112547",
      "email": "enquiry@a7entertainment.in",
      "sameAs": [
        "https://www.instagram.com/a7entertainment/",
        "https://www.linkedin.com/company/a7entertainment"
      ],
      "areaServed": ["India", "Kerala", "UAE"],
      "serviceType": [
        "Event Management", "Celebrity Management", "Brand Activation",
        "Film Promotions", "Influencer Marketing", "Digital Marketing",
        "Corporate Events", "Wedding Entertainment", "Stage Show Production"
      ]
    },
    {
      "@type": "WebSite",
      "@id": "https://www.a7entertainment.in/#website",
      "url": "https://www.a7entertainment.in",
      "name": "A7 Entertainment",
      "publisher": { "@id": "https://www.a7entertainment.in/#organization" }
    }
  ]
}
```

### 1C. Sub-page Metadata Exports
Add `export const metadata: Metadata = { ... }` to each sub-page:

- `src/app/(site)/about/page.tsx` — title "About Us", description about the company
- `src/app/(site)/services/page.tsx` — title "Our Services", keyword-rich description
- `src/app/(site)/gallery/page.tsx` — title "Portfolio & Projects"
- `src/app/(site)/contact/page.tsx` — title "Contact Us", LocalBusiness info

### 1D. Robots & Sitemap
- **Create `public/robots.txt`:**
  ```
  User-agent: *
  Allow: /
  Sitemap: https://www.a7entertainment.in/sitemap.xml
  ```
- **Create `src/app/sitemap.ts`:** Returns all 5 routes with `lastModified` and `priority`

### 1E. `next.config.ts` Optimization
```typescript
const nextConfig: NextConfig = {
  images: {
    formats: ["image/webp", "image/avif"],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
      {
        source: "/(.*)\\.(jpg|jpeg|png|webp|avif|svg|ico)",
        headers: [{ key: "Cache-Control", value: "public, max-age=2592000, immutable" }],
      },
    ];
  },
};
```

### 1F. OG Image
Create `src/app/opengraph-image.tsx` using `ImageResponse` from `next/og` — generates a branded 1200×630 card at build time. Red background, white A7 logo, tagline text.

### 1G. Favicon
Add `icons: { icon: "/favicon.ico", apple: "/apple-touch-icon.png" }` to metadata. Use the existing `logo-black.png` converted to ico via a simple Next.js icon route (`src/app/icon.tsx`).

---

## Phase 2 — Homepage Conversion & Content

### 2A. Hero Section CTA (`src/components/scenes/HomeHero.tsx`)
Add a single CTA button in the center of the hero (below the tagline), appearing after the clip-path reveal completes:

- **Copy:** "Explore Our Work" (scrolls to `#gallery`) or "Get a Quote" (scrolls to `#contact`)
- **Style:** Transparent background, white border, white text — `hover:bg-white hover:text-black` (500ms)
- Add `data-cursor-hover` attribute
- Animate with GSAP: fade in after the tag line reveals, delay ~1.8s
- Mobile: reduce font size, maintain tap target ≥44px

### 2B. Services Section Expansion (`src/components/sections/ServicesSection.tsx`)
Add 3 missing services and fix the numbering gap:

New services to add (renumber sequentially 01–09):
```
04 — Corporate Events
    "From boardroom to ballroom. We design and execute end-to-end corporate experiences — conferences, product launches, award ceremonies, and team events — that drive engagement and reinforce your brand's prestige."
    Tag: "Corporate & B2B"

08 — Wedding Entertainment  
    "Your biggest day, flawlessly produced. We orchestrate premium wedding entertainment — from artist performances and stage design to full event production — creating celebrations that last a lifetime."
    Tag: "Weddings & Celebrations"

09 — Stage Production
    "Full-scale live production. Lighting, sound, staging, crew coordination — we handle every technical element of your show so the performance takes centre stage."
    Tag: "Live Production"
```

Update marquee to include: `"Events · Concerts · Weddings · Film · Corporate · Production · Management"`

### 2C. Testimonials Section
**Skipped** — user confirmed to omit for now.

### 2D. Contact Section Enhancements (`src/components/sections/ContactSection.tsx`)

**Add WhatsApp CTA:** Below the phone number, add a WhatsApp button:
```html
<a href="https://wa.me/919886112547?text=Hi%2C%20I%27d%20like%20to%20discuss%20an%20event." 
   target="_blank" 
   data-cursor-hover>
  WhatsApp Us →
</a>
```
Style: same as existing contact links (red on hover)

**Add Business Location Signal (for local SEO):**
Below contact links, add a small "Serving clients across India & UAE" text.

### 2E. Footer (`src/components/ui/Footer.tsx`)

1. **Fix dynamic copyright year:**  
   Replace `"© 2026"` → `© {new Date().getFullYear()}`

2. **Add location text** (one-liner below copyright): `India & UAE`

### 2F. FAQ Section (New Component — SEO Critical)
**New file:** `src/components/sections/FAQSection.tsx`  
Insert at the end of the homepage, before `Footer`.

Structure:
```
FAQSection (bg-white, paddingTop: 6rem, paddingBottom: 6rem)
├── Section label + divider
├── Heading: "Frequently Asked" + "Questions"  
└── Accordion list (click to expand)
    Each item: Question (h3) + Answer (paragraph)
```

FAQ Data:
```typescript
const faqs = [
  { q: "What types of events does A7 Entertainment manage?", a: "We manage the full spectrum — from large-scale concerts and film promotions to corporate conferences, brand activations, wedding entertainment, and cultural festivals." },
  { q: "Do you manage celebrity bookings for events?", a: "Yes. Our celebrity management arm handles talent identification, negotiations, logistics, and on-ground coordination for both national and international artists." },
  { q: "Which cities and regions do you operate in?", a: "We operate pan-India with a strong presence in Kerala, and have delivered international productions in Dubai, UAE." },
  { q: "How do I get a quote for my event?", a: "Reach out through our contact form or WhatsApp us directly. We'll schedule a consultation to understand your vision and provide a detailed proposal." },
  { q: "Do you offer digital marketing alongside event management?", a: "Yes. Our digital marketing division runs performance marketing, social media, influencer campaigns, and content production — often integrated with live events for maximum reach." },
  { q: "What is A7 Studio?", a: "A7 Studio is our in-house content production facility offering professional shoot spaces, podcast setups, and post-production support for brands and creators." },
]
```

**Add FAQ JSON-LD schema inline** as a `<script type="application/ld+json">` block with `@type: "FAQPage"`.

Add `FAQSection` to `src/app/(site)/page.tsx` lazy-loaded with `dynamic()`.

---

## Phase 3 — Image SEO & Gallery

### 3A. Gallery Image Alt Text (`src/components/sections/GallerySection.tsx`)
Add descriptive `alt` attributes to all `<Image>` tags:

| File | Alt text |
|------|----------|
| `/gallery/team-experts.jpg` | "A7 Entertainment event production team" |
| `/gallery/red-silhouettes.jpg` | "Live concert crowd at A7 Entertainment event" |
| `/gallery/brand-design.jpg` | "Brand activation event by A7 Entertainment" |
| `/gallery/invitation-event.jpg` | "A7 Entertainment gala event production" |
| `/gallery/team-innovation.jpg` | "A7 Entertainment creative team planning session" |

### 3B. Next.js `<Image>` Component
Replace any raw `<img>` tags in gallery/about sections with Next.js `<Image>` for automatic WebP conversion and lazy loading.

---

## Phase 4 — Sub-page Polish

### 4A. Wire Contact Form (`src/app/(site)/contact/page.tsx`)
The sub-page contact form is NOT connected to `/api/contact`. Copy the form state machine from `ContactSection.tsx` (idle/loading/success/error) and wire the submit handler to POST to `/api/contact`.

### 4B. Gallery Sub-page (`src/app/(site)/gallery/page.tsx`)
Replace "Gallery components coming soon" with the actual `GallerySection` component (already exists, just import and render it).

### 4C. About Sub-page (`src/app/(site)/about/page.tsx`)
Add proper metadata export and improve content to match the homepage About section quality.

---

## Phase 5 — Premium UI Polish

### 5A. Services Card Number Fix
Renumber all services sequentially so there's no gap. Update the `number` field in the `services` array.

### 5B. About Section "Why Us" Micro-section (`src/components/sections/AboutSection.tsx`)
Add 3 differentiator points below the existing copy:
```
→ Proven at Scale: 200+ events, including international productions in Dubai
→ End-to-End: From concept and talent management to production and digital amplification  
→ Decade of Trust: 10+ years building experiences across entertainment and media
```

---

## Critical Files to Modify

| File | Changes |
|------|---------|
| `src/app/layout.tsx` | Full metadata object, JSON-LD schema, favicon icon |
| `src/app/(site)/about/page.tsx` | Add metadata export |
| `src/app/(site)/services/page.tsx` | Add metadata export |
| `src/app/(site)/gallery/page.tsx` | Add metadata export + render GallerySection |
| `src/app/(site)/contact/page.tsx` | Add metadata export + wire form to API |
| `src/app/(site)/page.tsx` | Add FAQSection import |
| `src/components/scenes/HomeHero.tsx` | Add CTA button |
| `src/components/sections/ServicesSection.tsx` | Add 3 services, fix numbering, update marquee |
| `src/components/sections/ContactSection.tsx` | Add WhatsApp button, location signal |
| `src/components/sections/GallerySection.tsx` | Add alt text, use Next.js Image |
| `src/components/ui/Footer.tsx` | Dynamic year, location text |
| `next.config.ts` | Image optimization, security headers |

## New Files to Create

| File | Purpose |
|------|---------|
| `src/app/sitemap.ts` | Dynamic sitemap |
| `src/app/opengraph-image.tsx` | OG image via next/og |
| `src/app/icon.tsx` | Favicon via next/og |
| `src/components/sections/FAQSection.tsx` | FAQ accordion with JSON-LD schema |
| `public/robots.txt` | Crawl instructions |

---

## Implementation Order

1. **Phase 1** — SEO changes are zero-risk and highest business impact
2. **Phase 2A (Hero CTA)** — small code change, big conversion impact
3. **Phase 2B (Services expansion)** — adds content depth + fixes numbering gap
4. **Phase 2D (WhatsApp)** — 5-minute change, critical for Indian market
5. **Phase 2E (Footer)** — quick wins
6. **Phase 2F (FAQ)** — highest SEO impact content addition
7. **Phase 3 (Image SEO)** — methodical, low-risk
8. **Phase 4 (Sub-pages)** — after main page is solid
9. **Phase 5 (UI Polish)** — final refinements

---

## Verification Steps

After each phase:
1. `npx next build` — must produce zero TypeScript/ESLint errors
2. Open `http://localhost:3000` — check the changed sections visually
3. Phase 1: Check page source for `<title>`, `<meta og:*>`, and `<script type="application/ld+json">`
4. Phase 2: Verify WhatsApp link opens correctly, hero CTA scrolls to gallery
5. Phase 2F: Validate FAQ schema at https://validator.schema.org
6. Phase 4: Submit contact form on `/contact` page — verify email arrives at enquiry@a7entertainment.in
7. Final: Run Lighthouse SEO audit

---

## Confirmed Decisions
- **Testimonials:** Skipped for now
- **WhatsApp number:** `+919886112547` (same as phone in ContactSection)
