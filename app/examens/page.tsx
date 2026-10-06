import Link from "next/link";
import { BookOpenText, Clock, Headphones, ListChecks } from "lucide-react";
import { Button } from "@/components/ui/button";
import { listMockSeries } from "@/lib/exam/mock-series";

export const metadata = {
  title: "Catalogue des examens",
  description: "Séries d'entraînement TCF Canada au format CBT officiel.",
};

export default function ExamCataloguePage() {
  const series = listMockSeries();
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="font-display text-3xl font-extrabold tracking-tight">
          Catalogue des examens
        </h1>
        <p className="max-w-2xl text-muted-foreground">
          Entraînez-vous dans les conditions réelles du TCF Canada : écran scindé, chronomètre
          strict et grille de navigation.
        </p>
      </div>

      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {series.map((s) => {
          const Icon = s.discipline === "CE" ? BookOpenText : Headphones;
          return (
            <li
              key={s.id}
              className="group flex flex-col justify-between gap-5 rounded-2xl border bg-card p-6 transition-all hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-lg"
            >
              <div className="space-y-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" aria-hidden />
                </div>
                <h2 className="font-display text-lg font-bold leading-snug">{s.title}</h2>
                <p className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5">
                    <ListChecks className="h-4 w-4" aria-hidden /> {s.questions.length} questions
                    (démo)
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="h-4 w-4" aria-hidden /> {s.durationSeconds / 60} min
                  </span>
                </p>
              </div>
              <Button asChild>
                <Link href={`/examens/${s.id}/intro`}>Commencer</Link>
              </Button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
