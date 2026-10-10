"use client";

import * as React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  Sparkles,
  ShieldCheck,
  Zap,
  Globe2,
  ChevronDown,
  CreditCard,
  Smartphone,
  ArrowRight,
  Crown,
  Calendar,
  Layers,
} from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  PRICING_PLANS,
  SUPPORTED_CURRENCIES,
  SupportedCurrency,
  detectClientCurrency,
  PricingPlan,
} from "@/lib/pricing/geo-pricing";

export const PLAN_3D_ASSETS: Record<string, { src: string; alt: string }> = {
  sprint_7d: {
    src: "/brand/icons-3d/pass-sprint-7d.png",
    alt: "Pass Sprint 7 Jours 3D Turbo",
  },
  intensif_15d: {
    src: "/brand/icons-3d/pass-intensif-15d.png",
    alt: "Pass Intensif 15 Jours 3D Énergie",
  },
  succes_30d: {
    src: "/brand/icons-3d/pass-succes-30d.png",
    alt: "Pass Succès 30 Jours 3D Étoile NCLC 7",
  },
  vip_60d: {
    src: "/brand/icons-3d/pass-vip-60d.png",
    alt: "Pass VIP 60 Jours 3D Diamant & Garantie",
  },
  annuel_365d: {
    src: "/brand/icons-3d/pass-annuel-365d.png",
    alt: "Pass Immigrant 1 An 3D Passeport & Clé d'Or",
  },
};

interface GeoPricingSectionProps {
  initialCurrency?: SupportedCurrency;
}

type FilterDuration = "all" | "sprint" | "annual";

