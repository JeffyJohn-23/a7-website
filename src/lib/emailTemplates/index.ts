import { WTL_2026_HTML } from "./wtl2026";

// ─── Broadcast email templates ──────────────────────────────────────────────
// "default" wraps the operator's typed message in the A7 shell (existing
// behaviour). Designed templates like WTL ship their own full HTML and ignore
// the message box — only the subject stays editable.

export type TemplateId = "default" | "wtl2026";

export type TemplateMeta = {
  id: TemplateId;
  label: string;
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
    usesMessage: true,
    note: "Your typed message, wrapped in the standard A7 email shell.",
  },
  {
    id: "wtl2026",
    label: "WTL 2026 — partnership emailer",
    usesMessage: false,
    defaultSubject: "The Greatest Show on Court is back for 2026",
    note:
      "Pre-designed WTL 2026 emailer. The message box is ignored. Both buttons open WhatsApp to +91 98861 12547.",
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
// IMG_RUUD has no default: that image was never supplied, so the <img> is
// removed at render time rather than showing a broken icon to recipients.
const SITE_ORIGIN = "https://www.a7entertainment.in";

const IMAGE_TOKENS: Record<string, string | undefined> = {
  "{{IMG_HERO}}": process.env.WTL_IMG_HERO || `${SITE_ORIGIN}/wtl/hero.jpg`,
  "{{IMG_PLAYERS}}": process.env.WTL_IMG_PLAYERS || `${SITE_ORIGIN}/wtl/players.jpg`,
  "{{IMG_RUUD}}": process.env.WTL_IMG_RUUD,
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

/**
 * Render a template to final HTML.
 * `message` is only used by templates with `usesMessage: true`.
 */
export function renderTemplate(
  id: TemplateId,
  opts: { message: string; recipientName: string; buildDefault: (m: string, n: string) => string }
): string {
  if (id === "wtl2026") {
    // Unsubscribe placeholder isn't wired up yet — strip it so recipients
    // don't see a dead link.
    return applyImages(WTL_2026_HTML).split("[UNSUBSCRIBE_URL]").join("#");
  }
  return opts.buildDefault(opts.message, opts.recipientName);
}
