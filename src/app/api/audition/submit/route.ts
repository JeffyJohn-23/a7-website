import React from "react";
import { NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { Resend } from "resend";
import { google } from "googleapis";
import { AuditionPDF } from "@/components/pdf/AuditionPDF";
import type { AuditionData } from "@/types/audition";

export const runtime = "nodejs";
export const maxDuration = 30;

// ─── Google Sheet columns (in order) ────────────────────────────────────────
const SHEET_HEADERS = [
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
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

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

function buildAdminHtml(data: AuditionData, ts: string): string {
  const g = data.gender.join(", ");
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
    <span style="float:right;font-size:10px;color:rgba(255,255,255,0.3);letter-spacing:0.3em;">NEW APPLICATION</span>
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

function buildAutoReplyHtml(name: string): string {
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
  <tr><td style="padding:24px 48px 40px;">
    <p style="margin:0 0 16px;font-size:15px;color:rgba(255,255,255,0.8);line-height:1.8;">
      We have received your model registration application and our team will review it shortly.
    </p>
    <p style="margin:0;font-size:15px;color:rgba(255,255,255,0.8);line-height:1.8;">
      If you have any questions in the meantime, feel free to reach us at
      <a href="mailto:enquiry@a7entertainment.in" style="color:#FF0000;text-decoration:none;">enquiry@a7entertainment.in</a>
      or WhatsApp us at +91&nbsp;98861&nbsp;12547.
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

function buildSheetRow(data: AuditionData): string[] {
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
  ];
}

async function appendToGoogleSheet(data: AuditionData): Promise<void> {
  const creds = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  const sheetId = process.env.GOOGLE_SHEET_ID;
  if (!creds || !sheetId) return;

  const auth = new google.auth.GoogleAuth({
    credentials: JSON.parse(creds) as object,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
  const sheets = google.sheets({ version: "v4", auth });

  // Auto-add headers if the sheet is empty
  const check = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: "Sheet1!A1:A1",
  });
  if (!check.data.values?.length) {
    await sheets.spreadsheets.values.update({
      spreadsheetId: sheetId,
      range: "Sheet1!A1",
      valueInputOption: "USER_ENTERED",
      requestBody: { values: [SHEET_HEADERS] },
    });
  }

  await sheets.spreadsheets.values.append({
    spreadsheetId: sheetId,
    range: "Sheet1!A:Y",
    valueInputOption: "USER_ENTERED",
    requestBody: { values: [buildSheetRow(data)] },
  });
}

// ─── POST handler ─────────────────────────────────────────────────────────────

export async function POST(request: Request) {
  try {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: "Email service not configured." },
        { status: 503 }
      );
    }

    const body = (await request.json()) as AuditionData;

    // Validate required fields
    if (!body.fullName?.trim() || !body.email?.trim() || !body.phone?.trim()) {
      return NextResponse.json(
        { success: false, error: "Name, email, and phone are required." },
        { status: 400 }
      );
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
      return NextResponse.json(
        { success: false, error: "Please provide a valid email address." },
        { status: 400 }
      );
    }
    if (!body.agreedToTerms || !body.signatureName?.trim()) {
      return NextResponse.json(
        { success: false, error: "Agreement and signature are required." },
        { status: 400 }
      );
    }

    // Generate PDF
    const pdfElement = React.createElement(AuditionPDF, { data: body });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pdfBuffer = await renderToBuffer(pdfElement as any);

    const timestamp = new Date().toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      dateStyle: "full",
      timeStyle: "short",
    });

    const safeName = body.fullName.replace(/[^a-z0-9]/gi, "_").slice(0, 50);
    const resend = new Resend(apiKey);

    // Send admin email + auto-reply in parallel; Sheets is fire-and-forget
    const [adminResult] = await Promise.allSettled([
      resend.emails.send({
        from: "A7 Entertainment <noreply@a7entertainment.in>",
        to: ["enquiry@a7entertainment.in"],
        reply_to: body.email,
        subject: `Orion Model Hunt — Registration — ${body.fullName}`,
        html: buildAdminHtml(body, timestamp),
        attachments: [
          {
            filename: `Registration_${safeName}.pdf`,
            content: Buffer.from(pdfBuffer),
          },
        ],
      }),
      resend.emails.send({
        from: "A7 Entertainment <noreply@a7entertainment.in>",
        to: [body.email],
        subject: "Application Received — A7 Entertainment",
        html: buildAutoReplyHtml(body.fullName),
      }),
      appendToGoogleSheet(body).catch((err) =>
        console.error("[Sheets]", err)
      ),
    ]);

    if (adminResult.status === "rejected") {
      console.error("[/api/audition/submit] Admin email failed:", adminResult.reason);
      return NextResponse.json(
        { success: false, error: "Failed to send application. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[/api/audition/submit]", err);
    return NextResponse.json(
      { success: false, error: "Server error. Please try again." },
      { status: 500 }
    );
  }
}
