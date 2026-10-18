import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { BrandLogo } from "@/components/brand-logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { NotificationBell } from "@/components/notifications/notification-bell";
import { SiteNav } from "@/components/site-nav";

import { HeaderMicroBar } from "@/components/header-micro-bar";

export async function SiteHeader() {
  const supabase = await createSupabaseServerClient();
  const user = supabase ? (await supabase.auth.getUser()).data.user : null;

  return (
    <div className="sticky top-0 z-50 w-full transition-colors">
      {/* Top micro-bar informative & bilingue */}
      <HeaderMicroBar />

      {/* Barre de navigation principale avec pilule centrale */}
      <header className="border-b border-border/60 bg-background/95 backdrop-blur-xl transition-colors">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <BrandLogo size="md" variant="horizontal" />

          {/* Navigation centrale avec menus groupés et état actif dynamique */}
          <SiteNav />

          {/* Actions & CTA */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            <ThemeToggle />

            {user ? (
              <>
                <NotificationBell recipient="CANDIDATE" />

                <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex rounded-full">
                  <Link href="/dashboard">Mon Espace</Link>
                </Button>
                <form action="/logout" method="post">
                  <Button type="submit" variant="outline" size="sm" className="rounded-full">
                    Déconnexion
                  </Button>
                </form>
              </>
            ) : (
              <>
                <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex rounded-full">
                  <Link href="/auth/login">Connexion</Link>
                </Button>
                <Button
                  asChild
                  size="sm"
                  className="rounded-full bg-brand-crimson hover:bg-brand-crimson-dark text-white font-semibold shadow-sm transition-all hover:shadow-md gap-1 px-3 sm:px-4 text-xs sm:text-sm shrink-0"
                >
                  <Link href="/test-gratuit">
                    <span className="hidden sm:inline">Essai Gratuit</span>
                    <span className="sm:hidden">Essai</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </header>
    </div>
  );
}
