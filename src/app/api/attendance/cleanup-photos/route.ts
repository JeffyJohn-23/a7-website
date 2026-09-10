import { NextResponse } from "next/server";
import { del } from "@vercel/blob";
import crypto from "crypto";
import { sql, isDbConfigured } from "@/lib/db";

export const runtime = "nodejs";
export const maxDuration = 300;

// ─── Selfie retention ───────────────────────────────────────────────────────
// Attendance selfies are personal data, so they are deleted after 90 days.
//
// IMPORTANT: only the PHOTOS are removed. The attendance rows themselves are
// payroll records and are kept — we null the photo columns rather than deleting
// the shift, so hours history stays intact.
//
// Invoked by Vercel Cron (see vercel.json). Vercel sends
// `Authorization: Bearer $CRON_SECRET`, which we verify so the endpoint cannot
// be triggered by anyone else.

const RETENTION_DAYS = 90;
const BATCH = 100; // del() accepts an array; keep batches modest

function authorized(request: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  const header = request.headers.get("authorization") ?? "";
  const expected = `Bearer ${secret}`;
  const a = Buffer.from(header, "utf8");
  const b = Buffer.from(expected, "utf8");
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

export async function GET(request: Request) {
  if (!authorized(request)) {
    return NextResponse.json({ success: false, error: "Unauthorized." }, { status: 401 });
  }
  if (!isDbConfigured()) {
    return NextResponse.json(
      { success: false, error: "Attendance is not configured." },
      { status: 503 }
    );
  }
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      { success: false, error: "Photo storage is not configured." },
      { status: 503 }
    );
  }

  // Rows older than the retention window that still hold a photo URL.
  const rows = (await sql`
    SELECT id, clock_in_photo_url, clock_out_photo_url
    FROM attendance
    WHERE work_date < (now() AT TIME ZONE 'Asia/Kolkata')::date
                      - ${RETENTION_DAYS}::int
      AND (clock_in_photo_url IS NOT NULL OR clock_out_photo_url IS NOT NULL)
    ORDER BY work_date
    LIMIT ${BATCH}
  `) as {
    id: number;
    clock_in_photo_url: string | null;
    clock_out_photo_url: string | null;
  }[];

  if (rows.length === 0) {
    return NextResponse.json({ success: true, deletedPhotos: 0, clearedRows: 0 });
  }

  const urls = rows
    .flatMap((r) => [r.clock_in_photo_url, r.clock_out_photo_url])
    .filter((u): u is string => Boolean(u));

  let deletedPhotos = 0;
  try {
    if (urls.length > 0) {
      await del(urls);
      deletedPhotos = urls.length;
    }
  } catch (err) {
    // A blob may already be gone (manually removed, or a previous partial run).
    // Log and still clear the columns so we don't retry the same rows forever.
    console.error("[cleanup-photos] blob delete failed:", err);
  }

  const ids = rows.map((r) => r.id);
  await sql`
    UPDATE attendance
    SET clock_in_photo_url = NULL,
        clock_out_photo_url = NULL
    WHERE id = ANY(${ids}::int[])
  `;

  console.log(
    `[cleanup-photos] removed ${deletedPhotos} photos across ${rows.length} shifts ` +
      `older than ${RETENTION_DAYS} days`
  );

  return NextResponse.json({
    success: true,
    deletedPhotos,
    clearedRows: rows.length,
    // More may remain if the batch filled — the next run picks them up.
    moreRemaining: rows.length === BATCH,
  });
}
