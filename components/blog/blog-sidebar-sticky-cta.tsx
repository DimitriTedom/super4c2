"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export function BlogSidebarStickyCta() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    try {
      const supabase = createSupabaseBrowserClient();
      supabase.auth.getUser().then(({ data }) => {
        setIsAuthenticated(!!data?.user);
      });
    } catch {
      setIsAuthenticated(false);
    }
  }, []);

  return (
    <div className="rounded-2xl border border-primary/30 bg-gradient-to-br from-card to-primary/5 p-4 text-center space-y-3 shadow-sm">
      {isAuthenticated ? (
        <>
          <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            Session Active
          </span>
          <h5 className="font-display font-bold text-sm text-foreground leading-snug">
            Votre Espace Candidat
          </h5>
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            Reprenez vos simulations CBT, révisez vos erreurs et suivez votre progression NCLC.
          </p>
          <Button asChild size="sm" className="w-full text-xs font-bold h-9 bg-primary hover:bg-primary-dark text-white shadow-xs">
            <Link href="/dashboard">Mon Tableau de Bord →</Link>
          </Button>
        </>
      ) : (
        <>
          <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20">
            100% Gratuit • Sans Carte
          </span>
          <h5 className="font-display font-bold text-sm text-foreground leading-snug">
            Créez Votre Compte Candidat
          </h5>
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            Sauvegardez vos scores, activez le carnet d&apos;erreurs SRS et simulez sous le chrono officiel FEI.
          </p>
          <Button asChild size="sm" className="w-full text-xs font-bold h-9 bg-primary hover:bg-primary-dark text-white shadow-xs">
            <Link href="/auth/register?source=blog_sidebar_sticky">Créer Mon Compte →</Link>
          </Button>
        </>
      )}
    </div>
  );
}
