import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { BrandLogo } from "@/components/brand-logo";
import { ThemeToggle } from "@/components/theme-toggle";

export async function SiteHeader() {
  const supabase = await createSupabaseServerClient();
  const user = supabase ? (await supabase.auth.getUser()).data.user : null;

  return (
    <div className="sticky top-0 z-50 w-full transition-colors">
      {/* Top micro-bar informative & élégante */}
      <div className="hidden border-b border-border/40 bg-muted/60 dark:bg-[#03060C] px-4 py-1.5 text-xs text-muted-foreground sm:block transition-colors">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-semibold text-foreground">Simulateur FEI 100% Opérationnel</span>
            <span className="text-border">|</span>
            <span>Conforme aux standards officiels France Éducation International (TCF / TEF)</span>
          </div>
          <div className="flex items-center gap-3.5 text-[11px]">
            <Link href="/blog" className="text-foreground/80 hover:text-primary transition-colors font-medium">
              Blog & Stratégies
            </Link>
            <span className="text-border">|</span>
            <Link href="/communaute" className="text-foreground/80 hover:text-primary transition-colors font-medium">
              Communauté VIP
            </Link>
            <span className="text-border">|</span>
            <span className="font-bold text-brand-crimson">🇨🇦 Objectif NCLC 7+</span>
            <span className="text-border">|</span>
            <Link
              href="/nclc-calculator"
              className="text-foreground/80 hover:text-foreground transition-colors"
            >
              Calculateur CRS
            </Link>
          </div>
        </div>
      </div>

      {/* Barre de navigation principale avec pilule centrale */}
      <header className="border-b border-border/60 bg-background/95 backdrop-blur-xl transition-colors">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <BrandLogo size="md" variant="horizontal" />

          {/* Navigation centrale style pilule flottante */}
          <nav className="hidden lg:flex items-center gap-1 rounded-full border border-border/70 bg-muted/40 dark:bg-white/[0.04] p-1.5 shadow-inner backdrop-blur-md">
            <Link
              href="/"
              className="rounded-full px-3.5 py-1.5 text-xs font-semibold text-foreground bg-background shadow-xs transition-all"
            >
              Accueil
            </Link>
            <Link
              href="/examens"
              className="rounded-full px-3.5 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-background/80 transition-all"
            >
              Séries TCF
            </Link>
            <Link
              href="/examens/demo-101-eo/intro"
              className="rounded-full px-3.5 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-background/80 transition-all flex items-center gap-1.5"
            >
              <span>Oral IA</span>
              <span className="rounded-full bg-cyan-500/15 px-1.5 py-0.2 text-[9px] font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider">
                Direct
              </span>
            </Link>
            <Link
              href="/examens/demo-101-ee/intro"
              className="rounded-full px-3.5 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-background/80 transition-all flex items-center gap-1"
            >
              <span>Écrit FEI</span>
              <Sparkles className="h-2.5 w-2.5 text-brand-crimson" />
            </Link>
            <Link
              href="/carnet-erreurs"
              className="rounded-full px-3.5 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-background/80 transition-all"
            >
              Carnet SRS
            </Link>
            <Link
              href="/blog"
              className="rounded-full px-3.5 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-background/80 transition-all"
            >
              Blog
            </Link>
            <Link
              href="/tarifs"
              className="rounded-full px-3.5 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-background/80 transition-all"
            >
              Tarifs
            </Link>
          </nav>

          {/* Actions & CTA */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Button asChild variant="ghost" size="sm" className="lg:hidden rounded-full px-2.5 text-xs">
              <Link href="/examens">Épreuves</Link>
            </Button>

            <span className="hidden sm:inline-flex items-center gap-1 rounded-full border border-border/70 bg-muted/50 px-2.5 py-1 text-xs font-semibold text-foreground/80">
              🇨🇦 FR-CA
            </span>

            <ThemeToggle />

            {user ? (
              <>
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
                  className="rounded-full bg-brand-crimson hover:bg-brand-crimson-dark text-white font-semibold shadow-sm transition-all hover:shadow-md gap-1 px-4"
                >
                  <Link href="/test-gratuit">
                    <span>Essai Gratuit</span>
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
