import Link from "next/link";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { BrandLogo } from "@/components/brand-logo";
import { ThemeToggle } from "@/components/theme-toggle";

export async function SiteHeader() {
  const supabase = await createSupabaseServerClient();
  const user = supabase ? (await supabase.auth.getUser()).data.user : null;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/80 transition-colors">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <BrandLogo size="md" variant="horizontal" />

        <nav className="hidden md:flex items-center gap-6 font-body text-sm font-medium text-slate-600 dark:text-slate-300">
          <Link
            href="/examens"
            className="hover:text-brand-crimson dark:hover:text-white transition-colors"
          >
            Séries TCF Canada
          </Link>
          <Link
            href="/oral-ai"
            className="hover:text-brand-crimson dark:hover:text-white transition-colors flex items-center gap-1.5"
          >
            <span>Oral IA (Tâche 2)</span>
            <span className="rounded-full bg-brand-cyan/15 px-1.5 py-0.5 text-[10px] font-bold text-brand-cyan uppercase tracking-wider">
              Live
            </span>
          </Link>
          <Link
            href="/nclc-calculator"
            className="hover:text-brand-crimson dark:hover:text-white transition-colors"
          >
            Simulateur CRS
          </Link>
          <Link
            href="/tarifs"
            className="hover:text-brand-crimson dark:hover:text-white transition-colors"
          >
            Tarifs
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <ThemeToggle />

          {user ? (
            <>
              <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
                <Link href="/dashboard">Mon Espace</Link>
              </Button>
              <form action="/logout" method="post">
                <Button type="submit" variant="outline" size="sm">
                  Déconnexion
                </Button>
              </form>
            </>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
                <Link href="/auth/login">Connexion</Link>
              </Button>
              <Button
                asChild
                size="sm"
                className="bg-brand-crimson hover:bg-brand-crimson-dark text-white font-medium shadow-sm transition-all hover:shadow-md"
              >
                <Link href="/auth/register">Essai Gratuit</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
