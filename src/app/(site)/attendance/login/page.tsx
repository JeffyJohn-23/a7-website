import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AttendanceLogin } from "@/components/sections/AttendanceLogin";
import { getCurrentEmployee } from "@/lib/employeeAuth";

export const metadata: Metadata = {
  title: "Attendance Sign In",
  robots: { index: false, follow: false, nocache: true },
};

export const dynamic = "force-dynamic";

export default async function AttendanceLoginPage() {
  // Already signed in — skip the form.
  const employee = await getCurrentEmployee();
  if (employee) redirect("/attendance");

  return (
    <main className="bg-black min-h-screen">
      <div
        className="section-padding border-b border-white/8 text-left"
        style={{ paddingTop: "5.5rem", paddingBottom: "2.5rem" }}
      >
        <div className="max-w-sm mx-auto">
          <h1 className="font-display font-black text-[#FF0000] text-4xl md:text-5xl leading-tight mb-3">
            ATTENDANCE
          </h1>
          <p className="text-[#555] text-sm tracking-widest uppercase">
            Sign in to clock in or out.
          </p>
        </div>
      </div>

      <AttendanceLogin />
    </main>
  );
}
