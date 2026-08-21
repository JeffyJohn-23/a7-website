import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import { fetchBroadcastRecipients, sendBroadcast } from "@/lib/broadcast";

export const runtime = "nodejs";
export const maxDuration = 300; // large sends take time (batched)

/** Recipient count preview — shown before the operator commits to sending. */
export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ success: false, error: "Unauthorized." }, { status: 401 });
  }

  try {
    const recipients = await fetchBroadcastRecipients();
    return NextResponse.json({ success: true, count: recipients.length });
  } catch (err) {
    console.error("[/api/admin/broadcast] preview failed:", err);
    return NextResponse.json(
      { success: false, error: "Could not read the broadcast sheet." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ success: false, error: "Unauthorized." }, { status: 401 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { success: false, error: "Email service not configured." },
      { status: 503 }
    );
  }

  const body = (await request.json().catch(() => ({}))) as {
    subject?: string;
    message?: string;
    confirm?: string;
  };

  const subject = body.subject?.trim();
  const message = body.message?.trim();

  if (!subject || !message) {
    return NextResponse.json(
      { success: false, error: "Subject and message are both required." },
      { status: 400 }
    );
  }

  // Explicit typed confirmation — guards against an accidental mass send.
  if (body.confirm !== "SEND") {
    return NextResponse.json(
      { success: false, error: "Confirmation missing." },
      { status: 400 }
    );
  }

  try {
    const recipients = await fetchBroadcastRecipients();
    if (recipients.length === 0) {
      return NextResponse.json(
        { success: false, error: "No recipients found in the broadcast sheet." },
        { status: 400 }
      );
    }

    const result = await sendBroadcast(recipients, subject, message, apiKey);
    return NextResponse.json({ success: true, ...result });
  } catch (err) {
    console.error("[/api/admin/broadcast]", err);
    return NextResponse.json(
      { success: false, error: "Send failed. Check server logs." },
      { status: 500 }
    );
  }
}
