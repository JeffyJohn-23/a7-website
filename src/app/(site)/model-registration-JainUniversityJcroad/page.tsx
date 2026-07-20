import type { Metadata } from "next";
import { ModelRegistrationForm } from "@/components/sections/ModelRegistrationForm";

export const metadata: Metadata = {
  title: "Model Registration By A7Entertainment & Parker Models — Jain University",
  description:
    "Complete the form to submit your profile for the Orion Model Hunt audition.",
  alternates: { canonical: "https://www.a7entertainment.in/model-registration-JainUniversityJcroad" },
  robots: { index: false, follow: false },
  openGraph: {
    url: "https://www.a7entertainment.in/model-registration-JainUniversityJcroad",
    title: "Model Registration (Jain University) | A7 Entertainment",
    description:
      "Jain University (JC Road) students — Orion Model Hunt.",
  },
};

export default function ModelRegistrationJainUniversityPage() {
  return (
    <main className="bg-black">
      {/* Page hero */}
      <div
        className="section-padding border-b border-white/8 text-left"
        style={{ paddingTop: "5.5rem", paddingBottom: "2.5rem" }}
      >
        <div className="max-w-4xl mx-auto">
          <h1 className="font-display font-black text-[#FF0000] text-4xl md:text-5xl leading-tight mb-3">
            REGISTRATION — Jain University.
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
        endpoint="/api/audition/submit-jain"
        showRollNumber
        universityName="Jain University"
      />
    </main>
  );
}
