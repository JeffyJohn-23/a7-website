import { NextResponse, after } from "next/server";
import { verifyWebhookSignature } from "@/lib/razorpay";
import {
  isOrderPaid,
  markOrderPaidWithoutSubmission,
} from "@/lib/auditionProcessing";
import type { PaymentInfo } from "@/types/audition";

export const runtime = "nodejs";
export const maxDuration = 60;

// Grace period so a normal in-page submission (PDF + emails + sheet write) has
// time to flip its row to "Paid" before the webhook steps in. This only keeps
// the sheet tidy — correctness no longer depends on it: the reconciler never
// emails and never overwrites a row that already reached "Paid".
const RECONCILE_GRACE_MS = 30_000;

// Reconciliation safety net (no email). When a payment is captured but the
// in-page form never completed, the row is marked "Paid (No Submission)" so it
// is visible for follow-up. A successful payment can therefore never trigger a
// notification — eliminating false "payment captured without registration" mail.
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

  if (event.event === "payment.captured") {
    const entity = event.payload?.payment?.entity;
    const orderId = entity?.order_id;
    const paymentId = entity?.id;

    if (orderId && paymentId) {
      const payment: PaymentInfo = {
        orderId,
        paymentId,
        amount: entity?.amount ?? 0,
        currency: entity?.currency ?? "INR",
        status: entity?.status ?? "captured",
        paidAt: new Date().toISOString(),
      };

      // Respond to Razorpay immediately; reconcile after a grace period so a
      // normal in-page submission has time to mark its row "Paid".
      after(async () => {
        try {
          await new Promise((resolve) => setTimeout(resolve, RECONCILE_GRACE_MS));
          if (await isOrderPaid(orderId)) return; // normal path — submission landed
          await markOrderPaidWithoutSubmission(payment); // no email; sheet status only
        } catch (err) {
          console.error("[/api/razorpay/webhook] reconcile error:", err);
        }
      });
    }
  }

  // Always acknowledge a validly-signed webhook to stop Razorpay retries.
  return NextResponse.json({ success: true });
}
