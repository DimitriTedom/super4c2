"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Zap } from "lucide-react";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { Button } from "@/components/ui/button";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

interface BlogArticleFooterCtaProps {
  targetCta: {
    label: string;
    href: string;
  };
}

export function BlogArticleFooterCta({ targetCta }: BlogArticleFooterCtaProps) {
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
    <div className="rounded-3xl border border-primary/30 bg-gradient-to-br from-card via-card to-primary/10 p-6 sm:p-8 space-y-4 shadow-md">
      <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-primary/10 text-primary border border-primary/20">
        <Zap className="h-3 w-3" />
        Passer à l&apos;Application Pratique
      </div>

      <h3 className="font-display text-xl sm:text-2xl font-black tracking-tight text-foreground">
        Prêt à Valider votre Palier NCLC 7 et Gagner vos 50 Points CRS ?
      </h3>

      <p className="text-sm text-muted-foreground leading-relaxed max-w-xl">
        Rejoignez Super4C2 pour vous entraîner dans les conditions réelles des examens officiels FEI : simulateur CBT chronométré, double notation instantanée et modèles Magic Rewrite C2.
      </p>

      <div className="pt-2 flex flex-wrap items-center gap-3">
        {isAuthenticated ? (
          <ShimmerButton
            href="/dashboard"
            background="#E51A31"
            shimmerColor="#ffffff"
            className="font-bold px-7 py-3 text-white text-xs sm:text-sm shadow-md"
          >
            Accéder à mon espace d&apos;entraînement →
          </ShimmerButton>
        ) : (
          <ShimmerButton
            href="/auth/register?source=blog_article_footer"
            background="#E51A31"
            shimmerColor="#ffffff"
            className="font-bold px-7 py-3 text-white text-xs sm:text-sm shadow-md"
          >
            Créer mon compte gratuit en 30s →
          </ShimmerButton>
        )}
        <Button variant="outline" size="sm" asChild className="text-xs h-10 border-border">
          <Link href={targetCta.href}>{targetCta.label}</Link>
        </Button>
      </div>
    </div>
  );
}
