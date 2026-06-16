"use client";

import { useState, useRef } from "react";
import type { AuditionData } from "@/types/audition";

// ─── initial state ────────────────────────────────────────────────────────────

const EMPTY: AuditionData = {
  fullName: "", stageName: "", dob: "", age: "", nationality: "", ethnicity: "",
  gender: [], height: "", weight: "", bloodType: "", phone: "", email: "",
  address: "", photoBase64: "",
  measureWeight: "", heightWithoutHeels: "", heightWithHeels: "", hobby: "",
  emailId: "", hair: "", eyes: "", complexion: "", bustChest: "",
  upperWaist: "", lowerWaist: "", hips: "", bodyType: "",
  auditionCategories: [],
  languageSkills: "", aboutYou: "", experience: "",
  skill1: "", skill2: "", skill3: "", skill4: "",
  link1: "", link2: "", link3: "", link4: "",
  instagram: "", snapchat: "", threads: "", otherSocial: "",
  agreedToTerms: false, signatureName: "",
  signatureDate: new Date().toISOString().split("T")[0],
};

// ─── sub-components ───────────────────────────────────────────────────────────

// Section header: red index chip + title above a full-width divider.
// marginBottom = --space-lg (32px) is the single source of truth for the
// header → first-field gap; pb-3 keeps the divider off the title.
function SectionBadge({ num, title }: { num: number; title: string }) {
  return (
    <div
      className="flex items-center gap-4 pb-3 border-b border-[#333]"
      style={{ marginBottom: "var(--space-lg)" }}
    >
      <span
        className="text-white font-bold text-sm leading-none flex-shrink-0"
        style={{ background: "#FF0000", padding: "4px 10px" }}
      >
        {num}
      </span>
      <span className="text-white text-sm font-bold tracking-[0.18em] uppercase">
        {title}
      </span>
    </div>
  );
}

// Label → input gap is exactly --space-xs (8px) everywhere.
function Label({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="block text-[10px] text-[#555] tracking-widest uppercase"
      style={{ marginBottom: "var(--space-xs)" }}
    >
      {children}
    </span>
  );
}

// Helper line sits --space-xs (8px) above its field group.
function Helper({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="text-[10px] text-[#555] uppercase tracking-widest"
      style={{ marginBottom: "var(--space-xs)" }}
    >
      {children}
    </p>
  );
}

// Border lives on the wrapper so focus-within highlights label + input together.
// justify-end keeps the baseline aligned across a grid row when one label wraps.
function TextInput({
  label, value, onChange, type = "text", placeholder = "", required = false,
}: {
  label: string; value: string; onChange: (v: string) => void;
  type?: string; placeholder?: string; required?: boolean;
}) {
  return (
    <div className="flex flex-col justify-end border-b border-[#333] pb-1 focus-within:border-[#FF0000] transition-colors">
      <Label>{label}{required && <span className="text-[#FF0000]"> *</span>}</Label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="bg-[#000000] [color-scheme:dark] text-white text-sm py-1 outline-none placeholder:text-white/20"
        style={{ WebkitBoxShadow: "0 0 0 1000px #000000 inset", WebkitTextFillColor: "white", border: "none" }}
        data-cursor-hover
      />
    </div>
  );
}

function TextArea({
  label, value, onChange, placeholder = "",
}: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="flex flex-col flex-1 border-b border-[#333] pb-1 focus-within:border-[#FF0000] transition-colors">
      <Label>{label}</Label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="flex-1 bg-[#000000] text-white text-sm py-2 outline-none resize-none min-h-[160px] placeholder:text-white/20"
        style={{ border: "none" }}
        data-cursor-hover
      />
    </div>
  );
}

