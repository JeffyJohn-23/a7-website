"use client";

import { useState, useEffect, useCallback } from "react";

// ─── Admin login ────────────────────────────────────────────────────────────

function LoginPanel({ onSuccess }: { onSuccess: () => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = (await res.json()) as { success: boolean; error?: string };
      if (data.success) onSuccess();
      else setError(data.error ?? "Login failed.");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="max-w-sm">
      <span className="block text-[10px] text-[#555] tracking-widest uppercase" style={{ marginBottom: "var(--space-xs)" }}>
        Admin Password
      </span>
      <div className="flex flex-col justify-end border-b border-[#333] pb-1 focus-within:border-[#FF0000] transition-colors">
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          className="bg-[#000000] text-white text-sm py-1 outline-none placeholder:text-white/20"
          style={{ WebkitBoxShadow: "0 0 0 1000px #000000 inset", WebkitTextFillColor: "white", border: "none" }}
          data-cursor-hover
        />
      </div>
      {error && <p className="text-[#FF0000] text-sm" style={{ marginTop: "var(--space-md)" }}>{error}</p>}
      <button
        type="submit"
        disabled={busy || !password}
        className="group relative overflow-hidden border border-white hover:border-[#FF0000] transition-[border-color] duration-300 text-white text-sm tracking-[0.2em] uppercase py-3 font-bold disabled:opacity-50 w-full"
        style={{ marginTop: "var(--space-lg)", paddingLeft: "0.75rem", paddingRight: "0.75rem" }}
        data-cursor-hover
      >
        <span className="absolute inset-0 bg-[#FF0000] -translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-in-out" aria-hidden="true" />
        <span className="relative z-10">{busy ? "Checking…" : "Log In"}</span>
      </button>
    </form>
  );
}

// ─── Compose + send ─────────────────────────────────────────────────────────

type SendResult = { sent: number; failed: number; total: number };

