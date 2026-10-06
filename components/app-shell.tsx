"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { SiteHeader } from "@/components/site-header";

/** Live exam screens (/examens/<id>/ce|co|ee|eo) are full-screen, distraction-free: no site chrome. */
const EXAM_ROOM = /^\/examens\/[^/]+\/(ce|co|ee|eo)\/?$/;

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  if (EXAM_ROOM.test(pathname)) return <>{children}</>;
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-4 py-8">{children}</main>
    </>
  );
}