export function GeoPricingSection({ initialCurrency }: GeoPricingSectionProps) {
  const [currency, setCurrency] = React.useState<SupportedCurrency>(initialCurrency || "EUR");
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
  const [filterDuration, setFilterDuration] = React.useState<FilterDuration>("all");
  const [selectedPlanId, setSelectedPlanId] = React.useState<string>("succes_30d");

  // Client-side auto-detection on mount if no initialCurrency provided
  React.useEffect(() => {
    if (!initialCurrency) {
      const detected = detectClientCurrency();
      setCurrency(detected);
    }
  }, [initialCurrency]);

  const activeCurrencyConfig = SUPPORTED_CURRENCIES[currency];

  const annualPlan = PRICING_PLANS.find((p) => p.id === "annuel_365d")!;
  const sprintPlans = PRICING_PLANS.filter((p) => p.durationDays < 365);

  return (
    <section className="relative overflow-hidden py-12 lg:py-20">
      {/* Background radial glow */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-40">
        <div className="h-[650px] w-[950px] rounded-full bg-gradient-to-tr from-primary/20 via-sky-500/10 to-indigo-500/20 blur-3xl" />
      </div>

      <div className="container relative mx-auto px-4 sm:px-6">
        {/* Header Block */}
        <div className="mx-auto max-w-3xl text-center space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Investissement Rentabilisé Dès le 1er Essai</span>
          </div>

          <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-foreground">
            Des Tarifs Clairs. <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-primary via-indigo-600 to-sky-600 bg-clip-text text-transparent">
              Une Seule Monnaie. Zéro Surprise.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            Un test officiel de langue coûte plus de <strong className="text-foreground font-semibold">300 $ CAD</strong>.
            Validez votre palier <strong className="text-primary font-semibold">NCLC 7 (+50 pts CRS)</strong> du premier coup ou préparez tout votre dossier sur 1 an.
          </p>

          {/* Geo-Currency Intelligence Bar */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <div className="inline-flex items-center gap-2.5 rounded-2xl border border-border/80 bg-background/80 px-4 py-2 text-xs font-medium text-foreground shadow-sm backdrop-blur-md">
              <span className="text-base">{activeCurrencyConfig.flag}</span>
              <span className="text-muted-foreground">Monnaie détectée pour votre pays :</span>
              <span className="font-bold text-foreground">{activeCurrencyConfig.label}</span>
            </div>

            {/* Manual Currency Switcher Toggle */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="inline-flex items-center gap-1.5 rounded-2xl border border-border/80 bg-background/60 hover:bg-background px-3 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors shadow-sm"
              >
                <Globe2 className="h-3.5 w-3.5 text-primary" />
                <span>Changer</span>
                <ChevronDown className="h-3.5 w-3.5 opacity-70" />
              </button>

              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 sm:left-0 z-50 mt-2 w-72 rounded-2xl border border-border bg-card p-2 shadow-2xl backdrop-blur-xl"
                  >
                    <div className="px-2 py-1.5 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                      Sélectionnez votre monnaie
                    </div>
                    {Object.values(SUPPORTED_CURRENCIES).map((curr) => (
                      <button
                        key={curr.code}
                        type="button"
                        onClick={() => {
                          setCurrency(curr.code);
                          setIsDropdownOpen(false);
                        }}
                        className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-medium transition-colors ${
                          currency === curr.code
                            ? "bg-primary text-primary-foreground font-bold"
                            : "hover:bg-muted text-foreground"
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <span className="text-base">{curr.flag}</span>
                          <span>{curr.label}</span>
                        </span>
                        <span className="opacity-80 font-mono text-[11px]">{curr.symbol}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Duration Filter Switcher Tabs */}
          <div className="pt-6 flex justify-center">
            <div className="inline-flex p-1 rounded-2xl bg-muted/60 border border-border/80 backdrop-blur-md">
              <button
                type="button"
                onClick={() => setFilterDuration("all")}
                className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
                  filterDuration === "all"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Toutes les Formules
              </button>
              <button
                type="button"
                onClick={() => setFilterDuration("sprint")}
                className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
                  filterDuration === "sprint"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Pass Révision (7j - 60j)
              </button>
              <button
                type="button"
                onClick={() => setFilterDuration("annual")}
                className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 ${
                  filterDuration === "annual"
                    ? "bg-gradient-to-r from-amber-500 to-primary text-white shadow-sm"
                    : "text-amber-600 dark:text-amber-400 hover:text-foreground font-extrabold"
                }`}
              >
                <Crown className="h-3.5 w-3.5" />
                <span>Pass Immigrant 1 An 🔥</span>
              </button>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* 1. FLAGSHIP HERO CARD: PASS IMMIGRANT 1 AN (365 JOURS)   */}
        {/* ======================================================== */}
        {(filterDuration === "all" || filterDuration === "annual") && (
          <div className="mt-12 max-w-5xl mx-auto rounded-3xl border-2 border-amber-500/80 bg-gradient-to-b from-card via-card to-amber-500/10 p-7 sm:p-9 shadow-2xl relative transition-all">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-primary px-5 py-1 text-xs font-black uppercase tracking-wider text-white shadow-lg shadow-amber-500/40 whitespace-nowrap z-10">
              👑 Pack Intégral Immigration Canada (Économisez 60%)
            </div>

            <div className="grid gap-8 lg:grid-cols-12 items-center">
              {/* Left Column: 3D Golden Passport + Title + Price + CTA (7 cols) */}
              <div className="lg:col-span-7 space-y-5 text-center lg:text-left flex flex-col items-center lg:items-start">
                <div className="flex flex-col sm:flex-row items-center gap-5">
                  {/* 3D Icon Stage */}
                  <div className="relative shrink-0 flex items-center justify-center">
                    <div className="absolute inset-0 rounded-full blur-3xl bg-amber-500/35 scale-125 pointer-events-none" />
                    <div className="relative h-28 w-28 sm:h-36 sm:w-36 shrink-0 flex items-center justify-center drop-shadow-2xl transition-transform hover:scale-105 duration-300">
                      <Image
                        src={PLAN_3D_ASSETS.annuel_365d.src}
                        alt={PLAN_3D_ASSETS.annuel_365d.alt}
                        width={144}
                        height={144}
                        className="h-full w-full object-contain"
                        priority
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/brand/icons-3d/vip-pricing-pass.png";
                        }}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5 text-center sm:text-left">
                    <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-bold text-amber-500 border border-amber-500/20">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>Accès Illimité 365 Jours (12 Mois)</span>
                    </div>
                    <h3 className="font-display text-2xl sm:text-3xl font-black text-foreground">
                      {annualPlan.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-sm">
                      L&apos;assurance tout-en-un pour votre parcours RP Canada. Idéal pour progresser de B1/B2 vers C1/C2 ou préparer à la fois le TCF Canada et l&apos;IELTS.
                    </p>
                  </div>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center sm:items-baseline gap-3">
                  <div className="flex items-baseline gap-2">
                    <span className="font-display text-4xl sm:text-5xl font-black tracking-tight text-foreground font-mono">
                      {annualPlan.prices[currency].formatted}
                    </span>
                  </div>
                  <div className="text-xs text-emerald-600 dark:text-emerald-400 font-bold px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                    ✨ Revient à seulement {currency === "XAF" ? "5 000 FCFA" : currency === "EUR" ? "7,50 €" : currency === "CAD" ? "10,75 $ CAD" : "7,90 $ USD"}/mois !
                  </div>
                </div>

                <div className="pt-1 w-full sm:w-auto">
                  <Button
                    asChild
                    size="lg"
                    className="w-full sm:w-auto px-8 font-black bg-gradient-to-r from-amber-500 via-orange-500 to-primary hover:opacity-95 text-white shadow-lg shadow-amber-500/25 h-12 text-sm"
                  >
                    <Link href={`/checkout?plan=annuel_365d&currency=${currency}`}>
                      <span>Activer Mon Pass Annuel 1 An</span>
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Link>
                  </Button>
                </div>
              </div>

              {/* Right Column: Inclusions & Guarantees (5 cols) */}
              <div className="lg:col-span-5 rounded-2xl border border-border/80 bg-background/60 p-5 space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Crown className="h-3.5 w-3.5 text-amber-500" />
                  <span>Privilèges Immigrant Inclus :</span>
                </div>
                <ul className="space-y-2.5 text-xs text-foreground/90">
                  {annualPlan.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <div className="mt-0.5 rounded-full p-0.5 bg-amber-500/20 text-amber-500 shrink-0">
                        <Check className="h-3 w-3 stroke-[3]" />
                      </div>
                      <span className="leading-snug">{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* 2. 4 PASS RÉVISION CIBLÉS (7j, 15j, 30j, 60j) EN 4 COLS  */}
        {/* ======================================================== */}
        {(filterDuration === "all" || filterDuration === "sprint") && (
          <div className="mt-14 space-y-6">
            {filterDuration === "all" && (
              <div className="text-center space-y-1.5 max-w-xl mx-auto">
                <h3 className="font-display text-xl sm:text-2xl font-black text-foreground">
                  Ou Choisissez un Pass Révision Ciblé (7 à 60 Jours)
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Des formules intensives pour valider votre NCLC 7 avant votre date d&apos;examen officiel.
                </p>
              </div>
            )}

            {/* Balanced 4-Column Grid */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 max-w-7xl mx-auto items-stretch">
              {sprintPlans.map((plan: PricingPlan) => {
                const price = plan.prices[currency];
                const isPopular = plan.popular;
                const isVip = plan.vip;

                return (
                  <motion.div
                    key={plan.id}
                    whileHover={{ y: -6 }}
                    transition={{ duration: 0.2 }}
                    onClick={() => setSelectedPlanId(plan.id)}
                    className={`group relative flex flex-col justify-between rounded-3xl border p-6 shadow-sm transition-all cursor-pointer ${
                      isPopular
                        ? "border-primary bg-card ring-2 ring-primary/80 shadow-2xl shadow-primary/10"
                        : isVip
                        ? "border-purple-500/50 bg-gradient-to-b from-card via-card to-purple-500/5 ring-1 ring-purple-500/30"
                        : "border-border/80 bg-card hover:border-border"
                    }`}
                  >
                    {/* Top Badges */}
                    {isPopular && (
                      <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-primary to-indigo-600 px-4 py-1 text-[11px] font-black uppercase tracking-wider text-white shadow-lg shadow-primary/30 whitespace-nowrap z-10">
                        ⭐ Choix N°1 des Candidats
                      </div>
                    )}

                    {isVip && (
                      <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 px-4 py-1 text-[11px] font-black uppercase tracking-wider text-white shadow-lg shadow-purple-500/30 whitespace-nowrap z-10">
                        🏆 Garantie NCLC 7
                      </div>
                    )}

                    <div>
                      {/* 3D Showcase Glass Podium Header */}
                      <div className="relative w-full h-36 rounded-2xl bg-gradient-to-b from-muted/60 via-muted/20 to-transparent border border-border/50 flex items-center justify-center p-3 mb-3 overflow-hidden shadow-xs group-hover:border-primary/40 transition-all">
                        {/* Ambient Aura */}
                        <div
                          className={cn(
                            "absolute inset-0 rounded-full blur-2xl transition-opacity duration-300 pointer-events-none scale-125 opacity-60 group-hover:opacity-100",
                            isPopular
                              ? "bg-primary/30"
                              : isVip
                              ? "bg-purple-500/30"
                              : plan.id === "intensif_15d"
                              ? "bg-amber-500/25"
                              : "bg-sky-500/20"
                          )}
                        />

                        {/* 3D Icon */}
                        <div className="relative h-28 w-28 shrink-0 flex items-center justify-center drop-shadow-2xl transition-all duration-300 group-hover:scale-110 group-hover:-translate-y-1">
                          <Image
                            src={PLAN_3D_ASSETS[plan.id]?.src || "/brand/icons-3d/vip-pricing-pass.png"}
                            alt={PLAN_3D_ASSETS[plan.id]?.alt || plan.name}
                            width={112}
                            height={112}
                            className="h-full w-full object-contain"
                            priority
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "/brand/icons-3d/vip-pricing-pass.png";
                            }}
                          />
                        </div>
                      </div>

                      {/* Tier Pill Badge Centered under Podium */}
                      <div className="flex justify-center mb-3">
                        {isPopular ? (
                          <span className="flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-0.5 text-[11px] font-black text-primary border border-primary/25 shadow-xs whitespace-nowrap">
                            <Zap className="h-3.5 w-3.5 fill-primary" /> Palier Idéal NCLC 7
                          </span>
                        ) : isVip ? (
                          <span className="flex items-center gap-1.5 rounded-full bg-purple-500/10 px-3 py-0.5 text-[11px] font-black text-purple-500 border border-purple-500/25 shadow-xs whitespace-nowrap">
                            <ShieldCheck className="h-3.5 w-3.5" /> Suivi VIP Garanti
                          </span>
                        ) : plan.id === "intensif_15d" ? (
                          <span className="flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3 py-0.5 text-[11px] font-black text-amber-600 dark:text-amber-400 border border-amber-500/25 shadow-xs whitespace-nowrap">
                            ⚡ Boost Sprint 15J
                          </span>
                        ) : (
                          <span className="flex items-center gap-1.5 rounded-full bg-muted px-3 py-0.5 text-[11px] font-black text-muted-foreground border border-border/80 shadow-xs whitespace-nowrap">
                            🚀 Diagnostic Express
                          </span>
                        )}
                      </div>

                      {/* Plan Title & Tagline */}
                      <div className="space-y-1 text-center mb-4">
                        <h3 className="font-display text-lg font-black text-foreground">
                          {plan.name}
                        </h3>
                        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 min-h-[34px]">
                          {plan.tagline}
                        </p>
                      </div>

                      {/* Price Block */}
                      <div className="mt-2 mb-5 pb-5 border-b border-border/60 text-center">
                        <div className="flex items-baseline justify-center gap-1.5">
                          <span className="font-display text-4xl sm:text-5xl font-black tracking-tight text-foreground font-mono">
                            {price.formatted.replace(` ${activeCurrencyConfig.symbol}`, "").replace(activeCurrencyConfig.symbol, "")}
                          </span>
                          <span className="text-lg font-bold text-foreground">
                            {activeCurrencyConfig.symbol}
                          </span>
                        </div>
                        <div className="text-[11px] text-muted-foreground font-medium mt-1">
                          Paiement unique {price.periodText} • Sans tacite reconduction
                        </div>
                      </div>

                      {/* Core Features */}
                      <ul className="space-y-2.5 text-xs text-foreground/90">
                        {plan.features.map((feature, i) => (
                          <li key={i} className="flex items-start gap-2.5">
                            <div
                              className={cn(
                                "mt-0.5 rounded-full p-0.5 shrink-0",
                                isPopular
                                  ? "bg-primary/20 text-primary"
                                  : isVip
                                  ? "bg-purple-500/20 text-purple-500"
                                  : "bg-emerald-500/20 text-emerald-600"
                              )}
                            >
                              <Check className="h-3 w-3 stroke-[3]" />
                            </div>
                            <span className="leading-snug">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Bottom CTA & Payment Method hints */}
                    <div className="mt-6 pt-5 border-t border-border/60 space-y-2.5">
                      <Button
                        asChild
                        size="lg"
                        className={cn(
                          "w-full font-bold shadow-md transition-all h-11 text-xs sm:text-sm",
                          isPopular
                            ? "bg-primary hover:bg-primary/90 text-primary-foreground shadow-primary/25"
                            : isVip
                            ? "bg-purple-600 hover:bg-purple-700 text-white shadow-purple-500/25"
                            : "bg-muted hover:bg-muted/80 text-foreground"
                        )}
                      >
                        <Link href={`/checkout?plan=${plan.id}&currency=${currency}`}>
                          <span>Commencer Maintenant</span>
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Link>
                      </Button>

                      {/* Payment Gateway local badge */}
                      <div className="flex items-center justify-center gap-2 text-[10px] text-muted-foreground">
                        {currency === "XAF" ? (
                          <>
                            <Smartphone className="h-3 w-3 text-emerald-500" />
                            <span>SasPay : MTN MoMo, Orange Money, Wave</span>
                          </>
                        ) : (
                          <>
                            <CreditCard className="h-3 w-3 text-sky-500" />
                            <span>CB, Visa, Mastercard, Apple Pay</span>
                          </>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {/* Reassurance & Guarantee Strip */}
        <div className="mt-16 mx-auto max-w-4xl rounded-3xl border border-border bg-card/60 p-6 sm:p-8 backdrop-blur-md shadow-sm">
          <div className="grid gap-6 sm:grid-cols-3 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3">
              <div className="rounded-2xl bg-emerald-500/10 p-3 text-emerald-500 shrink-0">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-foreground">SasPay & Stripe Certifiés</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  Chiffrement bancaire SSL 256 bits via SasPay (Mobile Money Afrique) et Stripe (International).
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3">
              <div className="rounded-2xl bg-primary/10 p-3 text-primary shrink-0">
                <Zap className="h-6 w-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-foreground">Activation Instantanée</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  Accès débloqué en quelques secondes dès validation USSD sur votre téléphone ou par carte.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3">
              <div className="rounded-2xl bg-amber-500/10 p-3 text-amber-500 shrink-0">
                <Sparkles className="h-6 w-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-foreground">Zéro Frais Cachés</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  Paiement unique selon la durée choisie (7j, 15j, 30j, 60j ou 1 an). Aucune reconduction forcée.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
