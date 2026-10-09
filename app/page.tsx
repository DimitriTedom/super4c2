import Link from "next/link";
import Image from "next/image";
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Mic,
  BookOpenText,
  Headphones,
  PenTool,
  Clock,
} from "lucide-react";
import NumberTicker from "@/components/ui/number-ticker";
import { Button } from "@/components/ui/button";
import { Globe } from "@/components/ui/globe";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";
import { AnimatedGradientText } from "@/components/ui/animated-gradient-text";
import { BlurFade } from "@/components/ui/blur-fade";
import { TestimonialsSection } from "@/components/testimonials-section";
import { FaqSection } from "@/components/faq-section";
import { ProductShowcaseSection } from "@/components/product-showcase-section";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "Super4C2 — Réussir le TCF Canada & Décrocher NCLC 7+ (+50 pts CRS)",
  description:
    "La première plateforme d'entraînement au TCF Canada avec simulateur officiel CBT, correcteur IA instantané FEI et examinateur vocal interactif en jeu de rôle.",
};

export default async function HomePage() {
  let faqs: { id: string; question: string; answer: string; category: string }[] = [];
  try {
    faqs = await prisma.faq.findMany({
      where: { isActive: true },
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
      select: { id: true, question: true, answer: true, category: true },
    });
  } catch (err) {
    console.error("Failed to fetch FAQs:", err);
  }
  return (
    <div className="overflow-x-clip">
      {/* 🌟 HERO — pleine largeur, sans bordure ; le globe est strictement coupé en deux à sa fin (équateur au bord bas) */}
      <section className="relative overflow-hidden w-full flex flex-col items-center justify-start pt-6 sm:pt-8 lg:pt-10 pb-20 sm:pb-24 min-h-[680px] sm:min-h-[760px] lg:min-h-[800px] border-b border-border/40">
        {/* Halo d'ambiance + trame de points fondue */}
        <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(65%_55%_at_50%_15%,rgba(229,26,49,0.12),transparent_70%),radial-gradient(45%_45%_at_85%_25%,rgba(0,180,216,0.10),transparent_70%)]" />
        <div className="pointer-events-none absolute inset-0 z-0 [background-image:radial-gradient(hsl(var(--foreground)/0.08)_1px,transparent_1px)] [background-size:28px_28px] [mask-image:radial-gradient(ellipse_75%_60%_at_50%_25%,black,transparent_75%)]" />

        {/* 🌍 Globe en arrière-plan (z-0) */}
        <div className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-[38%] z-0 w-[min(1280px,160vw)] aspect-square select-none">
          <Globe className="w-full h-full max-w-none pointer-events-auto" />
        </div>

        {/* 📝 Contenu textuel et CTAs au premier plan (z-10) — strictement au-dessus du globe sur l'axe Z */}
        <div className="relative z-10 mx-auto max-w-4xl space-y-6 sm:space-y-7 text-center">
          {/* 🛡️ Couche satinée de flou et de contraste pour une lisibilité parfaite au-dessus des points du globe */}
          <div className="pointer-events-none absolute -inset-x-6 sm:-inset-x-14 -inset-y-8 sm:-inset-y-12 z-[-1] rounded-3xl bg-background/80 dark:bg-background/70 backdrop-blur-md sm:backdrop-blur-lg [mask-image:radial-gradient(ellipse_85%_70%_at_50%_48%,black_45%,transparent_92%)]" />

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

      {/* 💻 VITRINE INTERACTIVE DU SIMULATEUR CBT */}
      <BlurFade inView>
        <ProductShowcaseSection />
      </BlurFade>

      {/* ⚔️ COMPARATIF HAUT DE GAMME : MÉTHODES CLASSIQUES VS SUPER4C2 */}
      <section className="space-y-8 max-w-5xl mx-auto">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary">
            <span>Audit Technologique & Pédagogique</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-black tracking-tight text-foreground">
            Pourquoi Super4C2 fait la différence le jour J
          </h2>
          <p className="text-sm text-muted-foreground max-w-xl mx-auto">
            Une comparaison objective entre les méthodes traditionnelles d&apos;entraînement et l&apos;architecture CBT de nouvelle génération.
          </p>
        </div>

        <div className="rounded-3xl border border-border/80 bg-card overflow-hidden shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x border-border/70">
            {/* Colonne Méthodes Traditionnelles */}
            <div className="p-6 sm:p-8 space-y-6 bg-muted/20">
              <div className="flex items-center justify-between border-b border-border/60 pb-4">
                <div className="flex items-center gap-2.5 text-foreground/80 font-display font-bold text-base sm:text-lg">
                  <div className="h-8 w-8 rounded-xl bg-destructive/10 text-destructive flex items-center justify-center font-bold text-sm">
                    ✕
                  </div>
                  <span>Entraînements Classiques &amp; PDF</span>
                </div>
                <span className="text-[11px] font-semibold text-muted-foreground bg-muted px-2 py-0.5 rounded-md">
                  Méthodes Passives
                </span>
              </div>

              <ul className="space-y-4 text-xs sm:text-sm text-muted-foreground">
                <li className="flex items-start gap-3">
                  <XCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-foreground/90">Page de 18 000 px à faire défiler :</strong> Les 39 questions sont empilées sans respect de la mise en page officielle, générant fatigue visuelle et désorientation le jour J.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <XCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-foreground/90">Expression Orale en monologue :</strong> Enregistrement dans le vide face à un minuteur sans aucun dialogue ni question imprévue.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <XCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-foreground/90">Délai de correction de 24h à 48h :</strong> Vos copies attendent des jours pour une simple appréciation générale sans réécriture didactique.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <XCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-foreground/90">Aucun suivi des points CRS :</strong> Vous avancez sans mesurer l&apos;impact concret de vos notes sur le seuil d&apos;invitation Entrée Express.
                  </span>
                </li>
              </ul>
            </div>

            {/* Colonne Super4C2 */}
            <div className="p-6 sm:p-8 space-y-6 bg-gradient-to-b from-primary/[0.04] to-transparent">
              <div className="flex items-center justify-between border-b border-primary/20 pb-4">
                <div className="flex items-center gap-2.5 text-foreground font-display font-bold text-base sm:text-lg">
                  <div className="h-8 w-8 rounded-xl bg-brand-crimson text-white flex items-center justify-center font-bold text-sm shadow-sm">
                    ✓
                  </div>
                  <span>Super4C2 • Plateforme CBT &amp; IA</span>
                </div>
                <span className="text-[11px] font-bold text-brand-crimson bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-md">
                  Standard Officiel
                </span>
              </div>

              <ul className="space-y-4 text-xs sm:text-sm text-foreground/90">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-foreground">Vrai Double Écran Scindé CBT :</strong> Document source à gauche, question ciblée à droite, grille de 39 pastilles interactives et compte à rebours officiel strict.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-foreground">Jeu de Rôle Oral Interactif en Direct :</strong> Un examinateur vocal IA simule les Tâches 2 et 3, vous relance avec naturel et analyse votre débit de parole.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-foreground">Magic Rewrite C1/C2 Instantané (0s) :</strong> Évaluation ligne par ligne sur la grille officielle FEI avec version modèle réécrite pour assimiler le niveau requis.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-foreground">Calculateur CRS &amp; Répétition Espacée :</strong> Projection immédiate de vos +50 points bonus francophone et mémorisation durable via le carnet SRS (J+1, J+3, J+7).
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 🧩 LES 4 ÉPREUVES OFFICIELLES TCF CANADA MAÎTRISÉES */}
      <section className="space-y-10 max-w-6xl mx-auto">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3.5 py-1 text-xs font-semibold text-primary">
            <Sparkles className="h-3.5 w-3.5 text-brand-crimson" />
            <span>Format Conforme FEI • TCF & TEF Canada</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-foreground">
            Les 4 Épreuves Officielles{" "}
            <span className="bg-gradient-to-r from-brand-crimson to-rose-600 bg-clip-text text-transparent">
              Maîtrisées
            </span>
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
            Chaque module est une réplique exacte des contraintes de l&apos;examen officiel, optimisée pour débloquer le niveau C1/C2 (NCLC 7+).
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {/* 1. Compréhension Écrite (CE) */}
          <div className="group relative rounded-3xl border border-border/80 bg-gradient-to-b from-card via-card to-rose-500/[0.03] p-6 shadow-sm hover:shadow-2xl hover:border-rose-500/40 transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between overflow-hidden">
            {/* Ambient glow pedestal behind 3D icon */}
            <div className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 w-44 h-44 bg-rose-500/15 blur-3xl rounded-full group-hover:bg-rose-500/25 transition-all duration-500" />
            
            <div className="relative z-10 space-y-4">
              {/* Badge format & duration */}
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/10 px-2.5 py-1 text-[11px] font-bold text-rose-600 dark:text-rose-400 border border-rose-500/20">
                  <Clock className="h-3 w-3" /> 60 min • 39 Q
                </span>
                <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                  NCLC 7+
                </span>
              </div>

              {/* 3D Icon Hero Stage */}
              <div className="relative flex items-center justify-center py-2">
                <div className="relative h-32 w-32 sm:h-36 sm:w-36 transition-transform duration-500 ease-out group-hover:scale-110 group-hover:-translate-y-2">
                  <Image
                    src="/brand/icons-3d/comprehension-ecrite-book.png"
                    alt="Compréhension Écrite 3D"
                    fill
                    sizes="144px"
                    className="object-contain drop-shadow-[0_12px_24px_rgba(225,29,72,0.22)] select-none pointer-events-none"
                    priority
                  />
                </div>
              </div>

              {/* Content */}
              <div className="space-y-2 text-left">
                <h3 className="font-display text-xl font-black text-foreground group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
                  Compréhension Écrite
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Double écran scindé officiel FEI, zoom typographique, touches rapides A-D et drapeaux de révision.
                </p>
              </div>

              {/* Feature pills */}
              <div className="flex flex-wrap gap-1.5 pt-1 text-[11px]">
                <span className="rounded-md bg-muted px-2 py-0.5 text-muted-foreground font-medium">
                  Grille 1-39 CBT
                </span>
                <span className="rounded-md bg-muted px-2 py-0.5 text-muted-foreground font-medium">
                  Zéro Scroll
                </span>
              </div>
            </div>

            {/* CTA Button */}
            <div className="relative z-10 pt-5">
              <Button asChild variant="outline" size="sm" className="w-full text-xs font-bold rounded-xl border-border/80 group-hover:border-rose-500/50 group-hover:bg-rose-50 dark:group-hover:bg-rose-950/30 group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-all justify-between">
                <Link href="/examens/demo-101/ce">
                  <span>Tester le simulateur CE</span>
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>
          </div>

          {/* 2. Compréhension Orale (CO) */}
          <div className="group relative rounded-3xl border border-border/80 bg-gradient-to-b from-card via-card to-cyan-500/[0.03] p-6 shadow-sm hover:shadow-2xl hover:border-cyan-500/40 transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between overflow-hidden">
            {/* Ambient glow pedestal behind 3D icon */}
            <div className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 w-44 h-44 bg-cyan-500/15 blur-3xl rounded-full group-hover:bg-cyan-500/25 transition-all duration-500" />
            
            <div className="relative z-10 space-y-4">
              {/* Badge format & duration */}
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-cyan-500/10 px-2.5 py-1 text-[11px] font-bold text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
                  <Clock className="h-3 w-3" /> 40 min • 39 Audio
                </span>
                <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                  NCLC 7+
                </span>
              </div>

              {/* 3D Icon Hero Stage */}
              <div className="relative flex items-center justify-center py-2">
                <div className="relative h-32 w-32 sm:h-36 sm:w-36 transition-transform duration-500 ease-out group-hover:scale-110 group-hover:-translate-y-2">
                  <Image
                    src="/brand/icons-3d/comprehension-orale-headphones.png"
                    alt="Compréhension Orale 3D"
                    fill
                    sizes="144px"
                    className="object-contain drop-shadow-[0_12px_24px_rgba(6,182,212,0.22)] select-none pointer-events-none"
                    priority
                  />
                </div>
              </div>

              {/* Content */}
              <div className="space-y-2 text-left">
                <h3 className="font-display text-xl font-black text-foreground group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                  Compréhension Orale
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Lecteur officiel FEI à écoute unique stricte, accents canadiens authentiques et timer verrouillé.
                </p>
              </div>

              {/* Feature pills */}
              <div className="flex flex-wrap gap-1.5 pt-1 text-[11px]">
                <span className="rounded-md bg-muted px-2 py-0.5 text-muted-foreground font-medium">
                  Écoute Unique
                </span>
                <span className="rounded-md bg-muted px-2 py-0.5 text-muted-foreground font-medium">
                  Accents Québécois
                </span>
              </div>
            </div>

            {/* CTA Button */}
            <div className="relative z-10 pt-5">
              <Button asChild variant="outline" size="sm" className="w-full text-xs font-bold rounded-xl border-border/80 group-hover:border-cyan-500/50 group-hover:bg-cyan-50 dark:group-hover:bg-cyan-950/30 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-all justify-between">
                <Link href="/examens/demo-101-co/co">
                  <span>Tester le simulateur CO</span>
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>
          </div>

          {/* 3. Expression Écrite (EE) */}
          <div className="group relative rounded-3xl border border-border/80 bg-gradient-to-b from-card via-card to-amber-500/[0.03] p-6 shadow-sm hover:shadow-2xl hover:border-amber-500/40 transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between overflow-hidden">
            {/* Ambient glow pedestal behind 3D icon */}
            <div className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 w-44 h-44 bg-amber-500/15 blur-3xl rounded-full group-hover:bg-amber-500/25 transition-all duration-500" />
            
            <div className="relative z-10 space-y-4">
              {/* Badge format & duration */}
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-2.5 py-1 text-[11px] font-bold text-amber-600 dark:text-amber-400 border border-amber-500/20">
                  <Clock className="h-3 w-3" /> 60 min • 3 Tâches
                </span>
                <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                  NCLC 7+
                </span>
              </div>

              {/* 3D Icon Hero Stage */}
              <div className="relative flex items-center justify-center py-2">
                <div className="relative h-32 w-32 sm:h-36 sm:w-36 transition-transform duration-500 ease-out group-hover:scale-110 group-hover:-translate-y-2">
                  <Image
                    src="/brand/icons-3d/expression-ecrite-pen.png"
                    alt="Expression Écrite 3D"
                    fill
                    sizes="144px"
                    className="object-contain drop-shadow-[0_12px_24px_rgba(245,158,11,0.22)] select-none pointer-events-none"
                    priority
                  />
                </div>
              </div>

              {/* Content */}
              <div className="space-y-2 text-left">
                <h3 className="font-display text-xl font-black text-foreground group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                  Expression Écrite
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Compteur de mots en temps réel, désactivation d&apos;autocorrecteur et réécriture C1/C2 en 1 clic.
                </p>
              </div>

              {/* Feature pills */}
              <div className="flex flex-wrap gap-1.5 pt-1 text-[11px]">
                <span className="rounded-md bg-muted px-2 py-0.5 text-muted-foreground font-medium">
                  Magic Rewrite
                </span>
                <span className="rounded-md bg-muted px-2 py-0.5 text-muted-foreground font-medium">
                  Critères FEI
                </span>
              </div>
            </div>

            {/* CTA Button */}
            <div className="relative z-10 pt-5">
              <Button asChild variant="outline" size="sm" className="w-full text-xs font-bold rounded-xl border-border/80 group-hover:border-amber-500/50 group-hover:bg-amber-50 dark:group-hover:bg-amber-950/30 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-all justify-between">
                <Link href="/examens/demo-101-ee/intro">
                  <span>Accéder à l&apos;atelier écrit</span>
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>
          </div>

          {/* 4. Expression Orale (EO) */}
          <div className="group relative rounded-3xl border border-border/80 bg-gradient-to-b from-card via-card to-violet-500/[0.03] p-6 shadow-sm hover:shadow-2xl hover:border-violet-500/40 transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between overflow-hidden">
            {/* Ambient glow pedestal behind 3D icon */}
            <div className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 w-44 h-44 bg-violet-500/15 blur-3xl rounded-full group-hover:bg-violet-500/25 transition-all duration-500" />
            
            <div className="relative z-10 space-y-4">
              {/* Badge format & duration */}
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-500/10 px-2.5 py-1 text-[11px] font-bold text-violet-600 dark:text-violet-400 border border-violet-500/20">
                  <Clock className="h-3 w-3" /> 12 min • 3 Tâches
                </span>
                <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                  NCLC 7+
                </span>
              </div>

              {/* 3D Icon Hero Stage */}
              <div className="relative flex items-center justify-center py-2">
                <div className="relative h-32 w-32 sm:h-36 sm:w-36 transition-transform duration-500 ease-out group-hover:scale-110 group-hover:-translate-y-2">
                  <Image
                    src="/brand/icons-3d/expression-orale-microphone.png"
                    alt="Expression Orale 3D"
                    fill
                    sizes="144px"
                    className="object-contain drop-shadow-[0_12px_24px_rgba(139,92,246,0.22)] select-none pointer-events-none"
                    priority
                  />
                </div>
              </div>

              {/* Content */}
              <div className="space-y-2 text-left">
                <h3 className="font-display text-xl font-black text-foreground group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                  Expression Orale
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Jeu de rôle interactif en visio avec notre Voice Agent M. Laurent. Débrief de prononciation & aisance.
                </p>
              </div>

              {/* Feature pills */}
              <div className="flex flex-wrap gap-1.5 pt-1 text-[11px]">
                <span className="rounded-md bg-muted px-2 py-0.5 text-muted-foreground font-medium">
                  Voice Agent IA
                </span>
                <span className="rounded-md bg-muted px-2 py-0.5 text-muted-foreground font-medium">
                  Débrief Vocal
                </span>
              </div>
            </div>

            {/* CTA Button */}
            <div className="relative z-10 pt-5">
              <Button asChild variant="outline" size="sm" className="w-full text-xs font-bold rounded-xl border-border/80 group-hover:border-violet-500/50 group-hover:bg-violet-50 dark:group-hover:bg-violet-950/30 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-all justify-between">
                <Link href="/examens/demo-101-eo/intro">
                  <span>Entrer en salle d&apos;oral</span>
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 🌟 TÉMOIGNAGES OFFICIELS CANDIDATS (Connectés à la base Prisma & CRUD Admin) */}
      <TestimonialsSection />

      {/* ❓ FOIRE AUX QUESTIONS OFFICIELLES (FAQ) */}
      <FaqSection initialFaqs={faqs} />

      {/* 🎯 CTA FINAL HAUTE PERFORMANCE & CONVERSION */}
      <section className="relative mx-auto max-w-6xl rounded-3xl border border-red-200/70 dark:border-slate-800 bg-gradient-to-br from-rose-50/80 via-white to-slate-50/90 dark:bg-[#0B132B] dark:from-transparent dark:via-transparent dark:to-transparent p-6 sm:p-12 lg:p-16 text-foreground dark:text-white text-center space-y-6 shadow-xl shadow-red-500/5 dark:shadow-2xl overflow-hidden transition-colors">
        {/* Subtle radial ambient gradients */}
        <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-brand-crimson/15 dark:bg-brand-crimson/20 blur-[100px] rounded-full" />
        <div className="pointer-events-none absolute -bottom-24 right-10 w-[400px] h-[250px] bg-cyan-500/10 dark:bg-cyan-500/15 blur-[90px] rounded-full" />
        <div className="pointer-events-none absolute inset-0 [background-image:radial-gradient(rgba(0,0,0,0.04)_1px,transparent_1px)] dark:[background-image:radial-gradient(rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,black,transparent_80%)]" />

        <div className="relative z-10 space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-red-200/80 dark:border-white/15 bg-white dark:bg-white/5 px-3.5 py-1 text-xs font-semibold text-slate-700 dark:text-slate-200 shadow-xs dark:shadow-none backdrop-blur-xs">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse" />
            <span>Objectif Immigration Canada • Entrée Express 2026</span>
          </div>

          <h2 className="font-display text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight text-slate-900 dark:text-white text-balance">
            Sécurisez vos <span className="bg-gradient-to-r from-brand-crimson to-rose-600 bg-clip-text text-transparent">+50 Points CRS</span> avec la référence CBT
          </h2>

          <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-base leading-relaxed max-w-xl mx-auto text-balance">
            Rejoignez les candidats qui s&apos;entraînent sur la réplique exacte du logiciel officiel et réussissent leur examen dès leur première tentative.
          </p>
        </div>

        {/* Buttons container (Fully responsive, no overflow) */}
        <div className="relative z-10 flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-md mx-auto pt-2">
          <Button
            asChild
            size="lg"
            className="w-full sm:w-auto bg-brand-crimson hover:bg-brand-crimson/90 text-white font-bold text-sm sm:text-base px-6 h-12 rounded-full shadow-lg shadow-brand-crimson/25 gap-2"
          >
            <Link href="/examens?test=tcf">
              <span>Commencer mon Essai Gratuit</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            size="lg"
            className="w-full sm:w-auto border-slate-300 dark:border-white/20 bg-white dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-800 dark:text-slate-100 font-semibold text-sm px-6 h-12 rounded-full shadow-xs dark:shadow-none backdrop-blur-xs"
          >
            <Link href="/nclc-calculator">
              <span>Calculer mes Points CRS</span>
            </Link>
          </Button>
        </div>

        {/* Trust Badges */}
        <div className="relative z-10 pt-4 border-t border-slate-200/80 dark:border-white/10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 dark:text-emerald-400" />
            Conforme France Éducation International
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 dark:text-emerald-400" />
            Accès immédiat sans carte bancaire
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-cyan-600 dark:text-cyan-400" />
            Noté 4.9/5 par les candidats
          </span>
        </div>
      </section>
      </div>
    </div>
  );
}
