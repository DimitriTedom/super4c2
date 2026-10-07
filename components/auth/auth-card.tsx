import * as React from "react";
import Link from "next/link";
import { ShieldCheck, Sparkles } from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function AuthCard({
  title,
  description,
  badgeText = "Entraînement TCF & TEF Canada",
  children,
}: {
  title: string;
  description: string;
  badgeText?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="w-full max-w-md space-y-6">
      {/* Brand Header */}
      <div className="flex flex-col items-center text-center space-y-2">
        <Link href="/" className="transition-transform hover:scale-105 inline-block">
          <BrandLogo size="lg" />
        </Link>
        <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
          <Sparkles className="h-3 w-3" />
          <span>{badgeText}</span>
        </div>
      </div>

      <Card className="rounded-3xl border border-border/80 bg-card/90 shadow-xl backdrop-blur-sm">
        <CardHeader className="space-y-1.5 pb-4 text-center">
          <CardTitle className="font-display text-2xl font-bold tracking-tight">{title}</CardTitle>
          <CardDescription className="text-sm text-muted-foreground">{description}</CardDescription>
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>

      {/* Trust & Security Footnote */}
      <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
        <ShieldCheck className="h-4 w-4 text-primary" />
        <span>Connexion sécurisée · Données hébergées au Canada</span>
      </div>
    </div>
  );
}
