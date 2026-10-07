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
import NumberTicker from "@/components/ui/number-ticker";
import { Button } from "@/components/ui/button";
import { Globe } from "@/components/ui/globe";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";
import { AnimatedGradientText } from "@/components/ui/animated-gradient-text";
import { BlurFade } from "@/components/ui/blur-fade";

export const metadata = {
  title: "Super4C2 — Réussir le TCF Canada & Décrocher NCLC 7+ (+50 pts CRS)",
  description:
    "La première plateforme d'entraînement au TCF Canada avec simulateur officiel CBT, correcteur IA instantané FEI et examinateur vocal interactif en jeu de rôle.",
};

export default function HomePage() {
  return (
    <div className="overflow-x-clip">
      {/* 🌟 HERO — pleine largeur, sans bordure ; le globe est strictement coupé en deux à sa fin (équateur au bord bas) */}
      <section className="relative overflow-hidden w-full flex flex-col items-center justify-start pt-6 sm:pt-8 lg:pt-10 pb-20 sm:pb-24 min-h-[680px] sm:min-h-[760px] lg:min-h-[800px] border-b border-border/40">
        {/* Halo d'ambiance + trame de points fondue */}
        <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(65%_55%_at_50%_15%,rgba(229,26,49,0.12),transparent_70%),radial-gradient(45%_45%_at_85%_25%,rgba(0,180,216,0.10),transparent_70%)]" />
        <div className="pointer-events-none absolute inset-0 z-0 [background-image:radial-gradient(hsl(var(--foreground)/0.08)_1px,transparent_1px)] [background-size:28px_28px] [mask-image:radial-gradient(ellipse_75%_60%_at_50%_25%,black,transparent_75%)]" />

        {/* 🌍 Globe en arrière-plan (z-0) : son centre est calé exactement sur le bord bas du hero (translate-y-1/2) -> seule la moitié haute est visible */}
        <div className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 z-0 w-[min(1360px,180vw)] aspect-square select-none">
          <Globe className="w-full h-full max-w-none pointer-events-auto" />
        </div>

        {/* 📝 Contenu textuel et CTAs au premier plan (z-10) — strictement au-dessus du globe sur l'axe Z */}
        <div className="relative z-10 mx-auto max-w-4xl space-y-6 sm:space-y-7 text-center">
          {/* Halo doux de contraste & lisibilité textuelle au-dessus du globe */}
          <div className="pointer-events-none absolute -inset-x-8 -inset-y-6 z-[-1] rounded-3xl bg-background/50 dark:bg-background/40 backdrop-blur-[2px] [mask-image:radial-gradient(ellipse_65%_55%_at_50%_50%,black_30%,transparent_80%)]" />

          <BlurFade delay={0.05}>
            <div className="group relative inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/85 px-4 py-1.5 shadow-[inset_0_-8px_10px_rgba(229,26,49,0.06)] transition-all duration-300 hover:border-brand-crimson/50 hover:shadow-[inset_0_-8px_14px_rgba(229,26,49,0.15)] backdrop-blur-md">
              <span
                className="animate-gradient absolute inset-0 block h-full w-full rounded-full bg-gradient-to-r from-brand-crimson/40 via-cyan-500/40 to-brand-crimson/40 bg-[length:300%_100%] p-[1px] opacity-70 transition-opacity group-hover:opacity-100"
                style={{
                  WebkitMask:
                    "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                  WebkitMaskComposite: "destination-out",
                  mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                  maskComposite: "subtract",
                  WebkitClipPath: "padding-box",
                }}
              />
              <Sparkles className="h-3.5 w-3.5 text-brand-crimson shrink-0" />
              <span className="h-3 w-px bg-border/80 shrink-0" />
              <AnimatedGradientText
                colorFrom="#E51A31"
                colorTo="#00B4D8"
                className="text-xs sm:text-sm font-bold tracking-tight"
              >
                Préparation Officielle Canada : TCF • TEF • IELTS
              </AnimatedGradientText>
              <ArrowRight className="h-3.5 w-3.5 text-muted-foreground shrink-0 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:text-foreground" />
            </div>
          </BlurFade>

          <BlurFade delay={0.15}>
            <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.08] text-foreground text-balance drop-shadow-[0_2px_12px_rgba(0,0,0,0.06)] dark:drop-shadow-[0_2px_16px_rgba(0,0,0,0.4)]">
              Décrochez vos{" "}
              <span className="bg-gradient-to-r from-brand-crimson to-rose-500 bg-clip-text text-transparent">4 C2</span>{" "}
              et Débloquez les{" "}
              <span className="text-cyan-600 dark:text-cyan-400">+50 Points</span> d&apos;Entrée Express.
            </h1>
          </BlurFade>

          <BlurFade delay={0.25}>
            <p className="font-body text-base sm:text-xl text-foreground/90 dark:text-slate-200 font-medium max-w-2xl mx-auto leading-relaxed text-balance">
              Fini le scroll interminable et les corrections humaines qui tardent 24h. Entraînez-vous dans les <strong className="text-foreground font-bold">conditions réelles de l&apos;examen officiel CBT</strong> avec un examinateur vocal IA interactif en jeu de rôle.
            </p>
          </BlurFade>

          <BlurFade delay={0.35}>
            <div className="flex flex-col items-center justify-center gap-4 pt-2">
              <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3 w-full">
                <ShimmerButton
                  href="/examens?test=tcf"
                  background="#E51A31"
                  shimmerColor="#ffffff"
                  className="w-full sm:w-auto shadow-[0_10px_40px_-10px_rgba(229,26,49,0.65)] font-bold px-7"
                >
                  <span className="flex items-center gap-2 text-base font-bold">
                    Commencer le TCF
                    <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </span>
                </ShimmerButton>

                <InteractiveHoverButton href="/examens?test=tef" className="w-full sm:w-auto text-base font-semibold px-6">
                  Commencer le TEF
                </InteractiveHoverButton>

                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto rounded-full border-border/80 bg-background/80 hover:bg-muted/80 backdrop-blur-md px-6 text-sm font-semibold shadow-xs transition-all hover:border-cyan-500/50"
                >
                  <Link href="/examens?test=ielts" className="gap-2">
                    <span className="inline-block h-2 w-2 rounded-full bg-cyan-500" />
                    <span>Préparer l&apos;IELTS General</span>
                  </Link>
                </Button>
              </div>

              <p className="text-xs text-muted-foreground flex items-center gap-1.5 pt-1">
                <span>Objectif Immigration Canada ?</span>
                <Link href="/nclc-calculator" className="text-primary hover:underline font-semibold">
                  Calculer mes points CRS (+50 pts NCLC 7) →
                </Link>
              </p>
            </div>
          </BlurFade>
        </div>
      </section>

      {/* Reste de la page dans un conteneur centré */}
      <div className="space-y-24 px-4 pb-8 pt-20 sm:px-6">
      {/* 📊 Statistiques clés */}
      <BlurFade inView>
        <section className="mx-auto grid max-w-5xl grid-cols-2 gap-y-8 sm:grid-cols-4 sm:divide-x sm:divide-border/50">
          <div className="text-center">
            <p className="font-display text-4xl sm:text-5xl font-black text-foreground">
              <NumberTicker value={50} />
              <span className="text-brand-crimson font-bold">+</span>
            </p>
            <p className="mt-1 text-xs text-muted-foreground">Points CRS Débloqués</p>
          </div>

          <div className="text-center">
            <p className="font-display text-4xl sm:text-5xl font-black text-emerald-600 dark:text-emerald-400">
              <NumberTicker value={100} />%
            </p>
            <p className="mt-1 text-xs text-muted-foreground">Format Conforme CBT FEI</p>
          </div>

          <div className="text-center">
            <p className="font-display text-4xl sm:text-5xl font-black text-foreground">
              0<span className="text-sm font-normal"> sec</span>
            </p>
            <p className="mt-1 text-xs text-muted-foreground">Correction IA Instantanée</p>
          </div>

          <div className="text-center">
            <p className="font-display text-4xl sm:text-5xl font-black text-cyan-600 dark:text-cyan-400">
              NCLC 7<span className="text-sm font-normal"> à 10</span>
            </p>
            <p className="mt-1 text-xs text-muted-foreground">Objectif B2 / C1 / C2</p>
          </div>
        </section>
      </BlurFade>

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
      <section className="mx-auto max-w-6xl rounded-3xl border bg-gradient-to-r from-primary via-primary-dark to-slate-900 p-8 sm:p-14 text-white text-center space-y-6 shadow-2xl">
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
    </div>
  );
}
