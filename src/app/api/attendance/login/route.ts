import { NextResponse } from "next/server";
import {
  findEmployeeForLogin,
  verifyPassword,
  createEmployeeSession,
  setEmployeePassword,
  passwordProblem,
} from "@/lib/employeeAuth";
import { isDbConfigured } from "@/lib/db";

export const runtime = "nodejs";

/**
 * Employee login.
 *
 * Two modes, distinguished by whether the account has a password yet:
 *  - Normal login: { email, password }
 *  - First-time setup: { email, newPassword } for an account whose password_hash
 *    is NULL (created by an admin, never signed in). This is why a "needs
 *    password" response is safe to reveal — such an account has no password to
 *    guess, and only appears for emails an admin already added.
 */
export async function POST(request: Request) {
  if (!isDbConfigured() || !process.env.AUTH_SECRET) {
    return NextResponse.json(
      { success: false, error: "Attendance is not configured." },
      { status: 503 }
    );
  }

  const body = (await request.json().catch(() => ({}))) as {
    email?: string;
    password?: string;
    newPassword?: string;
  };

  const email = body.email?.trim();
  if (!email) {
    return NextResponse.json(
      { success: false, error: "Email is required." },
      { status: 400 }
    );
  }

  const employee = await findEmployeeForLogin(email);

  // Generic failure for unknown/inactive accounts — don't disclose which emails exist.
  if (!employee) {
    return NextResponse.json(
      { success: false, error: "Incorrect email or password." },
      { status: 401 }
    );
  }

  // ── First-time password setup ──
  if (employee.password_hash === null) {
    if (!body.newPassword) {
      return NextResponse.json({ success: true, needsPassword: true });
    }
    const problem = passwordProblem(body.newPassword);
    if (problem) {
      return NextResponse.json({ success: false, error: problem }, { status: 400 });
    }
    await setEmployeePassword(employee.id, body.newPassword);
    await createEmployeeSession(employee.id);
    return NextResponse.json({
      success: true,
      employee: { name: employee.name, role: employee.role },
    });
  }

  // ── Normal login ──
  if (!body.password) {
    return NextResponse.json(
      { success: false, error: "Password is required." },
      { status: 400 }
    );
  }

  const ok = await verifyPassword(body.password, employee.password_hash);
  if (!ok) {
    return NextResponse.json(
      { success: false, error: "Incorrect email or password." },
      { status: 401 }
    );
  }

  await createEmployeeSession(employee.id);
  return NextResponse.json({
    success: true,
    employee: { name: employee.name, role: employee.role },
  });
}
