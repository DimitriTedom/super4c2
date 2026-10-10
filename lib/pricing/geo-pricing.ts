// ============================================================================
// SUPER4C2 — GEO-PRICING & CURRENCY INTELLIGENCE ENGINE
// ============================================================================
// Detects user country & displays localized single currency (FCFA, EUR, CAD, USD).
// Powered by SasPay (https://saspay.me) for Africa & Stripe for international.
// Eliminates cluttered multi-currency pricing cards.
// ============================================================================

export type SupportedCurrency = "XAF" | "EUR" | "CAD" | "USD";

export interface CurrencyConfig {
  code: SupportedCurrency;
  symbol: string;
  label: string;
  flag: string;
  locale: string;
  defaultCountry: string;
  paymentGateway: "saspay" | "stripe";
}

export const SUPPORTED_CURRENCIES: Record<SupportedCurrency, CurrencyConfig> = {
  XAF: {
    code: "XAF",
    symbol: "FCFA",
    label: "Franc CFA (Afrique Centrale & Ouest)",
    flag: "🇨🇲",
    locale: "fr-CM",
    defaultCountry: "Cameroun & Zone Franc",
    paymentGateway: "saspay", // SasPay Mobile Money (MTN MoMo, Orange Money, Wave, Moov)
  },
  EUR: {
    code: "EUR",
    symbol: "€",
    label: "Euro (France & Europe)",
    flag: "🇫🇷",
    locale: "fr-FR",
    defaultCountry: "France & Union Européenne",
    paymentGateway: "stripe",
  },
  CAD: {
    code: "CAD",
    symbol: "$ CAD",
    label: "Dollar Canadien (Canada)",
    flag: "🇨🇦",
    locale: "fr-CA",
    defaultCountry: "Canada",
    paymentGateway: "stripe",
  },
  USD: {
    code: "USD",
    symbol: "$ USD",
    label: "Dollar US (International)",
    flag: "🌐",
    locale: "en-US",
    defaultCountry: "International",
    paymentGateway: "stripe",
  },
};

export interface PlanPricing {
  amount: number;
  formatted: string;
  periodText: string;
}

