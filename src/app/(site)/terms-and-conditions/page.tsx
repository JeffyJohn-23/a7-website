import type { Metadata } from "next";
import { LegalLayout, type LegalSection } from "@/components/sections/LegalLayout";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description:
    "The terms and conditions governing your use of the A7 Entertainment website, model registration, and the registration fee payment.",
  alternates: { canonical: "https://www.a7entertainment.in/terms-and-conditions" },
  openGraph: {
    url: "https://www.a7entertainment.in/terms-and-conditions",
    title: "Terms & Conditions | A7 Entertainment",
    description:
      "The terms governing your use of the A7 Entertainment website and model registration.",
  },
};

const LAST_UPDATED = "June 25, 2026";

const sections: LegalSection[] = [
  {
    heading: "Acceptance of Terms",
    body: [
      "By accessing this website, submitting a model registration, or making a payment, you agree to be bound by these Terms & Conditions. If you do not agree, please do not use the website or submit an application.",
    ],
  },
  {
    heading: "Eligibility",
    body: [
      "You must provide true, accurate, and complete information in your registration. Applicants who are minors must have the consent of a parent or legal guardian. A7 Entertainment reserves the right to verify any information you provide.",
    ],
  },
  {
    heading: "Registration & Audition Fee",
    body: [
      "Submission of a model registration requires payment of a non-refundable registration fee of up to ₹499 (INR), except as set out in our Refund Policy. The exact fee payable is displayed on the registration page at the time of payment. Payment of this fee is a processing charge and does not guarantee selection, casting, representation, or any form of work or income.",
      "All payments are processed securely through Razorpay. By proceeding to payment you also agree to Razorpay’s applicable terms.",
    ],
  },
  {
    heading: "No Guarantee of Engagement",
    body: [
      "A7 Entertainment and its partners (including Parker Models) make no representation or guarantee that submitting an application or paying the registration fee will result in selection, an audition call-back, employment, or any commercial engagement.",
    ],
  },
  {
    heading: "Use of Submitted Material",
    body: [
      "You grant A7 Entertainment and Parker Models the right to use the information, photographs, and videos you submit strictly for audition, evaluation, and casting purposes, in accordance with our Privacy Policy.",
    ],
  },
  {
    heading: "Intellectual Property",
    body: [
      "All content on this website — including text, graphics, logos, and the A7 mark — is the property of A7 Entertainment and may not be reproduced without prior written permission.",
    ],
  },
  {
    heading: "Limitation of Liability",
    body: [
      "To the maximum extent permitted by law, A7 Entertainment shall not be liable for any indirect, incidental, or consequential damages arising from your use of the website or participation in the registration process.",
    ],
  },
  {
    heading: "Governing Law",
    body: [
      "These Terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the competent courts.",
    ],
  },
];

export default function TermsAndConditionsPage() {
  return (
    <LegalLayout
      title="Terms & Conditions"
      lastUpdated={LAST_UPDATED}
      intro="These Terms & Conditions govern your use of the A7 Entertainment website and the model registration process, including payment of the registration fee. Please read them carefully before submitting an application."
      sections={sections}
    />
  );
}
