import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import {
  fetchBroadcastRecipients,
  sendBroadcast,
  isAllowedSender,
  SENDERS,
  type BroadcastAttachment,
  type SenderValue,
} from "@/lib/broadcast";
import {
  TEMPLATES,
  getTemplate,
  isTemplateId,
  missingWtlImages,
  type TemplateId,
} from "@/lib/emailTemplates";

export const runtime = "nodejs";
// Sends are now one-per-recipient (attachments rule out the batch endpoint),
// so a large list takes proportionally longer.
export const maxDuration = 300;

// Vercel caps a Function request body at 4.5 MB; keep the attachment well under
// that so the JSON wrapper and base64 overhead still fit.
const MAX_ATTACHMENT_BYTES = 3_000_000;

/** Recipient count preview — shown before the operator commits to sending. */
export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ success: false, error: "Unauthorized." }, { status: 401 });
  }

  try {
    const recipients = await fetchBroadcastRecipients();
    return NextResponse.json({
      success: true,
      count: recipients.length,
      senders: SENDERS,
      templates: TEMPLATES,
      // Surfaced so the operator knows images will be missing before sending.
      missingImages: missingWtlImages(),
      maxAttachmentBytes: MAX_ATTACHMENT_BYTES,
    });
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
    sender?: string;
    template?: string;
    attachment?: { filename?: string; content?: string };
  };

  const subject = body.subject?.trim();
  const message = body.message?.trim() ?? "";

  // Template decides whether a typed message is needed at all.
  const templateId = body.template ?? "default";
  if (!isTemplateId(templateId)) {
    return NextResponse.json(
      { success: false, error: "Unknown template." },
      { status: 400 }
    );
  }
  const template = getTemplate(templateId)!;

  if (!subject) {
    return NextResponse.json(
      { success: false, error: "Subject is required." },
      { status: 400 }
    );
  }
  if (template.usesMessage && !message) {
    return NextResponse.json(
      { success: false, error: "Message is required for this template." },
      { status: 400 }
    );
  }

  // Sender must be on the allow-list — an unverified address fails at send time,
  // i.e. after the operator has already committed to the blast.
  const sender = body.sender;
  if (sender && !isAllowedSender(sender)) {
    return NextResponse.json(
      { success: false, error: "That sender address is not allowed." },
      { status: 400 }
    );
  }

  // Optional single attachment.
  let attachments: BroadcastAttachment[] | undefined;
  if (body.attachment?.content && body.attachment.filename) {
    const bytes = Buffer.from(body.attachment.content, "base64").byteLength;
    if (bytes > MAX_ATTACHMENT_BYTES) {
      return NextResponse.json(
        {
          success: false,
          error: `Attachment is too large (${(bytes / 1_000_000).toFixed(1)} MB). Limit is ${
            MAX_ATTACHMENT_BYTES / 1_000_000
          } MB.`,
        },
        { status: 413 }
      );
    }
    attachments = [
      { filename: body.attachment.filename, content: body.attachment.content },
    ];
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

    const result = await sendBroadcast(recipients, subject, message, apiKey, {
      sender: sender as SenderValue | undefined,
      attachments,
      template: templateId as TemplateId,
    });
    return NextResponse.json({ success: true, ...result });
  } catch (err) {
    console.error("[/api/admin/broadcast]", err);
    return NextResponse.json(
      { success: false, error: "Send failed. Check server logs." },
      { status: 500 }
    );
  }
}
