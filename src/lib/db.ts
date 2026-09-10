import { neon } from "@neondatabase/serverless";

// ─── Database (Neon Postgres) ───────────────────────────────────────────────
// HTTP mode: each query is a single stateless fetch, which is the right shape
// for serverless functions — no connection pool to exhaust across invocations.
//
// Usage:
//   const rows = await sql`SELECT * FROM employees WHERE id = ${id}`;
// Values interpolated into the tagged template are parameterised by the driver,
// so this is NOT string concatenation and is safe against SQL injection.

if (!process.env.DATABASE_URL) {
  // Fail loudly at import time rather than producing confusing runtime errors.
  console.error("[db] DATABASE_URL is not set — attendance features will fail.");
}

export const sql = neon(process.env.DATABASE_URL ?? "");

/** True when the database is configured (used for graceful 503s). */
export function isDbConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL);
}
