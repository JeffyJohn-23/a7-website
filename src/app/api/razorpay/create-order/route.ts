import { NextResponse } from "next/server";
import { createRazorpayOrder, isRazorpayConfigured } from "@/lib/razorpay";
import {
  REGISTRATION_FEE_PAISE,
  REGISTRATION_FEE_CURRENCY,
} from "@/lib/registration";

export const runtime = "nodejs";

// Creates a Razorpay order for the model-registration fee. The amount is fixed
// server-side from REGISTRATION_FEE_PAISE — any client-supplied amount is ignored.
export async function POST() {
  if (!isRazorpayConfigured()) {
    return NextResponse.json(
      { success: false, error: "Payments are temporarily unavailable. Please try again later." },
      { status: 503 }
    );
  }

  try {
    const receipt = `reg_${Date.now()}`;
    const order = await createRazorpayOrder({
      amount: REGISTRATION_FEE_PAISE,
      currency: REGISTRATION_FEE_CURRENCY,
      receipt,
      notes: { purpose: "Orion Model Hunt — Model Registration" },
    });

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
