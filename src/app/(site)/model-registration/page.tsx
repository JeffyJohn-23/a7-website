import type { Metadata } from "next";
import { ModelRegistrationForm } from "@/components/sections/ModelRegistrationForm";

export const metadata: Metadata = {
  title: "Model Registration",
  description:
    "Apply to be a part of A7 Entertainment's talent roster. Complete the model registration form to submit your profile for consideration.",
  alternates: { canonical: "https://www.a7entertainment.in/model-registration" },
  robots: { index: false, follow: false },
  openGraph: {
    url: "https://www.a7entertainment.in/model-registration",
    title: "Model Registration | A7 Entertainment",
    description:
      "Register as a model or talent with A7 Entertainment. Fill in your details and submit your application.",
  },
};

export default function ModelRegistrationPage() {
  return (
    <main className="bg-black">
      {/* Page hero */}
      <div
        className="section-padding border-b border-white/8 text-left"
        style={{ paddingTop: "5.5rem", paddingBottom: "2.5rem" }}
      >
        <div className="max-w-4xl mx-auto">
          <p className="text-[#FF0000] text-[10px] tracking-[0.4em] uppercase mb-3">
            A7 Entertainment
          </p>
          <h1 className="text-white text-4xl md:text-5xl font-bold leading-tight mb-3">
            Model Registration
          </h1>
          <p className="text-[#555] text-sm tracking-widest uppercase">
            Complete all sections and submit your application below.
          </p>
        </div>
      </div>

      {/* Form */}
      <ModelRegistrationForm />
    </main>
  );
}
