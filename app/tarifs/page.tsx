import { GeoPricingSection } from "@/components/pricing/geo-pricing-section";
import { CrsCalculator } from "@/components/nclc/crs-calculator";
import { FaqSection } from "@/components/faq-section";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tarifs & Formules NCLC 7 / CLB 9 — Super4C2 Préparation TCF & IELTS",
  description:
    "Formules d'entraînement officielles TCF Canada, TEF et IELTS avec tarification géolocalisée (FCFA, EUR, CAD, USD) et paiement Mobile Money sécurisé SasPay.",
  openGraph: {
    title: "Tarifs & Formules NCLC 7 / CLB 9 | Super4C2",
    description:
      "Des formules claires pour réussir votre TCF Canada et décrocher le palier NCLC 7 (+50 points Entrée Express) et CLB 9. Accès illimité aux simulateurs CBT officiels.",
    images: ["/brand/og-image-super4c2.jpg"],
  },
};

export default function TarifsPage() {
  return (
    <div className="space-y-16 py-4">
      {/* Dynamic Geo-Pricing Section */}
      <GeoPricingSection />

      {/* CRS Score Simulator anchor */}
      <div className="container mx-auto px-4 sm:px-6">
        <CrsCalculator />
      </div>

      {/* FAQ Section */}
      <div className="container mx-auto px-4 sm:px-6">
        <FaqSection />
      </div>
    </div>
  );
}
