import type { Metadata } from "next";
import { LegalLayout, type LegalSection } from "@/components/sections/LegalLayout";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How A7 Entertainment collects, uses, and protects the personal information you provide through our website and model registration form.",
  alternates: { canonical: "https://www.a7entertainment.in/privacy-policy" },
  openGraph: {
    url: "https://www.a7entertainment.in/privacy-policy",
    title: "Privacy Policy | A7 Entertainment",
    description:
      "How A7 Entertainment collects, uses, and protects your personal information.",
  },
};

const LAST_UPDATED = "June 25, 2026";

const sections: LegalSection[] = [
  {
    heading: "Information We Collect",
    body: [
      "When you submit a model registration or contact form, we collect the personal details you provide — including your name, date of birth, contact details, address, physical measurements, photographs, language and skill information, and social media links.",
      "When you make a payment, our payment processor (Razorpay) handles your card or banking details directly. We do not collect or store your full card numbers, CVV, or banking credentials on our servers.",
      "We may also automatically collect limited technical data such as your IP address, browser type, and usage analytics to operate and improve the website.",
    ],
  },
  {
    heading: "How We Use Your Information",
    body: [
      "We use the information you provide to review and process your model registration or audition application, to communicate with you about your application, and to respond to your enquiries.",
      "Payment information is used solely to process the registration fee and to reconcile and confirm successful transactions.",
    ],
  },
  {
    heading: "How We Share Your Information",
    body: [
      "We share your application data internally with our team and with associated partners (such as Parker Models) strictly for audition and casting purposes.",
      "We use trusted third-party service providers — including Razorpay (payments), Resend (email delivery), and Google (spreadsheet record-keeping) — who process your information on our behalf. We do not sell your personal information to third parties.",
    ],
  },
  {
    heading: "Data Retention",
    body: [
      "We retain your application and payment records for as long as necessary to fulfil the purposes described in this policy and to meet legal, accounting, or reporting obligations.",
    ],
  },
  {
    heading: "Your Rights",
    body: [
      "You may request access to, correction of, or deletion of the personal information we hold about you by contacting us at enquiry@a7entertainment.in. We will respond in accordance with applicable law.",
    ],
  },
  {
    heading: "Changes to This Policy",
    body: [
      "We may update this Privacy Policy from time to time. The latest version will always be available on this page with a revised “Last updated” date.",
    ],
  },
];

export default function PrivacyPolicyPage() {
  return (
    <LegalLayout
      title="Privacy Policy"
      lastUpdated={LAST_UPDATED}
      intro="This Privacy Policy explains how A7 Entertainment collects, uses, and safeguards the information you share with us through our website, model registration form, and payment process. By using our website you consent to the practices described below."
      sections={sections}
    />
  );
}
