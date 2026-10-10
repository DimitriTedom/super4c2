"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  Lock,
  ArrowRight,
  CheckCircle2,
  Smartphone,
  CreditCard,
  Crown,
  ChevronLeft,
  Sparkles,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  PRICING_PLANS,
  SUPPORTED_CURRENCIES,
  SupportedCurrency,
  PricingPlan,
} from "@/lib/pricing/geo-pricing";

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const planId = searchParams.get("plan") || "intensif_15d";
  const currencyParam = (searchParams.get("currency") as SupportedCurrency) || "XAF";

  const plan: PricingPlan =
    PRICING_PLANS.find((p) => p.id === planId) ||
    PRICING_PLANS.find((p) => p.id === "succes_30d") ||
    PRICING_PLANS[0];

  const currencyConfig = SUPPORTED_CURRENCIES[currencyParam] || SUPPORTED_CURRENCIES["XAF"];
  const price = plan.prices[currencyConfig.code];

  const [fullName, setFullName] = React.useState("Dimitri Candidat");
  const [email, setEmail] = React.useState("candidat@super4c2.com");
  const [phone, setPhone] = React.useState("+237 6 99 00 11 22");
  const [paymentMethod, setPaymentMethod] = React.useState<"saspay" | "card">(
    currencyConfig.code === "XAF" ? "saspay" : "card"
  );
  const [isLoading, setIsLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/billing/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planId: plan.id,
          currency: currencyConfig.code,
          customerName: fullName,
          customerEmail: email,
          customerPhone: phone,
          paymentMethod,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Une erreur est survenue lors de l'initialisation.");
      }

      if (data.checkoutUrl) {
        if (data.checkoutUrl.startsWith("http")) {
          window.location.href = data.checkoutUrl;
        } else {
          router.push(data.checkoutUrl);
        }
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Erreur de paiement. Veuillez réessayer.";
      setErrorMessage(message);
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 sm:py-12 max-w-5xl">
      {/* Back button */}
      <div className="mb-6">
        <Button asChild variant="ghost" size="sm" className="gap-1.5 text-muted-foreground">
          <Link href="/tarifs">
            <ChevronLeft className="h-4 w-4" />
            <span>Retour aux forfaits</span>
          </Link>
        </Button>
      </div>

      <div className="grid gap-8 lg:grid-cols-12 items-start">
        {/* Left Form: Details & Payment Method (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              Étape Finale Sécurisée
            </span>
            <h1 className="font-display text-2xl sm:text-3xl font-black text-foreground">
              Finaliser votre Inscription
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Accès immédiat débloqué dès validation de la transaction.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Candidate Identity */}
            <div className="rounded-3xl border border-border bg-card p-6 space-y-4 shadow-sm">
              <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-xs text-primary font-bold">
                  1
                </span>
                <span>Coordonnées du Candidat</span>
              </h2>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor="fullname" className="text-xs">
                    Nom & Prénom (identique à votre passeport)
                  </Label>
                  <Input
                    id="fullname"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    placeholder="ex. Jean Dupont"
                    className="h-10 text-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-xs">
                    Adresse E-mail (accès plateforme)
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="candidat@email.com"
                    className="h-10 text-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="phone" className="text-xs">
                    Numéro de Téléphone (Mobile Money / SMS)
                  </Label>
                  <Input
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    placeholder="+237 6..."
                    className="h-10 text-sm font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Payment Gateway Selector */}
            <div className="rounded-3xl border border-border bg-card p-6 space-y-4 shadow-sm">
              <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-xs text-primary font-bold">
                  2
                </span>
                <span>Mode de Règlement Sécurisé</span>
              </h2>

              <div className="grid gap-3 sm:grid-cols-2">
                {/* SasPay Mobile Money */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod("saspay")}
                  className={`flex flex-col items-start justify-between rounded-2xl border p-4 text-left transition-all ${
                    paymentMethod === "saspay"
                      ? "border-primary bg-primary/5 ring-2 ring-primary/60 shadow-sm"
                      : "border-border hover:border-border/80 bg-background"
                  }`}
                >
                  <div className="flex w-full items-center justify-between">
                    <span className="flex items-center gap-2 font-bold text-sm text-foreground">
                      <Smartphone className="h-4 w-4 text-emerald-500" />
                      <span>Mobile Money</span>
                    </span>
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600">
                      SasPay
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-2 leading-relaxed">
                    MTN MoMo, Orange Money, Wave, Moov. Push USSD direct sur votre téléphone.
                  </p>
                </button>

                {/* International Cards / Stripe */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod("card")}
                  className={`flex flex-col items-start justify-between rounded-2xl border p-4 text-left transition-all ${
                    paymentMethod === "card"
                      ? "border-primary bg-primary/5 ring-2 ring-primary/60 shadow-sm"
                      : "border-border hover:border-border/80 bg-background"
                  }`}
                >
                  <div className="flex w-full items-center justify-between">
                    <span className="flex items-center gap-2 font-bold text-sm text-foreground">
                      <CreditCard className="h-4 w-4 text-sky-500" />
                      <span>Carte Bancaire</span>
                    </span>
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-600">
                      Stripe
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-2 leading-relaxed">
                    Visa, Mastercard, Apple Pay, Google Pay. Chiffrement bancaire international.
                  </p>
                </button>
              </div>

              {errorMessage && (
                <div className="rounded-xl bg-destructive/10 border border-destructive/20 p-3 text-xs text-destructive font-medium">
                  {errorMessage}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="space-y-3">
              <Button
                type="submit"
                size="lg"
                loading={isLoading}
                loadingText="Initialisation de la passerelle..."
                className="w-full text-base font-black bg-gradient-to-r from-primary to-indigo-600 hover:opacity-95 text-white shadow-lg shadow-primary/25 h-12"
              >
                <span>Confirmer & Payer {price.formatted}</span>
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>

              <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground text-center">
                <Lock className="h-3.5 w-3.5 text-emerald-500" />
                <span>Transaction chiffrée SSL 256-bit • Activation automatique en temps réel</span>
              </div>
            </div>
          </form>
        </div>

        {/* Right Summary Card (5 cols) */}
        <div className="lg:col-span-5">
          <div className="rounded-3xl border border-border bg-card p-6 sm:p-7 space-y-6 shadow-md sticky top-24">
            <div className="flex items-start justify-between border-b border-border/80 pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Récapitulatif de la commande
                </span>
                <h3 className="font-display text-lg font-bold text-foreground mt-0.5 flex items-center gap-1.5">
                  {plan.annual && <Crown className="h-4 w-4 text-amber-500 fill-amber-500" />}
                  <span>{plan.name}</span>
                </h3>
              </div>
              <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary">
                {plan.durationDays} Jours
              </span>
            </div>

            {/* Price display */}
            <div className="space-y-1">
              <div className="flex items-baseline justify-between">
                <span className="text-xs text-muted-foreground">Tarif Régional ({currencyConfig.flag} {currencyConfig.code}) :</span>
                <span className="font-display text-2xl sm:text-3xl font-black text-foreground font-mono">
                  {price.formatted}
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground">
                Paiement unique • Sans engagement • Aucun prélèvement automatique masqué
              </p>
            </div>

            {/* Inclusions */}
            <div className="space-y-3 pt-4 border-t border-border/80">
              <span className="text-xs font-bold text-foreground">Inclus dans votre accès :</span>
              <ul className="space-y-2 text-xs text-foreground/90">
                {plan.features.slice(0, 5).map((f, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="leading-tight">{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Guarantee note */}
            <div className="rounded-2xl border border-border/80 bg-background/50 p-4 flex items-start gap-3">
              <ShieldCheck className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
              <div className="text-xs text-muted-foreground leading-relaxed">
                <strong className="text-foreground font-semibold">Garantie Réussite NCLC 7 :</strong>{" "}
                Accompagnement rigoureux aux normes de France Éducation International (+50 pts Entrée Express).
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <React.Suspense
      fallback={
        <div className="container mx-auto px-4 py-20 text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="mt-4 text-sm text-muted-foreground">Chargement de votre commande sécurisée...</p>
        </div>
      }
    >
      <CheckoutContent />
    </React.Suspense>
  );
}
