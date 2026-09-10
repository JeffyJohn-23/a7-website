import { NextResponse } from "next/server";
import { getCurrentEmployee } from "@/lib/employeeAuth";
import { sql, isDbConfigured } from "@/lib/db";

export const runtime = "nodejs";

// ─── Attendance corrections ─────────────────────────────────────────────────
// People forget to clock out. An admin can fix a shift's times or delete an
// erroneous one — but every change is auditable: a reason is REQUIRED and the
// acting admin is recorded in `corrected_by`.
//
// The DB still enforces its own rules: `clock_out_after_in` rejects a clock-out
// earlier than the clock-in, and the partial unique index prevents leaving two
// open shifts for one employee.

type Shift = {
  id: number;
  employee_id: number;
  clock_in_at: string;
  clock_out_at: string | null;
  work_date: string;
  note: string | null;
};

async function requireAdmin() {
  const employee = await getCurrentEmployee();
  if (!employee)
    return {
      error: NextResponse.json({ success: false, error: "Unauthorized." }, { status: 401 }),
    };
  if (employee.role !== "admin")
    return {
      error: NextResponse.json({ success: false, error: "Admins only." }, { status: 403 }),
    };
  return { employee };
}

/** Recent shifts for one employee, for the correction UI. */
export async function GET(request: Request) {
  if (!isDbConfigured()) {
    return NextResponse.json({ success: false, error: "Attendance is not configured." }, { status: 503 });
  }
  const gate = await requireAdmin();
  if (gate.error) return gate.error;

  const { searchParams } = new URL(request.url);
  const employeeId = Number(searchParams.get("employeeId"));
  if (!Number.isInteger(employeeId)) {
    return NextResponse.json({ success: false, error: "Invalid employee." }, { status: 400 });
  }

  const shifts = (await sql`
    SELECT a.id, a.employee_id, a.clock_in_at, a.clock_out_at, a.work_date, a.note
    FROM attendance a
    WHERE a.employee_id = ${employeeId}
    ORDER BY a.clock_in_at DESC
    LIMIT 60
  `) as Shift[];

  return NextResponse.json({ success: true, shifts });
}

/** Edit a shift's clock-in / clock-out times. */
export async function PATCH(request: Request) {
  if (!isDbConfigured()) {
    return NextResponse.json({ success: false, error: "Attendance is not configured." }, { status: 503 });
  }
  const gate = await requireAdmin();
  if (gate.error) return gate.error;

  const body = (await request.json().catch(() => ({}))) as {
    id?: number;
    clockInAt?: string;
    clockOutAt?: string | null;
    note?: string;
  };

  if (!Number.isInteger(body.id)) {
    return NextResponse.json({ success: false, error: "Invalid shift." }, { status: 400 });
  }
  const note = body.note?.trim();
  if (!note) {
    return NextResponse.json(
      { success: false, error: "A reason for the correction is required." },
      { status: 400 }
    );
  }
  if (!body.clockInAt) {
    return NextResponse.json(
      { success: false, error: "Clock-in time is required." },
      { status: 400 }
    );
  }

  // Validate the timestamps before touching the row.
  const inAt = new Date(body.clockInAt);
  if (Number.isNaN(inAt.getTime())) {
    return NextResponse.json({ success: false, error: "Invalid clock-in time." }, { status: 400 });
  }
  const outAt = body.clockOutAt ? new Date(body.clockOutAt) : null;
  if (outAt && Number.isNaN(outAt.getTime())) {
    return NextResponse.json({ success: false, error: "Invalid clock-out time." }, { status: 400 });
  }
  if (outAt && outAt < inAt) {
    return NextResponse.json(
      { success: false, error: "Clock-out cannot be before clock-in." },
      { status: 400 }
    );
  }
  if (inAt.getTime() > Date.now() + 60_000) {
    return NextResponse.json(
      { success: false, error: "Clock-in cannot be in the future." },
      { status: 400 }
    );
  }

  try {
    const rows = (await sql`
      UPDATE attendance
      SET clock_in_at = ${inAt.toISOString()}::timestamptz,
          clock_out_at = ${outAt ? outAt.toISOString() : null}::timestamptz,
          note = ${note},
          corrected_by = ${gate.employee!.id}
      WHERE id = ${body.id!}
      RETURNING id, clock_in_at, clock_out_at, note
    `) as Shift[];

    if (rows.length === 0) {
      return NextResponse.json({ success: false, error: "Shift not found." }, { status: 404 });
    }
    return NextResponse.json({ success: true, shift: rows[0] });
  } catch (err) {
    const code = (err as { code?: string }).code;
    // 23505: reopening this shift would leave the employee with two open shifts.
    if (code === "23505") {
      return NextResponse.json(
        {
          success: false,
          error: "That employee already has an open shift. Close it first.",
        },
        { status: 409 }
      );
    }
    // 23514: clock_out_after_in check constraint.
    if (code === "23514") {
      return NextResponse.json(
        { success: false, error: "Clock-out cannot be before clock-in." },
        { status: 400 }
      );
    }
    console.error("[admin/correct] update failed:", err);
    return NextResponse.json(
      { success: false, error: "Could not save the correction." },
      { status: 500 }
    );
  }
}

/** Delete an erroneous shift entirely (e.g. an accidental double punch). */
export async function DELETE(request: Request) {
  if (!isDbConfigured()) {
    return NextResponse.json({ success: false, error: "Attendance is not configured." }, { status: 503 });
  }
  const gate = await requireAdmin();
  if (gate.error) return gate.error;

  const body = (await request.json().catch(() => ({}))) as { id?: number };
  if (!Number.isInteger(body.id)) {
    return NextResponse.json({ success: false, error: "Invalid shift." }, { status: 400 });
  }

  const rows = (await sql`
    DELETE FROM attendance WHERE id = ${body.id!} RETURNING id
  `) as { id: number }[];

  if (rows.length === 0) {
    return NextResponse.json({ success: false, error: "Shift not found." }, { status: 404 });
  }
  return NextResponse.json({ success: true });
}
