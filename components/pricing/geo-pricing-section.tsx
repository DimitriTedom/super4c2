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
  HelpCircle,
  CreditCard,
  Smartphone,
  ArrowRight,
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

export function GeoPricingSection({ initialCurrency }: GeoPricingSectionProps) {
  const [currency, setCurrency] = React.useState<SupportedCurrency>(initialCurrency || "EUR");
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
  const [selectedPlanId, setSelectedPlanId] = React.useState<string>("succes_30d");

  // Client-side auto-detection on mount if no initialCurrency provided
  React.useEffect(() => {
    if (!initialCurrency) {
      const detected = detectClientCurrency();
      setCurrency(detected);
    }
  }, [initialCurrency]);

  const activeCurrencyConfig = SUPPORTED_CURRENCIES[currency];

  return (
    <section className="relative overflow-hidden py-12 lg:py-20">
      {/* Background radial glow */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-40">
        <div className="h-[600px] w-[900px] rounded-full bg-gradient-to-tr from-primary/20 via-sky-500/10 to-indigo-500/20 blur-3xl" />
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
            Validez votre palier <strong className="text-primary font-semibold">NCLC 7 (+50 pts CRS)</strong> sans reprendre le test une deuxième fois.
          </p>

          {/* Geo-Currency Intelligence Bar */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <div className="inline-flex items-center gap-2.5 rounded-2xl border border-border/80 bg-background/80 px-4 py-2 text-xs font-medium text-foreground shadow-sm backdrop-blur-md">
              <span className="text-base">{activeCurrencyConfig.flag}</span>
              <span className="text-muted-foreground">Tarif détecté pour votre région :</span>
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
        </div>

        {/* Pricing Cards Grid (4 Tiers) */}
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4 max-w-7xl mx-auto items-stretch">
          {PRICING_PLANS.map((plan: PricingPlan) => {
            const price = plan.prices[currency];
            const isPopular = plan.popular;
            const isVip = plan.vip;

            return (
              <motion.div
                key={plan.id}
                whileHover={{ y: -6 }}
                transition={{ duration: 0.2 }}
                onClick={() => setSelectedPlanId(plan.id)}
                className={`relative flex flex-col justify-between rounded-3xl border p-6 sm:p-7 shadow-sm transition-all cursor-pointer ${
                  isPopular
                    ? "border-primary bg-card ring-2 ring-primary/80 shadow-2xl shadow-primary/10"
                    : isVip
                    ? "border-amber-500/50 bg-gradient-to-b from-card via-card to-amber-500/5 ring-1 ring-amber-500/30"
                    : "border-border/80 bg-card hover:border-border"
                }`}
              >
                {/* Popular Badge */}
                {isPopular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-primary to-indigo-600 px-4 py-1 text-[11px] font-black uppercase tracking-wider text-white shadow-lg shadow-primary/30 whitespace-nowrap">
                    ⭐ Choix N°1 des Candidats
                  </div>
                )}

                {/* VIP Badge */}
                {isVip && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-1 text-[11px] font-black uppercase tracking-wider text-white shadow-lg shadow-amber-500/30 whitespace-nowrap">
                    🏆 Garantie Réussite NCLC 7
                  </div>
                )}

                <div>
                  {/* Plan Title & Tagline */}
                  <div className="space-y-1">
                    <h3 className="font-display text-lg font-bold text-foreground flex items-center justify-between">
                      <span>{plan.name}</span>
                      {isPopular && <Zap className="h-4 w-4 text-primary fill-primary" />}
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
                            isPopular
                              ? "bg-primary/20 text-primary"
                              : isVip
                              ? "bg-amber-500/20 text-amber-500"
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
                      isPopular
                        ? "bg-primary hover:bg-primary/90 text-primary-foreground shadow-primary/25"
                        : isVip
                        ? "bg-gradient-to-r from-amber-500 to-orange-500 hover:opacity-90 text-white shadow-amber-500/25"
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
                        <span>MTN MoMo, Orange Money, Wave acceptés</span>
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

        {/* Reassurance & Guarantee Strip */}
        <div className="mt-16 mx-auto max-w-4xl rounded-3xl border border-border bg-card/60 p-6 sm:p-8 backdrop-blur-md shadow-sm">
          <div className="grid gap-6 sm:grid-cols-3 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3">
              <div className="rounded-2xl bg-emerald-500/10 p-3 text-emerald-500 shrink-0">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-foreground">Paiement 100% Sécurisé</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  Chiffrement SSL 256 bits via Stripe et CinetPay. Données bancaires jamais stockées.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3">
              <div className="rounded-2xl bg-primary/10 p-3 text-primary shrink-0">
                <Zap className="h-6 w-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-foreground">Activation Immédiate</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  Accès instantané à toutes les séries d'examens dès la confirmation du paiement.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3">
              <div className="rounded-2xl bg-amber-500/10 p-3 text-amber-500 shrink-0">
                <Sparkles className="h-6 w-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-foreground">Aucun Renouvellement Forcé</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  Pas de tacite reconduction cachée. Vous payez uniquement pour la durée de révision choisie.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
