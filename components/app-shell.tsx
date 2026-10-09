"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/** Les écrans d'examen en direct (/examens/<id>/ce|co|ee|eo) sont en plein écran officiel sans barre de navigation */
const EXAM_ROOM = /^\/examens\/[^/]+\/(ce|co|ee|eo)\/?$/;

import { SiteFooter } from "@/components/site-footer";
import { MobileNavBar } from "@/components/mobile-nav";
import { AiChatWidget } from "@/components/ai/ai-chat-widget";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import { TopBodyLoader } from "@/components/ui/top-body-loader";
import { ScrollToTop } from "@/components/ui/scroll-to-top";

interface AppShellProps {
  header: ReactNode;
  children: ReactNode;
}

export function AppShell({ header, children }: AppShellProps) {
  const pathname = usePathname();
  const isExamRoom = EXAM_ROOM.test(pathname);
  const isAdmin = pathname.startsWith("/admin");

  if (isExamRoom) {
    return <>{children}</>;
  }

  if (isAdmin) {
    return (
      <>
        <TopBodyLoader />
        <ScrollProgress />
        {children}
        <AiChatWidget />
        <ScrollToTop />
      </>
    );
  }

  // La page d'accueil gère elle-même sa pleine largeur
  const isFullWidth = pathname === "/";

  return (
    <div className="flex min-h-screen flex-col justify-between pb-16 lg:pb-0 relative">
      {/* Barre de chargement d'état & de défilement en haut du body */}
      <TopBodyLoader />
      <ScrollProgress />

      <div>
        {header}
        <main className={isFullWidth ? "w-full" : "mx-auto max-w-7xl px-4 py-8"}>{children}</main>
      </div>

      <SiteFooter />
      <MobileNavBar />
      <AiChatWidget />
      <ScrollToTop />
    </div>
  );
}
