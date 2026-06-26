import { NextResponse, after } from "next/server";
import { verifyWebhookSignature } from "@/lib/razorpay";
import {
  isOrderRecorded,
  sendPaymentReconciliationAlert,
} from "@/lib/auditionProcessing";
import type { PaymentInfo } from "@/types/audition";

export const runtime = "nodejs";
export const maxDuration = 60;

// How long to wait after a captured payment before deciding the registration
// was abandoned. The in-page submit (PDF render + emails + sheet write) takes a
// few seconds; this grace period prevents a false "payment captured without
// registration" alert from racing ahead of a perfectly normal submission.
const RECONCILE_GRACE_MS = 30_000;

// Reconciliation safety net. Because we do not persist form data server-side,
// the webhook cannot regenerate a submission; instead, when a payment is
// captured but no matching registration row appears (applicant paid then closed
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
      // normal in-page submission has time to record its sheet row.
      after(async () => {
        try {
          await new Promise((resolve) => setTimeout(resolve, RECONCILE_GRACE_MS));
          if (await isOrderRecorded(orderId)) return; // normal path — submission landed
          const apiKey = process.env.RESEND_API_KEY;
          if (apiKey) await sendPaymentReconciliationAlert(payment, apiKey);
        } catch (err) {
          console.error("[/api/razorpay/webhook] reconcile error:", err);
        }
      });
    }
  }

  // Always acknowledge a validly-signed webhook to stop Razorpay retries.
  return NextResponse.json({ success: true });
}
