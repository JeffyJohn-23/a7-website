import { NextResponse } from "next/server";
import { getCurrentEmployee } from "@/lib/employeeAuth";
import { sql, isDbConfigured } from "@/lib/db";

export const runtime = "nodejs";
export const maxDuration = 30;

/**
 * Admin overview: who is currently clocked in, plus per-employee totals for a
 * given month (default: current month, IST).
 *
 * Query: ?month=YYYY-MM
 */
export async function GET(request: Request) {
  if (!isDbConfigured()) {
    return NextResponse.json(
      { success: false, error: "Attendance is not configured." },
      { status: 503 }
    );
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
  // Default to the current month in IST.
  const month = /^\d{4}-\d{2}$/.test(monthParam ?? "")
    ? (monthParam as string)
    : new Date()
        .toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" })
        .slice(0, 7);

  const monthStart = `${month}-01`;

  // Currently open shifts (who's in right now).
  const openNow = (await sql`
    SELECT a.id, a.clock_in_at, e.id AS employee_id, e.name
    FROM attendance a
    JOIN employees e ON e.id = a.employee_id
    WHERE a.clock_out_at IS NULL
    ORDER BY a.clock_in_at
  `) as {
    id: number;
    clock_in_at: string;
    employee_id: number;
    name: string;
  }[];

  // Per-employee totals for the month. Only closed shifts count toward hours —
  // an open shift has no duration yet.
  const totals = (await sql`
    SELECT e.id,
           e.name,
           e.email,
           COALESCE(
             SUM(EXTRACT(EPOCH FROM (a.clock_out_at - a.clock_in_at))) / 3600.0,
             0
           )::numeric(10,2) AS hours,
           COUNT(a.id) FILTER (WHERE a.clock_out_at IS NOT NULL)::int AS shifts
    FROM employees e
    LEFT JOIN attendance a
      ON a.employee_id = e.id
     AND a.clock_out_at IS NOT NULL
     AND a.work_date >= ${monthStart}::date
     AND a.work_date < (${monthStart}::date + INTERVAL '1 month')
    WHERE e.active = TRUE
    GROUP BY e.id, e.name, e.email
    ORDER BY e.name
  `) as {
    id: number;
    name: string;
    email: string;
    hours: string;
    shifts: number;
  }[];

  // Shifts that were never closed (forgotten clock-outs) — these need correcting.
  const unclosed = (await sql`
    SELECT a.id, a.clock_in_at, a.work_date, e.name
    FROM attendance a
    JOIN employees e ON e.id = a.employee_id
    WHERE a.clock_out_at IS NULL
      AND a.work_date < (now() AT TIME ZONE 'Asia/Kolkata')::date
    ORDER BY a.clock_in_at DESC
    LIMIT 50
  `) as { id: number; clock_in_at: string; work_date: string; name: string }[];

  return NextResponse.json({
    success: true,
    month,
    openNow,
    totals,
    unclosed,
  });
}