function ComposePanel() {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [count, setCount] = useState<number | null>(null);
  const [countError, setCountError] = useState("");
  const [confirming, setConfirming] = useState(false);
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<SendResult | null>(null);
  const [error, setError] = useState("");

  // Template
  type TemplateMeta = {
    id: string;
    label: string;
    usesMessage: boolean;
    defaultSubject?: string;
    note?: string;
  };
  const [templates, setTemplates] = useState<TemplateMeta[]>([]);
  const [template, setTemplate] = useState("default");
  const [missingImages, setMissingImages] = useState<string[]>([]);

  const activeTemplate = templates.find((t) => t.id === template);
  const needsMessage = activeTemplate?.usesMessage ?? true;

  // Sender + attachment
  const [senders, setSenders] = useState<{ value: string; label: string }[]>([]);
  const [sender, setSender] = useState("");
  const [maxBytes, setMaxBytes] = useState(3_000_000);
  const [file, setFile] = useState<{ filename: string; content: string; bytes: number } | null>(null);
  const [fileError, setFileError] = useState("");

  const pickFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError("");
    const f = e.target.files?.[0];
    e.target.value = ""; // allow re-selecting the same file
    if (!f) return;

    if (f.size > maxBytes) {
      setFileError(
        `That file is ${(f.size / 1_000_000).toFixed(1)} MB. Limit is ${(maxBytes / 1_000_000).toFixed(0)} MB.`
      );
      return;
    }

    const bytes = new Uint8Array(await f.arrayBuffer());
    // Chunked — String.fromCharCode(...) on a multi-MB array blows the stack.
    let binary = "";
    const CHUNK = 8192;
    for (let i = 0; i < bytes.length; i += CHUNK) {
      binary += String.fromCharCode(...bytes.subarray(i, i + CHUNK));
    }
    setFile({ filename: f.name, content: btoa(binary), bytes: f.size });
    setConfirming(false);
  };

  const loadCount = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/broadcast");
      const data = (await res.json()) as {
        success: boolean;
        count?: number;
        senders?: { value: string; label: string }[];
        templates?: TemplateMeta[];
        missingImages?: string[];
        maxAttachmentBytes?: number;
        error?: string;
      };
      if (data.success && typeof data.count === "number") {
        setCount(data.count);
        if (data.senders?.length) {
          setSenders(data.senders);
          setSender((cur) => cur || data.senders![0].value);
        }
        if (data.templates?.length) setTemplates(data.templates);
        setMissingImages(data.missingImages ?? []);
        if (data.maxAttachmentBytes) setMaxBytes(data.maxAttachmentBytes);
      } else setCountError(data.error ?? "Could not load recipients.");
    } catch {
      setCountError("Could not load recipients.");
    }
  }, []);

  useEffect(() => {
    void loadCount();
  }, [loadCount]);

  const send = async () => {
    setError("");
    setSending(true);
    try {
      const res = await fetch("/api/admin/broadcast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject,
          message,
          confirm: "SEND",
          sender: sender || undefined,
          template,
          attachment: file
            ? { filename: file.filename, content: file.content }
            : undefined,
        }),
      });
      const data = (await res.json()) as {
        success: boolean; sent?: number; failed?: number; total?: number; error?: string;
      };
      if (data.success) {
        setResult({ sent: data.sent ?? 0, failed: data.failed ?? 0, total: data.total ?? 0 });
        setConfirming(false);
      } else {
        setError(data.error ?? "Send failed.");
      }
    } catch {
      setError("Network error during send.");
    } finally {
      setSending(false);
    }
  };

  // ── Sent summary ──
  if (result) {
    return (
      <div className="max-w-2xl">
        <div className="inline-flex items-center justify-center w-14 h-14 mb-6" style={{ background: "#FF0000" }}>
          <svg viewBox="0 0 24 24" width="26" height="26" fill="none">
            <path d="M5 13l4 4L19 7" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h2 className="text-white text-2xl font-bold mb-4">Broadcast Sent</h2>
        <p className="text-[#666] text-base leading-relaxed mb-2">
          Delivered to <span className="text-white">{result.sent}</span> of {result.total} recipients.
        </p>
        {result.failed > 0 && (
          <p className="text-[#FF0000] text-sm mb-6">
            {result.failed} failed to send — check the server logs to identify them.
          </p>
        )}
        <button
          onClick={() => {
            setResult(null);
            setSubject("");
            setMessage("");
            setFile(null); // don't let a stale attachment ride along on the next blast
            setFileError("");
            void loadCount();
          }}
          className="text-[#FF0000] text-sm tracking-widest uppercase underline"
          data-cursor-hover
        >
          Compose another
        </button>
      </div>
    );
  }

  // Designed templates supply their own body, so only the subject is required.
  const ready =
    subject.trim().length > 0 &&
    (!needsMessage || message.trim().length > 0) &&
    (count ?? 0) > 0;

  return (
    <div className="max-w-2xl">
      {/* Recipient count */}
      <div className="border border-[#333]" style={{ padding: "1rem 1.25rem", marginBottom: "var(--space-lg)" }}>
        <div className="flex items-baseline justify-between gap-4 flex-wrap">
          <span className="text-[10px] text-[#555] tracking-widest uppercase">
            Recipients — Broadcast List
          </span>
          <span className="text-white text-xl font-bold">
            {countError ? "—" : count === null ? "…" : count}
          </span>
        </div>
        <p className="text-[11px] text-[#666] leading-relaxed" style={{ marginTop: "0.6rem" }}>
          {countError
            ? countError
            : "Read from the broadcast sheet (Name + Email). Each person receives their own email — recipients never see one another's addresses. The sheet is never modified."}
        </p>
      </div>

      {/* Template */}
      <div
        className="flex flex-col justify-end border-b border-[#333] pb-1 focus-within:border-[#FF0000] transition-colors"
        style={{ marginBottom: "var(--space-md)" }}
      >
        <span className="block text-[10px] text-[#555] tracking-widest uppercase" style={{ marginBottom: "var(--space-xs)" }}>
          Template
        </span>
        <select
          value={template}
          onChange={(e) => {
            const id = e.target.value;
            setTemplate(id);
            setConfirming(false);
            const t = templates.find((x) => x.id === id);
            if (t?.defaultSubject && !subject.trim()) setSubject(t.defaultSubject);
          }}
          className="bg-[#000000] [color-scheme:dark] text-white text-sm py-1 outline-none"
          style={{ border: "none" }}
          data-cursor-hover
        >
          {templates.length === 0 && <option value="default">Loading…</option>}
          {templates.map((t) => (
            <option key={t.id} value={t.id}>{t.label}</option>
          ))}
        </select>
      </div>

      {activeTemplate?.note && (
        <p className="text-[11px] text-[#666] leading-relaxed" style={{ marginTop: "-0.5rem", marginBottom: "var(--space-md)" }}>
          {activeTemplate.note}
        </p>
      )}

      {/* Missing image warning — only matters for designed templates */}
      {!needsMessage && missingImages.length > 0 && (
        <div
          className="border border-[#FF0000]"
          style={{ padding: "0.85rem 1.1rem", marginBottom: "var(--space-md)", background: "rgba(255,0,0,0.08)" }}
        >
          <p className="text-[#FF0000] text-[10px] font-bold tracking-[0.3em] uppercase">
            Images Not Configured
          </p>
          <p className="text-[11px] text-[#999] leading-relaxed" style={{ marginTop: "0.4rem" }}>
            {missingImages.join(", ")} — these images will be omitted from the email.
            Set the matching WTL_IMG_* environment variables to include them.
          </p>
        </div>
      )}

      {/* Sender */}
      <div
        className="flex flex-col justify-end border-b border-[#333] pb-1 focus-within:border-[#FF0000] transition-colors"
        style={{ marginBottom: "var(--space-md)" }}
      >
        <span className="block text-[10px] text-[#555] tracking-widest uppercase" style={{ marginBottom: "var(--space-xs)" }}>
          Send From
        </span>
        <select
          value={sender}
          onChange={(e) => { setSender(e.target.value); setConfirming(false); }}
          className="bg-[#000000] [color-scheme:dark] text-white text-sm py-1 outline-none"
          style={{ border: "none" }}
          data-cursor-hover
        >
          {senders.length === 0 && <option value="">Loading…</option>}
          {senders.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
      </div>

      {/* Attachment */}
      <div style={{ marginBottom: "var(--space-md)" }}>
        <span className="block text-[10px] text-[#555] tracking-widest uppercase" style={{ marginBottom: "var(--space-xs)" }}>
          Attachment (optional)
        </span>
        {file ? (
          <div className="flex items-center justify-between gap-4 border border-[#333]" style={{ padding: "0.6rem 0.9rem" }}>
            <span className="text-white text-sm truncate">
              {file.filename}{" "}
              <span className="text-[#555] text-xs">({(file.bytes / 1_000_000).toFixed(2)} MB)</span>
            </span>
            <button
              onClick={() => { setFile(null); setConfirming(false); }}
              className="text-[10px] text-[#555] hover:text-[#FF0000] transition-colors tracking-[0.2em] uppercase shrink-0"
              data-cursor-hover
            >
              Remove
            </button>
          </div>
        ) : (
          <label
            className="flex items-center justify-center border border-[#333] hover:border-[#FF0000] transition-colors cursor-pointer"
            style={{ padding: "0.75rem" }}
            data-cursor-hover
          >
            <span className="text-[#666] text-xs tracking-widest uppercase">
              Choose a file — max {(maxBytes / 1_000_000).toFixed(0)} MB
            </span>
            <input type="file" onChange={pickFile} className="hidden" />
          </label>
        )}
        {fileError && (
          <p className="text-[#FF0000] text-sm" style={{ marginTop: "var(--space-xs)" }}>{fileError}</p>
        )}
      </div>

      {/* Subject */}
      <div className="flex flex-col justify-end border-b border-[#333] pb-1 focus-within:border-[#FF0000] transition-colors" style={{ marginBottom: "var(--space-md)" }}>
        <span className="block text-[10px] text-[#555] tracking-widest uppercase" style={{ marginBottom: "var(--space-xs)" }}>
          Subject <span className="text-[#FF0000]">*</span>
        </span>
        <input
          type="text"
          value={subject}
          onChange={(e) => { setSubject(e.target.value); setConfirming(false); }}
          placeholder="e.g. Audition schedule — Orion Model Hunt"
          className="bg-[#000000] text-white text-sm py-1 outline-none placeholder:text-white/20"
          style={{ WebkitBoxShadow: "0 0 0 1000px #000000 inset", WebkitTextFillColor: "white", border: "none" }}
          data-cursor-hover
        />
      </div>

      {/* Message — hidden for templates that supply their own body, so nobody
          types a message that would silently be discarded. */}
      <div
        className="flex flex-col border-b border-[#333] pb-1 focus-within:border-[#FF0000] transition-colors"
        style={{ display: needsMessage ? undefined : "none" }}
      >
        <span className="block text-[10px] text-[#555] tracking-widest uppercase" style={{ marginBottom: "var(--space-xs)" }}>
          Message <span className="text-[#FF0000]">*</span>
        </span>
        <textarea
          value={message}
          onChange={(e) => { setMessage(e.target.value); setConfirming(false); }}
          rows={10}
          placeholder={"Write your message here.\n\nBlank lines start a new paragraph. Each applicant is greeted by their first name automatically."}
          className="bg-[#000000] text-white text-sm py-1 outline-none placeholder:text-white/20 resize-y"
          style={{ WebkitBoxShadow: "0 0 0 1000px #000000 inset", WebkitTextFillColor: "white", border: "none" }}
          data-cursor-hover
        />
      </div>

      {error && <p className="text-[#FF0000] text-sm" style={{ marginTop: "var(--space-md)" }}>{error}</p>}

      {/* Send / confirm */}
      <div style={{ marginTop: "var(--space-xl)" }}>
        {confirming ? (
          <div className="border border-[#FF0000]" style={{ padding: "1rem 1.25rem" }}>
            <p className="text-white text-sm leading-relaxed" style={{ marginBottom: "var(--space-md)" }}>
              Send this email to <span className="font-bold">{count}</span> recipients
              from <span className="font-bold">{sender}</span>
              {file && <> with <span className="font-bold">{file.filename}</span> attached</>}?
              This cannot be undone.
              {(count ?? 0) > 20 && (
                <span className="block text-[#999] text-xs" style={{ marginTop: "0.5rem" }}>
                  Sending one email at a time — this takes roughly{" "}
                  {Math.ceil(((count ?? 0) * 150) / 1000)}s. Keep this page open.
                </span>
              )}
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={send}
                disabled={sending}
                className="bg-[#FF0000] hover:bg-[#FF3333] transition-colors text-white text-sm tracking-[0.2em] uppercase py-3 px-6 font-bold disabled:opacity-50"
                data-cursor-hover
              >
                {sending ? "Sending…" : "Yes, send now"}
              </button>
              <button
                onClick={() => setConfirming(false)}
                disabled={sending}
                className="border border-[#333] hover:border-white transition-colors text-white text-sm tracking-[0.2em] uppercase py-3 px-6 disabled:opacity-50"
                data-cursor-hover
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setConfirming(true)}
            disabled={!ready}
            className="group relative overflow-hidden border border-white hover:border-[#FF0000] transition-[border-color] duration-300 text-white text-sm tracking-[0.2em] uppercase py-3 font-bold disabled:opacity-50 w-full sm:w-auto"
            style={{ paddingLeft: "0.75rem", paddingRight: "0.75rem" }}
            data-cursor-hover
          >
            <span className="absolute inset-0 bg-[#FF0000] -translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-in-out" aria-hidden="true" />
            <span className="relative z-10">Review &amp; Send</span>
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Root ───────────────────────────────────────────────────────────────────

export function AdminBroadcast() {
  // Always starts locked — a page load or refresh re-prompts for the password,
  // even if a cookie from a previous login is still present.
  const [authed, setAuthed] = useState(false);

  const logOut = async () => {
    await fetch("/api/admin/login", { method: "DELETE" }).catch(() => {});
    setAuthed(false);
  };

  return (
    <section className="bg-black section-padding" style={{ paddingTop: "3rem", paddingBottom: "6rem" }}>
      <div className="max-w-4xl mx-auto">
        {authed ? (
          <>
            <div className="flex justify-end" style={{ marginBottom: "var(--space-md)" }}>
              <button
                onClick={logOut}
                className="text-[10px] text-[#555] hover:text-[#FF0000] transition-colors tracking-[0.25em] uppercase"
                data-cursor-hover
              >
                Log Out
              </button>
            </div>
            <ComposePanel />
          </>
        ) : (
          <LoginPanel onSuccess={() => setAuthed(true)} />
        )}
      </div>
    </section>
  );
}
