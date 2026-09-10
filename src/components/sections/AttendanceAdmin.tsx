"use client";

import { useState, useEffect, useCallback } from "react";

type OpenNow = { id: number; clock_in_at: string; employee_id: number; name: string };
type Total = { id: number; name: string; email: string; hours: string; shifts: number };
type Unclosed = { id: number; clock_in_at: string; work_date: string; name: string };
type EmployeeRow = {
  id: number;
  email: string;
  name: string;
  role: string;
  active: boolean;
  needs_password: boolean;
};

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-IN", {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function currentMonth(): string {
  return new Date()
    .toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" })
    .slice(0, 7);
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="text-[10px] text-[#555] tracking-widest uppercase"
      style={{ marginBottom: "var(--space-sm)" }}
    >
      {children}
    </p>
  );
}

export function AttendanceAdmin() {
  const [month, setMonth] = useState(currentMonth);
  const [openNow, setOpenNow] = useState<OpenNow[]>([]);
  const [totals, setTotals] = useState<Total[]>([]);
  const [unclosed, setUnclosed] = useState<Unclosed[]>([]);
  const [employees, setEmployees] = useState<EmployeeRow[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // Add-employee form
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newRole, setNewRole] = useState<"employee" | "admin">("employee");
  const [addBusy, setAddBusy] = useState(false);
  const [addError, setAddError] = useState("");

  const load = useCallback(async () => {
    setError("");
    try {
      const [oRes, eRes] = await Promise.all([
        fetch(`/api/attendance/admin/overview?month=${month}`),
        fetch("/api/attendance/admin/employees"),
      ]);
      const o = (await oRes.json()) as {
        success: boolean;
        openNow?: OpenNow[];
        totals?: Total[];
        unclosed?: Unclosed[];
        error?: string;
      };
      const e = (await eRes.json()) as {
        success: boolean;
        employees?: EmployeeRow[];
        error?: string;
      };

      if (o.success) {
        setOpenNow(o.openNow ?? []);
        setTotals(o.totals ?? []);
        setUnclosed(o.unclosed ?? []);
      } else {
        setError(o.error ?? "Could not load overview.");
      }
      if (e.success) setEmployees(e.employees ?? []);
    } catch {
      setError("Could not load the dashboard.");
    } finally {
      setLoading(false);
    }
  }, [month]);

  useEffect(() => {
    void load();
  }, [load]);

  const addEmployee = async (ev: React.FormEvent) => {
    ev.preventDefault();
    setAddError("");
    setAddBusy(true);
    try {
      const res = await fetch("/api/attendance/admin/employees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName, email: newEmail, role: newRole }),
      });
      const data = (await res.json()) as { success: boolean; error?: string };
      if (data.success) {
        setNewName("");
        setNewEmail("");
        setNewRole("employee");
        await load();
      } else {
        setAddError(data.error ?? "Could not add employee.");
      }
    } catch {
      setAddError("Network error.");
    } finally {
      setAddBusy(false);
    }
  };

  const setActive = async (id: number, active: boolean) => {
    const res = await fetch("/api/attendance/admin/employees", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, active }),
    });
    const data = (await res.json()) as { success: boolean; error?: string };
    if (!data.success) setError(data.error ?? "Could not update employee.");
    await load();
  };

  const logOut = async () => {
    await fetch("/api/attendance/logout", { method: "POST" }).catch(() => {});
    window.location.href = "/attendance/login";
  };

  if (loading) {
    return (
      <section className="bg-black section-padding" style={{ paddingTop: "3rem", paddingBottom: "6rem" }}>
        <div className="max-w-4xl mx-auto">
          <p className="text-[#555] text-xs tracking-widest uppercase">Loading…</p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-black section-padding" style={{ paddingTop: "3rem", paddingBottom: "6rem" }}>
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-end" style={{ marginBottom: "var(--space-md)" }}>
          <button
            onClick={logOut}
            className="text-[10px] text-[#555] hover:text-[#FF0000] transition-colors tracking-[0.25em] uppercase"
            data-cursor-hover
          >
            Log Out
          </button>
        </div>

        {error && (
          <p className="text-[#FF0000] text-sm" style={{ marginBottom: "var(--space-md)" }}>
            {error}
          </p>
        )}

        {/* ── Currently clocked in ── */}
        <div style={{ marginBottom: "var(--space-2xl)" }}>
          <Label>Clocked In Right Now — {openNow.length}</Label>
          {openNow.length === 0 ? (
            <p className="text-[#666] text-sm">Nobody is currently clocked in.</p>
          ) : (
            <div className="flex flex-col" style={{ gap: "0.5rem" }}>
              {openNow.map((o) => (
                <div
                  key={o.id}
                  className="flex items-center justify-between border-b border-[#222] pb-2"
                >
                  <span className="text-white text-sm">{o.name}</span>
                  <span className="text-[#FF0000] text-xs tracking-widest uppercase">
                    since {formatTime(o.clock_in_at)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Forgotten clock-outs ── */}
        {unclosed.length > 0 && (
          <div
            className="border border-[#FF0000]"
            style={{
              padding: "1rem 1.25rem",
              marginBottom: "var(--space-2xl)",
              background: "rgba(255,0,0,0.06)",
            }}
          >
            <p className="text-[#FF0000] text-[10px] font-bold tracking-[0.3em] uppercase">
              Needs Attention — {unclosed.length} unclosed shift
              {unclosed.length === 1 ? "" : "s"}
            </p>
            <p className="text-[11px] text-[#999] leading-relaxed" style={{ marginTop: "0.4rem" }}>
              These shifts were started on an earlier day and never clocked out, so
              they count as zero hours. They need manual correction.
            </p>
            <div className="flex flex-col" style={{ gap: "0.4rem", marginTop: "0.8rem" }}>
              {unclosed.map((u) => (
                <div key={u.id} className="flex items-center justify-between text-xs">
                  <span className="text-white">{u.name}</span>
                  <span className="text-[#999]">
                    {String(u.work_date).slice(0, 10)} · in at {formatTime(u.clock_in_at)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Monthly hours ── */}
        <div style={{ marginBottom: "var(--space-2xl)" }}>
          <div
            className="flex items-end justify-between gap-4 flex-wrap"
            style={{ marginBottom: "var(--space-sm)" }}
          >
            <Label>Hours — {month}</Label>
            <div className="flex items-center gap-3">
              <input
                type="month"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="bg-[#000] [color-scheme:dark] text-white text-xs border border-[#333] px-2 py-1 outline-none focus:border-[#FF0000]"
                data-cursor-hover
              />
              <a
                href={`/api/attendance/admin/export?month=${month}`}
                className="text-[10px] text-[#FF0000] hover:opacity-70 transition-opacity tracking-[0.25em] uppercase"
                data-cursor-hover
              >
                Export CSV
              </a>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm" style={{ borderCollapse: "collapse" }}>
              <thead>
                <tr className="border-b border-[#333]">
                  <th className="text-left text-[10px] text-[#555] tracking-widest uppercase pb-2">
                    Employee
                  </th>
                  <th className="text-right text-[10px] text-[#555] tracking-widest uppercase pb-2">
                    Shifts
                  </th>
                  <th className="text-right text-[10px] text-[#555] tracking-widest uppercase pb-2">
                    Hours
                  </th>
                </tr>
              </thead>
              <tbody>
                {totals.map((t) => (
                  <tr key={t.id} className="border-b border-[#1a1a1a]">
                    <td className="text-white py-2">{t.name}</td>
                    <td className="text-[#999] py-2 text-right tabular-nums">{t.shifts}</td>
                    <td className="text-white py-2 text-right tabular-nums">{t.hours}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Employees ── */}
        <div>
          <Label>Employees</Label>

          <form
            onSubmit={addEmployee}
            className="border border-[#333]"
            style={{ padding: "1rem 1.25rem", marginBottom: "var(--space-lg)" }}
          >
            <div className="col-2" style={{ marginBottom: "var(--space-md)" }}>
              <div className="flex flex-col justify-end border-b border-[#333] pb-1 focus-within:border-[#FF0000] transition-colors">
                <span className="block text-[10px] text-[#555] tracking-widest uppercase" style={{ marginBottom: "var(--space-xs)" }}>
                  Full Name
                </span>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  required
                  className="bg-[#000] text-white text-sm py-1 outline-none"
                  style={{ WebkitBoxShadow: "0 0 0 1000px #000 inset", WebkitTextFillColor: "white", border: "none" }}
                  data-cursor-hover
                />
              </div>
              <div className="flex flex-col justify-end border-b border-[#333] pb-1 focus-within:border-[#FF0000] transition-colors">
                <span className="block text-[10px] text-[#555] tracking-widest uppercase" style={{ marginBottom: "var(--space-xs)" }}>
                  Work Email
                </span>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  required
                  className="bg-[#000] text-white text-sm py-1 outline-none"
                  style={{ WebkitBoxShadow: "0 0 0 1000px #000 inset", WebkitTextFillColor: "white", border: "none" }}
                  data-cursor-hover
                />
              </div>
            </div>

            <div className="flex items-center justify-between gap-4 flex-wrap">
              <label className="flex items-center gap-2 text-xs text-[#999]" data-cursor-hover>
                <input
                  type="checkbox"
                  checked={newRole === "admin"}
                  onChange={(e) => setNewRole(e.target.checked ? "admin" : "employee")}
                />
                Grant admin access
              </label>
              <button
                type="submit"
                disabled={addBusy}
                className="border border-white hover:border-[#FF0000] transition-colors text-white text-xs tracking-[0.2em] uppercase py-2 px-4 font-bold disabled:opacity-50"
                data-cursor-hover
              >
                {addBusy ? "Adding…" : "Add Employee"}
              </button>
            </div>

            {addError && (
              <p className="text-[#FF0000] text-sm" style={{ marginTop: "var(--space-md)" }}>
                {addError}
              </p>
            )}
          </form>

          <div className="flex flex-col" style={{ gap: "0.5rem" }}>
            {employees.map((e) => (
              <div
                key={e.id}
                className="flex items-center justify-between gap-4 border-b border-[#1a1a1a] pb-2"
              >
                <div className="min-w-0">
                  <p className={`text-sm truncate ${e.active ? "text-white" : "text-[#555] line-through"}`}>
                    {e.name}
                    {e.role === "admin" && (
                      <span className="text-[#FF0000] text-[9px] tracking-[0.2em] uppercase ml-2">
                        Admin
                      </span>
                    )}
                    {e.needs_password && (
                      <span className="text-[#666] text-[9px] tracking-[0.2em] uppercase ml-2">
                        Not signed in yet
                      </span>
                    )}
                  </p>
                  <p className="text-[#555] text-xs truncate">{e.email}</p>
                </div>
                <button
                  onClick={() => setActive(e.id, !e.active)}
                  className="text-[10px] text-[#555] hover:text-[#FF0000] transition-colors tracking-[0.2em] uppercase shrink-0"
                  data-cursor-hover
                >
                  {e.active ? "Deactivate" : "Reactivate"}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
