import { NextResponse } from "next/server";
import { getCurrentEmployee } from "@/lib/employeeAuth";
import { sql, isDbConfigured } from "@/lib/db";

export const runtime = "nodejs";
export const maxDuration = 60;

function csvCell(value: string | number | null): string {
  const s = value === null ? "" : String(value);
  // Quote if the value contains a delimiter, quote or newline.
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

/**
 * Monthly attendance CSV for payroll.
 * Query: ?month=YYYY-MM
 */
export async function GET(request: Request) {
  if (!isDbConfigured()) {
    return NextResponse.json({ success: false, error: "Attendance is not configured." }, { status: 503 });
  }

  const employee = await getCurrentEmployee();
  if (!employee) {
    return NextResponse.json({ success: false, error: "Unauthorized." }, { status: 401 });
  }
  if (employee.role !== "admin") {
    return NextResponse.json({ success: false, error: "Admins only." }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const monthParam = searchParams.get("month");
  const month = /^\d{4}-\d{2}$/.test(monthParam ?? "")
    ? (monthParam as string)
    : new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" }).slice(0, 7);
  const monthStart = `${month}-01`;

  const rows = (await sql`
    SELECT e.name,
           e.email,
           a.work_date,
           a.clock_in_at,
           a.clock_out_at,
           CASE
             WHEN a.clock_out_at IS NULL THEN NULL
             ELSE ROUND(
               (EXTRACT(EPOCH FROM (a.clock_out_at - a.clock_in_at)) / 3600.0)::numeric,
               2
             )
           END AS hours,
           a.note
    FROM attendance a
    JOIN employees e ON e.id = a.employee_id
    WHERE a.work_date >= ${monthStart}::date
      AND a.work_date < (${monthStart}::date + INTERVAL '1 month')
    ORDER BY e.name, a.clock_in_at
  `) as {
    name: string;
    email: string;
    work_date: string;
    clock_in_at: string;
    clock_out_at: string | null;
    hours: string | null;
    note: string | null;
  }[];

  const fmt = (iso: string | null) =>
    iso
      ? new Date(iso).toLocaleString("en-IN", {
          timeZone: "Asia/Kolkata",
          dateStyle: "short",
          timeStyle: "short",
        })
      : "";

  const header = ["Name", "Email", "Date", "Clock In", "Clock Out", "Hours", "Note"];
  const lines = [header.join(",")];

  for (const r of rows) {
    lines.push(
      [
        csvCell(r.name),
        csvCell(r.email),
        csvCell(String(r.work_date).slice(0, 10)),
        csvCell(fmt(r.clock_in_at)),
        csvCell(r.clock_out_at ? fmt(r.clock_out_at) : "NOT CLOCKED OUT"),
        csvCell(r.hours ?? ""),
        csvCell(r.note),
      ].join(",")
    );
  }

  // Excel opens UTF-8 CSVs correctly only with a BOM.
  const csv = "﻿" + lines.join("\r\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="attendance-${month}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
