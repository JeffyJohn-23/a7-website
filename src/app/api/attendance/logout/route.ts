import { NextResponse } from "next/server";
import { destroyEmployeeSession } from "@/lib/employeeAuth";

export const runtime = "nodejs";

export async function POST() {
  await destroyEmployeeSession();
  return NextResponse.json({ success: true });
}
