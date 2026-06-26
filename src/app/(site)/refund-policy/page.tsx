import type { Metadata } from "next";
import { LegalLayout, type LegalSection } from "@/components/sections/LegalLayout";

export const metadata: Metadata = {
  title: "Refund Policy",
  description:
    "A7 Entertainment's refund policy for the model registration fee — when the fee is refundable and how to request a refund.",
  alternates: { canonical: "https://www.a7entertainment.in/refund-policy" },
  openGraph: {
    url: "https://www.a7entertainment.in/refund-policy",
    title: "Refund Policy | A7 Entertainment",
    description:
      "When the model registration fee is refundable and how to request a refund.",
  },
};

const LAST_UPDATED = "June 25, 2026";

const sections: LegalSection[] = [
  {
    heading: "Registration Fee",
    body: [
      "Submission of a model registration requires a one-time, non-refundable registration fee of up to ₹499 (INR). The exact fee payable is shown on the registration page at the time of payment. This fee covers the administrative processing and review of your application.",
    ],
  },
  {
    heading: "Non-Refundable by Default",
    body: [
      "Because the fee covers processing that begins as soon as your application is submitted, the registration fee is generally non-refundable once your application has been received and processed. Payment of the fee does not guarantee selection, casting, or any engagement, and non-selection is not a ground for a refund.",
    ],
  },
  {
    heading: "When a Refund May Be Issued",
    body: [
      "A refund will be considered only in the following limited circumstances: (a) you were charged more than once for the same registration due to a technical error; (b) the payment was deducted but your application was not recorded due to a verified system failure on our side; or (c) where a refund is required under applicable law.",
    ],
  },
  {
    heading: "How to Request a Refund",
    body: [
      "To request a refund under the circumstances above, email enquiry@a7entertainment.in within 7 days of the transaction with your name, registered email, and the Razorpay payment/order ID. We will review eligible requests and respond accordingly.",
    ],
  },
  {
    heading: "Processing of Approved Refunds",
    body: [
      "Approved refunds are processed back to the original payment method through Razorpay. Depending on your bank or card issuer, it may take 5–10 business days for the amount to reflect in your account.",
    ],
  },
];

export default function RefundPolicyPage() {
  return (
    <LegalLayout
      title="Refund Policy"
      lastUpdated={LAST_UPDATED}
      intro="This Refund Policy explains the terms applicable to the model registration fee (up to ₹499), including the limited circumstances in which a refund may be issued. It should be read together with our Terms & Conditions."
      sections={sections}
    />
  );
}
