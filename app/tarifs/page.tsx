import { GeoPricingSection } from "@/components/pricing/geo-pricing-section";
import { CrsCalculator } from "@/components/nclc/crs-calculator";
import { FaqSection } from "@/components/faq-section";

export const metadata = {
  title: "Tarifs & Formules NCLC 7 — Super4C2 Préparation TCF Canada",
  description: "Des formules claires adaptées à votre région pour réussir votre TCF Canada et décrocher le palier NCLC 7 (+50 points Entrée Express). Franc CFA, EUR, CAD, USD.",
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