export interface PricingPlan {
  id: "sprint_7d" | "intensif_15d" | "succes_30d" | "vip_60d" | "annuel_365d";
  name: string;
  durationDays: number;
  tagline: string;
  popular?: boolean;
  vip?: boolean;
  annual?: boolean;
  prices: Record<SupportedCurrency, PlanPricing>;
  features: string[];
  limits: {
    cbtSimulationCount: string;
    writtenEvalCount: string;
    oralEvalCount: string;
    srsVaultAccess: boolean;
    nclcGuarantee: boolean;
  };
}

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: "sprint_7d",
    name: "Pass Sprint 7 Jours",
    durationDays: 7,
    tagline: "Diagnostic express & révision d'urgence pour candidats prêts.",
    prices: {
      XAF: { amount: 5000, formatted: "5 000 FCFA", periodText: "pour 7 jours" },
      EUR: { amount: 7.99, formatted: "7,99 €", periodText: "pour 7 jours" },
      CAD: { amount: 12, formatted: "12 $ CAD", periodText: "pour 7 jours" },
      USD: { amount: 9, formatted: "9 $ USD", periodText: "pour 7 jours" },
    },
    features: [
      "Accès aux séries officielles CBT (Compréhension Écrite & Orale)",
      "3 évaluations d'Expression Écrite avec grille FEI officielle",
      "2 simulations orales avec examinateur IA interactif",
      "Carnet d'Erreurs intelligent (Spaced Repetition de base)",
      "Chronomètre réel & conditions officielles France Éducation International",
    ],
    limits: {
      cbtSimulationCount: "5 examens complets",
      writtenEvalCount: "3 copies corrigées",
      oralEvalCount: "2 simulations vocales",
      srsVaultAccess: true,
      nclcGuarantee: false,
    },
  },
  {
    id: "intensif_15d",
    name: "Pass Intensif 15 Jours",
    durationDays: 15,
    tagline: "Entraînement ciblé pour combler ses lacunes avant le test.",
    prices: {
      XAF: { amount: 10000, formatted: "10 000 FCFA", periodText: "pour 15 jours" },
      EUR: { amount: 15.99, formatted: "15,99 €", periodText: "pour 15 jours" },
      CAD: { amount: 23, formatted: "23 $ CAD", periodText: "pour 15 jours" },
      USD: { amount: 17, formatted: "17 $ USD", periodText: "pour 15 jours" },
    },
    features: [
      "Tout le contenu du Pass Sprint",
      "Accès à 15 séries CBT officielles inédites",
      "10 évaluations d'Expression Écrite avec Magic Rewrite C1/C2",
      "6 séances d'Expression Orale (Jeu de rôle Tâche 2 & Dialogue Tâche 3)",
      "Carnet d'Erreurs SRS illimité (J+1, J+3, J+7)",
      "Support candidat sous 24h",
    ],
    limits: {
      cbtSimulationCount: "15 examens complets",
      writtenEvalCount: "10 copies corrigées",
      oralEvalCount: "6 simulations vocales",
      srsVaultAccess: true,
      nclcGuarantee: false,
    },
  },
  {
    id: "succes_30d",
    name: "Pass 30 Jours Succès NCLC 7",
    durationDays: 30,
    tagline: "La formule de référence pour garantir vos +50 points Entrée Express.",
    popular: true,
    prices: {
      XAF: { amount: 15000, formatted: "15 000 FCFA", periodText: "pour 30 jours" },
      EUR: { amount: 22.99, formatted: "22,99 €", periodText: "pour 30 jours" },
      CAD: { amount: 34, formatted: "34 $ CAD", periodText: "pour 30 jours" },
      USD: { amount: 25, formatted: "25 $ USD", periodText: "pour 30 jours" },
    },
    features: [
      "Simulateurs CBT illimités (CE & CO, TCF Canada & IELTS)",
      "3 Examens Blancs Complets chronométrés 4 épreuves avec relevé agrégé",
      "25 évaluations d'Expression Écrite avec Magic Rewrite C1/C2",
      "15 entretiens d'Expression Orale IA avec analyse de débit & intonation",
      "Carnet d'Erreurs automatisé & révisions ciblées Ebbinghaus",
      "Calculateur d'impact CRS Entrée Express & dossier IRCC",
      "Accès au Cercle VIP Super4C2 (partage d'astuces candidats)",
    ],
    limits: {
      cbtSimulationCount: "Illimité",
      writtenEvalCount: "25 copies corrigées",
      oralEvalCount: "15 simulations vocales",
      srsVaultAccess: true,
      nclcGuarantee: true,
    },
  },
  {
    id: "vip_60d",
    name: "Pass VIP 60 Jours Garantie",
    durationDays: 60,
    tagline: "Préparation d'élite avec accompagnement intensif et garantie résultat.",
    vip: true,
    prices: {
      XAF: { amount: 25000, formatted: "25 000 FCFA", periodText: "pour 60 jours" },
      EUR: { amount: 38.99, formatted: "38,99 €", periodText: "pour 60 jours" },
      CAD: { amount: 58, formatted: "58 $ CAD", periodText: "pour 60 jours" },
      USD: { amount: 42, formatted: "42 $ USD", periodText: "pour 60 jours" },
    },
    features: [
      "Accès TOTAL & ILLIMITÉ à toute la plateforme pendant 60 jours",
      "Examens Blancs Complets illimités avec conditions d'audience réelles",
      "Corrections d'Expression Écrite illimitées",
      "Entretiens oraux vocaux illimités (Tâche 1, 2, 3)",
      "Toutes les versions modèles Magic Rewrite C1/C2 débloquées",
      "Diagnostic personnalisé individuel avec plan d'action hebdomadaire",
      "Garantie NCLC 7 : Prolongation gratuite de 30 jours si palier non atteint",
    ],
    limits: {
      cbtSimulationCount: "Illimité",
      writtenEvalCount: "Illimité",
      oralEvalCount: "Illimité",
      srsVaultAccess: true,
      nclcGuarantee: true,
    },
  },
  {
    id: "annuel_365d",
    name: "Pass Immigrant 1 An (365 Jours)",
    durationDays: 365,
    tagline: "Sérénité absolue pour tout votre parcours d'immigration (TCF + TEF + IELTS).",
    annual: true,
    prices: {
      XAF: { amount: 60000, formatted: "60 000 FCFA", periodText: "pour 1 an (5 000 F/mois)" },
      EUR: { amount: 89.99, formatted: "89,99 €", periodText: "pour 1 an (7,50 €/mois)" },
      CAD: { amount: 129, formatted: "129 $ CAD", periodText: "pour 1 an (10,75 $/mois)" },
      USD: { amount: 95, formatted: "95 $ USD", periodText: "pour 1 an (7,90 $/mois)" },
    },
    features: [
      "Accès TOTAL & ILLIMITÉ 365 jours à TOUS les examens (TCF Canada, TEF Canada, IELTS)",
      "Toutes les nouvelles séries officielles ajoutées chaque semaine pendant 1 an",
      "Examens Blancs Complets illimités (repassages sans limite)",
      "Corrections IA illimitées d'Expression Écrite & simulateur d'audience orale illimité",
      "Carnet d'Erreurs SRS permanent avec consolidation mémorielle sur 1 an",
      "Assurance Repassage : Valable pour plusieurs tentatives officielles si nécessaire",
      "Support VIP direct avec les concepteurs pédagogiques",
    ],
    limits: {
      cbtSimulationCount: "Illimité 365j",
      writtenEvalCount: "Illimité 365j",
      oralEvalCount: "Illimité 365j",
      srsVaultAccess: true,
      nclcGuarantee: true,
    },
  },
];

