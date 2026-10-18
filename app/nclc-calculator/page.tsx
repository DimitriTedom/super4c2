import Image from "next/image";
import { CrsCalculator } from "@/components/nclc/crs-calculator";

export const metadata = {
  title: "Simulateur de Points CRS Entrée Express — Calculateur NCLC 7+",
  description:
    "Calculez en temps réel l'impact de vos résultats TCF / TEF Canada sur votre score global CRS d'Entrée Express. Découvrez comment débloquer jusqu'à +50 points bonus francophone.",
};

export default function NclcCalculatorPage() {
  return (
    <div className="space-y-10 py-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b pb-6">
        <div className="max-w-3xl space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-primary">
            Calculateur Conforme aux Barèmes IRCC (Entrée Express)
          </span>
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight">
            Simulateur de Points CRS & Niveaux NCLC
          </h1>
          <p className="text-muted-foreground text-base leading-relaxed">
            Le seuil <strong>NCLC 7 (niveau B2 avancé)</strong> dans les 4 épreuves du TCF Canada est le déclencheur de points le plus puissant pour votre dossier d&apos;immigration permanente. Testez différents scénarios et découvrez la valeur exacte de chaque palier.
          </p>
        </div>
        <div className="shrink-0 flex items-center justify-center p-2 rounded-3xl bg-amber-500/5 border border-amber-500/20 shadow-md">
          <Image
            src="/brand/icons-3d/crs-calculator-compass.png"
            alt="Calculateur CRS 3D +50 Points"
            width={96}
            height={96}
            className="h-24 w-24 object-contain drop-shadow-md"
            priority
          />
        </div>
      </div>

      <CrsCalculator />
    </div>
  );
}
