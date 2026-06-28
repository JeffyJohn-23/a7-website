import { NextResponse } from "next/server";
import type { AuditionData, PaymentInfo } from "@/types/audition";
import { verifyPaymentSignature, isRazorpayConfigured } from "@/lib/razorpay";
import {
  processAuditionSubmission,
  isOrderPaid,
  STATUS_PAID,
} from "@/lib/auditionProcessing";
import { REGISTRATION_FEE_PAISE, REGISTRATION_FEE_CURRENCY } from "@/lib/registration";

export const runtime = "nodejs";
export const maxDuration = 30;

type SubmitBody = AuditionData & {
  razorpay_order_id?: string;
  razorpay_payment_id?: string;
  razorpay_signature?: string;
};

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

    // ── 1. Payment signature verification (FIRST — before any side effects) ──
    if (!isRazorpayConfigured()) {
      return NextResponse.json(
        { success: false, error: "Payments are temporarily unavailable." },
        { status: 503 }
      );
    }
    const orderId = body.razorpay_order_id;
    const paymentId = body.razorpay_payment_id;
    const signature = body.razorpay_signature;
    if (!orderId || !paymentId || !signature) {
      return NextResponse.json(
        { success: false, error: "Payment details are required." },
        { status: 402 }
      );
    }
    const validSignature = verifyPaymentSignature({ orderId, paymentId, signature });
    if (!validSignature) {
      console.error(
        `[/api/audition/submit] Signature verification FAILED for order ${orderId}, payment ${paymentId}`
      );
      return NextResponse.json(
        { success: false, error: "Payment verification failed." },
        { status: 402 }
      );
    }

    // ── 2. Idempotency — replayed Paid order returns success without re-processing ──
    if (await isOrderPaid(orderId)) {
      return NextResponse.json({ success: true, duplicate: true });
    }

    // ── 3. Field validation (unchanged) ──
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

    // ── 4. Attach server-confirmed payment metadata, then run the pipeline ──
    const payment: PaymentInfo = {
      orderId,
      paymentId,
      amount: REGISTRATION_FEE_PAISE,
      currency: REGISTRATION_FEE_CURRENCY,
      status: STATUS_PAID,
      paidAt: new Date().toISOString(),
    };
    const data: AuditionData = { ...body, payment };

    const result = await processAuditionSubmission(data, apiKey);
    return NextResponse.json({ success: true, duplicate: result.duplicate });
  } catch (err) {
    console.error("[/api/audition/submit]", err);
    return NextResponse.json(
      { success: false, error: "Server error. Please try again." },
      { status: 500 }
    );
  }
}
