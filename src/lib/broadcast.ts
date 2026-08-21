import { google } from "googleapis";
import { Resend } from "resend";

// ─── Applicant broadcast ────────────────────────────────────────────────────
// Reads the curated broadcast list (GOOGLE_SHEET_ID_BROADCAST) and emails each
// person individually (never a shared To:/CC), batched to respect Resend's
// limits. This sheet is READ-ONLY to this code — nothing is ever written back.
//
// Expected sheet shape (row 1 is a header, data starts at row 2):
//   A = Full Name
//   B = Email

const SHEET_NAME = "Sheet1";
const BROADCAST_RANGE = `${SHEET_NAME}!A2:B`;
const COL_FULL_NAME = 0; // A
const COL_EMAIL = 1; // B

// Resend: batch endpoint accepts up to 100 messages per call; API limit is
// 10 req/s. 100/batch with a small gap keeps us far under both.
const BATCH_SIZE = 100;
const BATCH_DELAY_MS = 300;

export type Recipient = { email: string; name: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Fetch unique, valid recipients from the dedicated broadcast sheet.
 * Rows without a valid email are skipped; duplicates are collapsed.
 */
export async function fetchBroadcastRecipients(): Promise<Recipient[]> {
  const creds = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  const sheetId = process.env.GOOGLE_SHEET_ID_BROADCAST;
  if (!creds || !sheetId) {
    throw new Error(
      "Broadcast sheet is not configured (GOOGLE_SERVICE_ACCOUNT_JSON / GOOGLE_SHEET_ID_BROADCAST)."
    );
  }

  const auth = new google.auth.GoogleAuth({
    credentials: JSON.parse(creds) as object,
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  });
  const sheets = google.sheets({ version: "v4", auth });

  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: BROADCAST_RANGE,
  });

  const rows = res.data.values ?? [];
  const seen = new Set<string>();
  const recipients: Recipient[] = [];

  for (const row of rows) {
    const email = String(row[COL_EMAIL] ?? "").trim();
    if (!EMAIL_RE.test(email)) continue; // skips blanks and malformed rows

    const key = email.toLowerCase();
    if (seen.has(key)) continue; // de-duplicate
    seen.add(key);

    recipients.push({
      email,
      name: String(row[COL_FULL_NAME] ?? "").trim(),
    });
  }

  return recipients;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}

/** Wrap the operator's plain-text message in the A7 email shell. */
export function buildBroadcastHtml(message: string, recipientName: string): string {
  const greeting = recipientName ? `Hi ${escapeHtml(recipientName.split(" ")[0])},` : "Hi,";
  const body = escapeHtml(message)
    .split(/\n{2,}/)
    .map(
      (para) =>
        `<p style="margin:0 0 16px;font-size:15px;color:rgba(255,255,255,0.8);line-height:1.8;">${para.replace(/\n/g, "<br/>")}</p>`
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"/><title>A7 Entertainment</title></head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:48px 16px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#111111;border:1px solid rgba(255,255,255,0.08);">
  <tr><td style="padding:32px 48px;border-bottom:2px solid #FF0000;">
    <span style="font-size:22px;font-weight:900;color:#FF0000;letter-spacing:0.05em;">A7</span>
    <span style="font-size:13px;color:rgba(255,255,255,0.45);letter-spacing:0.25em;margin-left:10px;">ENTERTAINMENT</span>
  </td></tr>
  <tr><td style="padding:36px 48px 8px;">
    <p style="margin:0 0 18px;font-size:15px;color:#ffffff;">${greeting}</p>
    ${body}
  </td></tr>
  <tr><td style="padding:8px 48px 32px;">
    <p style="margin:0;font-size:15px;color:rgba(255,255,255,0.8);line-height:1.8;">
      For any questions, reach us at
      <a href="mailto:enquiry@a7entertainment.in" style="color:#FF0000;text-decoration:none;">enquiry@a7entertainment.in</a>.
    </p>
  </td></tr>
  <tr><td style="padding:20px 48px;background:rgba(255,255,255,0.03);border-top:1px solid rgba(255,255,255,0.06);">
    <p style="margin:0;font-size:11px;color:rgba(255,255,255,0.25);letter-spacing:0.15em;">A7 ENTERTAINMENT &nbsp;·&nbsp; WWW.A7ENTERTAINMENT.IN</p>
  </td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;
}

export type BroadcastResult = { sent: number; failed: number; total: number };

/**
 * Send `message` to every recipient as an individual email (one To: per
 * message — recipients never see each other). Uses Resend's batch endpoint,
 * 100 per call, with a short delay between calls.
 */
export async function sendBroadcast(
  recipients: Recipient[],
  subject: string,
  message: string,
  apiKey: string
): Promise<BroadcastResult> {
  const resend = new Resend(apiKey);
  let sent = 0;
  let failed = 0;

  for (let i = 0; i < recipients.length; i += BATCH_SIZE) {
    const chunk = recipients.slice(i, i + BATCH_SIZE);
    const payload = chunk.map((r) => ({
      from: "A7 Entertainment <noreply@a7entertainment.in>",
      to: [r.email], // individual — no shared To:/CC between applicants
      reply_to: "enquiry@a7entertainment.in",
      subject,
      html: buildBroadcastHtml(message, r.name),
    }));

    try {
      const { error } = await resend.batch.send(payload);
      if (error) {
        console.error("[broadcast] batch failed:", error);
        failed += chunk.length;
      } else {
        sent += chunk.length;
      }
    } catch (err) {
      console.error("[broadcast] batch threw:", err);
      failed += chunk.length;
    }

    if (i + BATCH_SIZE < recipients.length) {
      await new Promise((resolve) => setTimeout(resolve, BATCH_DELAY_MS));
    }
  }

  return { sent, failed, total: recipients.length };
}
