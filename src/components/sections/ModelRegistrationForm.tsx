"use client";

import { useState, useRef } from "react";
import type { AuditionData } from "@/types/audition";

// ─── initial state ────────────────────────────────────────────────────────────

const EMPTY: AuditionData = {
  fullName: "", stageName: "", dob: "", age: "", nationality: "", ethnicity: "",
  gender: [], height: "", weight: "", bloodType: "", phone: "", email: "",
  address: "", photoBase64: "",
  measureWeight: "", heightWithoutHeels: "", heightWithHeels: "",
  hair: "", eyes: "", complexion: "", bustChest: "",
  upperWaist: "", lowerWaist: "", hips: "", bodyType: "",
  auditionCategories: [],
  languageSkills: "", aboutYou: "", experience: "",
  skill1: "", skill2: "", skill3: "", skill4: "",
  auditionLink: "",
  instagram: "", snapchat: "", threads: "", otherSocial: "",
  agreedToTerms: false, signatureName: "",
  signatureDate: new Date().toISOString().split("T")[0],
};

const EMPTY_POINTS: string[] = ["", "", "", "", ""];

// ─── sub-components ───────────────────────────────────────────────────────────

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
        className="bg-[#000000] [color-scheme:dark] text-white text-sm py-1 outline-none placeholder:text-white/20"
        style={{ WebkitBoxShadow: "0 0 0 1000px #000000 inset", WebkitTextFillColor: "white", border: "none" }}
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

