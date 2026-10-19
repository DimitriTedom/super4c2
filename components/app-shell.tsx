"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { SiteFooter } from "@/components/site-footer";
import { MobileNavBar } from "@/components/mobile-nav";
import { AiChatWidget } from "@/components/ai/ai-chat-widget";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import { ScrollToTop } from "@/components/ui/scroll-to-top";
import { NewcomerGuideModal } from "@/components/onboarding/newcomer-guide-modal";

/** Les écrans d'examen en direct (/examens/<id>/ce|co|ee|eo|examen-blanc) sont en plein écran officiel sans barre de navigation */
const EXAM_ROOM = /^\/examens\/[^/]+\/(ce|co|ee|eo|examen-blanc)\/?$/;

interface AppShellProps {
  header: ReactNode;
  children: ReactNode;
}

export function AppShell({ header, children }: AppShellProps) {
  const pathname = usePathname();
  const isExamRoom = EXAM_ROOM.test(pathname);
  const isAuth = pathname.startsWith("/auth") || pathname === "/admin/login";
  const isAdmin = pathname.startsWith("/admin");

  // 1. Salle d'examen CBT FEI — Isolation totale sans distraction ni widget
  if (isExamRoom) {
    return <div className="min-h-screen bg-background">{children}</div>;
  }

  // 2. Écrans d'authentification (Connexion, Inscription, Callback)
  if (isAuth) {
    // La console de login Admin gère son propre habillage sombre et sécurisé
    if (pathname === "/admin/login") {
      return <>{children}</>;
    }

    return (
      <div className="relative min-h-screen flex flex-col justify-between bg-gradient-to-b from-background via-muted/20 to-background">
        {/* En-tête minimal avec lien de retour */}
        <header className="w-full px-6 py-4 flex items-center justify-between border-b border-border/40 backdrop-blur-xs">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors group"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            <span>Retour à l&apos;accueil</span>
          </Link>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="hidden sm:inline">Préparation TCF &amp; TEF Canada</span>
          </div>
        </header>

        {/* Corps centré contenant le formulaire d'auth */}
        <main className="flex-1 flex items-center justify-center p-4 sm:p-6 my-4">
          {children}
        </main>

        {/* Pied de page discret et conforme */}
        <footer className="w-full py-4 px-6 border-t border-border/40 text-center text-xs text-muted-foreground flex flex-col sm:flex-row items-center justify-between gap-2 max-w-7xl mx-auto">
          <p>© {new Date().getFullYear()} Super4C2. Tous droits réservés.</p>
          <div className="flex items-center gap-4 text-xs">
            <Link href="/mentions-legales" className="hover:underline">
              Mentions Légales
            </Link>
            <Link href="/confidentialite" className="hover:underline">
              Confidentialité
            </Link>
            <Link href="/conditions" className="hover:underline">
              Conditions d&apos;utilisation
            </Link>
          </div>
        </footer>
      </div>
    );
  }

  // 3. Espace Administration sécurisé (L'admin gère son propre plein écran sans widgets parasites)
  if (isAdmin) {
    return <>{children}</>;
  }

  // 4. Site public & Portail candidat standard (Dashboard, Méthodologie, Blog, Simulateur, etc.)
  const isFullWidth = pathname === "/";

  return (
    <div className="flex min-h-screen flex-col justify-between pb-16 lg:pb-0 relative">
      {/* Barre de défilement en haut du body */}
      <ScrollProgress />

      <div>
        {header}
        <main className={isFullWidth ? "w-full" : "mx-auto max-w-7xl px-4 py-8"}>
          {children}
        </main>
      </div>

      <SiteFooter />
      <MobileNavBar />
      <AiChatWidget />
      <NewcomerGuideModal />
      <ScrollToTop />
    </div>
  );
}
