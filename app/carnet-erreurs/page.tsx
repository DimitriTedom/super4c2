import { SrsCarnet } from "@/components/dashboard/srs-carnet";

export const metadata = {
  title: "Carnet d'Erreurs Intelligent — Répétition Espacée SRS",
  description:
    "Révisez vos erreurs et pièges ratés lors de vos entraînements TCF Canada selon l'algorithme de répétition espacée (J+1, J+3, J+7) pour garantir le seuil NCLC 7.",
};

export default function CarnetErreursPage() {
  return (
    <div className="space-y-8 py-4">
      <div className="max-w-3xl space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-primary">
          Algorithme de Répétition Espacée (SRS)
        </span>
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight">
          Carnet d&apos;Erreurs & Maîtrise des Pièges
        </h1>
        <p className="text-muted-foreground text-base">
          Chaque question ou point de méthode manqué lors de vos simulations est automatiquement archivé ici et réapparaît à intervalles scientifiques (J+1, J+3, J+7) jusqu&apos;à ancrage définitif.
        </p>
      </div>

      <SrsCarnet />
    </div>
  );
}
