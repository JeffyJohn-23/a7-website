import type { ReactNode } from "react";

export type LegalSection = {
  heading: string;
  body: ReactNode[];
};

type LegalLayoutProps = {
  title: string;
  lastUpdated: string;
  intro?: ReactNode;
  sections: LegalSection[];
};

/**
 * Shared presentational shell for the policy pages (Privacy / Terms / Refund).
 * Server component — static content only, no client hooks.
 * Brand palette only: #000 bg, #FF0000 accents, white headings, muted body.
 */
export function LegalLayout({ title, lastUpdated, intro, sections }: LegalLayoutProps) {
  return (
    <main className="bg-black min-h-screen">
      {/* Page hero */}
      <div
        className="section-padding border-b border-white/8"
        style={{ paddingTop: "6.5rem", paddingBottom: "2.5rem" }}
      >
        <div className="max-w-4xl mx-auto">
          <h1 className="font-display font-black text-white text-4xl md:text-5xl leading-tight mb-3">
            {title}
          </h1>
          <p className="text-[#666] text-xs tracking-[0.25em] uppercase">
            Last updated · {lastUpdated}
          </p>
        </div>
      </div>

      {/* Body */}
      <div className="section-padding" style={{ paddingTop: "3rem", paddingBottom: "6rem" }}>
        <div className="max-w-4xl mx-auto">
          {intro && (
            <p
              className="font-sans text-[15px] leading-[1.85]"
              style={{ color: "rgba(255,255,255,0.72)", marginBottom: "3rem" }}
            >
              {intro}
            </p>
          )}

          <div className="flex flex-col" style={{ gap: "2.75rem" }}>
            {sections.map((section, i) => (
              <section key={i}>
                <div className="flex items-center gap-4 mb-4">
                  <span
                    className="text-white font-bold text-xs leading-none flex-shrink-0"
                    style={{ background: "#FF0000", padding: "4px 9px" }}
                  >
                    {i + 1}
                  </span>
                  <h2 className="text-white text-base font-bold tracking-[0.12em] uppercase">
                    {section.heading}
                  </h2>
                </div>
                <div
                  className="font-sans text-[15px] leading-[1.85] flex flex-col"
                  style={{ color: "rgba(255,255,255,0.72)", gap: "1rem" }}
                >
                  {section.body.map((para, j) => (
                    <div key={j}>{para}</div>
                  ))}
                </div>
              </section>
            ))}
          </div>

          {/* Contact footer line */}
          <div
            className="border-t border-white/8"
            style={{ marginTop: "4rem", paddingTop: "2rem" }}
          >
            <p className="font-sans text-[13px] leading-[1.8]" style={{ color: "#666" }}>
              Questions about this policy? Contact us at{" "}
              <a
                href="mailto:enquiry@a7entertainment.in"
                className="text-[#FF0000] no-underline hover:opacity-70 transition-opacity"
                data-cursor-hover
              >
                enquiry@a7entertainment.in
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
