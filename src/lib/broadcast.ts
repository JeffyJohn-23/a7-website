import { google } from "googleapis";
import { Resend } from "resend";
import { renderTemplate, type RecipientList, type TemplateId } from "@/lib/emailTemplates";

// ─── Applicant broadcast ────────────────────────────────────────────────────
// Reads a recipient sheet and emails each person individually (never a shared
// To:/CC), paced to respect Resend's limits. These sheets are READ-ONLY to
// this code — nothing is ever written back.
//
// Each template names the list it sends to. Row 1 is a header, data starts at
// row 2.
//   broadcast (GOOGLE_SHEET_ID_BROADCAST):     A = Full Name, B = Email
//   voucher   (GOOGLE_SHEET_ID_ORION_VOUCHER): A = Full Name, B = Email, C = Voucher Code

const SHEET_NAME = "Sheet1";
const COL_FULL_NAME = 0; // A
const COL_EMAIL = 1; // B
const COL_VOUCHER = 2; // C (voucher list only)

const LISTS: Record<RecipientList, { envVar: string; range: string; needsVoucher: boolean }> = {
  broadcast: { envVar: "GOOGLE_SHEET_ID_BROADCAST", range: `${SHEET_NAME}!A2:B`, needsVoucher: false },
  voucher: { envVar: "GOOGLE_SHEET_ID_ORION_VOUCHER", range: `${SHEET_NAME}!A2:C`, needsVoucher: true },
};

// Sends go one-per-request (the batch endpoint cannot carry attachments), so
// pace them under Resend's 10 req/s limit. 150ms ≈ 6.6/s with headroom.
const SEND_DELAY_MS = 150;

export type Recipient = { email: string; name: string; voucher?: string };

/** `skipped` counts rows dropped for a bad email, a missing voucher or a duplicate. */
export type RecipientFetch = { recipients: Recipient[]; skipped: number };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Fetch unique, valid recipients from a recipient sheet.
 * Rows without a valid email (or, for the voucher list, without a code) are
 * skipped; duplicate emails keep their first row.
 */
export async function fetchRecipients(list: RecipientList = "broadcast"): Promise<RecipientFetch> {
  const { envVar, range, needsVoucher } = LISTS[list];
  const creds = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  const sheetId = process.env[envVar];
  if (!creds || !sheetId) {
    throw new Error(`Recipient sheet is not configured (GOOGLE_SERVICE_ACCOUNT_JSON / ${envVar}).`);
  }

  const auth = new google.auth.GoogleAuth({
    credentials: JSON.parse(creds) as object,
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  });
  const sheets = google.sheets({ version: "v4", auth });

  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range,
  });

  const rows = res.data.values ?? [];
  const seen = new Set<string>();
  const recipients: Recipient[] = [];
  let skipped = 0;

  for (const row of rows) {
    const name = String(row[COL_FULL_NAME] ?? "").trim();
    const email = String(row[COL_EMAIL] ?? "").trim();
    const voucher = String(row[COL_VOUCHER] ?? "").trim();

    // Fully blank rows aren't worth reporting.
    if (!name && !email && !voucher) continue;

    // Bad email, or a voucher row with no code — never send a blank voucher.
    if (!EMAIL_RE.test(email) || (needsVoucher && !voucher)) {
      skipped++;
      continue;
    }

    const key = email.toLowerCase();
    if (seen.has(key)) {
      skipped++; // de-duplicate
      continue;
    }
    seen.add(key);

    recipients.push(needsVoucher ? { email, name, voucher } : { email, name });
  }

  return { recipients, skipped };
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

// ─── Sender addresses ───────────────────────────────────────────────────────
// Any address on a verified domain works without extra setup, but this is an
// explicit allow-list: a typo or an unverified domain would fail at send time,
// after the operator has already committed to a blast.
export const SENDERS = [
  { value: "noreply@a7entertainment.in", label: "A7 Entertainment (noreply@)", name: "A7 Entertainment" },
  { value: "enquiry@a7entertainment.in", label: "A7 Enquiry (enquiry@)", name: "A7 Entertainment" },
  { value: "careers@a7entertainment.in", label: "A7 Careers (careers@)", name: "A7 Entertainment" },
  { value: "abhishekupadhye@a7entertainment.in", label: "Abhishek Upadhye", name: "Abhishek Upadhye" },
] as const;

export type SenderValue = (typeof SENDERS)[number]["value"];

export function isAllowedSender(value: string): value is SenderValue {
  return SENDERS.some((s) => s.value === value);
}

/**
 * Resend requires a display name + address. The name comes from the allow-list
 * entry, so a personal address shows that person's name rather than the
 * company's.
 */
function fromHeader(sender: SenderValue): string {
  const entry = SENDERS.find((s) => s.value === sender);
  return `${entry?.name ?? "A7 Entertainment"} <${sender}>`;
}

export type BroadcastAttachment = {
  filename: string;
  /** Base64 (no data: prefix). */
  content: string;
};

export type BroadcastResult = { sent: number; failed: number; total: number };

/**
 * Send `message` to every recipient as an individual email (one To: per
 * message — recipients never see each other's address).
 *
 * Sends ONE AT A TIME rather than via resend.batch.send: the batch endpoint
 * does not support attachments. That costs speed (one API call per recipient)
 * but it is the only way attachments work, and it makes per-recipient failures
 * visible instead of failing a whole chunk of 100.
 */
export async function sendBroadcast(
  recipients: Recipient[],
  subject: string,
  message: string,
  apiKey: string,
  options?: {
    sender?: SenderValue;
    attachments?: BroadcastAttachment[];
    template?: TemplateId;
  }
): Promise<BroadcastResult> {
  const resend = new Resend(apiKey);
  const sender: SenderValue = options?.sender && isAllowedSender(options.sender)
    ? options.sender
    : "noreply@a7entertainment.in";

  // Resend accepts a Buffer or base64 string for attachment content.
  const attachments = options?.attachments?.length
    ? options.attachments.map((a) => ({
        filename: a.filename,
        content: Buffer.from(a.content, "base64"),
      }))
    : undefined;

  let sent = 0;
  let failed = 0;

  for (let i = 0; i < recipients.length; i++) {
    const r = recipients[i];
    try {
      const { error } = await resend.emails.send({
        from: fromHeader(sender),
        to: [r.email],
        reply_to: sender,
        subject,
        html: renderTemplate(options?.template ?? "default", {
          message,
          recipientName: r.name,
          voucher: r.voucher,
          buildDefault: buildBroadcastHtml,
        }),
        ...(attachments ? { attachments } : {}),
      });
      if (error) {
        console.error(`[broadcast] send failed for ${r.email}:`, error);
        failed++;
      } else {
        sent++;
      }
    } catch (err) {
      console.error(`[broadcast] send threw for ${r.email}:`, err);
      failed++;
    }

    // Stay under Resend's 10 req/s limit.
    if (i + 1 < recipients.length) {
      await new Promise((resolve) => setTimeout(resolve, SEND_DELAY_MS));
    }
  }

  return { sent, failed, total: recipients.length };
}
