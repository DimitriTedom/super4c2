import Link from "next/link";
import { BookOpenText, Clock, Headphones, ListChecks, PenTool, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { listMockSeries } from "@/lib/exam/mock-series";
import { listWrittenSeries } from "@/lib/exam/mock-written-series";

export const metadata = {
  title: "Catalogue des examens TCF Canada",
  description: "Séries d'entraînement TCF Canada au format CBT officiel avec correction IA.",
};

export default function ExamCataloguePage() {
  const qcmSeries = listMockSeries();
  const writtenSeries = listWrittenSeries();

  return (
    <div className="space-y-12">
      <div className="space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-primary">
          Simulateur CBT Conforme France Éducation International
        </span>
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight">
          Catalogue des Épreuves TCF Canada
        </h1>
        <p className="max-w-3xl text-muted-foreground text-base">
          Préparez-vous dans les conditions réelles du jour J : chronomètres officiels non interruptibles, écran scindé, lecteur audio mono-écoute et correction IA immédiate.
        </p>
      </div>

      {/* Section 1 : Épreuves de Compréhension (QCM) */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 border-b pb-2">
          <BookOpenText className="h-5 w-5 text-primary" />
          <h2 className="font-display text-xl font-bold">Compréhension Écrite & Orale (QCM)</h2>
        </div>

        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {qcmSeries.map((s) => {
            const Icon = s.discipline === "CE" ? BookOpenText : Headphones;
            return (
              <li
                key={s.id}
                className="group flex flex-col justify-between gap-5 rounded-2xl border bg-card p-6 transition-all hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-lg"
              >
                <div className="space-y-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-display text-lg font-bold leading-snug">{s.title}</h3>
                  <p className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5">
                      <ListChecks className="h-4 w-4" /> {s.questions.length} questions (démo)
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Clock className="h-4 w-4" /> {s.durationSeconds / 60} min
                    </span>
                  </p>
                </div>
                <Button asChild>
                  <Link href={`/examens/${s.id}/intro`}>Commencer l&apos;épreuve</Link>
                </Button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Section 2 : Expression Écrite (EE) avec Correcteur IA */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b pb-2">
          <div className="flex items-center gap-2">
            <PenTool className="h-5 w-5 text-[#E51A31]" />
            <h2 className="font-display text-xl font-bold">Expression Écrite (Atelier IA FEI)</h2>
          </div>
          <span className="inline-flex items-center gap-1 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            Correction Instantanée
          </span>
        </div>

        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {writtenSeries.map((s) => (
            <li
              key={s.id}
              className="group flex flex-col justify-between gap-5 rounded-2xl border bg-card p-6 transition-all hover:-translate-y-0.5 hover:border-[#E51A31]/50 hover:shadow-lg"
            >
              <div className="space-y-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#E51A31]/10 text-[#E51A31]">
                  <PenTool className="h-5 w-5" />
                </div>
                <h3 className="font-display text-lg font-bold leading-snug">{s.title}</h3>
                <p className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5">
                    <ListChecks className="h-4 w-4" /> 3 tâches officielles FEI
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="h-4 w-4" /> {s.durationSeconds / 60} min
                  </span>
                </p>
                <p className="text-xs text-muted-foreground">
                  Comprend l&apos;évaluation selon les 4 critères FEI et le Magic Rewrite C1/C2.
                </p>
              </div>
              <Button asChild className="bg-[#E51A31] hover:bg-[#B31224] text-white">
                <Link href={`/examens/${s.id}/intro`}>Accéder à l&apos;atelier écrit</Link>
              </Button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
