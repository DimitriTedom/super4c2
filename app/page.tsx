import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Mic,
  BookOpenText,
  Headphones,
  PenTool,
} from "lucide-react";
import InteractiveGridPattern from "@/components/ui/interactive-grid-pattern";
import NumberTicker from "@/components/ui/number-ticker";
import { Button } from "@/components/ui/button";
import { Globe } from "@/components/ui/globe";

export const metadata = {
  title: "Super4C2 — Réussir le TCF Canada & Décrocher NCLC 7+ (+50 pts CRS)",
  description:
    "La première plateforme d'entraînement au TCF Canada avec simulateur officiel CBT, correcteur IA instantané FEI et examinateur vocal interactif en jeu de rôle.",
};

export default function HomePage() {
  return (
    <div className="space-y-24 py-4 overflow-hidden">
      {/* 🌟 HERO SECTION AVEC LE GLOBE POSITIONNÉ EN BAS AU CENTRE */}
      <section className="relative overflow-hidden rounded-3xl border bg-card p-8 sm:p-14 lg:p-20 shadow-xl">
        <InteractiveGridPattern
          cellSize={40}
          interactive
          className="opacity-40"
        />

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-bold text-primary">
            <Sparkles className="h-4 w-4" />
            <span>La Révolution de l&apos;Entraînement TCF & TEF Canada</span>
          </div>

          <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.08] text-foreground text-balance">
            Décrochez vos <span className="text-[#E51A31] underline decoration-[#E51A31]/30">4 C2</span> et Débloquez les{" "}
            <span className="text-cyan-600 dark:text-cyan-400">+50 Points</span> d&apos;Entrée Express.
          </h1>

          <p className="font-body text-base sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed text-balance">
            Fini le scroll interminable et les corrections humaines qui tardent 24h. Entraînez-vous dans les <strong>conditions réelles de l&apos;examen officiel CBT</strong> avec un examinateur vocal IA interactif en jeu de rôle.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Button
              asChild
              size="lg"
              className="w-full sm:w-auto bg-[#E51A31] hover:bg-[#B31224] text-white font-bold text-base px-8 h-13 shadow-lg hover:shadow-xl transition-all"
            >
              <Link href="/examens" className="flex items-center gap-2">
                <span>Faire une simulation d&apos;examen</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>

            <Button asChild variant="outline" size="lg" className="w-full sm:w-auto font-medium text-base h-13">
              <Link href="/nclc-calculator">Calculer mes points CRS Canada</Link>
            </Button>
          </div>

          {/* 🌍 LE GLOBE POSITIONNÉ EN BAS AU CENTRE */}
          <div className="relative mx-auto -mt-6 sm:-mt-10 max-w-2xl w-full flex items-center justify-center pointer-events-auto">
            <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-card via-card/80 to-transparent z-10 pointer-events-none" />
            <Globe className="w-full max-w-[520px] aspect-square" />
          </div>

          {/* Statistiques clés */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-border/60 relative z-20">
            <div className="text-center">
              <p className="font-display text-3xl sm:text-4xl font-black text-foreground">
                <NumberTicker value={50} />
                <span className="text-primary font-bold">+</span>
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">Points CRS Débloqués</p>
            </div>

            <div className="text-center">
              <p className="font-display text-3xl sm:text-4xl font-black text-emerald-600 dark:text-emerald-400">
                <NumberTicker value={100} />%
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">Format Conforme CBT FEI</p>
            </div>

            <div className="text-center">
              <p className="font-display text-3xl sm:text-4xl font-black text-foreground">
                0<span className="text-xs font-normal"> sec</span>
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">Correction IA Instantanée</p>
            </div>

            <div className="text-center">
              <p className="font-display text-3xl sm:text-4xl font-black text-cyan-600 dark:text-cyan-400">
                NCLC 7<span className="text-xs font-normal"> à 10</span>
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">Objectif B2 / C1 / C2</p>
            </div>
          </div>
        </div>
      </section>

      {/* ⚔️ COMPARATIF CHOC : SUPER4C2 VS OBJECTIF CANADA */}
      <section className="space-y-8 max-w-5xl mx-auto">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-primary">
            La Différence Technologique
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight">
            Pourquoi Super4C2 surpasse les méthodes traditionnelles
          </h2>
          <p className="text-sm text-muted-foreground max-w-xl mx-auto">
            Nous avons audité les leaders du marché pour éliminer toutes leurs faiblesses.
          </p>
        </div>

        <div className="rounded-3xl border bg-card overflow-hidden shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x">
            {/* Colonne Mauvaises Pratiques (Objectif Canada) */}
            <div className="p-8 space-y-6 bg-red-500/5">
              <div className="flex items-center gap-2 text-red-600 dark:text-red-400 font-display font-bold text-lg">
                <XCircle className="h-6 w-6" />
                <span>Plateformes Classiques & Objectif Canada</span>
              </div>

              <ul className="space-y-4 text-xs sm:text-sm text-muted-foreground">
                <li className="flex items-start gap-3">
                  <XCircle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                  <span>
                    <strong>Scroll de 18 000 pixels :</strong> Les 39 questions sont empilées sur une seule page géante qui ne ressemble en rien à l&apos;écran d&apos;examen réel.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <XCircle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                  <span>
                    <strong>Oral Tâche 2 sans répondant :</strong> Vous devez parler seul dans le vide face à un minuteur sans aucune interaction !
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <XCircle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                  <span>
                    <strong>Délai de correction de 24h à 48h :</strong> Vos copies écrites attendent des jours pour une simple note sans réécriture de qualité.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <XCircle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                  <span>
                    <strong>Aucun calcul CRS Entrée Express :</strong> Aucune vision sur l&apos;impact de vos résultats sur votre dossier d&apos;immigration canadienne.
                  </span>
                </li>
              </ul>
            </div>

            {/* Colonne Super4C2 */}
            <div className="p-8 space-y-6 bg-emerald-500/5 border-l">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-display font-bold text-lg">
                <CheckCircle2 className="h-6 w-6" />
                <span>L&apos;Expérience Super4C2 (Next-Gen)</span>
              </div>

              <ul className="space-y-4 text-xs sm:text-sm text-foreground">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>
                    <strong>Vrai Moteur CBT Écran Scindé :</strong> Document à gauche, question à droite, grille de 39 pastilles et chronomètre strict non interruptible.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>
                    <strong>Jeu de Rôle Oral Interactif en Direct :</strong> L&apos;examinateur IA vocal vous répond et challenge vos questions comme le jour J !
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>
                    <strong>Magic Rewrite C1/C2 Instantané :</strong> Vos textes évalués sur la grille officielle FEI avec réécriture modèle pour apprendre immédiatement.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>
                    <strong>Simulateur CRS & Carnet SRS :</strong> Vos points bonus calculés en temps réel et vos pièges révisés selon la méthode scientifique (J+1, J+3, J+7).
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 🧩 BENTOGRID DES 4 ÉPREUVES */}
      <section className="space-y-8 max-w-6xl mx-auto">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-primary">
            Couverture Exhaustive
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight">
            Les 4 Épreuves Officielles TCF Canada Maîtrisées
          </h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border bg-card p-6 space-y-4 shadow-sm hover:border-primary/50 transition-all">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <BookOpenText className="h-6 w-6" />
            </div>
            <h3 className="font-display text-lg font-bold">Compréhension Écrite</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              60 minutes, 39 questions à choix multiple. Simulation exacte de l&apos;interface informatique FEI avec grille 1-39 et drapeaux de révision.
            </p>
            <Button asChild variant="outline" size="sm" className="w-full text-xs">
              <Link href="/examens/demo-101/ce">Tester le simulateur CE</Link>
            </Button>
          </div>

          <div className="rounded-2xl border bg-card p-6 space-y-4 shadow-sm hover:border-primary/50 transition-all">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-600">
              <Headphones className="h-6 w-6" />
            </div>
            <h3 className="font-display text-lg font-bold">Compréhension Orale</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              40 minutes, 39 documents sonores. Lecteur officiel avec lecture unique obligatoire sans possibilité de rembobinage.
            </p>
            <Button asChild variant="outline" size="sm" className="w-full text-xs">
              <Link href="/examens/demo-101-co/co">Tester le simulateur CO</Link>
            </Button>
          </div>

          <div className="rounded-2xl border bg-card p-6 space-y-4 shadow-sm hover:border-primary/50 transition-all">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#E51A31]/10 text-[#E51A31]">
              <PenTool className="h-6 w-6" />
            </div>
            <h3 className="font-display text-lg font-bold">Expression Écrite</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              60 minutes, 3 tâches FEI. Compteur de mots temps réel, désactivation d&apos;autocorrecteur et Magic Rewrite C1/C2 en un clic.
            </p>
            <Button asChild variant="outline" size="sm" className="w-full text-xs">
              <Link href="/examens/demo-101-ee/intro">Accéder à l&apos;atelier écrit</Link>
            </Button>
          </div>

          <div className="rounded-2xl border bg-card p-6 space-y-4 shadow-sm hover:border-primary/50 transition-all">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600">
              <Mic className="h-6 w-6" />
            </div>
            <h3 className="font-display text-lg font-bold">Expression Orale</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              12 minutes, 3 tâches dont le jeu de rôle interactif en direct avec notre Voice Agent. Débriefing de fluidité et de prononciation.
            </p>
            <Button asChild variant="outline" size="sm" className="w-full text-xs">
              <Link href="/examens/demo-101-eo/intro">Entrer en salle d&apos;oral</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* 🎯 CTA FINAL BANNER */}
      <section className="rounded-3xl border bg-gradient-to-r from-primary via-primary-dark to-slate-900 p-8 sm:p-14 text-white text-center space-y-6 shadow-2xl">
        <h2 className="font-display text-3xl sm:text-5xl font-black tracking-tight max-w-2xl mx-auto">
          Prêt à Valider votre Palier NCLC 7 et Réussir votre Immigration ?
        </h2>
        <p className="text-white/80 max-w-xl mx-auto text-sm sm:text-base">
          Rejoignez les candidats qui s&apos;entraînent sur Super4C2 avec le simulateur officiel et maximisez vos chances pour le tirage au sort Entrée Express.
        </p>
        <div className="pt-2">
          <Button
            asChild
            size="lg"
            className="bg-white text-primary hover:bg-slate-100 font-black text-base px-10 h-14 shadow-xl"
          >
            <Link href="/examens">Commencer Maintenant (Accès Immédiat)</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
