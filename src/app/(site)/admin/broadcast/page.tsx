import type { Metadata } from "next";
import { AdminBroadcast } from "@/components/sections/AdminBroadcast";

export const metadata: Metadata = {
  title: "Broadcast — Admin",
  robots: { index: false, follow: false, nocache: true },
};

// Never cached, and the password is always required on load — a refresh or a
// revisit re-prompts rather than resuming a previous session.
export const dynamic = "force-dynamic";

export default function AdminBroadcastPage() {
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
            Email everyone on the broadcast list.
          </p>
        </div>
      </div>

      <AdminBroadcast />
    </main>
  );
}
