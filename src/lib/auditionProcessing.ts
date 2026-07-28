import React from "react";
import { renderToBuffer } from "@react-pdf/renderer";
import { Resend } from "resend";
import { google } from "googleapis";
import { AuditionPDF } from "@/components/pdf/AuditionPDF";
import type { AuditionData, PaymentInfo } from "@/types/audition";

// ─── Google Sheet columns (in order) ────────────────────────────────────────
// First 25 columns (A:Y) preserve the original schema so pre-payment rows stay
// aligned. The 5 payment columns (Z:AD) are appended at the end.
export const SHEET_HEADERS = [
  "Timestamp", "Full Name", "Date of Birth", "Age",
  "Nationality", "Gender",
  "Phone", "Email", "Address",
  "Meas. Weight", "Height",
  "Hair Colour", "Eye Colour", "Bust/Chest", "Trouser Waist", "Hips",
  "Language Skills",
  "About You",
  "Skill 1", "Skill 2", "Skill 3", "Skill 4",
  "Instagram URL",
  "Agreed to Terms", "Signature Name",
  // ── Payment (Z:AD) ──
  "Order ID", "Payment ID", "Amount (INR)", "Payment Status", "Paid At",
];

// Free flow (e.g. SJU): the 25 form columns only, no payment columns.
export const SHEET_HEADERS_FREE = SHEET_HEADERS.slice(0, 25);

// Free flow + University Roll Number (e.g. Jain University): 25 form columns
// with the roll number inserted right after Full Name (column C).
export const SHEET_HEADERS_FREE_WITH_ROLL = [
  ...SHEET_HEADERS_FREE.slice(0, 2), // Timestamp, Full Name
  "University Roll Number",
  ...SHEET_HEADERS_FREE.slice(2),
];

const SHEET_NAME = "Sheet1";
const FREE_APPEND_RANGE = `${SHEET_NAME}!A:Y`; // A..Y = 25 columns
const FREE_WITH_ROLL_APPEND_RANGE = `${SHEET_NAME}!A:Z`; // A..Z = 26 columns
// A..AD = 30 columns
const APPEND_RANGE = `${SHEET_NAME}!A:AD`;
// Payment columns Z:AD — [Order ID, Payment ID, Amount, Status, Paid At]
const PAYMENT_RANGE = `${SHEET_NAME}!Z2:AD`;

// Payment status values written to the sheet's "Payment Status" column.
export const STATUS_PENDING = "Pending";
export const STATUS_PAID = "Paid";
// Webhook saw a captured payment but the in-page form never completed.
// Overridden to STATUS_PAID if the real submission lands later.
export const STATUS_PAID_NO_SUBMISSION = "Paid (No Submission)";

// In-memory dedupe guard. Survives within a warm server instance; the Sheet
// lookup below covers cross-instance / cold-start cases when Sheets is enabled.
const processedOrderIds = new Set<string>();

// ─── HTML helpers ────────────────────────────────────────────────────────────

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}

function field(label: string, value: string) {
  if (!value) return "";
  return `
    <tr>
      <td style="padding:4px 0;font-size:10px;color:rgba(255,255,255,0.4);letter-spacing:0.25em;text-transform:uppercase;width:160px;vertical-align:top;">${escapeHtml(label)}</td>
      <td style="padding:4px 0;font-size:13px;color:#ffffff;">${escapeHtml(value)}</td>
    </tr>`;
}

