import type { Metadata } from "next";
import { ModelRegistrationForm } from "@/components/sections/ModelRegistrationForm";

export const metadata: Metadata = {
  title: "Model Registration By A7Entertainment & Parker Models — Presidency University",
  description:
    "Complete the form to submit your profile for the Orion Model Hunt audition.",
  alternates: { canonical: "https://www.a7entertainment.in/model-registration-PresidencyUniversity" },
  robots: { index: false, follow: false },
  openGraph: {
    url: "https://www.a7entertainment.in/model-registration-PresidencyUniversity",
    title: "Model Registration (Presidency University) | A7 Entertainment",
    description:
      "Presidency University students — Orion Model Hunt.",
  },
};

export default function ModelRegistrationPresidencyUniversityPage() {
  return (
    <main className="bg-black">
      {/* Page hero */}
      <div
        className="section-padding border-b border-white/8 text-left"
        style={{ paddingTop: "5.5rem", paddingBottom: "2.5rem" }}
      >
        <div className="max-w-4xl mx-auto">
          <h1 className="font-display font-black text-[#FF0000] text-4xl md:text-5xl leading-tight mb-3">
            REGISTRATION — Presidency University.
          </h1>
          <h1 className="font-display font-black text-white text-3xl md:text-3xl leading-tight mb-3">
            Orion Model Hunt By A7Entertainment & Parker Models.
          </h1>

          <p className="text-[#555] text-sm tracking-widest uppercase">
            Complete all sections and submit your application below.
          </p>
        </div>
      </div>

      {/* Form — free mode, no payment, University Roll Number required */}
      <ModelRegistrationForm
        mode="free"
        endpoint="/api/audition/submit-presidency"
        showRollNumber
        universityName="Presidency University"
      />
    </main>
  );
}
