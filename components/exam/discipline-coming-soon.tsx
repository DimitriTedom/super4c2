import Link from "next/link";
import Image from "next/image";
import { Lock, ArrowRight, Sparkles, PenTool, Mic, ShieldAlert, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DisciplineComingSoonProps {
  discipline: "CE" | "CO";
  seriesId: string;
}

export function DisciplineComingSoon({ discipline, seriesId }: DisciplineComingSoonProps) {
  const isCe = discipline === "CE";
  const title = isCe ? "Compréhension Écrite" : "Compréhension Orale";
  const code = isCe ? "CE" : "CO";
  const icon3d = isCe
    ? "/brand/icons-3d/comprehension-ecrite-book.png"
    : "/brand/icons-3d/comprehension-orale-headphones.png";
  const questionsCount = "39 questions officielles";
  const explanation = isCe
    ? "Pour vous assurer une préparation rigoureusement conforme aux critères de France Éducation International, l'épreuve de Compréhension Écrite (39 questions, double écran CBT) est actuellement en cours de calibrage final par nos concepteurs pédagogiques."
    : "Les enregistrements sonores haute fidélité et le lecteur officiel à mono-écoute sans retour arrière font l'objet d'un calibrage approfondi afin de reproduire exactement les conditions d'un centre agréé TCF Canada.";

  const normalizedSeriesId = seriesId.replace(/-(ce|co|ee|eo)$/, "");

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 text-center">
      <div className="relative overflow-hidden rounded-3xl border-2 border-amber-500/40 bg-gradient-to-b from-card via-card to-amber-500/[0.04] p-8 sm:p-10 shadow-2xl backdrop-blur-xl">
        {/* Badge supérieur */}
        <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/40 bg-amber-500/10 px-3.5 py-1 text-xs font-bold text-amber-600 dark:text-amber-400">
          <Lock className="h-3.5 w-3.5" />
          <span>Bientôt Disponible · Calibrage FEI en Cours</span>
        </div>

        {/* Visuel 3D avec cadenas */}
        <div className="relative mx-auto mt-6 mb-4 h-24 w-24">
          <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-amber-500/10 p-3 shadow-inner">
            <Image
              src={icon3d}
              alt={title}
              width={80}
              height={80}
              className="h-16 w-16 object-contain drop-shadow-md opacity-85"
            />
          </div>
          <div className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-amber-500 text-white shadow-md">
            <Lock className="h-4 w-4" />
          </div>
        </div>

        {/* Titre & Explication */}
        <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight mt-3">
          {title} ({code})
        </h1>
        <p className="mt-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          {questionsCount} · Format Officiel FEI
        </p>

        <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
          {explanation}
        </p>

        {/* Encart incitatif gratuité & disciplines actives */}
        <div className="mt-8 rounded-2xl border border-emerald-500/30 bg-emerald-500/[0.06] p-4 text-left">
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-emerald-800 dark:text-emerald-200">
                Préparez les 2 épreuves décisives dès aujourd&apos;hui (100% Gratuit)
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                78% des candidats manquent le 4C2 à cause de l&apos;Écrit et de l&apos;Oral. Ces deux simulateurs sont ouverts et opérationnels avec correction IA instantanée !
              </p>
            </div>
          </div>
        </div>

        {/* Boutons d'action */}
        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          <Button asChild size="lg" className="w-full bg-[#E51A31] hover:bg-[#B31224] text-white font-bold gap-2">
            <Link href={`/examens/${normalizedSeriesId}/ee/intro`}>
              <PenTool className="h-4 w-4" />
              <span>Expression Écrite (3 Tâches)</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Button>

          <Button asChild size="lg" variant="outline" className="w-full font-bold gap-2 border-primary/30">
            <Link href={`/examens/${normalizedSeriesId}/eo/intro`}>
              <Mic className="h-4 w-4 text-amber-500" />
              <span>Expression Orale IA</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>

        <div className="mt-6 pt-4 border-t border-border/60">
          <Button asChild variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
            <Link href="/dashboard" className="gap-1.5">
              <Home className="h-4 w-4" />
              <span>Retourner au Tableau de Bord Candidat</span>
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
