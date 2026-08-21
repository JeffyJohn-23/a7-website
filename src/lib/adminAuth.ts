import crypto from "crypto";
import { cookies } from "next/headers";

// ─── Admin authentication (single shared password) ──────────────────────────
// Deliberately minimal: one operator (the site owner) needs access to the
// broadcast tool. The password lives only in ADMIN_PASSWORD (server-side env);
// the browser only ever holds an HMAC token derived from it, never the password.

const COOKIE_NAME = "a7_admin";

/** True only if an admin password is configured. */
export function isAdminConfigured(): boolean {
  return Boolean(process.env.ADMIN_PASSWORD);
}

/** Constant-time string comparison. */
function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a, "utf8");
  const bufB = Buffer.from(b, "utf8");
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

/**
 * Session token = HMAC(password, "a7-admin-session"). Deriving it from the
 * password means changing ADMIN_PASSWORD instantly invalidates old sessions,
 * and the raw password is never stored in the cookie.
 */
function sessionToken(): string {
  const password = process.env.ADMIN_PASSWORD!;
  return crypto.createHmac("sha256", password).update("a7-admin-session").digest("hex");
}

/** Verify a submitted password against ADMIN_PASSWORD. */
export function verifyAdminPassword(submitted: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  return safeEqual(submitted, expected);
}

/** Issue the admin session cookie (httpOnly, 12h). */
export async function createAdminSession(): Promise<void> {
  const store = await cookies();
  store.set(COOKIE_NAME, sessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 12,
  });
}

/** Clear the admin session cookie. */
export async function destroyAdminSession(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

/** True if the current request carries a valid admin session. */
export async function isAdminAuthenticated(): Promise<boolean> {
  if (!isAdminConfigured()) return false;
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  if (!token) return false;
  return safeEqual(token, sessionToken());
}
