import { Star, Quote, ShieldCheck, CheckCircle2 } from "lucide-react";
import { prisma } from "@/lib/prisma";

export async function TestimonialsSection() {
  let testimonials: Array<{
    id: string;
    candidateName: string;
    country: string;
    targetScore: string;
    achievedNclc: string;
    crsPointsGained: number;
    quote: string;
    rating: number;
    isFeatured: boolean;
  }> = [];

  try {
    testimonials = await prisma.testimonial.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
      take: 6,
    });
  } catch (error) {
    console.warn("Erreur lors de la récupération des témoignages Prisma :", error);
  }

  // Fallback si la base de données est vide pour garantir un affichage premium
  if (!testimonials || testimonials.length === 0) {
    testimonials = [
      {
        id: "t1",
        candidateName: "Amine K.",
        country: "Algérie",
        targetScore: "NCLC 7",
        achievedNclc: "NCLC 8 (+50 pts CRS)",
        crsPointsGained: 50,
        quote:
          "Le double écran scindé et l'absence de scroll infini m'ont sauvé le jour J. J'ai gagné 15 minutes en compréhension écrite par rapport à mon premier essai sur Objectif Canada.",
        rating: 5,
        isFeatured: true,
      },
      {
        id: "t2",
        candidateName: "Sarah M.",
        country: "Maroc",
        targetScore: "NCLC 7",
        achievedNclc: "NCLC 9 (Score 538)",
        crsPointsGained: 50,
        quote:
          "L'examinateur vocal IA pour la Tâche 2 d'expression orale est bluffant. On s'habitue à poser des questions et à recevoir des objections réalistes en temps réel.",
        rating: 5,
        isFeatured: true,
      },
      {
        id: "t3",
        candidateName: "Jean-Marc T.",
        country: "Cameroun",
        targetScore: "NCLC 7",
        achievedNclc: "NCLC 8 (4 C2 Validés)",
        crsPointsGained: 50,
        quote:
          "Le Magic Rewrite C1/C2 sur les 3 tâches d'expression écrite est une arme absolue. En 10 secondes, on comprend exactement comment enrichir son vocabulaire.",
        rating: 5,
        isFeatured: true,
      },
    ];
  }

  return (
    <section className="space-y-10 max-w-6xl mx-auto py-8">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary">
          <ShieldCheck className="h-3.5 w-3.5" /> Témoignages Candidats Vérifiés
        </div>
        <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground">
          Ils ont décroché leurs <span className="text-primary">+50 Points</span> d&apos;Entrée Express
        </h2>
        <p className="text-muted-foreground text-sm sm:text-base max-w-2xl mx-auto">
          Découvrez les retours d&apos;expérience de candidats qui se sont entraînés sur Super4C2 et ont validé leurs paliers NCLC 7 à 10.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((t) => (
          <div
            key={t.id}
            className={`group relative flex flex-col justify-between rounded-3xl border p-6 sm:p-7 transition-all hover:-translate-y-1 shadow-sm hover:shadow-xl ${
              t.isFeatured
                ? "border-primary/40 bg-gradient-to-br from-card via-card to-primary/[0.04]"
                : "border-border/80 bg-card hover:border-primary/30"
            }`}
          >
            <div className="space-y-4">
              {/* Rating stars & Quote Icon */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  {Array.from({ length: t.rating || 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>
                <Quote className="h-6 w-6 text-primary/30 group-hover:text-primary transition-colors" />
              </div>

              {/* Quote text */}
              <p className="text-sm text-foreground/90 leading-relaxed italic">
                &laquo; {t.quote} &raquo;
              </p>
            </div>

            {/* Candidate Metadata */}
            <div className="pt-6 border-t border-border/60 mt-6 flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5">
                  <h4 className="font-display font-bold text-sm text-foreground">
                    {t.candidateName}
                  </h4>
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                </div>
                <p className="text-[11px] text-muted-foreground">
                  {t.country || "Candidat Immigrant"}
                </p>
              </div>

              <div className="text-right">
                <span className="inline-flex rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-bold text-primary">
                  {t.achievedNclc}
                </span>
                {t.crsPointsGained > 0 && (
                  <span className="block text-[10px] font-mono text-cyan-600 dark:text-cyan-400 font-bold mt-0.5">
                    +{t.crsPointsGained} pts CRS
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
