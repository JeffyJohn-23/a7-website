"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

/**
 * Employee login.
 *
 * Two-step when an account has never signed in: the server replies
 * `needsPassword: true` and the form switches to "choose a password".
 */
export function AttendanceLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [needsPassword, setNeedsPassword] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (needsPassword && password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setBusy(true);
    try {
      const res = await fetch("/api/attendance/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          needsPassword
            ? { email, newPassword: password }
            : { email, password }
        ),
      });
      const data = (await res.json()) as {
        success: boolean;
        needsPassword?: boolean;
        error?: string;
      };

      if (data.success && data.needsPassword) {
        // First sign-in for this account — ask them to choose a password.
        setNeedsPassword(true);
        setPassword("");
        setBusy(false);
        return;
      }

      if (data.success) {
        router.push("/attendance");
        router.refresh();
        return;
      }

      setError(data.error ?? "Login failed.");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section
      className="bg-black section-padding"
      style={{ paddingTop: "3rem", paddingBottom: "6rem" }}
    >
      <div className="max-w-sm mx-auto">
        <form onSubmit={submit}>
          {needsPassword && (
            <div
              className="border border-[#333]"
              style={{ padding: "0.85rem 1.1rem", marginBottom: "var(--space-lg)" }}
            >
              <p className="text-[#FF0000] text-[10px] font-bold tracking-[0.3em] uppercase">
                First Sign-In
              </p>
              <p
                className="text-[11px] text-[#999] leading-relaxed"
                style={{ marginTop: "0.4rem" }}
              >
                Choose a password for your account. At least 8 characters,
                including a letter and a number.
              </p>
            </div>
          )}

          {/* Email */}
          <div
            className="flex flex-col justify-end border-b border-[#333] pb-1 focus-within:border-[#FF0000] transition-colors"
            style={{ marginBottom: "var(--space-md)" }}
          >
            <span
              className="block text-[10px] text-[#555] tracking-widest uppercase"
              style={{ marginBottom: "var(--space-xs)" }}
            >
              Work Email
            </span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              readOnly={needsPassword}
              autoComplete="username"
              required
              className="bg-[#000000] text-white text-sm py-1 outline-none placeholder:text-white/20 disabled:opacity-60"
              style={{
                WebkitBoxShadow: "0 0 0 1000px #000000 inset",
                WebkitTextFillColor: "white",
                border: "none",
              }}
              data-cursor-hover
            />
          </div>

          {/* Password */}
          <div className="flex flex-col justify-end border-b border-[#333] pb-1 focus-within:border-[#FF0000] transition-colors">
            <span
              className="block text-[10px] text-[#555] tracking-widest uppercase"
              style={{ marginBottom: "var(--space-xs)" }}
            >
              {needsPassword ? "New Password" : "Password"}
            </span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={needsPassword ? "new-password" : "current-password"}
              required
              className="bg-[#000000] text-white text-sm py-1 outline-none"
              style={{
                WebkitBoxShadow: "0 0 0 1000px #000000 inset",
                WebkitTextFillColor: "white",
                border: "none",
              }}
              data-cursor-hover
            />
          </div>

          {/* Confirm (first sign-in only) */}
          {needsPassword && (
            <div
              className="flex flex-col justify-end border-b border-[#333] pb-1 focus-within:border-[#FF0000] transition-colors"
              style={{ marginTop: "var(--space-md)" }}
            >
              <span
                className="block text-[10px] text-[#555] tracking-widest uppercase"
                style={{ marginBottom: "var(--space-xs)" }}
              >
                Confirm Password
              </span>
              <input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                autoComplete="new-password"
                required
                className="bg-[#000000] text-white text-sm py-1 outline-none"
                style={{
                  WebkitBoxShadow: "0 0 0 1000px #000000 inset",
                  WebkitTextFillColor: "white",
                  border: "none",
                }}
                data-cursor-hover
              />
            </div>
          )}

          {error && (
            <p
              className="text-[#FF0000] text-sm"
              style={{ marginTop: "var(--space-md)" }}
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={busy}
            className="group relative overflow-hidden border border-white hover:border-[#FF0000] transition-[border-color] duration-300 text-white text-sm tracking-[0.2em] uppercase py-3 font-bold disabled:opacity-50 w-full"
            style={{
              marginTop: "var(--space-xl)",
              paddingLeft: "0.75rem",
              paddingRight: "0.75rem",
            }}
            data-cursor-hover
          >
            <span
              className="absolute inset-0 bg-[#FF0000] -translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-in-out"
              aria-hidden="true"
            />
            <span className="relative z-10">
              {busy
                ? "Please wait…"
                : needsPassword
                ? "Set Password & Continue"
                : "Sign In"}
            </span>
          </button>
        </form>
      </div>
    </section>
  );
}