function formatAmount(payment: PaymentInfo): string {
  return `₹${(payment.amount / 100).toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;
}

function paymentBlockHtml(payment: PaymentInfo): string {
  return `<tr><td style="padding:20px 48px;background:rgba(255,0,0,0.06);border-top:1px solid rgba(255,255,255,0.06);">
    <p style="margin:0 0 8px;font-size:10px;letter-spacing:0.3em;color:#FF0000;text-transform:uppercase;">Payment Verified · ${escapeHtml(formatAmount(payment))}</p>
    <table cellpadding="0" cellspacing="0">
      ${field("Payment ID", payment.paymentId)}
      ${field("Order ID", payment.orderId)}
      ${field("Status", payment.status)}
      ${field("Paid At", payment.paidAt)}
    </table>
  </td></tr>`;
}

function buildAdminHtml(data: AuditionData, ts: string, badge = "PAID APPLICATION"): string {
  const g = data.gender.join(", ");
  const payment = data.payment;
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"/><title>Model Registration</title></head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:48px 16px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#111111;border:1px solid rgba(255,255,255,0.08);">
  <tr><td style="padding:32px 48px;border-bottom:2px solid #FF0000;">
    <span style="font-size:22px;font-weight:900;color:#FF0000;letter-spacing:0.05em;">A7</span>
    <span style="font-size:13px;color:rgba(255,255,255,0.45);letter-spacing:0.25em;margin-left:10px;">ENTERTAINMENT</span>
    <span style="float:right;font-size:10px;color:rgba(255,255,255,0.3);letter-spacing:0.3em;">${escapeHtml(badge)}</span>
  </td></tr>
  <tr><td style="padding:32px 48px 8px;">
    <p style="margin:0 0 4px;font-size:10px;letter-spacing:0.4em;color:#FF0000;text-transform:uppercase;">Model Registration</p>
    <h1 style="margin:0;font-size:26px;font-weight:700;color:#ffffff;">${escapeHtml(data.fullName)}</h1>
  </td></tr>
  <tr><td style="padding:16px 48px 0;"><div style="width:48px;height:3px;background:#FF0000;"></div></td></tr>
  <tr><td style="padding:24px 48px;">
    <table cellpadding="0" cellspacing="0">
      ${field("Email", data.email)}
      ${field("Phone", data.phone)}
      ${field("University Roll Number", data.universityRollNumber ?? "")}
      ${field("Date of Birth", data.dob)}
      ${field("Age", data.age)}
      ${field("Gender", g)}
      ${field("Nationality", data.nationality)}
      ${field("Languages", data.languageSkills)}
      ${field("Instagram", data.instagram)}
    </table>
  </td></tr>
  ${data.aboutYou ? `<tr><td style="padding:0 48px 24px;">
    <p style="margin:0 0 6px;font-size:10px;letter-spacing:0.3em;color:rgba(255,255,255,0.35);">ABOUT</p>
    <p style="margin:0;font-size:13px;color:rgba(255,255,255,0.8);line-height:1.7;">${escapeHtml(data.aboutYou)}</p>
  </td></tr>` : ""}
  ${payment ? paymentBlockHtml(payment) : ""}
  <tr><td style="padding:20px 48px;background:rgba(255,255,255,0.03);border-top:1px solid rgba(255,255,255,0.06);">
    <p style="margin:0;font-size:10px;color:rgba(255,255,255,0.25);letter-spacing:0.2em;">SUBMITTED VIA A7ENTERTAINMENT.IN &nbsp;·&nbsp; ${escapeHtml(ts)}</p>
    <p style="margin:6px 0 0;font-size:10px;color:rgba(255,255,255,0.25);">Full application attached as PDF.</p>
  </td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;
}

function buildAutoReplyHtml(name: string, payment?: PaymentInfo): string {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"/><title>Application Received</title></head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:48px 16px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#111111;border:1px solid rgba(255,255,255,0.08);">
  <tr><td style="padding:32px 48px;border-bottom:2px solid #FF0000;">
    <span style="font-size:22px;font-weight:900;color:#FF0000;letter-spacing:0.05em;">A7</span>
    <span style="font-size:13px;color:rgba(255,255,255,0.45);letter-spacing:0.25em;margin-left:10px;">ENTERTAINMENT</span>
  </td></tr>
  <tr><td style="padding:40px 48px 16px;">
    <p style="margin:0 0 6px;font-size:10px;letter-spacing:0.4em;color:#FF0000;text-transform:uppercase;">Application Received</p>
    <h1 style="margin:0;font-size:26px;font-weight:700;color:#ffffff;line-height:1.3;">Thank you, ${escapeHtml(name)}.</h1>
  </td></tr>
  <tr><td style="padding:8px 48px;"><div style="width:48px;height:3px;background:#FF0000;"></div></td></tr>
  <tr><td style="padding:24px 48px 16px;">
    <p style="margin:0 0 16px;font-size:15px;color:rgba(255,255,255,0.8);line-height:1.8;">
      We have received your model registration application and our team will review it shortly.
    </p>
    <p style="margin:0;font-size:15px;color:rgba(255,255,255,0.8);line-height:1.8;">
      If you have any questions in the meantime, feel free to reach us at
      <a href="mailto:enquiry@a7entertainment.in" style="color:#FF0000;text-decoration:none;">enquiry@a7entertainment.in</a>
      or WhatsApp us at +91&nbsp;98861&nbsp;12547.
    </p>
  </td></tr>
  ${payment ? `<tr><td style="padding:8px 48px 32px;">
    <div style="border:1px solid rgba(255,255,255,0.1);padding:16px 20px;">
      <p style="margin:0 0 8px;font-size:10px;letter-spacing:0.3em;color:#FF0000;text-transform:uppercase;">Payment Receipt</p>
      <p style="margin:0;font-size:13px;color:rgba(255,255,255,0.7);line-height:1.9;">
        Amount Paid: <span style="color:#ffffff;">${escapeHtml(formatAmount(payment))}</span><br/>
        Payment ID: <span style="color:#ffffff;">${escapeHtml(payment.paymentId)}</span><br/>
        Order ID: <span style="color:#ffffff;">${escapeHtml(payment.orderId)}</span>
      </p>
    </div>
  </td></tr>` : ""}
  <tr><td style="padding:20px 48px;background:rgba(255,255,255,0.03);border-top:1px solid rgba(255,255,255,0.06);">
    <p style="margin:0;font-size:11px;color:rgba(255,255,255,0.25);letter-spacing:0.15em;">A7 ENTERTAINMENT &nbsp;·&nbsp; WWW.A7ENTERTAINMENT.IN</p>
  </td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;
}

// ─── Google Sheets ───────────────────────────────────────────────────────────

function buildSheetRow(data: AuditionData): string[] {
  const p = data.payment;
  return [
    new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
    data.fullName,
    data.dob,
    data.age,
    data.nationality,
    data.gender.join(", "),
    data.phone,
    data.email,
    data.address,
    data.measureWeight,
    data.height,
    data.hairColour,
    data.eyeColour,
    data.bustChest,
    data.trouser,
    data.hips,
    data.languageSkills,
    data.aboutYou,
    data.skill1,
    data.skill2,
    data.skill3,
    data.skill4,
    data.instagram,
    data.agreedToTerms ? "Yes" : "No",
    data.signatureName,
    // ── Payment columns ──
    p?.orderId ?? "",
    p?.paymentId ?? "",
    p ? (p.amount / 100).toFixed(2) : "",
    p?.status ?? "",
    p?.paidAt ?? "",
  ];
}

// Pass an explicit sheetId to target a specific spreadsheet (e.g. the SJU
// sheet). With no argument it falls back to the default paid-flow sheet.
function getSheetsClient(sheetIdOverride?: string) {
  const creds = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  const sheetId = sheetIdOverride ?? process.env.GOOGLE_SHEET_ID;
  if (!creds || !sheetId) return null;
  const auth = new google.auth.GoogleAuth({
    credentials: JSON.parse(creds) as object,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
  return { sheets: google.sheets({ version: "v4", auth }), sheetId };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SheetsApi = ReturnType<typeof google.sheets>;

/** Ensure the header row spans all 30 columns (self-heals 25-column sheets). */
async function ensureHeaders(sheets: SheetsApi, sheetId: string): Promise<void> {
  const check = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: `${SHEET_NAME}!A1:AD1`,
  });
  const headerRow = check.data.values?.[0] ?? [];
  if (headerRow.length < SHEET_HEADERS.length) {
    await sheets.spreadsheets.values.update({
      spreadsheetId: sheetId,
      range: `${SHEET_NAME}!A1`,
      valueInputOption: "RAW",
      requestBody: { values: [SHEET_HEADERS] },
    });
  }
}

/** Locate an order's row (1-based) and its current payment status. */
async function findOrderRow(
  sheets: SheetsApi,
  sheetId: string,
  orderId: string
): Promise<{ row: number; status: string } | null> {
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: PAYMENT_RANGE, // Z2:AD — [orderId, paymentId, amount, status, paidAt]
  });
  const rows = res.data.values ?? [];
  for (let i = 0; i < rows.length; i++) {
    if (rows[i][0] === orderId) {
      return { row: i + 2, status: rows[i][3] ?? "" };
    }
  }
  return null;
}

/**
 * True if a status cell means a *completed* paid submission. Matches "Paid" or
 * "paid" (any case) exactly — but NOT "Paid (No Submission)", which is the
 * webhook placeholder that a real submission is allowed to upgrade.
 */
function isPaidStatus(status: string | undefined): boolean {
  return (status ?? "").trim().toLowerCase() === STATUS_PAID.toLowerCase();
}

/** True once an order has reached "Paid" status (deduplication guard). */
export async function isOrderPaid(orderId: string): Promise<boolean> {
  if (processedOrderIds.has(orderId)) return true;
  const client = getSheetsClient();
  if (!client) return false; // can't verify without Sheets — treat as not paid
  const found = await findOrderRow(client.sheets, client.sheetId, orderId);
  const paid = isPaidStatus(found?.status);
  if (paid) processedOrderIds.add(orderId);
  return paid;
}

/**
 * Append a "Pending" row when the applicant initiates payment (Proceed to
 * Payment). Captures the lead even if they never complete checkout. Non-fatal.
 */
export async function appendPendingRow(data: AuditionData): Promise<void> {
  const client = getSheetsClient();
  if (!client) {
    console.error(
      "[Sheets] Not configured — PENDING registration not recorded. " +
        `Order: ${data.payment?.orderId ?? "n/a"}`
    );
    return;
  }
  const { sheets, sheetId } = client;
  await ensureHeaders(sheets, sheetId);
  await sheets.spreadsheets.values.append({
    spreadsheetId: sheetId,
    range: APPEND_RANGE,
    valueInputOption: "RAW",
    requestBody: { values: [buildSheetRow(data)] },
  });
}

/**
 * Flip the applicant's existing Pending row to Paid (or append a full Paid row
 * if no Pending row was recorded). Logged loudly but non-fatal on failure.
 */
async function recordPaidToSheet(data: AuditionData): Promise<void> {
  const client = getSheetsClient();
  const orderId = data.payment?.orderId;
  if (!client) {
    console.error(
      "[Sheets] Not configured — PAID registration not recorded. " +
        `Order: ${orderId ?? "n/a"}`
    );
    return;
  }
  const { sheets, sheetId } = client;
  await ensureHeaders(sheets, sheetId);

  const p = data.payment;
  const existing = orderId ? await findOrderRow(sheets, sheetId, orderId) : null;
  if (existing && p) {
    // Update payment columns (AA:AD) on the pending row → Paid.
    await sheets.spreadsheets.values.update({
      spreadsheetId: sheetId,
      range: `${SHEET_NAME}!AA${existing.row}:AD${existing.row}`,
      valueInputOption: "RAW",
      requestBody: {
        values: [[p.paymentId, (p.amount / 100).toFixed(2), STATUS_PAID, p.paidAt]],
      },
    });
  } else {
    // No pending row found (create-order sheet write failed) — append a full row.
    await sheets.spreadsheets.values.append({
      spreadsheetId: sheetId,
      range: APPEND_RANGE,
      valueInputOption: "RAW",
      requestBody: { values: [buildSheetRow(data)] },
    });
  }
}

// ─── Public pipeline ─────────────────────────────────────────────────────────

export type ProcessResult = { duplicate: boolean };

/**
 * Render the PDF, email applicant + admin, and append the sheet row.
 * Idempotent on `data.payment.orderId`. The admin email is the source of truth:
 * if it fails the whole call rejects (caller returns 500). A Sheets failure is
 * logged loudly but does not fail the submission.
 */
export async function processAuditionSubmission(
  data: AuditionData,
  apiKey: string
): Promise<ProcessResult> {
  const orderId = data.payment?.orderId;

  // Idempotency — never process the same already-Paid order twice.
  if (orderId && (await isOrderPaid(orderId))) {
    return { duplicate: true };
  }

  const pdfElement = React.createElement(AuditionPDF, { data });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pdfBuffer = await renderToBuffer(pdfElement as any);

  const timestamp = new Date().toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    dateStyle: "full",
    timeStyle: "short",
  });
  const safeName = data.fullName.replace(/[^a-z0-9]/gi, "_").slice(0, 50);
  const resend = new Resend(apiKey);

  // Emails first — the admin email (with PDF) is the source of truth. If it
  // fails we throw BEFORE marking the row Paid, so the order stays Pending and
  // a retry can succeed.
  const [adminResult] = await Promise.allSettled([
    resend.emails.send({
      from: "A7 Entertainment <noreply@a7entertainment.in>",
      to: ["enquiry@a7entertainment.in"],
      reply_to: data.email,
      subject: `Orion Model Hunt — Registration — ${data.fullName}`,
      html: buildAdminHtml(data, timestamp),
      attachments: [
        { filename: `Registration_${safeName}.pdf`, content: Buffer.from(pdfBuffer) },
      ],
    }),
    resend.emails.send({
      from: "A7 Entertainment <noreply@a7entertainment.in>",
      to: [data.email],
      subject: "Application Received — A7 Entertainment",
      html: buildAutoReplyHtml(data.fullName, data.payment),
    }),
  ]);

  if (adminResult.status === "rejected") {
    throw new Error(
      `Admin email failed: ${String((adminResult as PromiseRejectedResult).reason)}`
    );
  }

  // Emails sent — now flip the pending row to Paid (non-fatal on failure).
  await recordPaidToSheet(data).catch((err) =>
    console.error(
      `[Sheets] Could not mark order ${orderId ?? "n/a"} as Paid — reconcile manually:`,
      err
    )
  );

  if (orderId) processedOrderIds.add(orderId);
  return { duplicate: false };
}

/**
 * Webhook safety net (no email). Records a captured payment whose in-page form
 * never completed by setting the row's status to "Paid (No Submission)". It
 * never clobbers a row that already reached "Paid" (a real submission), so a
 * normal payment can never be mislabeled or trigger a notification. Genuine
 * abandonment is then visible by filtering the sheet for this status.
 */
export async function markOrderPaidWithoutSubmission(payment: PaymentInfo): Promise<void> {
  const client = getSheetsClient();
  if (!client) {
    console.error(
      "[Sheets] Not configured — cannot reconcile captured payment",
      payment.orderId
    );
    return;
  }
  const { sheets, sheetId } = client;
  await ensureHeaders(sheets, sheetId);

  const amount = (payment.amount / 100).toFixed(2);
  const existing = await findOrderRow(sheets, sheetId, payment.orderId);

  if (existing) {
    if (isPaidStatus(existing.status)) return; // real submission already landed
    await sheets.spreadsheets.values.update({
      spreadsheetId: sheetId,
      range: `${SHEET_NAME}!AA${existing.row}:AD${existing.row}`,
      valueInputOption: "RAW",
      requestBody: {
        values: [[payment.paymentId, amount, STATUS_PAID_NO_SUBMISSION, payment.paidAt]],
      },
    });
    return;
  }

  // No pending row exists (create-order sheet write had failed) — append a
  // minimal record so the captured payment is still visible for follow-up.
  const row = new Array(SHEET_HEADERS.length).fill("");
  row[0] = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
  row[1] = "(Paid via webhook — no form data)";
  row[25] = payment.orderId; // Z
  row[26] = payment.paymentId; // AA
  row[27] = amount; // AB
  row[28] = STATUS_PAID_NO_SUBMISSION; // AC
  row[29] = payment.paidAt; // AD
  await sheets.spreadsheets.values.append({
    spreadsheetId: sheetId,
    range: APPEND_RANGE,
    valueInputOption: "RAW",
    requestBody: { values: [row] },
  });
}

// ─── Free flow (no payment — e.g. SJU students) ──────────────────────────────

/** Ensure the free sheet's 25-column header row exists. */
async function ensureFreeHeaders(sheets: SheetsApi, sheetId: string): Promise<void> {
  const check = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: `${SHEET_NAME}!A1:Y1`,
  });
  const headerRow = check.data.values?.[0] ?? [];
  if (headerRow.length < SHEET_HEADERS_FREE.length) {
    await sheets.spreadsheets.values.update({
      spreadsheetId: sheetId,
      range: `${SHEET_NAME}!A1`,
      valueInputOption: "RAW",
      requestBody: { values: [SHEET_HEADERS_FREE] },
    });
  }
}

/** Append a free registration row (25 form columns) to the given sheet. */
async function appendFreeRow(sheetId: string | undefined, data: AuditionData): Promise<void> {
  // Never fall back to the paid sheet — a missing SJU sheet id must not write
  // free registrations into the paid spreadsheet.
  if (!sheetId) {
    console.error("[Sheets] GOOGLE_SHEET_ID_SJU not configured — free registration NOT recorded.");
    return;
  }
  const client = getSheetsClient(sheetId);
  if (!client) {
    console.error("[Sheets] Service account not configured — free registration NOT recorded.");
    return;
  }
  const { sheets } = client;
  await ensureFreeHeaders(sheets, sheetId);
  await sheets.spreadsheets.values.append({
    spreadsheetId: sheetId,
    range: FREE_APPEND_RANGE,
    valueInputOption: "RAW",
    requestBody: { values: [buildSheetRow(data).slice(0, 25)] },
  });
}

/** Append a free registration row with University Roll Number (26 columns). */
async function appendFreeRowWithRoll(
  sheetId: string | undefined,
  envVarName: string,
  data: AuditionData
): Promise<void> {
  if (!sheetId) {
    console.error(`[Sheets] ${envVarName} not configured — free registration NOT recorded.`);
    return;
  }
  const client = getSheetsClient(sheetId);
  if (!client) {
    console.error("[Sheets] Service account not configured — free registration NOT recorded.");
    return;
  }
  const { sheets } = client;

  const check = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: `${SHEET_NAME}!A1:Z1`,
  });
  const headerRow = check.data.values?.[0] ?? [];
  // Re-check by content (not just length) so an older header order (e.g. Roll
  // Number previously appended at column Z) also self-heals to the new order.
  const headersMatch = SHEET_HEADERS_FREE_WITH_ROLL.every((h, i) => headerRow[i] === h);
  if (!headersMatch) {
    await sheets.spreadsheets.values.update({
      spreadsheetId: sheetId,
      range: `${SHEET_NAME}!A1`,
      valueInputOption: "RAW",
      requestBody: { values: [SHEET_HEADERS_FREE_WITH_ROLL] },
    });
  }

  const formCols = buildSheetRow(data).slice(0, 25);
  const row = [
    ...formCols.slice(0, 2), // Timestamp, Full Name
    data.universityRollNumber ?? "",
    ...formCols.slice(2),
  ];
  await sheets.spreadsheets.values.append({
    spreadsheetId: sheetId,
    range: FREE_WITH_ROLL_APPEND_RANGE,
    valueInputOption: "RAW",
    requestBody: { values: [row] },
  });
}

/** Per-university branding for the free registration pipeline. */
export type FreeFlowConfig = {
  /** Short badge shown in the admin email header, e.g. "SJU · FREE". */
  badge: string;
  /** Text inserted into the admin email subject, e.g. "SJU Registration". */
  subjectLabel: string;
  /** Google Sheet id for this university's registrations. */
  sheetId: string | undefined;
  /** Name of the env var supplying sheetId, used only in log messages. */
  sheetIdEnvVar: string;
  /** True if the sheet/row should include the University Roll Number column. */
  includeRollNumber?: boolean;
};

/**
 * Free registration pipeline (no payment): render the PDF, email applicant +
 * admin, and append the form row to the given university's sheet. The admin
 * email is the source of truth (throws if it fails); the sheet write is
 * non-fatal.
 */
export async function processFreeSubmission(
  data: AuditionData,
  apiKey: string,
  config: FreeFlowConfig
): Promise<void> {
  const pdfElement = React.createElement(AuditionPDF, { data });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pdfBuffer = await renderToBuffer(pdfElement as any);

  const timestamp = new Date().toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    dateStyle: "full",
    timeStyle: "short",
  });
  const safeName = data.fullName.replace(/[^a-z0-9]/gi, "_").slice(0, 50);
  const resend = new Resend(apiKey);

  const [adminResult] = await Promise.allSettled([
    resend.emails.send({
      from: "A7 Entertainment <noreply@a7entertainment.in>",
      to: ["enquiry@a7entertainment.in"],
      reply_to: data.email,
      subject: `Orion Model Hunt — ${config.subjectLabel} — ${data.fullName}`,
      html: buildAdminHtml(data, timestamp, config.badge),
      attachments: [
        { filename: `Registration_${safeName}.pdf`, content: Buffer.from(pdfBuffer) },
      ],
    }),
    resend.emails.send({
      from: "A7 Entertainment <noreply@a7entertainment.in>",
      to: [data.email],
      subject: "Application Received — A7 Entertainment",
      html: buildAutoReplyHtml(data.fullName, data.payment),
    }),
  ]);

  if (adminResult.status === "rejected") {
    throw new Error(
      `Admin email failed: ${String((adminResult as PromiseRejectedResult).reason)}`
    );
  }

  const appendPromise = config.includeRollNumber
    ? appendFreeRowWithRoll(config.sheetId, config.sheetIdEnvVar, data)
    : appendFreeRow(config.sheetId, data);

  await appendPromise.catch((err) =>
    console.error("[Sheets] Free append FAILED — reconcile manually:", err)
  );
}
