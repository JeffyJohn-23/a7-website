import type { Metadata } from "next";
import { ModelRegistrationForm } from "@/components/sections/ModelRegistrationForm";

export const metadata: Metadata = {
  title: "Model Registration — St. Joseph University",
  description:
    "Free model registration for St. Joseph University students. Complete the form to submit your profile for the Orion Model Hunt audition.",
  alternates: { canonical: "https://www.a7entertainment.in/model-registration-StJosephUniversity" },
  robots: { index: false, follow: false },
  openGraph: {
    url: "https://www.a7entertainment.in/model-registration-StJosephUniversity",
    title: "Model Registration (SJU) | A7 Entertainment",
    description:
      "Free model registration for St. Joseph University students — Orion Model Hunt.",
  },
};

export default function ModelRegistrationSJUPage() {
  return (
    <main className="bg-black">
      {/* Page hero */}
      <div
        className="section-padding border-b border-white/8 text-left"
        style={{ paddingTop: "5.5rem", paddingBottom: "2.5rem" }}
      >
        <div className="max-w-4xl mx-auto">
          <h1 className="font-display font-black text-[#FF0000] text-4xl md:text-5xl leading-tight mb-3">
            REGISTRATION
          </h1>
          <h1 className="font-display font-black text-white text-3xl md:text-3xl leading-tight mb-3">
            Orion Model Hunt — St. Joseph University.
          </h1>

          <p className="text-[#555] text-sm tracking-widest uppercase">
            Free registration for SJU students. Complete all sections and submit below.
          </p>
        </div>
      </div>

      {/* Form — free mode, no payment */}
      <ModelRegistrationForm mode="free" endpoint="/api/audition/submit-sju" />
    </main>
  );
}
