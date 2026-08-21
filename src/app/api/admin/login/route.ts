import { NextResponse } from "next/server";
import {
  verifyAdminPassword,
  createAdminSession,
  destroyAdminSession,
  isAdminConfigured,
} from "@/lib/adminAuth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!isAdminConfigured()) {
    return NextResponse.json(
      { success: false, error: "Admin access is not configured." },
      { status: 503 }
    );
  }

  const body = (await request.json().catch(() => ({}))) as { password?: string };
  if (!body.password || !verifyAdminPassword(body.password)) {
    // Generic message — don't reveal whether a password was even set.
    return NextResponse.json(
      { success: false, error: "Incorrect password." },
      { status: 401 }
    );
  }

  await createAdminSession();
  return NextResponse.json({ success: true });
}

/** Log out. */
export async function DELETE() {
  await destroyAdminSession();
  return NextResponse.json({ success: true });
}