// Mapping of country codes to currencies
const COUNTRY_TO_CURRENCY: Record<string, SupportedCurrency> = {
  // Franc CFA (Zone CEMAC & UEMOA)
  CM: "XAF",
  CI: "XAF",
  SN: "XAF",
  GA: "XAF",
  CG: "XAF",
  CD: "XAF",
  BJ: "XAF",
  TG: "XAF",
  BF: "XAF",
  NE: "XAF",
  ML: "XAF",
  TD: "XAF",
  CF: "XAF",
  GQ: "XAF",
  GN: "XAF",
  MG: "XAF",

  // Europe (EUR)
  FR: "EUR",
  BE: "EUR",
  CH: "EUR",
  DE: "EUR",
  IT: "EUR",
  ES: "EUR",
  PT: "EUR",
  LU: "EUR",
  NL: "EUR",

  // Canada
  CA: "CAD",

  // USA & Rest of World
  US: "USD",
  GB: "USD",
  MA: "USD",
  DZ: "USD",
  TN: "USD",
};

/**
 * Detects currency from country code (e.g. from Vercel / Cloudflare header)
 */
export function getCurrencyForCountry(countryCode?: string | null): SupportedCurrency {
  if (!countryCode) return "EUR";
  const upper = countryCode.toUpperCase().trim();
  return COUNTRY_TO_CURRENCY[upper] || "USD";
}

/**
 * Client-side heuristic using browser timezone when server header is not present
 */
export function detectClientCurrency(): SupportedCurrency {
  if (typeof window === "undefined") return "EUR";

  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";

    // African timezones
    if (
      tz.includes("Douala") ||
      tz.includes("Abidjan") ||
      tz.includes("Dakar") ||
      tz.includes("Lagos") ||
      tz.includes("Kinshasa") ||
      tz.includes("Brazzaville") ||
      tz.includes("Libreville") ||
      tz.includes("Yaounde") ||
      tz.includes("Cotonou") ||
      tz.includes("Lome") ||
      tz.includes("Ouagadougou") ||
      tz.includes("Bamako") ||
      tz.includes("Niamey") ||
      tz.includes("Ndjamena")
    ) {
      return "XAF";
    }

    // Canadian timezones
    if (
      tz.includes("Toronto") ||
      tz.includes("Montreal") ||
      tz.includes("Vancouver") ||
      tz.includes("Edmonton") ||
      tz.includes("Winnipeg") ||
      tz.includes("Halifax") ||
      tz.includes("Canada")
    ) {
      return "CAD";
    }

    // European timezones
    if (
      tz.includes("Paris") ||
      tz.includes("Brussels") ||
      tz.includes("Berlin") ||
      tz.includes("Madrid") ||
      tz.includes("Rome") ||
      tz.includes("Amsterdam") ||
      tz.includes("Zurich") ||
      tz.includes("Europe")
    ) {
      return "EUR";
    }
  } catch {
    // fallback
  }

  return "USD";
}
