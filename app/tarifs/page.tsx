import Link from "next/link";
import { Check, ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Tarifs & Formules — Super4C2 Préparation TCF Canada",
  description: "Des formules claires et transparentes pour réussir votre TCF Canada et décrocher le palier NCLC 7 (+50 points Entrée Express).",
};

export default function TarifsPage() {
  const plans = [
    {
      name: "Pass Sprint 15 Jours",
      price: "39",
      period: "accès pendant 15 jours",
      desc: "Idéal pour une révision intensive de dernière ligne droite avant le jour J.",
      highlight: false,
      features: [
        "Accès complet aux simulateurs CBT (CE & CO)",
        "10 évaluations d'Expression Écrite avec grille FEI",
        "5 entretiens d'Expression Orale avec IA interactive",
        "Carnet d'Erreurs intelligent (algorithme SRS)",
        "Calculateur d'impact CRS Entrée Express",
      ],
      cta: "Choisir le Pass Sprint",
      badge: null,
    },
    {
      name: "Pass 30 Jours Succès",
      price: "59",
      period: "accès pendant 30 jours",
      desc: "La formule la plus populaire pour valider sereinement le palier NCLC 7.",
      highlight: true,
      features: [
        "Tout le contenu du Pass Sprint",
        "Simulateurs CBT Compréhension Écrite & Orale illimités",
        "30 évaluations d'Expression Écrite avec Magic Rewrite C1/C2",
        "15 séances d'Expression Orale (Jeu de rôle Tâche 2 en direct)",
        "Analyse de débit de parole & suggestions lexicales poussées",
        "Support pédagogique prioritaire 7j/7",
      ],
      cta: "Décrocher mon NCLC 7",
      badge: "Recommandé — Meilleur Rapport Efficacité",
    },
    {
      name: "Pass VIP Garantie NCLC 7+",
      price: "99",
      period: "accès illimité 60 jours",
      desc: "Pour les candidats exigeants visant le score maximal en Entrée Express.",
      highlight: false,
      features: [
        "Accès illimité à l'intégralité de la plateforme pendant 60 jours",
        "Corrections d'Expression Écrite illimitées par IA",
        "Entretiens d'Expression Orale vocaux illimités",
        "Toutes les versions modèles Magic Rewrite C1/C2",
        "Diagnostic de départ personnalisé avec plan d'action ciblé",
        "Garantie satisfait ou réentraînement offert",
      ],
      cta: "Choisir le Pass VIP",
      badge: "Garantie Excellence",
    },
  ];

  return (
    <div className="space-y-12 py-6">
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-primary">
          Investissez dans votre Résidence Permanente au Canada
        </span>
        <h1 className="font-display text-3xl sm:text-5xl font-black tracking-tight">
          Des Tarifs Simples. Aucun Frais Caché.
        </h1>
        <p className="text-muted-foreground text-base leading-relaxed">
          Un test de langue officiel coûte plus de 300 $ CAD. Assurez-vous de le réussir du premier coup avec la seule plateforme qui intègre un vrai examinateur IA interactif.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3 max-w-7xl mx-auto items-stretch">
        {plans.map((p, idx) => (
          <div
            key={idx}
            className={`flex flex-col justify-between rounded-3xl border p-8 shadow-sm transition-all relative ${
              p.highlight
                ? "border-primary bg-card ring-2 ring-primary shadow-xl lg:-translate-y-2"
                : "border-border bg-card"
            }`}
          >
            {p.badge && (
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-[11px] font-bold text-primary-foreground shadow-sm whitespace-nowrap">
                {p.badge}
              </div>
            )}

            <div className="space-y-6">
              <div>
                <h2 className="font-display text-xl font-bold text-foreground">{p.name}</h2>
                <p className="text-xs text-muted-foreground mt-1 min-h-[32px]">{p.desc}</p>
              </div>

              <div className="flex items-baseline gap-1">
                <span className="font-display text-5xl font-black tracking-tight text-foreground">
                  {p.price}€
                </span>
                <span className="text-xs text-muted-foreground font-medium">/ {p.period}</span>
              </div>

              <ul className="space-y-3 text-xs text-foreground/90 pt-2 border-t">
                {p.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <Check className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-8 mt-6 border-t">
              <Button
                asChild
                size="lg"
                className={`w-full font-bold shadow-sm ${
                  p.highlight
                    ? "bg-[#E51A31] hover:bg-[#B31224] text-white"
                    : "bg-primary hover:bg-primary/90 text-primary-foreground"
                }`}
              >
                <Link href="/auth/register" className="flex items-center justify-center gap-2">
                  <span>{p.cta}</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Garantie */}
      <div className="max-w-2xl mx-auto rounded-2xl border bg-muted/30 p-6 text-center space-y-2">
        <div className="flex items-center justify-center gap-2 text-foreground font-bold text-sm">
          <ShieldCheck className="h-5 w-5 text-emerald-500" />
          <span>Paiement 100% Sécurisé & Accès Immédiat</span>
        </div>
        <p className="text-xs text-muted-foreground">
          Paiement par carte bancaire (Stripe) et Mobile Money international. Activation instantanée de vos crédits d&apos;évaluation IA dès validation.
        </p>
      </div>
    </div>
  );
}
