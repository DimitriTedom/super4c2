import { CrsCalculator } from "@/components/nclc/crs-calculator";

export const metadata = {
  title: "Simulateur de Points CRS Entrée Express — Calculateur NCLC 7+",
  description:
    "Calculez en temps réel l'impact de vos résultats TCF / TEF Canada sur votre score global CRS d'Entrée Express. Découvrez comment débloquer jusqu'à +50 points bonus francophone.",
};

export default function NclcCalculatorPage() {
  return (
    <div className="space-y-10 py-4">
      <div className="max-w-3xl space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-primary">
          Simulateur Officiel Entrée Express Canada (IRCC)
        </span>
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight">
          Simulateur de Points CRS & Niveaux NCLC
        </h1>
        <p className="text-muted-foreground text-base leading-relaxed">
          Le seuil <strong>NCLC 7 (niveau B2 avancé)</strong> dans les 4 épreuves du TCF Canada est le déclencheur de points le plus puissant pour votre dossier d&apos;immigration permanente. Testez différents scénarios et découvrez la valeur exacte de chaque palier.
        </p>
      </div>

      <CrsCalculator />
    </div>
  );
}
