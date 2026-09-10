import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AttendanceAdmin } from "@/components/sections/AttendanceAdmin";
import { getCurrentEmployee } from "@/lib/employeeAuth";

export const metadata: Metadata = {
  title: "Attendance Admin",
  robots: { index: false, follow: false, nocache: true },
};

export const dynamic = "force-dynamic";

export default async function AttendanceAdminPage() {
  // Real authorization: signed in AND an admin. Every admin API route
  // re-checks this independently.
  const employee = await getCurrentEmployee();
  if (!employee) redirect("/attendance/login");
  if (employee.role !== "admin") redirect("/attendance");

  return (
    <main className="bg-black min-h-screen">
      <div
        className="section-padding border-b border-white/8 text-left"
        style={{ paddingTop: "5.5rem", paddingBottom: "2.5rem" }}
      >
        <div className="max-w-4xl mx-auto">
          <h1 className="font-display font-black text-[#FF0000] text-4xl md:text-5xl leading-tight mb-3">
            ATTENDANCE ADMIN
          </h1>
          <p className="text-[#555] text-sm tracking-widest uppercase">
            Live status, monthly hours, and employee management.
          </p>
        </div>
      </div>

      <AttendanceAdmin />
    </main>
  );
}
