import { NextResponse } from "next/server";
import { getCurrentEmployee } from "@/lib/employeeAuth";
import { sql, isDbConfigured } from "@/lib/db";

export const runtime = "nodejs";
export const maxDuration = 30;

type OpenShift = {
  id: number;
  clock_in_at: string;
  work_date: string;
};

/** Current status: whether this employee has an open shift right now. */
export async function GET() {
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

  const open = (await sql`
    SELECT id, clock_in_at, work_date
    FROM attendance
    WHERE employee_id = ${employee.id} AND clock_out_at IS NULL
  `) as OpenShift[];

  const today = (await sql`
    SELECT id, clock_in_at, clock_out_at
    FROM attendance
    WHERE employee_id = ${employee.id}
      AND work_date = (now() AT TIME ZONE 'Asia/Kolkata')::date
    ORDER BY clock_in_at DESC
  `) as { id: number; clock_in_at: string; clock_out_at: string | null }[];

  return NextResponse.json({
    success: true,
    employee: { name: employee.name, role: employee.role },
    openShift: open[0] ?? null,
    today,
  });
}

/**
 * Clock in or out.
 *
 * The DB's partial unique index (one open shift per employee) is the real
 * guarantee here — a duplicate clock-in raises 23505 rather than creating a
 * second open row, so concurrent taps cannot corrupt the record.
 */
export async function POST(request: Request) {
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

  const body = (await request.json().catch(() => ({}))) as {
    action?: "in" | "out";
    photoUrl?: string;
  };

  if (body.action !== "in" && body.action !== "out") {
    return NextResponse.json(
      { success: false, error: "Invalid action." },
      { status: 400 }
    );
  }

  const photoUrl = body.photoUrl ?? null;

  if (body.action === "in") {
    try {
      const rows = (await sql`
        INSERT INTO attendance (employee_id, clock_in_photo_url)
        VALUES (${employee.id}, ${photoUrl})
        RETURNING id, clock_in_at
      `) as { id: number; clock_in_at: string }[];

      return NextResponse.json({ success: true, action: "in", shift: rows[0] });
    } catch (err) {
      // 23505 = unique_violation → an open shift already exists.
      const code = (err as { code?: string }).code;
      if (code === "23505") {
        return NextResponse.json(
          { success: false, error: "You are already clocked in." },
          { status: 409 }
        );
      }
      console.error("[/api/attendance/clock] clock-in failed:", err);
      return NextResponse.json(
        { success: false, error: "Could not clock in. Please try again." },
        { status: 500 }
      );
    }
  }

  // action === "out" — close the open shift, if any.
  const rows = (await sql`
    UPDATE attendance
    SET clock_out_at = now(),
        clock_out_photo_url = ${photoUrl}
    WHERE employee_id = ${employee.id} AND clock_out_at IS NULL
    RETURNING id, clock_in_at, clock_out_at
  `) as { id: number; clock_in_at: string; clock_out_at: string }[];

  if (rows.length === 0) {
    return NextResponse.json(
      { success: false, error: "You are not clocked in." },
      { status: 409 }
    );
  }

  return NextResponse.json({ success: true, action: "out", shift: rows[0] });
}
