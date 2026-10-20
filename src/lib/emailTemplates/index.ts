import { WTL_2026_HTML } from "./wtl2026";
import { A7_INTRO_HTML } from "./a7-intro";
import { ORION_VOUCHER_HTML } from "./orion-voucher";

// ─── Broadcast email templates ──────────────────────────────────────────────
// "default" wraps the operator's typed message in the A7 shell (existing
// behaviour). Designed templates like WTL ship their own full HTML and ignore
// the message box — only the subject stays editable.

export type TemplateId = "default" | "wtl2026" | "a7intro" | "orionVoucher";

/**
 * Which Google Sheet a template sends to.
 *   broadcast — GOOGLE_SHEET_ID_BROADCAST (A=Name, B=Email)
 *   voucher   — GOOGLE_SHEET_ID_ORION_VOUCHER (A=Name, B=Email, C=Voucher Code)
 */
export type RecipientList = "broadcast" | "voucher";

export type TemplateMeta = {
  id: TemplateId;
  label: string;
  /** Recipient sheet this template is sent to. */
  list: RecipientList;
  /** True when the operator's typed message is used as the body. */
  usesMessage: boolean;
  /** Suggested subject, prefilled in the UI. */
  defaultSubject?: string;
  /** Shown in the UI so the operator knows what they're sending. */
  note?: string;
};

export const TEMPLATES: TemplateMeta[] = [
  {
    id: "default",
    label: "Default — A7 message",
    list: "broadcast",
    usesMessage: true,
    note: "Your typed message, wrapped in the standard A7 email shell.",
  },
  {
    id: "wtl2026",
    label: "WTL 2026 — partnership emailer",
    list: "broadcast",
    usesMessage: false,
    defaultSubject: "The Greatest Show on Court is back for 2026",
    note:
      "Pre-designed WTL 2026 emailer. The message box is ignored. Both buttons open WhatsApp to +91 98861 12547.",
  },
  {
    id: "a7intro",
    label: "A7 Entertainment — company intro",
    list: "broadcast",
    usesMessage: false,
    defaultSubject: "A7 Entertainment — Innovate. Create. Inspire.",
    note:
      "Pre-designed A7 company-intro emailer (services, projects, contact). The message box is ignored.",
  },
  {
    id: "orionVoucher",
    label: "Orion × Rare Rabbit — voucher",
    list: "voucher",
    usesMessage: false,
    defaultSubject: "Your Rare Rabbit collaboration gift – Orion Model Hunt 2026",
    note:
      "Sent to the voucher sheet (Name, Email, Voucher Code), not the broadcast list. Each person gets their own code. Rows without a code are skipped. The message box is ignored.",
  },
];

export function getTemplate(id: string): TemplateMeta | undefined {
  return TEMPLATES.find((t) => t.id === id);
}

export function isTemplateId(id: string): id is TemplateId {
  return TEMPLATES.some((t) => t.id === id);
}

// ─── Image hosting ──────────────────────────────────────────────────────────
// Email clients cannot resolve relative paths, so the WTL template's images are
// tokens substituted with absolute public URLs at render time. Configure via
// env so the images can be swapped without a code change.
//
// If a URL is missing the <img> is removed entirely rather than rendering a
// broken-image icon in the recipient's inbox.
// Images are served from the site's /public folder, so they default to absolute
// production URLs and need no configuration. The env vars remain as an override
// (e.g. to point at a CDN later) without a code change.
//
const SITE_ORIGIN = "https://www.a7entertainment.in";

const IMAGE_TOKENS: Record<string, string | undefined> = {
  "{{IMG_HERO}}": process.env.WTL_IMG_HERO || `${SITE_ORIGIN}/wtl/hero.jpg`,
  "{{IMG_PLAYERS}}": process.env.WTL_IMG_PLAYERS || `${SITE_ORIGIN}/wtl/players.jpg`,
};

/** True when every WTL image URL is configured. */
export function wtlImagesConfigured(): boolean {
  return Object.values(IMAGE_TOKENS).every((v) => Boolean(v));
}

/** Which image env vars are still missing (surfaced in the UI). */
export function missingWtlImages(): string[] {
  return Object.entries(IMAGE_TOKENS)
    .filter(([, v]) => !v)
    .map(([token]) => token.replace(/[{}]/g, ""));
}

function applyImages(html: string): string {
  let out = html;
  for (const [token, url] of Object.entries(IMAGE_TOKENS)) {
    if (url) {
      out = out.split(token).join(url);
    } else {
      // Drop the whole <img> rather than leave a broken reference.
      const imgWithToken = new RegExp(`<img[^>]*${token.replace(/[{}]/g, "\\$&")}[^>]*>`, "g");
      out = out.replace(imgWithToken, "");
    }
  }
  return out;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}

/**
 * Render a template to final HTML.
 * `message` is only used by templates with `usesMessage: true`.
 * `voucher` is only used by the voucher template.
 */
export function renderTemplate(
  id: TemplateId,
  opts: {
    message: string;
    recipientName: string;
    voucher?: string;
    buildDefault: (m: string, n: string) => string;
  }
): string {
  if (id === "orionVoucher") {
    if (!opts.voucher) throw new Error("Voucher template rendered without a voucher code.");
    const firstName = opts.recipientName.trim().split(/\s+/)[0] || "there";
    return ORION_VOUCHER_HTML
      .split("{{IMG_ORION_BANNER}}").join(`${SITE_ORIGIN}/orion/banner.jpg`)
      .split("{{FIRST_NAME}}").join(escapeHtml(firstName))
      .split("{{VOUCHER_CODE}}").join(escapeHtml(opts.voucher));
  }
  if (id === "wtl2026") {
    // Unsubscribe placeholder isn't wired up yet — strip it so recipients
    // don't see a dead link.
    return applyImages(WTL_2026_HTML).split("[UNSUBSCRIBE_URL]").join("#");
  }
  if (id === "a7intro") return A7_INTRO_HTML;
  return opts.buildDefault(opts.message, opts.recipientName);
}