function CheckboxGroup({
  label, options, selected, onChange,
}: {
  label: string; options: string[];
  selected: string[]; onChange: (v: string[]) => void;
}) {
  const toggle = (opt: string) => {
    onChange(
      selected.includes(opt) ? selected.filter((x) => x !== opt) : [...selected, opt]
    );
  };
  return (
    <div>
      {label && <Label>{label}</Label>}
      {/* gap-x = --space-md (24px), gap-y = --space-sm (16px) */}
      <div
        className="flex flex-wrap"
        style={{ columnGap: "var(--space-md)", rowGap: "var(--space-sm)" }}
      >
        {options.map((opt) => {
          const checked = selected.includes(opt);
          return (
            <label key={opt} className="flex items-center gap-2 cursor-pointer group" data-cursor-hover>
              <div
                className="w-4 h-4 border flex items-center justify-center flex-shrink-0 transition-colors"
                style={{
                  borderColor: checked ? "#FF0000" : "#555",
                  background: checked ? "#FF0000" : "transparent",
                }}
                onClick={() => toggle(opt)}
              >
                {checked && (
                  <svg viewBox="0 0 10 8" width="9" height="7" fill="none">
                    <path d="M1 4l3 3 5-6" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
              <span className="text-white/70 text-xs uppercase tracking-widest group-hover:text-white transition-colors">{opt}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
}

// Skill row — bulleted single-line input on the TextInput baseline.
function SkillInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="border-b border-[#333] pb-1 focus-within:border-[#FF0000] transition-colors flex items-center gap-2">
      <span className="text-[#555] text-xs flex-shrink-0">•</span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="SKILL"
        className="flex-1 bg-[#000] text-white text-xs uppercase tracking-widest py-1 outline-none placeholder:text-white/20"
        style={{ border: "none", WebkitBoxShadow: "0 0 0 1000px #000 inset", WebkitTextFillColor: "white" }}
        data-cursor-hover
      />
    </div>
  );
}

// ─── main component ───────────────────────────────────────────────────────────

export function ModelRegistrationForm() {
  const [form, setForm] = useState<AuditionData>(EMPTY);
  const [photoPreview, setPhotoPreview] = useState<string>("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const set = (field: keyof AuditionData) => (v: string) =>
    setForm((f) => ({ ...f, [field]: v }));

  // ── Photo compression ──────────────────────────────────────────────────────
  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const src = ev.target?.result as string;
      const img = new window.Image();
      img.src = src;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX = 600;
        let w = img.naturalWidth, h = img.naturalHeight;
        if (w > MAX || h > MAX) {
          if (w > h) { h = Math.round((h * MAX) / w); w = MAX; }
          else { w = Math.round((w * MAX) / h); h = MAX; }
        }
        canvas.width = w; canvas.height = h;
        canvas.getContext("2d")!.drawImage(img, 0, 0, w, h);
        const compressed = canvas.toDataURL("image/jpeg", 0.75);
        setPhotoPreview(compressed);
        setForm((f) => ({ ...f, photoBase64: compressed }));
      };
    };
    reader.readAsDataURL(file);
  };

  // ── Submit ────────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!form.fullName.trim()) { setErrorMsg("Full name is required."); return; }
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setErrorMsg("A valid email address is required."); return;
    }
    if (!form.phone.trim()) { setErrorMsg("Phone number is required."); return; }
    if (!form.agreedToTerms) { setErrorMsg("You must agree to the terms."); return; }
    if (!form.signatureName.trim()) { setErrorMsg("Signature (full name) is required."); return; }

    setStatus("loading");
    try {
      const res = await fetch("/api/audition/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json() as { success: boolean; error?: string };
      if (data.success) {
        setStatus("success");
      } else {
        setErrorMsg(data.error ?? "Submission failed. Please try again.");
        setStatus("error");
      }
    } catch {
      setErrorMsg("Network error. Please try again.");
      setStatus("error");
    }
  };

  // ── Success state ──────────────────────────────────────────────────────────
  if (status === "success") {
    return (
      <section className="bg-black section-padding" style={{ paddingTop: "5rem", paddingBottom: "6rem" }}>
        <div className="max-w-2xl mx-auto text-center">
          <div
            className="inline-flex items-center justify-center w-16 h-16 mb-6"
            style={{ background: "#FF0000" }}
          >
            <svg viewBox="0 0 24 24" width="28" height="28" fill="none">
              <path d="M5 13l4 4L19 7" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h2 className="text-white text-3xl font-bold mb-4">Application Submitted</h2>
          <p className="text-[#666] text-base leading-relaxed mb-8">
            Thank you, {form.fullName.split(" ")[0]}. We&apos;ve received your registration and sent a
            confirmation to <span className="text-white">{form.email}</span>. Our team will be in touch.
          </p>
          <button
            onClick={() => { setForm(EMPTY); setPhotoPreview(""); setStatus("idle"); }}
            className="text-[#FF0000] text-sm tracking-widest uppercase underline"
            data-cursor-hover
          >
            Submit another application
          </button>
        </div>
      </section>
    );
  }

  // ── Form ───────────────────────────────────────────────────────────────────
  // Spacing system (all from the token scale in globals.css):
  //   section → section : --space-section  (80 / 64 / 48)  via .form-sections flex gap
  //   header → fields    : --space-lg (32)                 via SectionBadge
  //   field → field      : --space-md (24)                 via .field-stack
  //   2-col gutter        : --gap-col (48 / 32 / 24)         via .col-2
  //   label → input       : --space-xs (8)                  via Label
  return (
    <section className="bg-black section-padding" style={{ paddingTop: "3rem", paddingBottom: "6rem" }}>
      <div className="max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} noValidate className="form-sections">

          {/* ── Section 1 – Personal Information ── */}
          <section>
            <SectionBadge num={1} title="Personal Information" />
            <div className="col-fields-photo">
              {/* Fields */}
              <div className="field-stack">
                <TextInput label="Full Name" value={form.fullName} onChange={set("fullName")} required />
                <TextInput label="Stage Name (if any)" value={form.stageName} onChange={set("stageName")} />
                <div className="col-2">
                  <TextInput label="Date of Birth" value={form.dob} onChange={set("dob")} type="date" />
                  <TextInput label="Age" value={form.age} onChange={set("age")} type="number" />
                  <TextInput label="Nationality" value={form.nationality} onChange={set("nationality")} />
                  <TextInput label="Ethnicity" value={form.ethnicity} onChange={set("ethnicity")} />
                </div>
                <div className="border-b border-[#333] pb-2">
                  <CheckboxGroup
                    label="Gender"
                    options={["MALE", "FEMALE", "NON-BINARY", "OTHER"]}
                    selected={form.gender}
                    onChange={(v) => setForm((f) => ({ ...f, gender: v }))}
                  />
                </div>
                <div className="col-2">
                  <TextInput label="Height" value={form.height} onChange={set("height")} placeholder="e.g. 5'7&quot;" />
                  <TextInput label="Weight" value={form.weight} onChange={set("weight")} placeholder="e.g. 60 kg" />
                  <TextInput label="Blood Type" value={form.bloodType} onChange={set("bloodType")} />
                  <TextInput label="Phone Number" value={form.phone} onChange={set("phone")} type="tel" required />
                </div>
                <TextInput label="E-Mail" value={form.email} onChange={set("email")} type="email" required />
                <TextInput label="Address" value={form.address} onChange={set("address")} />
              </div>

              {/* Photo upload — stretches to match the field column height */}
              <div className="flex flex-col">
                <Label>Photo (4×5cm) / ID / Selfie</Label>
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="flex-1 min-h-[240px] border border-[#333] hover:border-[#FF0000] transition-colors overflow-hidden flex flex-col items-center justify-center gap-2 p-4"
                  data-cursor-hover
                >
                  {photoPreview ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <>
                      <svg viewBox="0 0 24 24" width="28" height="28" fill="none" className="opacity-30">
                        <circle cx="12" cy="8" r="3" stroke="currentColor" strokeWidth="1.5" />
                        <path d="M4 19c0-3.314 3.582-6 8-6s8 2.686 8 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                      <span className="text-white/30 text-[10px] text-center tracking-widest uppercase">Click to Upload</span>
                    </>
                  )}
                </button>
                {photoPreview && (
                  <button
                    type="button"
                    onClick={() => { setPhotoPreview(""); setForm((f) => ({ ...f, photoBase64: "" })); }}
                    className="mt-2 text-[10px] text-white/30 hover:text-[#FF0000] transition-colors tracking-widest uppercase text-center"
                    data-cursor-hover
                  >
                    Remove
                  </button>
                )}
                <input ref={fileRef} type="file" accept="image/*" onChange={handlePhoto} className="hidden" />
              </div>
            </div>
          </section>

          {/* ── Section 2 – Measurements ── */}
          <section>
            <SectionBadge num={2} title="Measurements" />
            {/* True 2-column grid — two balanced columns (7 / 6), no placeholder cells */}
            <div className="col-2">
              <div className="field-stack">
                <TextInput label="Weight" value={form.measureWeight} onChange={set("measureWeight")} />
                <TextInput label="Height Without Heels" value={form.heightWithoutHeels} onChange={set("heightWithoutHeels")} />
                <TextInput label="Height With Heels" value={form.heightWithHeels} onChange={set("heightWithHeels")} />
                <TextInput label="Bust / Chest" value={form.bustChest} onChange={set("bustChest")} />
                <TextInput label="Upper Waist" value={form.upperWaist} onChange={set("upperWaist")} />
                <TextInput label="Lower Waist" value={form.lowerWaist} onChange={set("lowerWaist")} />
                <TextInput label="Hips" value={form.hips} onChange={set("hips")} />
              </div>
              <div className="field-stack">
                <TextInput label="Hair" value={form.hair} onChange={set("hair")} />
                <TextInput label="Eyes" value={form.eyes} onChange={set("eyes")} />
                <TextInput label="Complexion" value={form.complexion} onChange={set("complexion")} />
                <TextInput label="Body Type" value={form.bodyType} onChange={set("bodyType")} />
                <TextInput label="Hobby" value={form.hobby} onChange={set("hobby")} />
                <TextInput label="Email ID" value={form.emailId} onChange={set("emailId")} type="email" />
              </div>
            </div>
          </section>

          {/* ── Section 3 – Audition Category ── */}
          <section>
            <SectionBadge num={3} title="Audition Category" />
            <CheckboxGroup
              label=""
              options={["RAMP", "CATALOGUE", "MOVIES", "WEB SERIES", "MUSIC"]}
              selected={form.auditionCategories}
              onChange={(v) => setForm((f) => ({ ...f, auditionCategories: v }))}
            />
          </section>

          {/* ── Section 4 – Language Skills ── */}
          <section>
            <SectionBadge num={4} title="Language Skills" />
            <TextInput
              label="Languages you speak"
              value={form.languageSkills}
              onChange={set("languageSkills")}
              placeholder="e.g. English, Hindi, Malayalam"
            />
          </section>

          {/* ── Sections 5 & 6 – About You + Experience (synchronized two-column) ──
              items-stretch forces equal column heights; flex-col aligns the two
              headers on the same baseline and lets each TextArea fill its cell. */}
          <div className="col-2 items-stretch">
            <section className="flex flex-col">
              <SectionBadge num={5} title="About You" />
              <TextArea
                label="Tell us about yourself."
                value={form.aboutYou}
                onChange={set("aboutYou")}
              />
            </section>
            <section className="flex flex-col">
              <SectionBadge num={6} title="Experience" />
              <TextArea
                label="Please list any previous experience."
                value={form.experience}
                onChange={set("experience")}
              />
            </section>
          </div>

          {/* ── Section 7 – Skills ── */}
          <section>
            <SectionBadge num={7} title="Skills" />
            <Helper>List a few skills related to the audition category.</Helper>
            <div className="col-2">
              <SkillInput value={form.skill1} onChange={set("skill1")} />
              <SkillInput value={form.skill2} onChange={set("skill2")} />
              <SkillInput value={form.skill3} onChange={set("skill3")} />
              <SkillInput value={form.skill4} onChange={set("skill4")} />
            </div>
          </section>

          {/* ── Section 8 – Upload Links ── */}
          <section>
            <SectionBadge num={8} title="Upload Links" />
            <Helper>Provide links to your walk audition video and self-introduction.</Helper>
            <div className="col-2">
              <TextInput label="Link 1" value={form.link1} onChange={set("link1")} type="url" placeholder="https://" />
              <TextInput label="Link 2" value={form.link2} onChange={set("link2")} type="url" placeholder="https://" />
              <TextInput label="Link 3" value={form.link3} onChange={set("link3")} type="url" placeholder="https://" />
              <TextInput label="Link 4" value={form.link4} onChange={set("link4")} type="url" placeholder="https://" />
            </div>
          </section>

          {/* ── Section 9 – Social Media ── */}
          <section>
            <SectionBadge num={9} title="Social Media" />
            <div className="col-2">
              <TextInput label="Instagram" value={form.instagram} onChange={set("instagram")} placeholder="@username" />
              <TextInput label="Snapchat" value={form.snapchat} onChange={set("snapchat")} placeholder="@username" />
              <TextInput label="Threads" value={form.threads} onChange={set("threads")} placeholder="@username" />
              <TextInput label="Other" value={form.otherSocial} onChange={set("otherSocial")} placeholder="Platform — @username" />
            </div>
          </section>

          {/* ── Section 10 – Agreement ── */}
          <section>
            <SectionBadge num={10} title="Agreement" />
            {/* Declaration → checkbox → signature share a uniform --space-md (24px) rhythm */}
            <div className="field-stack">
              <p className="text-xs text-[#666] uppercase tracking-wider leading-relaxed">
                I hereby declare that the information provided above is true and accurate.
                I understand that A7 Entertainment reserves the right to use my information and
                photos/videos for audition purposes only. I agree to the terms and conditions set by A7 Entertainment.
              </p>
              <label className="flex items-center gap-3 cursor-pointer group w-fit" data-cursor-hover>
                <div
                  className="w-4 h-4 border flex items-center justify-center flex-shrink-0 transition-colors"
                  style={{
                    borderColor: form.agreedToTerms ? "#FF0000" : "#555",
                    background: form.agreedToTerms ? "#FF0000" : "transparent",
                  }}
                  onClick={() => setForm((f) => ({ ...f, agreedToTerms: !f.agreedToTerms }))}
                >
                  {form.agreedToTerms && (
                    <svg viewBox="0 0 10 8" width="9" height="7" fill="none">
                      <path d="M1 4l3 3 5-6" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
                <span className="text-sm text-white/60 group-hover:text-white transition-colors">
                  I agree to the terms and conditions above. <span className="text-[#FF0000]">*</span>
                </span>
              </label>
              <div className="col-2">
                <TextInput
                  label="Applicant Signature (type full name)"
                  value={form.signatureName}
                  onChange={set("signatureName")}
                  required
                />
                <TextInput label="Date" value={form.signatureDate} onChange={set("signatureDate")} type="date" />
              </div>
            </div>

            {/* Final submission area — --space-xl (48px) above for a clean break */}
            <div style={{ marginTop: "var(--space-xl)" }}>
              {errorMsg && (
                <p className="text-[#FF0000] text-sm" style={{ marginBottom: "var(--space-md)" }}>{errorMsg}</p>
              )}
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="relative overflow-hidden border border-white hover:bg-white hover:text-black transition-colors text-white text-sm tracking-[0.2em] uppercase px-6 py-3 font-bold disabled:opacity-50 w-full sm:w-auto group"
                  data-cursor-hover
                >
                  <span className="relative">
                    {status === "loading" ? "Submitting…" : "Submit Application"}
                  </span>
                </button>
                <p className="text-xs text-[#666]">
                  Fields marked <span className="text-[#FF0000]">*</span> are required.
                </p>
              </div>
            </div>
          </section>

        </form>
      </div>
    </section>
  );
}
