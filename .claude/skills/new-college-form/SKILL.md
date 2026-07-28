---
name: new-college-form
description: Scaffold a new free (no-payment) model-registration form for a college/university, cloning the pattern used for St. Joseph University and Jain University. Use when the user asks to add a registration form for a new college, e.g. "/new-college-form Christ University" or "create a form like Jain's for XYZ College with an ID card number field".
---

# New college registration form

Creates a free, non-payment variant of the model-registration form for a specific college, reusing `ModelRegistrationForm`, `AuditionPDF`, and the shared processing pipeline in `src/lib/auditionProcessing.ts`. This mirrors exactly how `/model-registration-StJosephUniversity` and `/model-registration-JainUniversityJcroad` were built — read both before starting so the new one stays consistent.

**This is strictly additive.** Never modify the paid flow (`/model-registration`, `/api/audition/submit`, `processAuditionSubmission`, `SHEET_HEADERS`) or any other college's route/page/sheet while doing this.

## Before writing anything

Ask the user (if not already given):
1. **College name** (for page copy) and **URL slug** (e.g. `ChristUniversity`, `JainUniversityJcroad`-style — PascalCase, no spaces, matches the existing pattern).
2. **Any extra mandatory field(s)** beyond the standard form (Jain University added a required "University Roll Number" — some colleges may need something similar, e.g. an ID card number; others may need none).
3. Confirm a new Google Sheet will be created for this college and shared with the service account as Editor (same as SJU/Jain) — this is an operational step for the user, not something you can do.

## Steps

### 1. Extend `AuditionData` only if a new extra field is needed
If the college needs a field that doesn't exist yet (like Jain's `universityRollNumber`), add it as an **optional** field to `src/types/audition.ts`, following the existing pattern:
```ts
// University flows only (e.g. Jain University) — mandatory there, absent elsewhere.
universityRollNumber?: string;
```
Never make a college-specific field required at the type level — it must stay optional so the paid form and other colleges' forms are unaffected. Add it to `EMPTY` in `ModelRegistrationForm.tsx` too.

If the college needs no extra field (just name/branding), skip this step — reuse the standard fields.

