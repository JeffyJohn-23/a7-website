// ─── Registration fee — single source of truth ──────────────────────────────
// The amount is enforced server-side (create-order). The UI imports the same
// constant so the displayed price can never drift from what is actually charged.
// To change the fee, edit ONLY these values (and the figure quoted in the legal
// pages: /terms-and-conditions and /refund-policy).

/**
 * Master switch for the PAID model registration flow.
 *
 * While false: /model-registration redirects to Instagram (see next.config.ts)
 * and the payment endpoints refuse to run, so no one can pay via a cached page
 * or a direct API call. Set back to true (and remove the redirect in
 * next.config.ts) to reopen registration.
 *
 * Free college forms are unaffected by this flag.
 */
export const PAID_REGISTRATION_OPEN = false;

export const REGISTRATION_FEE_PAISE = 19900; // ₹199.00
export const REGISTRATION_FEE_CURRENCY = "INR";

/** Human-readable label, e.g. "₹499". */
export const REGISTRATION_FEE_LABEL = `₹${(REGISTRATION_FEE_PAISE / 100).toLocaleString(
  "en-IN",
  { maximumFractionDigits: 0 }
)}`;
