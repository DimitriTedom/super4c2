"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/** Les écrans d'examen en direct (/examens/<id>/ce|co|ee|eo) sont en plein écran officiel sans barre de navigation */
const EXAM_ROOM = /^\/examens\/[^/]+\/(ce|co|ee|eo)\/?$/;

interface AppShellProps {
  header: ReactNode;
  children: ReactNode;
}

export function AppShell({ header, children }: AppShellProps) {
  const pathname = usePathname();
  const isExamRoom = EXAM_ROOM.test(pathname);

  if (isExamRoom) {
    return <>{children}</>;
  }

  return (
    <>
      {header}
      <main className="mx-auto max-w-7xl px-4 py-8">{children}</main>
    </>
  );
}