### 2. Google Sheet header + row builder (`src/lib/auditionProcessing.ts`)
- If reusing the standard 25-column schema (no extra field), no changes needed — pass `includeRollNumber: false` (or omit it) in the `FreeFlowConfig` in step 4.
- If adding a new extra field, follow the `SHEET_HEADERS_FREE_WITH_ROLL` pattern as a *precedent*, not something to reuse directly (that constant is Jain-specific). Create an analogous `SHEET_HEADERS_FREE_WITH_<FIELD>` and a matching `appendFreeRowWith<Field>` function, modeled closely on `appendFreeRowWithRoll`. Put the new field **right after "Full Name"** in the column order (matches the position the user asked for on Jain's sheet), not appended at the end.
- Extend `FreeFlowConfig` (around line 579) with a new flag only if introducing a genuinely new field shape — if it's another roll-number-like single string field, prefer generalizing `includeRollNumber`/`appendFreeRowWithRoll` into a reusable `extraColumn?: { header: string; value: string }` shape rather than duplicating per-college functions. Use judgement: two colleges sharing "one extra ID-like text field" is a strong signal to generalize; don't over-engineer for a single case.
- Self-heal the header check by **content**, not just length (see how `appendFreeRowWithRoll` compares `headerRow[i] === h` for every expected header) — so an existing sheet with the old/blank header row corrects itself on the next submission.

### 3. New submit route: `src/app/api/audition/submit-<slug>/route.ts`
Copy `src/app/api/audition/submit-jain/route.ts` (if the college has an extra required field) or `src/app/api/audition/submit-sju/route.ts` (if not) as the starting point. Keep:
- The honeypot check (`body.website`) — silently return `{ success: true }` if filled.
- The same required-field validation as the existing free routes, plus a `!body.<newField>?.trim()` check only if this college requires an extra field.
- `payment: undefined` stripped before processing.
- Call `processFreeSubmission(data, apiKey, { badge, subjectLabel, sheetId: process.env.GOOGLE_SHEET_ID_<SLUG_UPPER>, sheetIdEnvVar: "GOOGLE_SHEET_ID_<SLUG_UPPER>", includeRollNumber: <true only if extra field> })`.
- `badge` shown in the admin email header, e.g. `"<COLLEGE> · FREE"`. `subjectLabel` used in the admin email subject, e.g. `"<College> Registration"`.

Never point a new college's `sheetId` at an existing college's env var, and never fall back to the paid sheet if the new sheet id is unset — log loudly and skip, matching `appendFreeRow`'s existing behavior.

### 4. New page: `src/app/(site)/model-registration-<Slug>/page.tsx`
Copy `src/app/(site)/model-registration-JainUniversityJcroad/page.tsx` structure exactly:
- `metadata.robots: { index: false, follow: false }` — always noindex, matches SJU/Jain.
- Canonical + OG `url` set to `https://www.a7entertainment.in/model-registration-<Slug>`.
- Hero copy pattern (verbatim except the college name): heading `REGISTRATION — <College Name>.`, subheading `Orion Model Hunt By A7Entertainment & Parker Models.`, then `Complete all sections and submit your application below.` Do not add extra marketing copy — the user has explicitly asked to keep this minimal/consistent across colleges.
- Render `<ModelRegistrationForm mode="free" endpoint="/api/audition/submit-<slug>" universityName="<College Name>" />`, adding `showRollNumber` (or the new equivalent prop) only if this college has an extra mandatory field.

### 5. Form changes (`src/components/sections/ModelRegistrationForm.tsx`) — only if a new extra field is introduced
If reusing the existing roll-number-shaped field pattern, no component changes are needed beyond passing `showRollNumber` — it already renders and validates generically. If a *new kind* of field is needed, follow the existing `showRollNumber` prop as the precedent: add a boolean prop, a conditional `TextInput` placed logically within Section 1, and a `validate()` guard gated on that prop, defaulting to `false`/off so no other college's form is affected.

### 6. PDF (`src/components/pdf/AuditionPDF.tsx`) — only if a new extra field is introduced
Render it conditionally (`data.<field> ? <Field .../> : null`), placed near Phone (matches where `universityRollNumber` was added), so it's invisible on the paid PDF and any college that doesn't use it.

### 7. Admin email body (`src/lib/auditionProcessing.ts`, `buildAdminHtml`)
If a new extra field was introduced, add one `${field("Label", data.<field> ?? "")}` line — `field()` already renders nothing for empty values, so it's safe to include unconditionally in the shared template.

### 8. Document the env var
Add `GOOGLE_SHEET_ID_<SLUG_UPPER>=<sheet id for the free /model-registration-<Slug> flow>` to the environment variables list in root `CLAUDE.md`, next to the existing `GOOGLE_SHEET_ID_SJU` / `GOOGLE_SHEET_ID_JAIN` lines.

## After scaffolding

1. Run `npx next build` and confirm zero errors (this repo's standing rule — see CLAUDE.md "Before You Code").
2. Tell the user explicitly, every time: they must (a) create the new Google Sheet, (b) share it with the service account email from `GOOGLE_SERVICE_ACCOUNT_JSON` as **Editor**, and (c) set `GOOGLE_SHEET_ID_<SLUG_UPPER>` in Vercel, then redeploy. This exact miss (sheet shared as Viewer instead of Editor) caused a real production incident before — call it out clearly, don't bury it.
3. Remind them the URL path segment is case-sensitive and must match exactly what was scaffolded (e.g. `JainUniversityJcroad`, not `jainuniversityjcroad`).

## Non-goals

- Do not add Razorpay/payment to a college form unless explicitly requested — these are free by definition.
- Do not touch `/model-registration`, `/api/audition/submit`, `SHEET_HEADERS`, or `processAuditionSubmission` (the paid pipeline).
- Do not touch any other existing college's route, page, or sheet config.
- Do not add spam protection beyond the honeypot unless asked — that was a deliberate, discussed choice (honeypot + noindex) over a heavier access-code gate.
