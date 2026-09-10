import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { getCurrentEmployee } from "@/lib/employeeAuth";

export const runtime = "nodejs";
export const maxDuration = 30;

// Selfie upload for clock in/out.
//
// Stored PRIVATE — these are photos of staff, so the URLs must not be publicly
// guessable. The client sends a compressed JPEG data URL; we decode it server
// side so the browser never talks to Blob directly with a write token.
//
// Vercel caps a Function request body at 4.5 MB. The client compresses to well
// under that, but we enforce a limit here too rather than trusting the client.
const MAX_BYTES = 1_500_000; // ~1.5 MB after compression

export function isBlobConfigured(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

export async function POST(request: Request) {
  const employee = await getCurrentEmployee();
  if (!employee) {
    return NextResponse.json({ success: false, error: "Unauthorized." }, { status: 401 });
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      { success: false, error: "Photo storage is not configured." },
      { status: 503 }
    );
  }

  const body = (await request.json().catch(() => ({}))) as {
    photoBase64?: string;
    kind?: "in" | "out";
  };

  const dataUrl = body.photoBase64;
  if (!dataUrl || !dataUrl.startsWith("data:image/")) {
    return NextResponse.json(
      { success: false, error: "A photo is required." },
      { status: 400 }
    );
  }

  const commaAt = dataUrl.indexOf(",");
  if (commaAt === -1) {
    return NextResponse.json({ success: false, error: "Invalid photo." }, { status: 400 });
  }

  const buffer = Buffer.from(dataUrl.slice(commaAt + 1), "base64");
  if (buffer.byteLength === 0) {
    return NextResponse.json({ success: false, error: "Invalid photo." }, { status: 400 });
  }
  if (buffer.byteLength > MAX_BYTES) {
    return NextResponse.json(
      { success: false, error: "Photo is too large. Please try again." },
      { status: 413 }
    );
  }

  const kind = body.kind === "out" ? "out" : "in";
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const pathname = `attendance/${employee.id}/${stamp}-${kind}.jpg`;

  try {
    // PRIVATE: these are photos of staff. A private blob is not served to
    // anonymous visitors even if the URL leaks.
    const blob = await put(pathname, buffer, {
      access: "private",
      addRandomSuffix: true,
      contentType: "image/jpeg",
    });
    return NextResponse.json({ success: true, url: blob.url });
  } catch (err) {
    console.error("[/api/attendance/photo] upload failed:", err);
    return NextResponse.json(
      { success: false, error: "Could not save the photo." },
      { status: 500 }
    );
  }
}
