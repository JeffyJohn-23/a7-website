import { NextResponse } from "next/server";
import type { AuditionData } from "@/types/audition";
import { processFreeSubmission } from "@/lib/auditionProcessing";

export const runtime = "nodejs";
export const maxDuration = 30;

// Free registration endpoint for Jain University CMS campus students. No
// payment — deliberately separate from /api/audition/submit so the paid flow
// can never be bypassed. Writes to the Jain CMS sheet (GOOGLE_SHEET_ID_JAINCMS).
// Requires University Roll Number in addition to the standard fields.
type SubmitBody = AuditionData & { website?: string };

export async function POST(request: Request) {
  try {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: "Email service not configured." },
        { status: 503 }
      );
    }

    const body = (await request.json()) as SubmitBody;

    // Honeypot: real users never fill the hidden "website" field. If it's set,
    // silently pretend success so bots don't learn they were caught.
    if (body.website && body.website.trim() !== "") {
      return NextResponse.json({ success: true });
    }

    // Field validation (same required set as the paid flow, plus roll number)
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
    if (!body.universityRollNumber?.trim()) {
      return NextResponse.json(
        { success: false, error: "University Roll Number is required." },
        { status: 400 }
      );
    }
    if (!body.agreedToTerms || !body.signatureName?.trim()) {
      return NextResponse.json(
        { success: false, error: "Agreement and signature are required." },
        { status: 400 }
      );
    }

    // Strip payment (free flow) and process to the Jain CMS sheet.
    const data: AuditionData = { ...body, payment: undefined };
    await processFreeSubmission(data, apiKey, {
      badge: "JAIN CMS · FREE",
      subjectLabel: "Jain CMS Registration",
      sheetId: process.env.GOOGLE_SHEET_ID_JAINCMS,
      sheetIdEnvVar: "GOOGLE_SHEET_ID_JAINCMS",
      includeRollNumber: true,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[/api/audition/submit-jaincms]", err);
    return NextResponse.json(
      { success: false, error: "Server error. Please try again." },
      { status: 500 }
    );
  }
}
