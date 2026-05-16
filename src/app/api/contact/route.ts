import { Resend } from "resend";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const runtime = "nodejs";

type ContactBody = {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
};

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error("[/api/contact] RESEND_API_KEY is not set.");
      return NextResponse.json(
        { success: false, error: "Email service is not configured." },
        { status: 503 }
      );
    }

    const resend = new Resend(apiKey);
    const body: ContactBody = await req.json();
    const { name, email, subject, message } = body;

    // Validate required fields
    if (!name?.trim() || !email?.trim() || !subject?.trim() || !message?.trim()) {
      return NextResponse.json(
        { success: false, error: "All fields are required." },
        { status: 400 }
      );
    }

    // Basic email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    const timestamp = new Date().toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      dateStyle: "full",
      timeStyle: "short",
    });

    const htmlEmail = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>New Website Enquiry</title>
</head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:48px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#111111;border:1px solid rgba(255,255,255,0.08);">

          <!-- Header -->
          <tr>
            <td style="padding:40px 48px 32px;border-bottom:2px solid #FF0000;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <span style="font-size:22px;font-weight:900;color:#FF0000;letter-spacing:0.05em;text-transform:uppercase;">A7</span>
                    <span style="font-size:13px;color:rgba(255,255,255,0.45);letter-spacing:0.25em;text-transform:uppercase;margin-left:10px;">Entertainment</span>
                  </td>
                  <td align="right">
                    <span style="font-size:10px;color:rgba(255,255,255,0.3);letter-spacing:0.3em;text-transform:uppercase;">New Enquiry</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Heading -->
          <tr>
            <td style="padding:40px 48px 8px;">
              <p style="margin:0 0 6px;font-size:10px;letter-spacing:0.4em;text-transform:uppercase;color:#FF0000;">Website Contact Form</p>
              <h1 style="margin:0;font-size:28px;font-weight:700;color:#ffffff;line-height:1.2;">
                ${escapeHtml(subject ?? "")}
              </h1>
            </td>
          </tr>

          <!-- Red rule -->
          <tr>
            <td style="padding:24px 48px 32px;">
              <div style="width:48px;height:3px;background:#FF0000;"></div>
            </td>
          </tr>

          <!-- Sender details -->
          <tr>
            <td style="padding:0 48px 32px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding-bottom:20px;">
                    <p style="margin:0 0 4px;font-size:10px;letter-spacing:0.3em;text-transform:uppercase;color:rgba(255,255,255,0.35);">From</p>
                    <p style="margin:0;font-size:15px;font-weight:600;color:#ffffff;">${escapeHtml(name ?? "")}</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding-bottom:20px;">
                    <p style="margin:0 0 4px;font-size:10px;letter-spacing:0.3em;text-transform:uppercase;color:rgba(255,255,255,0.35);">Email</p>
                    <a href="mailto:${escapeHtml(email ?? "")}" style="margin:0;font-size:14px;color:#FF0000;text-decoration:none;">${escapeHtml(email ?? "")}</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding:0 48px 32px;">
              <div style="height:1px;background:rgba(255,255,255,0.06);"></div>
            </td>
          </tr>

          <!-- Message -->
          <tr>
            <td style="padding:0 48px 40px;">
              <p style="margin:0 0 12px;font-size:10px;letter-spacing:0.3em;text-transform:uppercase;color:rgba(255,255,255,0.35);">Message</p>
              <p style="margin:0;font-size:15px;color:rgba(255,255,255,0.85);line-height:1.8;white-space:pre-wrap;">${escapeHtml(message ?? "").replace(/\n/g, "<br/>")}</p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px 48px;background:rgba(255,255,255,0.03);border-top:1px solid rgba(255,255,255,0.06);">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <p style="margin:0;font-size:10px;color:rgba(255,255,255,0.25);letter-spacing:0.2em;text-transform:uppercase;">
                      Submitted via a7entertainment.in
                    </p>
                  </td>
                  <td align="right">
                    <p style="margin:0;font-size:10px;color:rgba(255,255,255,0.25);letter-spacing:0.1em;">
                      ${timestamp}
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `.trim();

    await resend.emails.send({
      from: "A7 Entertainment <noreply@a7entertainment.in>",
      to: ["enquiry@a7entertainment.in"],
      reply_to: email,
      subject: `Website Enquiry: ${subject}`,
      text: `Name: ${name}\nEmail: ${email}\n\n${message}\n\nSubmitted: ${timestamp}`,
      html: htmlEmail,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[/api/contact]", err);
    return NextResponse.json(
      { success: false, error: "Failed to send message. Please try again." },
      { status: 500 }
    );
  }
}

/** Escape HTML special chars to prevent injection in email template */
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}
