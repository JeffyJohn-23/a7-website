"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const faqs = [
  {
    q: "What types of events does A7 Entertainment manage?",
    a: "We manage the full spectrum — from large-scale concerts and film promotions to corporate conferences, brand activations, wedding entertainment, and cultural festivals. Whether it's a 500-person gala or a 50,000-person concert, we handle concept, production, talent, and execution end to end.",
  },
  {
    q: "Do you manage celebrity bookings for events in Kerala and across India?",
    a: "Yes. Our celebrity management arm handles talent identification, negotiations, contracts, logistics, and on-ground coordination for both national and international artists. We have established relationships with top-tier talent across film, music, sports, and digital media.",
  },
  {
    q: "Which cities and regions do you operate in?",
    a: "We operate pan-India with a strong presence in Kerala — including Kollam, Thiruvananthapuram, Kochi, and Kozhikode — and have delivered international productions in Dubai, UAE. Our team is equipped to manage productions anywhere in the country.",
  },
  {
    q: "What makes A7 Entertainment different from other event management companies?",
    a: "We are a fully integrated agency — meaning event production, celebrity management, digital marketing, influencer campaigns, and content creation all live under one roof. This integration means faster execution, tighter brand consistency, and measurable ROI across every touchpoint of your campaign.",
  },
  {
    q: "How do I get a quote for my event or campaign?",
    a: "Reach out through our contact form or WhatsApp us directly. We'll schedule a consultation to understand your vision, audience, and objectives — then provide a detailed proposal with timelines and investment details. Most clients receive a proposal within 48 hours.",
  },
  {
    q: "Do you offer digital marketing alongside event management?",
    a: "Yes. Our digital marketing division runs performance marketing, social media management, influencer campaigns, and content production — often integrated with live events for maximum reach. We design campaigns that build anticipation before the event and extend its impact long after.",
  },
  {
    q: "What is A7 Studio?",
    a: "A7 Studio is our in-house content production facility offering professional shoot spaces, podcast setups, and post-production support for brands and creators. It's designed for brands that need high-quality content without the overhead of a full production agency.",
  },
  {
    q: "Can you handle brand activations for corporate clients?",
    a: "Absolutely. Brand activations are one of our core specialities — from experiential pop-ups and product launch events to interactive installations and sponsored experiences. We build activations that create genuine emotional connections between your brand and your audience.",
  },
];

export function FAQSection() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section
      id="faq"
      className="relative w-full bg-white section-padding"
      style={{ paddingTop: "2.5rem", paddingBottom: "6rem" }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Label + divider */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex items-center gap-6 mb-10"
        >
          <span className="text-[11px] tracking-[0.5em] uppercase text-[#FF0000] font-sans shrink-0">
            FAQ
          </span>
          <div className="flex-1 h-px bg-black/10" />
        </motion.div>

        {/* Two-column layout on large screens */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-12 lg:gap-20 items-start">

          {/* Left: heading block */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
            className="lg:sticky lg:top-28"
          >
            {/* Dot motif accent */}
            <div
              className="w-12 h-12 mb-8 hidden lg:grid"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: "5px",
              }}
              aria-hidden="true"
            >
              {Array.from({ length: 16 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-full"
                  style={{
                    width: "4px",
                    height: "4px",
                    background: i % 5 === 0 ? "#FF0000" : "rgba(0,0,0,0.15)",
                  }}
                />
              ))}
            </div>

            <h2
              className="font-display font-bold leading-[1.06] text-[#0a0a0a] mb-5"
              style={{ fontSize: "clamp(2.4rem, 5.5vw, 4rem)" }}
            >
              Frequently
              <br />
              Asked
              <br />
              <span className="text-[#FF0000]">Questions</span>
            </h2>
            <p className="text-[#666] text-[13px] leading-[1.85] max-w-[16rem]">
              Everything you need to know about working with A7 Entertainment.
            </p>
            <button
              data-cursor-hover
              onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
              className="mt-8 inline-flex items-center gap-3 text-[10px] tracking-[0.3em] uppercase font-sans font-medium text-[#FF0000] group"
            >
              <span className="w-6 h-px bg-[#FF0000] group-hover:w-10 transition-all duration-300" />
              Ask Us Directly
            </button>
          </motion.div>

          {/* Right: accordion */}
          <div>
            <div className="divide-y divide-black/[0.07]">
              {faqs.map((faq, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.45, ease: "easeOut", delay: Math.min(i * 0.04, 0.24) }}
                >
                  <button
                    data-cursor-hover
                    onClick={() => setOpen(open === i ? null : i)}
                    className="w-full flex items-start justify-between gap-8 py-7 text-left group"
                    aria-expanded={open === i}
                    aria-controls={`faq-answer-${i}`}
                  >
                    <h3 className="font-display text-[clamp(0.9rem,2vw,1.05rem)] font-semibold text-[#0a0a0a] leading-snug group-hover:text-[#FF0000] transition-colors duration-200 max-w-xl">
                      {faq.q}
                    </h3>
                    <motion.span
                      animate={{ rotate: open === i ? 45 : 0 }}
                      transition={{ duration: 0.22 }}
                      className="shrink-0 mt-0.5 text-[#999] group-hover:text-[#FF0000] transition-colors duration-200 font-light text-xl leading-none"
                      aria-hidden="true"
                    >
                      +
                    </motion.span>
                  </button>

                  <AnimatePresence initial={false}>
                    {open === i && (
                      <motion.div
                        id={`faq-answer-${i}`}
                        key="answer"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.32, ease: [0.04, 0.62, 0.23, 0.98] }}
                        className="overflow-hidden"
                      >
                        <p className="text-[#555] text-[14px] leading-[1.9] pb-7 pt-1 max-w-xl">
                          {faq.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>

            {/* Bottom note */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-8 pt-6 border-t border-black/[0.07] flex items-center justify-between gap-4 flex-wrap"
            >
              <p className="text-[#999] text-[12px]">Still have questions?</p>
              <button
                data-cursor-hover
                onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
                className="text-[10px] tracking-[0.3em] uppercase font-sans font-medium text-[#FF0000] hover:underline transition-all"
              >
                Get in Touch →
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
