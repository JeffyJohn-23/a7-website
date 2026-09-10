import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AttendanceClock } from "@/components/sections/AttendanceClock";
import { getCurrentEmployee } from "@/lib/employeeAuth";

export const metadata: Metadata = {
  title: "Attendance",
  robots: { index: false, follow: false, nocache: true },
};

// Never cached — status must always reflect the live shift.
export const dynamic = "force-dynamic";

export default async function AttendancePage() {
  // Real authorization check (proxy.ts only checks a cookie exists).
  const employee = await getCurrentEmployee();
  if (!employee) redirect("/attendance/login");

  return (
    <main className="bg-black min-h-screen">
      <div
        className="section-padding border-b border-white/8 text-left"
        style={{ paddingTop: "5.5rem", paddingBottom: "2.5rem" }}
      >
        <div className="max-w-md mx-auto">
          <h1 className="font-display font-black text-[#FF0000] text-4xl md:text-5xl leading-tight mb-3">
            ATTENDANCE
          </h1>
          <p className="text-[#555] text-sm tracking-widest uppercase">
            Clock in when you start, clock out when you finish.
          </p>
        </div>
      </div>

      <AttendanceClock />
    </main>
  );
}
