import { NextResponse } from "next/server";
import { verifyWebhookSignature } from "@/lib/razorpay";
import {
  isOrderRecorded,
  sendPaymentReconciliationAlert,
} from "@/lib/auditionProcessing";
import type { PaymentInfo } from "@/types/audition";

export const runtime = "nodejs";

// Reconciliation safety net. Because we do not persist form data server-side,
// the webhook cannot regenerate a submission; instead, when a payment is
// captured but no matching registration row exists (applicant paid then closed
// the browser before the form finished), it alerts the admin to follow up.
export async function POST(request: Request) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-razorpay-signature");

  if (!verifyWebhookSignature(rawBody, signature)) {
    console.error("[/api/razorpay/webhook] Invalid signature");
    return NextResponse.json({ success: false }, { status: 400 });
  }

  let event: {
    event?: string;
    payload?: {
      payment?: {
        entity?: {
          id?: string;
          order_id?: string;
          amount?: number;
          currency?: string;
          status?: string;
        };
      };
    };
  };
  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ success: false }, { status: 400 });
  }

  try {
    if (event.event === "payment.captured") {
      const entity = event.payload?.payment?.entity;
      const orderId = entity?.order_id;
      const paymentId = entity?.id;

      if (orderId && paymentId) {
        const recorded = await isOrderRecorded(orderId);
        if (!recorded) {
          const apiKey = process.env.RESEND_API_KEY;
          if (apiKey) {
            const payment: PaymentInfo = {
              orderId,
              paymentId,
              amount: entity?.amount ?? 0,
              currency: entity?.currency ?? "INR",
              status: entity?.status ?? "captured",
              paidAt: new Date().toISOString(),
            };
            await sendPaymentReconciliationAlert(payment, apiKey);
          }
        }
      }
    }
  } catch (err) {
    // Log but still 200 — a non-200 makes Razorpay retry indefinitely.
    console.error("[/api/razorpay/webhook] Handler error:", err);
  }

  // Always acknowledge a validly-signed webhook to stop Razorpay retries.
  return NextResponse.json({ success: true });
}
