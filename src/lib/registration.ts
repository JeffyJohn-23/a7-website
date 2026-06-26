// ─── Registration fee — single source of truth ──────────────────────────────
// The amount is enforced server-side (create-order). The UI imports the same
// constant so the displayed price can never drift from what is actually charged.
// To change the fee, edit ONLY these values (and the figure quoted in the legal
// pages: /terms-and-conditions and /refund-policy).

export const REGISTRATION_FEE_PAISE = 24900; // ₹249.00
export const REGISTRATION_FEE_CURRENCY = "INR";

/** Human-readable label, e.g. "₹499". */
export const REGISTRATION_FEE_LABEL = `₹${(REGISTRATION_FEE_PAISE / 100).toLocaleString(
  "en-IN",
  { maximumFractionDigits: 0 }
)}`;
