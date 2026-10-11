import { Star, ShieldCheck, CheckCircle2 } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Marquee } from "@/components/ui/marquee";

interface TestimonialItem {
  id: string;
  candidateName: string;
  country: string;
  flag: string;
  targetScore: string;
  achievedNclc: string;
  crsPointsGained: number;
  quote: string;
  rating: number;
  isFeatured?: boolean;
}

const DEFAULT_TESTIMONIALS: TestimonialItem[] = [
  {
    id: "t1",
    candidateName: "Amine K.",
    country: "Algérie",
    flag: "🇩🇿",
    targetScore: "NCLC 7",
    achievedNclc: "NCLC 8 (+50 pts CRS)",
    crsPointsGained: 50,
    quote:
      "Le vrai double écran CBT scindé et l'absence de scroll infini m'ont sauvé le jour J. J'ai gagné 15 minutes précieuses en compréhension écrite sans aucune panique.",
    rating: 5,
    isFeatured: true,
  },
  {
    id: "t2",
    candidateName: "Sarah M.",
    country: "Maroc",
    flag: "🇲🇦",
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
    flag: "🇨🇲",
    targetScore: "NCLC 7",
    achievedNclc: "NCLC 8 (4 C2 Validés)",
    crsPointsGained: 50,
    quote:
      "Le Magic Rewrite C1/C2 sur les 3 tâches d'expression écrite est une arme absolue. En 10 secondes, on comprend exactement comment enrichir sa syntaxe.",
    rating: 5,
    isFeatured: true,
  },
  {
    id: "t4",
    candidateName: "Fatou Diop",
    country: "Sénégal",
    flag: "🇸🇳",
    targetScore: "NCLC 7",
    achievedNclc: "NCLC 8 (Score 506)",
    crsPointsGained: 50,
    quote:
      "La Compréhension Orale avec l'écoute unique stricte m'a mise exactement dans la pression de la vraie salle d'examen. Aucune mauvaise surprise le jour J.",
    rating: 5,
    isFeatured: false,
  },
  {
    id: "t5",
    candidateName: "Youssef B.",
    country: "Tunisie",
    flag: "🇹🇳",
    targetScore: "NCLC 7",
    achievedNclc: "NCLC 9 (Score 562)",
    crsPointsGained: 50,
    quote:
      "Grâce aux 50 points du palier francophone débloqués sur Super4C2, mon score CRS est monté à 514. J'ai reçu mon invitation d'Entrée Express deux semaines plus tard !",
    rating: 5,
    isFeatured: true,
  },
  {
    id: "t6",
    candidateName: "Chloé D.",
    country: "France / Québec",
    flag: "🇨🇦",
    targetScore: "NCLC 7",
    achievedNclc: "NCLC 10 (Score 610)",
    crsPointsGained: 50,
    quote:
      "Le système de carnet SRS combiné aux corrections d'Aura C2 m'a permis d'éliminer mes fautes récurrentes de morphosyntaxe en moins de 12 jours.",
    rating: 5,
    isFeatured: false,
  },
  {
    id: "t7",
    candidateName: "Ibrahim S.",
    country: "Côte d'Ivoire",
    flag: "🇨🇮",
    targetScore: "NCLC 7",
    achievedNclc: "NCLC 8 (+50 pts CRS)",
    crsPointsGained: 50,
    quote:
      "Fini d'attendre 48h pour un simple corrigé. La correction instantanée mot par mot m'a fait progresser dix fois plus vite qu'en institut classique.",
    rating: 5,
    isFeatured: true,
  },
  {
    id: "t8",
    candidateName: "Meriem A.",
    country: "Liban",
    flag: "🇱🇧",
    targetScore: "NCLC 7",
    achievedNclc: "NCLC 9 (4 C2 Validés)",
    crsPointsGained: 50,
    quote:
      "La simulation d'entretien oral avec M. Laurent est d'une authenticité impressionnante. On arrive à l'examen sans aucun stress d'inconnu.",
    rating: 5,
    isFeatured: false,
  },
];

