"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { SelfieCapture } from "@/components/ui/SelfieCapture";

type Shift = { id: number; clock_in_at: string; clock_out_at: string | null };

type Status = {
  employee: { name: string; role: string };
  openShift: { id: number; clock_in_at: string } | null;
  today: Shift[];
};

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-IN", {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/** Elapsed time since clock-in, as "3h 24m". */
function elapsed(sinceIso: string, now: number): string {
  const ms = now - new Date(sinceIso).getTime();
  if (ms < 0) return "0m";
  const mins = Math.floor(ms / 60000);
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

export function AttendanceClock() {
  const router = useRouter();
  const [status, setStatus] = useState<Status | null>(null);
  const [loadError, setLoadError] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [now, setNow] = useState(() => Date.now());
  /** Which punch we're taking a photo for, if the camera is open. */
  const [capturing, setCapturing] = useState<"in" | "out" | null>(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/attendance/clock");
      if (res.status === 401) {
        router.push("/attendance/login");
        return;
      }
      const data = (await res.json()) as {
        success: boolean;
        employee?: Status["employee"];
        openShift?: Status["openShift"];
        today?: Shift[];
        error?: string;
      };
      if (data.success && data.employee) {
        setStatus({
          employee: data.employee,
          openShift: data.openShift ?? null,
          today: data.today ?? [],
        });
      } else {
        setLoadError(data.error ?? "Could not load your status.");
      }
    } catch {
      setLoadError("Could not load your status.");
    }
  }, [router]);

  useEffect(() => {
    void load();
  }, [load]);

  // Tick the "time on shift" counter once a minute.
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 60000);
    return () => clearInterval(t);
  }, []);

  /** Upload the selfie, then punch. A failed upload must not punch. */
  const punchWithPhoto = async (action: "in" | "out", photoBase64: string) => {
    setCapturing(null);
    setError("");
    setBusy(true);
    try {
      const up = await fetch("/api/attendance/photo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ photoBase64, kind: action }),
      });
      const upData = (await up.json()) as { success: boolean; url?: string; error?: string };
      if (!upData.success || !upData.url) {
        setError(upData.error ?? "Could not save the photo.");
        setBusy(false);
        return;
      }
      await punch(action, upData.url);
    } catch {
      setError("Network error while saving the photo.");
      setBusy(false);
    }
  };

  const punch = async (action: "in" | "out", photoUrl?: string) => {
    setError("");
    setBusy(true);
    try {
      const res = await fetch("/api/attendance/clock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, photoUrl }),
      });
      const data = (await res.json()) as { success: boolean; error?: string };
      if (data.success) {
        await load();
      } else {
        setError(data.error ?? "Something went wrong.");
        await load(); // resync — the server is the source of truth
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  const logOut = async () => {
    await fetch("/api/attendance/logout", { method: "POST" }).catch(() => {});
    router.push("/attendance/login");
    router.refresh();
  };

  if (loadError) {
    return (
      <section className="bg-black section-padding" style={{ paddingTop: "3rem", paddingBottom: "6rem" }}>
        <div className="max-w-md mx-auto">
          <p className="text-[#FF0000] text-sm">{loadError}</p>
        </div>
      </section>
    );
  }

  if (!status) {
    return (
      <section className="bg-black section-padding" style={{ paddingTop: "3rem", paddingBottom: "6rem" }}>
        <div className="max-w-md mx-auto">
          <p className="text-[#555] text-xs tracking-widest uppercase">Loading…</p>
        </div>
      </section>
    );
  }

  const isIn = Boolean(status.openShift);

  return (
    <section className="bg-black section-padding" style={{ paddingTop: "3rem", paddingBottom: "6rem" }}>
      <div className="max-w-md mx-auto">
        {/* Who + log out */}
        <div className="flex items-start justify-between gap-4" style={{ marginBottom: "var(--space-lg)" }}>
          <div>
            <p className="text-[10px] text-[#555] tracking-widest uppercase">Signed in as</p>
            <p className="text-white text-lg font-bold">{status.employee.name}</p>
          </div>
          <button
            onClick={logOut}
            className="text-[10px] text-[#555] hover:text-[#FF0000] transition-colors tracking-[0.25em] uppercase"
            data-cursor-hover
          >
            Log Out
          </button>
        </div>

        {/* Current status */}
        <div
          className="border"
          style={{
            padding: "1.25rem",
            marginBottom: "var(--space-lg)",
            borderColor: isIn ? "#FF0000" : "#333",
            background: isIn ? "rgba(255,0,0,0.06)" : "transparent",
          }}
        >
          <p className="text-[10px] tracking-[0.3em] uppercase" style={{ color: isIn ? "#FF0000" : "#555" }}>
            {isIn ? "Clocked In" : "Not Clocked In"}
          </p>
          {isIn && status.openShift && (
            <p className="text-white text-sm" style={{ marginTop: "0.5rem" }}>
              Since {formatTime(status.openShift.clock_in_at)} ·{" "}
              <span className="text-[#999]">{elapsed(status.openShift.clock_in_at, now)} on shift</span>
            </p>
          )}
        </div>

        {error && (
          <p className="text-[#FF0000] text-sm" style={{ marginBottom: "var(--space-md)" }}>
            {error}
          </p>
        )}

        {/* The one big action */}
        <button
          onClick={() => setCapturing(isIn ? "out" : "in")}
          disabled={busy}
          className="w-full text-sm tracking-[0.2em] uppercase font-bold py-5 transition-colors disabled:opacity-50"
          style={{
            background: isIn ? "transparent" : "#FF0000",
            color: "#FFFFFF",
            border: isIn ? "1px solid #FF0000" : "1px solid #FF0000",
          }}
          data-cursor-hover
        >
          {busy ? "Please wait…" : isIn ? "Clock Out" : "Clock In"}
        </button>

        {capturing && (
          <SelfieCapture
            action={capturing}
            onCancel={() => setCapturing(null)}
            onCapture={(dataUrl) => void punchWithPhoto(capturing, dataUrl)}
          />
        )}

        {/* Today's punches */}
        {status.today.length > 0 && (
          <div style={{ marginTop: "var(--space-xl)" }}>
            <p className="text-[10px] text-[#555] tracking-widest uppercase" style={{ marginBottom: "var(--space-sm)" }}>
              Today
            </p>
            <div className="flex flex-col" style={{ gap: "0.5rem" }}>
              {status.today.map((s) => (
                <div
                  key={s.id}
                  className="flex items-center justify-between border-b border-[#222] pb-2 text-sm"
                >
                  <span className="text-white">{formatTime(s.clock_in_at)}</span>
                  <span className="text-[#555] text-xs tracking-widest uppercase">
                    {s.clock_out_at ? formatTime(s.clock_out_at) : "Open"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