// 5 bullet-point inputs — each point is an independent text field (max 200 chars each).
// The parent joins non-empty points into a single \n-delimited string for storage.
function BulletInputGroup({
  points, onUpdate,
}: {
  points: string[]; onUpdate: (i: number, v: string) => void;
}) {
  const MAX_CHAR_PER_POINT = 200;
  const totalChars = points.reduce((sum, p) => sum + p.length, 0);
  const maxTotal = MAX_CHAR_PER_POINT * points.length;

  return (
    <div>
      <div className="field-stack">
        {points.map((point, i) => (
          <div
            key={i}
            className="border-b border-[#333] pb-1 focus-within:border-[#FF0000] transition-colors flex items-center gap-2"
          >
            <span className="text-[#555] text-xs flex-shrink-0">•</span>
            <div className="flex-1 flex flex-col">
              <input
                type="text"
                value={point}
                onChange={(e) => onUpdate(i, e.target.value.slice(0, MAX_CHAR_PER_POINT))}
                maxLength={MAX_CHAR_PER_POINT}
                placeholder=""
                className="bg-[#000] text-white text-sm py-1 outline-none placeholder:text-white/20"
                style={{ border: "none", WebkitBoxShadow: "0 0 0 1000px #000 inset", WebkitTextFillColor: "white" }}
                data-cursor-hover
              />
              <span className="text-[8px] text-[#555] mt-1 text-right">{point.length}/{MAX_CHAR_PER_POINT}</span>
            </div>
          </div>
        ))}
      </div>
      <p className="text-[8px] text-[#555] mt-2 text-right">Total: {totalChars}/{maxTotal} characters</p>
    </div>
  );
}

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
  const [aboutPoints, setAboutPoints] = useState<string[]>([...EMPTY_POINTS]);
  const [expPoints, setExpPoints] = useState<string[]>([...EMPTY_POINTS]);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const set = (field: keyof AuditionData) => (v: string) =>
    setForm((f) => ({ ...f, [field]: v }));

  const updateAboutPoint = (i: number, v: string) => {
    const pts = aboutPoints.map((p, j) => (j === i ? v : p));
    setAboutPoints(pts);
    setForm((f) => ({
      ...f,
      aboutYou: pts.filter((p) => p.trim()).map((p) => "• " + p).join("\n"),
    }));
  };

  const updateExpPoint = (i: number, v: string) => {
    const pts = expPoints.map((p, j) => (j === i ? v : p));
    setExpPoints(pts);
    setForm((f) => ({
      ...f,
      experience: pts.filter((p) => p.trim()).map((p) => "• " + p).join("\n"),
    }));
  };

  const reset = () => {
    setForm(EMPTY);
    setPhotoPreview("");
    setAboutPoints([...EMPTY_POINTS]);
    setExpPoints([...EMPTY_POINTS]);
    setStatus("idle");
    setErrorMsg("");
  };

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

  // ── Validation (all fields required) ─────────────────────────────────────
  const validate = (): string | null => {
    if (!form.fullName.trim()) return "Full name is required.";
    if (!form.stageName.trim()) return "Stage name is required.";
    if (!form.dob) return "Date of birth is required.";
    if (!form.age.trim()) return "Age is required.";
    if (!form.nationality.trim()) return "Nationality is required.";
    if (!form.ethnicity.trim()) return "Ethnicity is required.";
    if (form.gender.length === 0) return "Please select a gender.";
    if (!form.height.trim()) return "Height is required.";
    if (!form.weight.trim()) return "Weight is required.";
    if (!form.bloodType.trim()) return "Blood type is required.";
    if (!form.phone.trim()) return "Phone number is required.";
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      return "A valid email address is required.";
    if (!form.address.trim()) return "Address is required.";
    if (!form.photoBase64) return "Please upload a photo.";
    if (!form.measureWeight.trim()) return "Measurement weight is required.";
    if (!form.heightWithoutHeels.trim()) return "Height without heels is required.";
    if (!form.heightWithHeels.trim()) return "Height with heels is required.";
    if (!form.hair.trim()) return "Hair is required.";
    if (!form.eyes.trim()) return "Eyes is required.";
    if (!form.complexion.trim()) return "Complexion is required.";
    if (!form.bustChest.trim()) return "Bust / Chest is required.";
    if (!form.upperWaist.trim()) return "Upper waist is required.";
    if (!form.lowerWaist.trim()) return "Lower waist is required.";
    if (!form.hips.trim()) return "Hips is required.";
    if (!form.bodyType.trim()) return "Body type is required.";
    if (form.auditionCategories.length === 0) return "Please select at least one audition category.";
    if (!form.languageSkills.trim()) return "Language skills are required.";
    if (!form.aboutYou.trim()) return "Please fill in at least one point in About You.";
    if (!form.experience.trim()) return "Please fill in at least one point in Experience.";
    if (!form.skill1.trim()) return "At least one skill is required.";
    if (!form.auditionLink.trim()) return "Audition link is required.";
    if (!form.instagram.trim()) return "Instagram URL is required.";
    if (!form.snapchat.trim()) return "Snapchat URL is required.";
    if (!form.threads.trim()) return "Threads URL is required.";
    if (!form.otherSocial.trim()) return "Other social media URL is required.";
    if (!form.agreedToTerms) return "You must agree to the terms.";
    if (!form.signatureName.trim()) return "Signature (full name) is required.";
    return null;
  };

  // ── Submit ────────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    const err = validate();
    if (err) { setErrorMsg(err); return; }

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
            onClick={reset}
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
  return (
    <section className="bg-black section-padding" style={{ paddingTop: "3rem", paddingBottom: "6rem" }}>
      <div className="max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} noValidate className="form-sections">

          {/* ── Section 1 – Personal Information ── */}
          <section>
            <SectionBadge num={1} title="Personal Information" />
            <div className="col-fields-photo">
              <div className="field-stack">
                <TextInput label="Full Name" value={form.fullName} onChange={set("fullName")} required />
                <TextInput label="Stage Name" value={form.stageName} onChange={set("stageName")} required />
                <div className="col-2">
                  <TextInput label="Date of Birth" value={form.dob} onChange={set("dob")} type="date" required />
                  <TextInput label="Age" value={form.age} onChange={set("age")} type="number" required />
                  <TextInput label="Nationality" value={form.nationality} onChange={set("nationality")} required />
                  <TextInput label="Ethnicity" value={form.ethnicity} onChange={set("ethnicity")} required />
                </div>
                <CheckboxGroup
                  label="Gender"
                  options={["MALE", "FEMALE", "NON-BINARY", "OTHER"]}
                  selected={form.gender}
                  onChange={(v) => setForm((f) => ({ ...f, gender: v }))}
                />
                <div className="col-2">
                  <TextInput label="Height" value={form.height} onChange={set("height")} placeholder="e.g. 5'7&quot;" required />
                  <TextInput label="Weight" value={form.weight} onChange={set("weight")} placeholder="e.g. 60 kg" required />
                  <TextInput label="Blood Type" value={form.bloodType} onChange={set("bloodType")} required />
                  <TextInput label="Phone Number" value={form.phone} onChange={set("phone")} type="tel" required />
                </div>
                <TextInput label="E-Mail" value={form.email} onChange={set("email")} type="email" required />
                <TextInput label="Address" value={form.address} onChange={set("address")} required />
              </div>

              {/* Photo upload — fixed 200px height */}
              <div className="flex flex-col">
                <Label>Photo (4×5cm) / ID / Selfie <span className="text-[#FF0000]">*</span></Label>
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="w-full h-[200px] border border-[#333] hover:border-[#FF0000] transition-colors overflow-hidden flex flex-col items-center justify-center gap-2 p-4"
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
            <div className="col-2">
              <div className="field-stack">
                <TextInput label="Weight" value={form.measureWeight} onChange={set("measureWeight")} required />
                <TextInput label="Height Without Heels" value={form.heightWithoutHeels} onChange={set("heightWithoutHeels")} required />
                <TextInput label="Height With Heels" value={form.heightWithHeels} onChange={set("heightWithHeels")} required />
                <TextInput label="Bust / Chest" value={form.bustChest} onChange={set("bustChest")} required />
                <TextInput label="Upper Waist" value={form.upperWaist} onChange={set("upperWaist")} required />
                <TextInput label="Lower Waist" value={form.lowerWaist} onChange={set("lowerWaist")} required />
              </div>
              <div className="field-stack">
                <TextInput label="Hips" value={form.hips} onChange={set("hips")} required />
                <TextInput label="Hair" value={form.hair} onChange={set("hair")} required />
                <TextInput label="Eyes" value={form.eyes} onChange={set("eyes")} required />
                <TextInput label="Complexion" value={form.complexion} onChange={set("complexion")} required />
                <TextInput label="Body Type" value={form.bodyType} onChange={set("bodyType")} required />
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
              placeholder="e.g. English, Kannada, Hindi"
              required
            />
          </section>

          {/* ── Sections 5 & 6 – About You + Experience ── */}
          <div className="col-2 items-stretch">
            <section className="flex flex-col">
              <SectionBadge num={5} title="About You" />
              <Helper>Add up to 5 points about yourself.</Helper>
              <BulletInputGroup points={aboutPoints} onUpdate={updateAboutPoint} />
            </section>
            <section className="flex flex-col">
              <SectionBadge num={6} title="Experience" />
              <Helper>Add up to 5 points about your experience.</Helper>
              <BulletInputGroup points={expPoints} onUpdate={updateExpPoint} />
            </section>
          </div>

          {/* ── Section 7 – Skills ── */}
          <section>
            <SectionBadge num={7} title="Skills" />
            <Helper>List skills related to the audition category.</Helper>
            <div className="col-2">
              <SkillInput value={form.skill1} onChange={set("skill1")} />
              <SkillInput value={form.skill2} onChange={set("skill2")} />
              <SkillInput value={form.skill3} onChange={set("skill3")} />
              <SkillInput value={form.skill4} onChange={set("skill4")} />
            </div>
          </section>

          {/* ── Section 8 – Audition Link ── */}
          <section>
            <SectionBadge num={8} title="Audition Link" />
            <Helper>Share a link to your audition video, Instagram reel, or any other media.</Helper>
            <TextInput
              label="Audition Video / Reel URL"
              value={form.auditionLink}
              onChange={set("auditionLink")}
              type="url"
              placeholder="https://"
              required
            />
          </section>

          {/* ── Section 9 – Social Media ── */}
          <section>
            <SectionBadge num={9} title="Social Media" />
            <Helper>Provide your profile links (full URL).</Helper>
            <div className="col-2">
              <TextInput label="Instagram" value={form.instagram} onChange={set("instagram")} type="url" placeholder="https://instagram.com/username" required />
              <TextInput label="Snapchat" value={form.snapchat} onChange={set("snapchat")} type="url" placeholder="https://www.snapchat.com/add/username" required />
              <TextInput label="Threads" value={form.threads} onChange={set("threads")} type="url" placeholder="https://www.threads.net/@username" required />
              <TextInput label="Other Social Media" value={form.otherSocial} onChange={set("otherSocial")} type="url" placeholder="https://" required />
            </div>
          </section>

          {/* ── Section 10 – Agreement ── */}
          <section>
            <SectionBadge num={10} title="Agreement" />
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

            <div style={{ marginTop: "var(--space-xl)" }}>
              {errorMsg && (
                <p className="text-[#FF0000] text-sm" style={{ marginBottom: "var(--space-md)" }}>{errorMsg}</p>
              )}
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="relative overflow-hidden border border-white hover:bg-white hover:text-black transition-colors text-white text-sm tracking-[0.2em] uppercase px-6 py-3 font-bold disabled:opacity-50 w-full sm:w-auto"
                  data-cursor-hover
                >
                  <span className="relative">
                    {status === "loading" ? "Submitting…" : "Submit Application"}
                  </span>
                </button>
                <p className="text-xs text-[#666]">All fields are required.</p>
              </div>
            </div>
          </section>

        </form>
      </div>
    </section>
  );
}
