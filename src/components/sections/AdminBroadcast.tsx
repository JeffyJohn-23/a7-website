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

  const loadCount = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/broadcast");
      const data = (await res.json()) as {
        success: boolean; count?: number; error?: string;
      };
      if (data.success && typeof data.count === "number") {
        setCount(data.count);
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
        body: JSON.stringify({ subject, message, confirm: "SEND" }),
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
          onClick={() => { setResult(null); setSubject(""); setMessage(""); void loadCount(); }}
          className="text-[#FF0000] text-sm tracking-widest uppercase underline"
          data-cursor-hover
        >
          Compose another
        </button>
      </div>
    );
  }

  const ready = subject.trim().length > 0 && message.trim().length > 0 && (count ?? 0) > 0;

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

      {/* Message */}
      <div className="flex flex-col border-b border-[#333] pb-1 focus-within:border-[#FF0000] transition-colors">
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
              Send this email to <span className="font-bold">{count}</span> recipients?
              This cannot be undone.
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

export function AdminBroadcast({ initiallyAuthed }: { initiallyAuthed: boolean }) {
  const [authed, setAuthed] = useState(initiallyAuthed);

  return (
    <section className="bg-black section-padding" style={{ paddingTop: "3rem", paddingBottom: "6rem" }}>
      <div className="max-w-4xl mx-auto">
        {authed ? <ComposePanel /> : <LoginPanel onSuccess={() => setAuthed(true)} />}
      </div>
    </section>
  );
}