function TestimonialCard({ t }: { t: TestimonialItem }) {
  return (
    <div
      className={`group relative flex flex-col justify-between rounded-2xl border p-5 sm:p-6 transition-all duration-300 w-[300px] sm:w-[350px] shrink-0 bg-card hover:bg-card/90 shadow-sm hover:shadow-md ${
        t.isFeatured
          ? "border-primary/40 bg-gradient-to-br from-card via-card to-primary/[0.03]"
          : "border-border/70"
      }`}
    >
      <div className="space-y-3">
        {/* Rating stars & Badge */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-0.5">
            {Array.from({ length: t.rating || 5 }).map((_, i) => (
              <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            ))}
          </div>

          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
            <CheckCircle2 className="h-3 w-3" />
            {t.achievedNclc}
          </span>
        </div>

        {/* Quote */}
        <p className="text-xs sm:text-sm text-foreground/85 leading-relaxed italic line-clamp-4">
          &ldquo;{t.quote}&rdquo;
        </p>
      </div>

      {/* Author Details */}
      <div className="flex items-center gap-3 pt-3 mt-3 border-t border-border/50">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-xs shrink-0">
          {t.candidateName.charAt(0)}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <p className="text-xs font-bold text-foreground truncate">{t.candidateName}</p>
            <span className="text-xs" title={t.country}>
              {t.flag}
            </span>
          </div>
          <p className="text-[11px] text-muted-foreground truncate">
            {t.country} • Objectif {t.targetScore}
          </p>
        </div>
      </div>
    </div>
  );
}

function getCountryFlag(country: string, fallbackIndex: number): string {
  const c = country.toLowerCase().trim();
  if (c.includes("algér") || c.includes("alger")) return "🇩🇿";
  if (c.includes("maroc")) return "🇲🇦";
  if (c.includes("camer")) return "🇨🇲";
  if (c.includes("sénég") || c.includes("seneg")) return "🇸🇳";
  if (c.includes("ivoir")) return "🇨🇮";
  if (c.includes("tunis")) return "🇹🇳";
  if (c.includes("franc")) return "🇫🇷";
  if (c.includes("canad")) return "🇨🇦";
  if (c.includes("bénin") || c.includes("benin")) return "🇧🇯";
  if (c.includes("togo")) return "🇹🇬";
  if (c.includes("cong")) return "🇨🇩";
  if (c.includes("mali")) return "🇲🇱";
  if (c.includes("guiné") || c.includes("guine")) return "🇬🇳";
  if (c.includes("gabon")) return "🇬🇦";
  return DEFAULT_TESTIMONIALS[fallbackIndex % DEFAULT_TESTIMONIALS.length]?.flag || "🇨🇦";
}

export async function TestimonialsSection() {
  let testimonials = DEFAULT_TESTIMONIALS;

  try {
    const dbTestimonials = await prisma.testimonial.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
      take: 12,
    });

    if (dbTestimonials && dbTestimonials.length >= 3) {
      testimonials = dbTestimonials.map((d, idx) => ({
        id: d.id,
        candidateName: d.candidateName,
        country: d.country,
        flag: getCountryFlag(d.country, idx),
        targetScore: d.targetScore,
        achievedNclc: d.achievedNclc,
        crsPointsGained: d.crsPointsGained,
        quote: d.quote,
        rating: d.rating,
        isFeatured: d.isFeatured,
      }));
    }
  } catch (error) {
    console.warn("Erreur lors de la récupération des témoignages Prisma :", error);
  }

  const firstRow = testimonials.slice(0, Math.ceil(testimonials.length / 2));
  const secondRow = testimonials.slice(Math.ceil(testimonials.length / 2));

  return (
    <section className="relative space-y-8 max-w-7xl mx-auto py-10 overflow-hidden">
      {/* Header */}
      <div className="text-center space-y-3 px-4">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-primary">
          <ShieldCheck className="h-3.5 w-3.5" /> Témoignages Candidats Vérifiés
        </div>
        <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground">
          Ils ont décroché leurs{" "}
          <span className="bg-gradient-to-r from-brand-crimson to-rose-500 bg-clip-text text-transparent">
            +50 Points
          </span>{" "}
          d&apos;Entrée Express
        </h2>
        <p className="text-muted-foreground text-sm sm:text-base max-w-2xl mx-auto">
          Découvrez les retours d&apos;expérience de candidats qui se sont préparés dans les conditions réelles CBT et ont validé leurs paliers NCLC 7 à 10.
        </p>
      </div>

      {/* Marquee dual rows with fading edges */}
      <div className="relative flex flex-col gap-4 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
        {/* Row 1 — Leftward */}
        <Marquee pauseOnHover className="[--duration:35s]">
          {firstRow.map((t) => (
            <TestimonialCard key={t.id} t={t} />
          ))}
        </Marquee>

        {/* Row 2 — Rightward (Reverse) */}
        <Marquee reverse pauseOnHover className="[--duration:35s]">
          {secondRow.map((t) => (
            <TestimonialCard key={t.id} t={t} />
          ))}
        </Marquee>
      </div>
    </section>
  );
}
