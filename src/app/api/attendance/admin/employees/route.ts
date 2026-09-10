import { NextResponse } from "next/server";
import { getCurrentEmployee } from "@/lib/employeeAuth";
import { sql, isDbConfigured } from "@/lib/db";

export const runtime = "nodejs";

async function requireAdmin() {
  const employee = await getCurrentEmployee();
  if (!employee) return { error: NextResponse.json({ success: false, error: "Unauthorized." }, { status: 401 }) };
  if (employee.role !== "admin")
    return { error: NextResponse.json({ success: false, error: "Admins only." }, { status: 403 }) };
  return { employee };
}

/** List all employees (including inactive, so they can be re-enabled). */
export async function GET() {
  if (!isDbConfigured()) {
    return NextResponse.json({ success: false, error: "Attendance is not configured." }, { status: 503 });
  }
  const gate = await requireAdmin();
  if (gate.error) return gate.error;

  const employees = (await sql`
    SELECT id, email, name, role, active, (password_hash IS NULL) AS needs_password
    FROM employees
    ORDER BY active DESC, name
  `) as {
    id: number;
    email: string;
    name: string;
    role: string;
    active: boolean;
    needs_password: boolean;
  }[];

  return NextResponse.json({ success: true, employees });
}

/** Add an employee. They set their own password on first sign-in. */
export async function POST(request: Request) {
  if (!isDbConfigured()) {
    return NextResponse.json({ success: false, error: "Attendance is not configured." }, { status: 503 });
  }
  const gate = await requireAdmin();
  if (gate.error) return gate.error;

  const body = (await request.json().catch(() => ({}))) as {
    email?: string;
    name?: string;
    role?: string;
  };

  const email = body.email?.trim();
  const name = body.name?.trim();
  const role = body.role === "admin" ? "admin" : "employee";

  if (!email || !name) {
    return NextResponse.json(
      { success: false, error: "Name and email are required." },
      { status: 400 }
    );
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json(
      { success: false, error: "Please provide a valid email address." },
      { status: 400 }
    );
  }

  try {
    const rows = (await sql`
      INSERT INTO employees (email, name, role)
      VALUES (${email}, ${name}, ${role})
      RETURNING id, email, name, role, active
    `) as { id: number }[];
    return NextResponse.json({ success: true, employee: rows[0] });
  } catch (err) {
    if ((err as { code?: string }).code === "23505") {
      return NextResponse.json(
        { success: false, error: "An employee with that email already exists." },
        { status: 409 }
      );
    }
    console.error("[admin/employees] create failed:", err);
    return NextResponse.json(
      { success: false, error: "Could not add employee." },
      { status: 500 }
    );
  }
}

/** Activate / deactivate. Deactivating revokes access immediately. */
export async function PATCH(request: Request) {
  if (!isDbConfigured()) {
    return NextResponse.json({ success: false, error: "Attendance is not configured." }, { status: 503 });
  }
  const gate = await requireAdmin();
  if (gate.error) return gate.error;

  const body = (await request.json().catch(() => ({}))) as {
    id?: number;
    active?: boolean;
  };

  if (typeof body.id !== "number" || typeof body.active !== "boolean") {
    return NextResponse.json({ success: false, error: "Invalid request." }, { status: 400 });
  }

  // Don't let an admin lock themselves out.
  if (body.id === gate.employee!.id && body.active === false) {
    return NextResponse.json(
      { success: false, error: "You cannot deactivate your own account." },
      { status: 400 }
    );
  }

  await sql`UPDATE employees SET active = ${body.active} WHERE id = ${body.id}`;
  return NextResponse.json({ success: true });
}
