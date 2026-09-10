import crypto from "crypto";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { sql } from "@/lib/db";

// ─── Employee authentication ────────────────────────────────────────────────
// Per-person accounts (unlike the single shared ADMIN_PASSWORD used by the
// broadcast tool) because attendance must attribute hours to an individual.
//
// Session cookie holds `employeeId.expiry.HMAC(employeeId.expiry)` — signed
// with AUTH_SECRET, so it cannot be forged client-side. The password itself is
// never stored or transmitted after login; only its bcrypt hash lives in the DB.

const COOKIE_NAME = "a7_emp";
const SESSION_HOURS = 12; // long enough to span a shift — you clock out on the same session
const BCRYPT_ROUNDS = 10;

export type Employee = {
  id: number;
  email: string;
  name: string;
  role: "employee" | "admin";
  active: boolean;
};

function authSecret(): string {
  const s = process.env.AUTH_SECRET;
  if (!s) throw new Error("AUTH_SECRET is not set");
  return s;
}

/** Constant-time comparison of two equal-length strings. */
function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a, "utf8");
  const bufB = Buffer.from(b, "utf8");
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

function signature(payload: string): string {
  return crypto.createHmac("sha256", authSecret()).update(payload).digest("hex");
}

// ─── Passwords ──────────────────────────────────────────────────────────────

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, BCRYPT_ROUNDS);
}

export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}

/** Minimum policy for employee passwords. */
export function passwordProblem(plain: string): string | null {
  if (plain.length < 8) return "Password must be at least 8 characters.";
  if (!/[a-zA-Z]/.test(plain) || !/[0-9]/.test(plain))
    return "Password must include at least one letter and one number.";
  return null;
}

// ─── Session cookie ─────────────────────────────────────────────────────────

export async function createEmployeeSession(employeeId: number): Promise<void> {
  const expiry = Date.now() + SESSION_HOURS * 60 * 60 * 1000;
  const payload = `${employeeId}.${expiry}`;
  const store = await cookies();
  store.set(COOKIE_NAME, `${payload}.${signature(payload)}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_HOURS * 60 * 60,
  });
}

export async function destroyEmployeeSession(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

/**
 * Resolve the signed-in employee, or null. Verifies the HMAC and expiry, then
 * re-reads the row so a deactivated employee loses access immediately rather
 * than staying valid until their cookie expires.
 */
export async function getCurrentEmployee(): Promise<Employee | null> {
  if (!process.env.AUTH_SECRET || !process.env.DATABASE_URL) return null;

  const store = await cookies();
  const raw = store.get(COOKIE_NAME)?.value;
  if (!raw) return null;

  const parts = raw.split(".");
  if (parts.length !== 3) return null;
  const [idStr, expiryStr, sig] = parts;

  const payload = `${idStr}.${expiryStr}`;
  if (!safeEqual(sig, signature(payload))) return null;

  const expiry = Number(expiryStr);
  if (!Number.isFinite(expiry) || Date.now() > expiry) return null;

  const id = Number(idStr);
  if (!Number.isInteger(id)) return null;

  const rows = (await sql`
    SELECT id, email, name, role, active
    FROM employees
    WHERE id = ${id} AND active = TRUE
  `) as Employee[];

  return rows[0] ?? null;
}

/** Employee for a login attempt, including the hash (never expose this shape). */
export async function findEmployeeForLogin(email: string): Promise<
  (Employee & { password_hash: string | null }) | null
> {
  const rows = (await sql`
    SELECT id, email, name, role, active, password_hash
    FROM employees
    WHERE lower(email) = lower(${email}) AND active = TRUE
  `) as (Employee & { password_hash: string | null })[];
  return rows[0] ?? null;
}

export async function setEmployeePassword(id: number, plain: string): Promise<void> {
  const hash = await hashPassword(plain);
  await sql`UPDATE employees SET password_hash = ${hash} WHERE id = ${id}`;
}
