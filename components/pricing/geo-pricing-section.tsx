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
import { Button } from "@/components/ui/button";
import {
  PRICING_PLANS,
  SUPPORTED_CURRENCIES,
  SupportedCurrency,
  detectClientCurrency,
  PricingPlan,
} from "@/lib/pricing/geo-pricing";

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

  const displayedPlans = React.useMemo(() => {
    if (filterDuration === "sprint") {
      return PRICING_PLANS.filter((p) => p.durationDays < 365);
    }
    if (filterDuration === "annual") {
      return PRICING_PLANS.filter((p) => p.durationDays === 365);
    }
    return PRICING_PLANS;
  }, [filterDuration]);

  const annualPlan = PRICING_PLANS.find((p) => p.id === "annuel_365d")!;

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

        {/* Heroic Highlight Card for 1-Year Pass when in 'annual' filter */}
        {filterDuration === "annual" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-12 max-w-4xl mx-auto rounded-3xl border-2 border-amber-500/80 bg-gradient-to-b from-card via-card to-amber-500/10 p-8 sm:p-10 shadow-2xl relative"
          >
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-primary px-5 py-1 text-xs font-black uppercase tracking-wider text-white shadow-lg shadow-amber-500/40">
              👑 Pack Intégral Immigration Canada (Économisez 60%)
            </div>

            <div className="grid gap-8 lg:grid-cols-2 items-center">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-bold text-amber-500">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>Accès Illimité 365 Jours (12 Mois Complets)</span>
                </div>
                <h3 className="font-display text-2xl sm:text-3xl font-black text-foreground">
                  {annualPlan.name}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  L&apos;assurance tout-en-un pour votre démarche de Résidence Permanente. Idéal si vous progressez de B1/B2 vers C1/C2 ou préparez à la fois le TCF Canada et l&apos;IELTS.
                </p>

                <div className="pt-2">
                  <div className="flex items-baseline gap-2">
                    <span className="font-display text-5xl font-black tracking-tight text-foreground font-mono">
                      {annualPlan.prices[currency].formatted}
                    </span>
                  </div>
                  <div className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
                    ✨ Revient à seulement {currency === "XAF" ? "5 000 FCFA" : currency === "EUR" ? "7,50 €" : currency === "CAD" ? "10,75 $ CAD" : "7,90 $ USD"} par mois !
                  </div>
                </div>

                <div className="pt-4">
                  <Button
                    asChild
                    size="lg"
                    className="w-full sm:w-auto px-8 font-black bg-gradient-to-r from-amber-500 via-orange-500 to-primary hover:opacity-95 text-white shadow-lg shadow-amber-500/25"
                  >
                    <Link href={`/checkout?plan=annuel_365d&currency=${currency}`}>
                      <span>Activer Mon Pass Annuel 1 An</span>
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Link>
                  </Button>
                </div>
              </div>

              <div className="rounded-2xl border border-border/80 bg-background/60 p-6 space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Ce qui est inclus dans le Pass Annuel :
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
          </motion.div>
        )}

        {/* Pricing Cards Grid (All or Sprint) */}
        {filterDuration !== "annual" && (
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4 max-w-7xl mx-auto items-stretch">
            {displayedPlans.map((plan: PricingPlan) => {
              const price = plan.prices[currency];
              const isPopular = plan.popular;
              const isVip = plan.vip;
              const isAnnual = plan.annual;

              return (
                <motion.div
                  key={plan.id}
                  whileHover={{ y: -6 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => setSelectedPlanId(plan.id)}
                  className={`relative flex flex-col justify-between rounded-3xl border p-6 sm:p-7 shadow-sm transition-all cursor-pointer ${
                    isAnnual
                      ? "border-amber-500/80 bg-gradient-to-b from-card via-card to-amber-500/10 ring-2 ring-amber-500/40 shadow-xl"
                      : isPopular
                      ? "border-primary bg-card ring-2 ring-primary/80 shadow-2xl shadow-primary/10"
                      : isVip
                      ? "border-purple-500/50 bg-gradient-to-b from-card via-card to-purple-500/5 ring-1 ring-purple-500/30"
                      : "border-border/80 bg-card hover:border-border"
                  }`}
                >
                  {/* Badges */}
                  {isAnnual && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-1 text-[11px] font-black uppercase tracking-wider text-white shadow-lg shadow-amber-500/30 whitespace-nowrap">
                      👑 1 An • Sérénité Totale
                    </div>
                  )}

                  {isPopular && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-primary to-indigo-600 px-4 py-1 text-[11px] font-black uppercase tracking-wider text-white shadow-lg shadow-primary/30 whitespace-nowrap">
                      ⭐ Choix N°1 des Candidats
                    </div>
                  )}

                  {isVip && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 px-4 py-1 text-[11px] font-black uppercase tracking-wider text-white shadow-lg shadow-purple-500/30 whitespace-nowrap">
                      🏆 Garantie NCLC 7
                    </div>
                  )}

                  <div>
                    {/* Plan Title & Tagline */}
                    <div className="space-y-1">
                      <h3 className="font-display text-lg font-bold text-foreground flex items-center justify-between">
                        <span>{plan.name}</span>
                        {isPopular ? (
                          <Zap className="h-4 w-4 text-primary fill-primary" />
                        ) : isAnnual ? (
                          <Crown className="h-4 w-4 text-amber-500 fill-amber-500" />
                        ) : null}
                      </h3>
                      <p className="text-xs text-muted-foreground min-h-[34px] leading-relaxed">
                        {plan.tagline}
                      </p>
                    </div>

                    {/* Price Block */}
                    <div className="mt-6 mb-6 pb-6 border-b border-border/60">
                      <div className="flex items-baseline gap-1.5">
                        <span className="font-display text-4xl sm:text-5xl font-black tracking-tight text-foreground font-mono">
                          {price.formatted.replace(` ${activeCurrencyConfig.symbol}`, "").replace(activeCurrencyConfig.symbol, "")}
                        </span>
                        <span className="text-lg font-bold text-foreground">
                          {activeCurrencyConfig.symbol}
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground font-medium mt-1">
                        Paiement unique {price.periodText} • Sans tacite reconduction
                      </div>
                    </div>

                    {/* Core Features */}
                    <ul className="space-y-3 text-xs text-foreground/90">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-2.5">
                          <div
                            className={`mt-0.5 rounded-full p-0.5 shrink-0 ${
                              isAnnual
                                ? "bg-amber-500/20 text-amber-500"
                                : isPopular
                                ? "bg-primary/20 text-primary"
                                : isVip
                                ? "bg-purple-500/20 text-purple-500"
                                : "bg-emerald-500/20 text-emerald-600"
                            }`}
                          >
                            <Check className="h-3 w-3 stroke-[3]" />
                          </div>
                          <span className="leading-snug">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Bottom CTA & Payment Method hints */}
                  <div className="mt-8 pt-6 border-t border-border/60 space-y-3">
                    <Button
                      asChild
                      size="lg"
                      className={`w-full font-bold shadow-md transition-all ${
                        isAnnual
                          ? "bg-gradient-to-r from-amber-500 to-orange-500 hover:opacity-90 text-white shadow-amber-500/25"
                          : isPopular
                          ? "bg-primary hover:bg-primary/90 text-primary-foreground shadow-primary/25"
                          : isVip
                          ? "bg-purple-600 hover:bg-purple-700 text-white shadow-purple-500/25"
                          : "bg-muted hover:bg-muted/80 text-foreground"
                      }`}
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
