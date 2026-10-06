import Link from "next/link";
import { redirect } from "next/navigation";
import { BookOpenText, Headphones, PenTool, Mic, BookMarked, Sparkles, Trophy, ArrowRight } from "lucide-react";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Tableau de Bord Candidat — Objectif NCLC 7 / C2",
};

export default async function DashboardPage() {
  const supabase = await createSupabaseServerClient();
  const user = supabase ? (await supabase.auth.getUser()).data.user : null;

  if (!user) {
    redirect("/auth/login?next=/dashboard");
  }

  // Profil simulé candidat
  const currentSkills = [
    { code: "CE", name: "Compréhension Écrite", level: 8, target: 7, ok: true, href: "/examens/demo-101/ce", icon: BookOpenText },
    { code: "CO", name: "Compréhension Orale", level: 7, target: 7, ok: true, href: "/examens/demo-101-co/co", icon: Headphones },
    { code: "EE", name: "Expression Écrite", level: 7, target: 7, ok: true, href: "/examens/demo-101-ee/ee", icon: PenTool },
    { code: "EO", name: "Expression Orale", level: 6, target: 7, ok: false, href: "/examens/demo-101-eo/eo", icon: Mic },
  ];

  return (
    <div className="space-y-10 py-2">
      {/* Header candidat */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-primary">
            Espace d&apos;Entraînement TCF Canada
          </span>
          <h1 className="font-display text-3xl font-extrabold tracking-tight mt-1">
            Bienvenue, {user.email?.split("@")[0]}
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Objectif : <strong>NCLC 7 dans les 4 épreuves</strong> pour valider les +50 points bonus Entrée Express.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button asChild variant="outline">
            <Link href="/carnet-erreurs" className="gap-2">
              <BookMarked className="h-4 w-4 text-[#E51A31]" />
              <span>Carnet d&apos;Erreurs (4)</span>
            </Link>
          </Button>
          <Button asChild className="bg-[#E51A31] hover:bg-[#B31224] text-white">
            <Link href="/examens" className="gap-2">
              <Sparkles className="h-4 w-4" />
              <span>Simulateur d&apos;Examen</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* Radar des 4 compétences NCLC */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-bold">Votre Niveau par Épreuve (NCLC)</h2>
          <Link href="/nclc-calculator" className="text-xs text-primary font-semibold hover:underline flex items-center gap-1">
            Calculateur de points CRS <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {currentSkills.map((sk) => {
            const Icon = sk.icon;
            return (
              <div
                key={sk.code}
                className="rounded-2xl border bg-card p-5 space-y-4 shadow-sm transition-all hover:border-primary/40"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span
                    className={`font-mono text-xs font-bold px-2 py-0.5 rounded-full border ${
                      sk.ok
                        ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                        : "bg-amber-500/10 text-amber-600 border-amber-500/20"
                    }`}
                  >
                    {sk.ok ? "Seuil NCLC 7 atteint ✓" : "Priorité de révision ⚠"}
                  </span>
                </div>

                <div>
                  <h3 className="font-display text-sm font-bold text-foreground">{sk.name}</h3>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="font-display text-3xl font-black text-foreground">
                      NCLC {sk.level}
                    </span>
                    <span className="text-xs text-muted-foreground">Cible : NCLC {sk.target}</span>
                  </div>
                </div>

                <Button asChild variant="outline" size="sm" className="w-full text-xs">
                  <Link href={sk.href}>S&apos;entraîner en conditions réelles</Link>
                </Button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bannière Défi Entrée Express */}
      <div className="rounded-2xl border bg-gradient-to-r from-primary/10 via-background to-cyan-500/10 p-6 sm:p-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
              <Trophy className="h-4 w-4" />
              Impact Entrée Express Canada
            </span>
            <h3 className="font-display text-2xl font-black text-foreground">
              Plus qu&apos;une épreuve à hisser au niveau NCLC 7 !
            </h3>
            <p className="text-sm text-muted-foreground max-w-xl">
              Votre Expression Orale est actuellement à NCLC 6. En gagnant un échelon grâce à nos séances de jeu de rôle IA, vous débloquerez instantanément les <strong>+50 points CRS francophones</strong>.
            </p>
          </div>

          <Button asChild size="lg" className="bg-[#E51A31] hover:bg-[#B31224] text-white shrink-0">
            <Link href="/examens/demo-101-eo/intro" className="gap-2">
              <Mic className="h-4 w-4" />
              Lancer l&apos;Oral IA maintenant
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
