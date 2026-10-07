import Link from "next/link";
import { ArrowLeft, Scale } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Mentions Légales & Conditions Générales d'Utilisation — Super4C2",
  description:
    "Mentions légales, conditions d'utilisation et cadre d'entraînement de la plateforme Super4C2.",
};

export default function MentionsLegalesPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-8 py-6">
      <div className="space-y-2">
        <Button variant="ghost" size="sm" asChild className="mb-2">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" /> Retour à l&apos;accueil
          </Link>
        </Button>
        <span className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
          <Scale className="h-4 w-4" /> Cadre Réglementaire
        </span>
        <h1 className="font-display text-3xl font-extrabold tracking-tight">
          Mentions Légales & Conditions d&apos;Utilisation
        </h1>
        <p className="text-sm text-muted-foreground">
          Dernière mise à jour : 1er octobre 2026.
        </p>
      </div>

      <div className="space-y-6 text-sm text-foreground/90 leading-relaxed rounded-3xl border bg-card p-6 sm:p-8">
        <section className="space-y-2">
          <h2 className="font-display text-lg font-bold text-foreground">1. Éditeur de la Plateforme</h2>
          <p>
            La plateforme <strong>Super4C2</strong> est un service numérique spécialisé dans la préparation et le perfectionnement linguistique pour les examens TCF Canada et TEF Canada.
          </p>
          <p className="text-muted-foreground text-xs">
            Directeur de la publication et responsable technique : Dimitri Tedom.
            Contact support : <a href="mailto:contact@super4c2.com" className="text-primary underline">contact@super4c2.com</a>.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-lg font-bold text-foreground">2. Hébergement & Données</h2>
          <p>
            L&apos;infrastructure de Super4C2 est hébergée sur des serveurs sécurisés haute disponibilité situés dans l&apos;Union Européenne et au Canada, bénéficiant des normes de sécurité de pointe (chiffrement TLS 1.3, sauvegardes continues).
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-lg font-bold text-foreground">3. Propriété Intellectuelle & Indépendance</h2>
          <p>
            <strong>TCF (Test de Connaissance du Français)</strong> est une marque déposée de <em>France Éducation International (FEI)</em>, établissement public sous tutelle du Ministère français de l&apos;Éducation Nationale.
          </p>
          <p>
            <strong>TEF (Test d&apos;Évaluation de Français)</strong> est une marque déposée de la <em>Chambre de Commerce et d&apos;Industrie de Paris Île-de-France (CCI Paris Île-de-France)</em>.
          </p>
          <p className="rounded-xl border border-primary/20 bg-primary/5 p-4 text-xs text-muted-foreground">
            <strong>Avis officiel :</strong> Super4C2 est une solution d&apos;entraînement pédagogique indépendante. La plateforme n&apos;est ni affiliée, ni agréée, ni sponsorisée par FEI ou la CCI Paris Île-de-France. Les exercices et simulations proposés sont conçus par notre équipe pédagogique selon les spécifications publiques des examens.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-lg font-bold text-foreground">4. Utilisation du Service & Abonnements</h2>
          <p>
            L&apos;accès aux simulations CBT et aux fonctionnalités d&apos;évaluation IA est personnel, individuel et non transférable. Le partage d&apos;identifiants entre plusieurs candidats est strictement interdit afin de préserver l&apos;intégrité des algorithmes de répétition espacée (SRS) et le suivi des scores.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-lg font-bold text-foreground">5. Garantie Pédagogique & Responsabilité</h2>
          <p>
            Super4C2 fournit tous les outils méthodologiques nécessaires pour maximiser les chances de réussite au palier NCLC 7. Toutefois, l&apos;obtention de la certification finale dépend exclusivement de la performance réelle du candidat lors de sa session en centre d&apos;examen agréé.
          </p>
        </section>
      </div>
    </div>
  );
}
