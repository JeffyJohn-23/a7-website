"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import type { AuditionData } from "@/types/audition";

// ─── initial state ────────────────────────────────────────────────────────────

const EMPTY: AuditionData = {
  fullName: "", dob: "", age: "", nationality: "", ethnicity: "",
  gender: [], bloodType: "", phone: "", email: "",
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
  // rawPhoto = compressed source used for drag manipulation; never cropped
  const [rawPhoto, setRawPhoto] = useState<string>("");
  const [aboutPoints, setAboutPoints] = useState<string[]>([...EMPTY_POINTS]);
  const [expPoints, setExpPoints] = useState<string[]>([...EMPTY_POINTS]);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  // ── Photo drag / zoom state ────────────────────────────────────────────────
  const [photoOffset, setPhotoOffset] = useState({ x: 0, y: 0 });
  const [photoScale, setPhotoScale] = useState({ w: 0, h: 0 });
  const [zoomLevel, setZoomLevel] = useState(1.0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOrigin, setDragOrigin] = useState({ mx: 0, my: 0, ox: 0, oy: 0 });
  const [hasDragged, setHasDragged] = useState(false);
  const [cropConfirmed, setCropConfirmed] = useState(false);
  const photoFrameRef = useRef<HTMLDivElement>(null);
  // Refs readable inside non-passive DOM event listeners (no stale closures)
  const isDraggingRef = useRef(false);
  const dragOriginRef = useRef(dragOrigin);
  const photoOffsetRef = useRef(photoOffset);
  const photoScaleRef = useRef(photoScale);
  const naturalSizeRef = useRef({ w: 0, h: 0 });
  const baseCoverScaleRef = useRef(1.0);
  const zoomLevelRef = useRef(1.0);
  const pinchStartRef = useRef({ dist: 0, zoom: 1.0 });

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
    setRawPhoto("");
    setPhotoOffset({ x: 0, y: 0 });
    setPhotoScale({ w: 0, h: 0 });
    setZoomLevel(1.0);
    setHasDragged(false);
    setCropConfirmed(false);
    setAboutPoints([...EMPTY_POINTS]);
    setExpPoints([...EMPTY_POINTS]);
    setStatus("idle");
    setErrorMsg("");
  };

  // ── Photo upload + drag-to-reposition ─────────────────────────────────────

  // Keep refs in sync for use inside non-passive DOM event listeners
  isDraggingRef.current = isDragging;
  dragOriginRef.current = dragOrigin;
  photoOffsetRef.current = photoOffset;
  photoScaleRef.current = photoScale;
  zoomLevelRef.current = zoomLevel;

  // Non-passive wheel (zoom) + touchmove (pan/pinch) listeners
  useEffect(() => {
    const el = photoFrameRef.current;
    if (!el || !rawPhoto) return;

    const clamp = (x: number, y: number, sc: { w: number; h: number }) => {
      const fw = el.offsetWidth, fh = el.offsetHeight;
      return {
        x: sc.w < fw ? Math.round((fw - sc.w) / 2) : Math.max(fw - sc.w, Math.min(0, x)),
        y: sc.h < fh ? Math.round((fh - sc.h) / 2) : Math.max(fh - sc.h, Math.min(0, y)),
      };
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.08 : 0.08;
      const { w: nw, h: nh } = naturalSizeRef.current;
      const cs = baseCoverScaleRef.current;
      const fw = el.offsetWidth, fh = el.offsetHeight;
      const containRatio = Math.min(fw / nw, fh / nh) / cs;
      const oldZoom = zoomLevelRef.current;
      const newZoom = Math.max(containRatio, Math.min(3.0, oldZoom + delta));
      const oldW = Math.round(nw * cs * oldZoom), oldH = Math.round(nh * cs * oldZoom);
      const newW = Math.round(nw * cs * newZoom), newH = Math.round(nh * cs * newZoom);
      const ox = photoOffsetRef.current.x, oy = photoOffsetRef.current.y;
      const fx = (fw / 2 - ox) / (oldW || 1), fy = (fh / 2 - oy) / (oldH || 1);
      const clamped = clamp(fw / 2 - fx * newW, fh / 2 - fy * newH, { w: newW, h: newH });
      setZoomLevel(newZoom);
      setPhotoScale({ w: newW, h: newH });
      setPhotoOffset(clamped);
      setCropConfirmed(false);
    };

    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      if (e.touches.length === 2) {
        // Pinch zoom
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const { dist: startDist, zoom: startZoom } = pinchStartRef.current;
        if (startDist <= 0) return;
        const { w: nw, h: nh } = naturalSizeRef.current;
        const cs = baseCoverScaleRef.current;
        const fw = el.offsetWidth, fh = el.offsetHeight;
        const containRatio = Math.min(fw / nw, fh / nh) / cs;
        const oldZoom = zoomLevelRef.current;
        const newZoom = Math.max(containRatio, Math.min(3.0, startZoom * (dist / startDist)));
        const oldW = Math.round(nw * cs * oldZoom), oldH = Math.round(nh * cs * oldZoom);
        const newW = Math.round(nw * cs * newZoom), newH = Math.round(nh * cs * newZoom);
        const ox = photoOffsetRef.current.x, oy = photoOffsetRef.current.y;
        const fx = (fw / 2 - ox) / (oldW || 1), fy = (fh / 2 - oy) / (oldH || 1);
        const clamped = clamp(fw / 2 - fx * newW, fh / 2 - fy * newH, { w: newW, h: newH });
        setZoomLevel(newZoom);
        setPhotoScale({ w: newW, h: newH });
        setPhotoOffset(clamped);
        setCropConfirmed(false);
      } else if (e.touches.length === 1 && isDraggingRef.current) {
        // Single-finger pan
        const t = e.touches[0];
        const o = dragOriginRef.current;
        const sc = photoScaleRef.current;
        setPhotoOffset(clamp(o.ox + t.clientX - o.mx, o.oy + t.clientY - o.my, sc));
        setHasDragged(true);
        setCropConfirmed(false);
      }
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    el.addEventListener("touchmove", onTouchMove, { passive: false });
    return () => {
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("touchmove", onTouchMove);
    };
  }, [rawPhoto]); // re-bind when a new photo is loaded

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = ""; // allow re-selecting same file
    const reader = new FileReader();
    reader.onload = (ev) => {
      const src = ev.target?.result as string;
      const img = new window.Image();
      img.src = src;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX = 1200; // larger source for better crop quality
        let w = img.naturalWidth, h = img.naturalHeight;
        if (w > MAX || h > MAX) {
          if (w > h) { h = Math.round((h * MAX) / w); w = MAX; }
          else { w = Math.round((w * MAX) / h); h = MAX; }
        }
        canvas.width = w; canvas.height = h;
        canvas.getContext("2d")!.drawImage(img, 0, 0, w, h);
        const compressed = canvas.toDataURL("image/jpeg", 0.85);
        setRawPhoto(compressed);
        setPhotoOffset({ x: 0, y: 0 });
        setPhotoScale({ w: 0, h: 0 }); // will be set by onLoad on the <img>
        setHasDragged(false);
        setForm((f) => ({ ...f, photoBase64: compressed })); // fallback until crop
      };
    };
    reader.readAsDataURL(file);
  };

  // Called when the preview <img> loads — compute cover-fit scale & center offset
  const handleImgLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    const frame = photoFrameRef.current;
    if (!frame) return;
    const fw = frame.offsetWidth, fh = frame.offsetHeight;
    const nw = img.naturalWidth, nh = img.naturalHeight;
    naturalSizeRef.current = { w: nw, h: nh };
    const coverScale = Math.max(fw / nw, fh / nh);
    baseCoverScaleRef.current = coverScale;
    const sw = Math.round(nw * coverScale), sh = Math.round(nh * coverScale);
    setPhotoScale({ w: sw, h: sh });
    setPhotoOffset({ x: Math.round((fw - sw) / 2), y: Math.round((fh - sh) / 2) });
    setZoomLevel(1.0);
  }, []);

  const getClampedOffset = useCallback((x: number, y: number) => {
    const frame = photoFrameRef.current;
    const sc = photoScaleRef.current;
    if (!frame || !sc.w) return { x, y };
    const fw = frame.offsetWidth, fh = frame.offsetHeight;
    return {
      // Center when image is smaller than frame; clamp to cover otherwise
      x: sc.w < fw ? Math.round((fw - sc.w) / 2) : Math.max(fw - sc.w, Math.min(0, x)),
      y: sc.h < fh ? Math.round((fh - sc.h) / 2) : Math.max(fh - sc.h, Math.min(0, y)),
    };
  }, []);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    setDragOrigin({ mx: e.clientX, my: e.clientY, ox: photoOffset.x, oy: photoOffset.y });
    e.preventDefault();
  };
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    setPhotoOffset(getClampedOffset(
      dragOrigin.ox + e.clientX - dragOrigin.mx,
      dragOrigin.oy + e.clientY - dragOrigin.my,
    ));
    setHasDragged(true);
    setCropConfirmed(false);
  };
  const handleMouseUp = () => setIsDragging(false);
  const handleMouseLeave = () => setIsDragging(false);

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      pinchStartRef.current = { dist: Math.sqrt(dx * dx + dy * dy), zoom: zoomLevelRef.current };
      setIsDragging(false);
    } else {
      const t = e.touches[0];
      setIsDragging(true);
      setDragOrigin({ mx: t.clientX, my: t.clientY, ox: photoOffset.x, oy: photoOffset.y });
    }
  };
  const handleTouchEnd = () => {
    setIsDragging(false);
    pinchStartRef.current = { dist: 0, zoom: zoomLevelRef.current };
  };

  // Capture what's visible in the frame → update photoBase64 for PDF
  const confirmCrop = useCallback(() => {
    const frame = photoFrameRef.current;
    if (!rawPhoto || !frame || !photoScale.w) return;
    const fw = frame.offsetWidth;
    const fh = frame.offsetHeight;
    const canvas = document.createElement("canvas");
    canvas.width = fw;
    canvas.height = fh;
    const ctx = canvas.getContext("2d")!;
    const img = new window.Image();
    img.onload = () => {
      ctx.drawImage(img, photoOffset.x, photoOffset.y, photoScale.w, photoScale.h);
      const cropped = canvas.toDataURL("image/jpeg", 0.85);
      setForm((f) => ({ ...f, photoBase64: cropped }));
      setCropConfirmed(true);
    };
    img.src = rawPhoto;
  }, [rawPhoto, photoOffset, photoScale]);

  // ── Validation (all fields required) ─────────────────────────────────────
  const validate = (): string | null => {
    if (!form.fullName.trim()) return "Full name is required.";
    if (!form.phone.trim()) return "Phone number is required.";
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      return "A valid email address is required.";
    if (!form.dob) return "Date of birth is required.";
    if (!form.age.trim()) return "Age is required.";
    if (!form.nationality.trim()) return "Nationality is required.";
    if (!form.ethnicity.trim()) return "Ethnicity is required.";
    if (form.gender.length === 0) return "Please select a gender.";
    if (!form.bloodType.trim()) return "Blood type is required.";
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
                <TextInput label="Mobile Number" value={form.phone} onChange={set("phone")} type="tel" required />
                <TextInput label="E-Mail" value={form.email} onChange={set("email")} type="email" required />
                <TextInput label="Date of Birth" value={form.dob} onChange={set("dob")} type="date" required />
                <TextInput label="Age" value={form.age} onChange={set("age")} type="number" required />
                <TextInput label="Nationality" value={form.nationality} onChange={set("nationality")} required />
                <TextInput label="Ethnicity" value={form.ethnicity} onChange={set("ethnicity")} required />
                <CheckboxGroup
                  label="Gender"
                  options={["MALE", "FEMALE", "NON-BINARY", "OTHER"]}
                  selected={form.gender}
                  onChange={(v) => setForm((f) => ({ ...f, gender: v }))}
                />
                <TextInput label="Blood Type" value={form.bloodType} onChange={set("bloodType")} required />
                <TextInput label="Address" value={form.address} onChange={set("address")} required />
              </div>

              {/* Photo upload — drag-to-reposition */}
              <div className="flex flex-col">
                <Label>Photo (4×5cm) / ID / Selfie <span className="text-[#FF0000]">*</span></Label>

                {rawPhoto ? (
                  <>
                    {/* Draggable frame */}
                    <div
                      ref={photoFrameRef}
                      className="w-full h-[200px] border border-[#333] overflow-hidden relative select-none"
                      style={{ cursor: isDragging ? "grabbing" : "grab" }}
                      onMouseDown={handleMouseDown}
                      onMouseMove={handleMouseMove}
                      onMouseUp={handleMouseUp}
                      onMouseLeave={handleMouseLeave}
                      onTouchStart={handleTouchStart}
                      onTouchEnd={handleTouchEnd}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={rawPhoto}
                        alt="Preview"
                        className="absolute pointer-events-none"
                        style={{
                          width: photoScale.w || "100%",
                          height: photoScale.h || "auto",
                          left: photoOffset.x,
                          top: photoOffset.y,
                        }}
                        onLoad={handleImgLoad}
                        draggable={false}
                      />
                      {/* Hint overlay — disappears after first drag */}
                      {!hasDragged && (
                        <div className="absolute inset-0 flex items-end justify-center pb-3 pointer-events-none">
                          <span
                            className="text-[9px] tracking-[0.25em] uppercase px-3 py-1"
                            style={{ background: "rgba(0,0,0,0.65)", color: "rgba(255,255,255,0.55)" }}
                          >
                            Drag to reposition · Scroll to zoom
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Controls */}
                    <div className="flex items-center justify-between mt-2">
                      {cropConfirmed ? (
                        <span className="text-[9px] tracking-[0.25em] uppercase" style={{ color: "rgba(255,255,255,0.35)" }}>
                          ✓ Saved — drag or zoom to re-adjust
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={confirmCrop}
                          className="text-[9px] tracking-[0.25em] uppercase transition-opacity hover:opacity-70"
                          style={{ color: "#FF0000" }}
                          data-cursor-hover
                        >
                          ✓ Confirm Position
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          setRawPhoto("");
                          setPhotoOffset({ x: 0, y: 0 });
                          setPhotoScale({ w: 0, h: 0 });
                          setZoomLevel(1.0);
                          setHasDragged(false);
                          setCropConfirmed(false);
                          setForm((f) => ({ ...f, photoBase64: "" }));
                        }}
                        className="text-[9px] text-white/25 hover:text-[#FF0000] transition-colors tracking-[0.25em] uppercase"
                        data-cursor-hover
                      >
                        Remove
                      </button>
                    </div>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="w-full h-[200px] border border-[#333] hover:border-[#FF0000] transition-colors flex flex-col items-center justify-center gap-2 p-4"
                    data-cursor-hover
                  >
                    <svg viewBox="0 0 24 24" width="28" height="28" fill="none" className="opacity-30">
                      <circle cx="12" cy="8" r="3" stroke="currentColor" strokeWidth="1.5" />
                      <path d="M4 19c0-3.314 3.582-6 8-6s8 2.686 8 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                    <span className="text-white/30 text-[10px] text-center tracking-widest uppercase">Click to Upload</span>
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
              <TextInput label="Snapchat" value={form.snapchat} onChange={set("snapchat")} type="url" placeholder="https://www.snapchat.com/add/username" />
              <TextInput label="Threads" value={form.threads} onChange={set("threads")} type="url" placeholder="https://www.threads.net/@username" />
              <TextInput label="Other Social Media" value={form.otherSocial} onChange={set("otherSocial")} type="url" placeholder="https://" />
            </div>
          </section>

          {/* ── Section 10 – Agreement ── */}
          <section>
            <SectionBadge num={10} title="Agreement" />
            <div className="field-stack">
              <p className="text-xs text-[#666] uppercase tracking-wider leading-relaxed">
                I hereby declare that the information provided above is true and accurate.
                I understand that A7 Entertainment reserves the right to use my information and
                photos/videos for audition purposes only. I agree to the terms and conditions set by A7 Entertainment and Parker Models.
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
                <div className="flex flex-col justify-end border-b border-[#333] pb-1">
                  <Label>Date</Label>
                  <div className="text-white text-sm py-1">
                    {new Date(form.signatureDate).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                  </div>
                </div>
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
                  className="group relative overflow-hidden border border-white hover:border-[#FF0000] transition-[border-color] duration-300 text-white text-sm tracking-[0.2em] uppercase px-6 py-3 font-bold disabled:opacity-50 w-full sm:w-auto"
                  data-cursor-hover
                >
                  {/* Red fill sweeps top → bottom on hover */}
                  <span
                    className="absolute inset-0 bg-[#FF0000] -translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-in-out"
                    aria-hidden="true"
                  />
                  <span className="relative z-10">
                    {status === "loading" ? "Submitting…" : "Submit Application"}
                  </span>
                </button>
                <p className="text-xs text-[#666]">Fields marked <span className="text-[#FF0000]">*</span> are required.</p>
              </div>
            </div>
          </section>

        </form>
      </div>
    </section>
  );
}
