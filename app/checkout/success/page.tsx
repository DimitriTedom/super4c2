"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  BookOpen,
  LayoutDashboard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PRICING_PLANS } from "@/lib/pricing/geo-pricing";

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const planId = searchParams.get("plan") || "succes_30d";
  const gateway = searchParams.get("gateway") || "saspay";

  const plan = PRICING_PLANS.find((p) => p.id === planId) || PRICING_PLANS[2];

  return (
    <div className="container mx-auto px-4 py-16 sm:py-24 max-w-2xl text-center space-y-8">
      {/* 3D Success Badge Animation */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="mx-auto flex h-24 w-24 items-center justify-center rounded-3xl bg-emerald-500/10 border-2 border-emerald-500/20 p-2 shadow-2xl"
      >
        <Image
          src="/brand/icons-3d/state-success-victory.png"
          alt="Victoire & Validation Réussie 3D"
          width={88}
          height={88}
          className="h-full w-full object-contain drop-shadow-md"
          priority
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/brand/icons-3d/diploma-achievement.png";
          }}
        />
      </motion.div>

      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3.5 py-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Paiement Validé avec Succès • Accès Débloqué</span>
        </div>

        <h1 className="font-display text-3xl sm:text-4xl font-black tracking-tight text-foreground">
          Félicitations & Bienvenue sur Super4C2 !
        </h1>

        <p className="text-sm sm:text-base text-muted-foreground max-w-lg mx-auto leading-relaxed">
          Votre <strong className="text-foreground font-bold">{plan.name}</strong> est désormais activé. Vos simulateurs d&apos;examens CBT, corrections d&apos;expression et entretiens oraux sont disponibles dès maintenant.
        </p>
      </div>

      {/* Confirmation Card */}
      <div className="rounded-3xl border border-border bg-card p-6 text-left space-y-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-border/80 pb-3">
          <span className="text-xs text-muted-foreground font-medium">Forfait Actif :</span>
          <span className="text-xs font-bold text-foreground">{plan.name}</span>
        </div>
        <div className="flex items-center justify-between border-b border-border/80 pb-3">
          <span className="text-xs text-muted-foreground font-medium">Validité :</span>
          <span className="text-xs font-bold text-primary font-mono">{plan.durationDays} Jours d&apos;accès illimité</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground font-medium">Passerelle de règlement :</span>
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            {gateway === "saspay" ? "SasPay Mobile Money" : "Stripe Secure Card"}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <Button asChild size="lg" className="w-full sm:w-auto font-bold h-12 px-6 shadow-md">
          <Link href="/examens" className="gap-2">
            <BookOpen className="h-4 w-4" />
            <span>Accéder aux Séries d&apos;Examens</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>

        <Button asChild variant="outline" size="lg" className="w-full sm:w-auto font-bold h-12 px-6">
          <Link href="/dashboard" className="gap-2">
            <LayoutDashboard className="h-4 w-4" />
            <span>Voir Mon Tableau de Bord</span>
          </Link>
        </Button>
      </div>

      {/* Support assurance */}
      <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
        <ShieldCheck className="h-4 w-4 text-emerald-500" />
        <span>Un e-mail récapitulatif avec vos identifiants a été envoyé. Besoin d&apos;aide ? Écrivez à support@super4c2.com</span>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <React.Suspense fallback={<div className="py-20 text-center">Chargement...</div>}>
      <CheckoutSuccessContent />
    </React.Suspense>
  );
}
