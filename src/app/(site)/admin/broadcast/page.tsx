import type { Metadata } from "next";
import { AdminBroadcast } from "@/components/sections/AdminBroadcast";
import { isAdminAuthenticated } from "@/lib/adminAuth";

export const metadata: Metadata = {
  title: "Broadcast — Admin",
  robots: { index: false, follow: false, nocache: true },
};

// Auth is re-checked server-side on every API call; this only decides which
// panel to render first.
export const dynamic = "force-dynamic";

export default async function AdminBroadcastPage() {
  const authed = await isAdminAuthenticated();

  return (
    <main className="bg-black min-h-screen">
      <div
        className="section-padding border-b border-white/8 text-left"
        style={{ paddingTop: "5.5rem", paddingBottom: "2.5rem" }}
      >
        <div className="max-w-4xl mx-auto">
          <h1 className="font-display font-black text-[#FF0000] text-4xl md:text-5xl leading-tight mb-3">
            BROADCAST
          </h1>
          <p className="text-[#555] text-sm tracking-widest uppercase">
            Email all paid model registration applicants.
          </p>
        </div>
      </div>

      <AdminBroadcast initiallyAuthed={authed} />
    </main>
  );
}
