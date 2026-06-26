import { NextResponse } from "next/server";
import { createRazorpayOrder, isRazorpayConfigured } from "@/lib/razorpay";
import { appendPendingRow, STATUS_PENDING } from "@/lib/auditionProcessing";
import {
  REGISTRATION_FEE_PAISE,
  REGISTRATION_FEE_CURRENCY,
} from "@/lib/registration";
import type { AuditionData } from "@/types/audition";

export const runtime = "nodejs";

// Creates a Razorpay order for the model-registration fee and records a
// "Pending" lead row in the sheet. The amount is fixed server-side from
// REGISTRATION_FEE_PAISE — any client-supplied amount is ignored.
export async function POST(request: Request) {
  if (!isRazorpayConfigured()) {
    return NextResponse.json(
      { success: false, error: "Payments are temporarily unavailable. Please try again later." },
      { status: 503 }
    );
  }

  try {
    const form = (await request.json().catch(() => ({}))) as Partial<AuditionData>;

    const receipt = `reg_${Date.now()}`;
    const order = await createRazorpayOrder({
      amount: REGISTRATION_FEE_PAISE,
      currency: REGISTRATION_FEE_CURRENCY,
      receipt,
      notes: {
        purpose: "Orion Model Hunt — Model Registration",
        applicant: (form.fullName ?? "").slice(0, 100),
      },
    });

    // Record a Pending lead row (best-effort — never blocks the payment).
    if (form.fullName || form.email || form.phone) {
      const pending: AuditionData = {
        ...(form as AuditionData),
        photoBase64: "", // not stored in the sheet
        payment: {
          orderId: order.id,
          paymentId: "",
          amount: REGISTRATION_FEE_PAISE,
          currency: REGISTRATION_FEE_CURRENCY,
          status: STATUS_PENDING,
          paidAt: "",
        },
      };
      await appendPendingRow(pending).catch((err) =>
        console.error("[/api/razorpay/create-order] pending row failed:", err)
      );
    }

    return NextResponse.json({
      success: true,
      orderId: order.id,
      amount: REGISTRATION_FEE_PAISE,
      currency: REGISTRATION_FEE_CURRENCY,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    console.error("[/api/razorpay/create-order]", err);
    return NextResponse.json(
      { success: false, error: "Could not start payment. Please try again." },
      { status: 500 }
    );
  }
}
