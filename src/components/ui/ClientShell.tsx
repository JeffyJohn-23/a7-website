"use client";

import { useEffect } from "react";
import { initLenis } from "@/lib/lenis";
import { CustomCursor } from "@/components/ui/CustomCursor";

/**
 * Client-only shell: initializes Lenis smooth scroll and renders the custom cursor.
 * Extracted from RootLayout so the layout itself stays a Server Component,
 * enabling SSR for above-the-fold content (critical for FCP/LCP).
 */
export function ClientShell({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    initLenis();
  }, []);

  return (
    <>
      <CustomCursor />
      {children}
    </>
  );
}
