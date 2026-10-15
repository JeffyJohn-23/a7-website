import { NextResponse } from "next/server";
import { get } from "@vercel/blob";
import { getCurrentEmployee } from "@/lib/employeeAuth";
import { sql, isDbConfigured } from "@/lib/db";

export const runtime = "nodejs";
export const maxDuration = 30;

// ─── Attendance selfie viewer ───────────────────────────────────────────────
// Selfies live in a PRIVATE Blob store, so a browser cannot load the stored URL
// directly. This route streams the image to an authenticated admin instead.
//
// It deliberately takes a SHIFT ID and looks the blob URL up in the database
// itself. It never accepts a URL from the client — otherwise it could be used
// to read any blob in the store, or to fetch arbitrary addresses.
//
// Query: ?shiftId=<number>&kind=in|out

export async function GET(request: Request) {
  if (!isDbConfigured()) {
    return NextResponse.json({ success: false, error: "Attendance is not configured." }, { status: 503 });
  }

  const employee = await getCurrentEmployee();
  if (!employee) {
    return NextResponse.json({ success: false, error: "Unauthorized." }, { status: 401 });
  }
  if (employee.role !== "admin") {
    return NextResponse.json({ success: false, error: "Admins only." }, { status: 403 });
  }
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json({ success: false, error: "Photo storage is not configured." }, { status: 503 });
  }

  const { searchParams } = new URL(request.url);
  const shiftId = Number(searchParams.get("shiftId"));
  const kind = searchParams.get("kind");

  if (!Number.isInteger(shiftId) || (kind !== "in" && kind !== "out")) {
    return NextResponse.json({ success: false, error: "Invalid request." }, { status: 400 });
  }

  const rows = (await sql`
    SELECT clock_in_photo_url, clock_out_photo_url
    FROM attendance
    WHERE id = ${shiftId}
  `) as { clock_in_photo_url: string | null; clock_out_photo_url: string | null }[];

  const url = kind === "in" ? rows[0]?.clock_in_photo_url : rows[0]?.clock_out_photo_url;
  if (!url) {
    // No photo, or already removed by the 90-day retention job.
    return NextResponse.json({ success: false, error: "No photo for this punch." }, { status: 404 });
  }

  try {
    const blob = await get(url, { access: "private" });
    if (!blob || blob.statusCode !== 200) {
      return NextResponse.json({ success: false, error: "Photo not found." }, { status: 404 });
    }

    return new NextResponse(blob.stream, {
      headers: {
        "Content-Type": blob.blob.contentType || "image/jpeg",
        // Staff photos: browser may keep a copy for this session, but nothing
        // shared (CDN/proxy) should cache them.
        "Cache-Control": "private, max-age=300",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (err) {
    console.error("[admin/photo] read failed:", err);
    return NextResponse.json({ success: false, error: "Could not load the photo." }, { status: 500 });
  }
}
