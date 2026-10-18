import Link from "next/link";
import Image from "next/image";
import { BookOpen, Calculator, FileQuestion, Home, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "404 — Page introuvable | Super4C2",
  description: "La ressource demandée n'existe pas ou a été déplacée.",
};

export default function NotFoundPage() {
  return (
    <div className="flex min-h-[calc(100vh-14rem)] flex-col items-center justify-center px-4 py-16 text-center">
      {/* 3D Critical Error Icon */}
      <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-3xl bg-red-500/10 border-2 border-red-500/20 p-2 shadow-xl">
        <Image
          src="/brand/icons-3d/state-error-critical.png"
          alt="Page introuvable ou Erreur 404 3D"
          width={88}
          height={88}
          className="h-full w-full object-contain drop-shadow-md"
          priority
        />
      </div>

      {/* 404 Badge */}
      <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-primary mb-4">
        <FileQuestion className="h-4 w-4" /> Erreur 404 · Document introuvable
      </div>

      {/* Massive 404 display */}
      <h1 className="font-display text-7xl sm:text-9xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-primary via-primary/80 to-primary/30">
        404
      </h1>

      <h2 className="mt-4 font-display text-2xl sm:text-3xl font-extrabold tracking-tight">
        Cette question ou page n&apos;est pas dans le livret d&apos;examen
      </h2>

      <p className="mt-3 max-w-md text-base text-muted-foreground leading-relaxed">
        Le lien que vous avez suivi a peut-être expiré ou été déplacé. Ne perdez pas une minute de révision et reprenez votre entraînement :
      </p>

      {/* Quick Action Navigation Grid */}
      <div className="mt-8 grid w-full max-w-xl gap-4 sm:grid-cols-3 text-left">
        <Link
          href="/examens"
          className="group rounded-2xl border bg-card p-4 transition-all hover:-translate-y-1 hover:border-primary/50 hover:shadow-md"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary mb-2">
            <BookOpen className="h-4 w-4" />
          </div>
          <h3 className="font-display text-sm font-bold group-hover:text-primary transition-colors">
            Séries TCF Canada
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">Simulateur CBT 39Q</p>
        </Link>

        <Link
          href="/nclc-calculator"
          className="group rounded-2xl border bg-card p-4 transition-all hover:-translate-y-1 hover:border-primary/50 hover:shadow-md"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary mb-2">
            <Calculator className="h-4 w-4" />
          </div>
          <h3 className="font-display text-sm font-bold group-hover:text-primary transition-colors">
            Simulateur CRS
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">+50 pts Entrée Express</p>
        </Link>

        <Link
          href="/carnet-erreurs"
          className="group rounded-2xl border bg-card p-4 transition-all hover:-translate-y-1 hover:border-primary/50 hover:shadow-md"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary mb-2">
            <Sparkles className="h-4 w-4" />
          </div>
          <h3 className="font-display text-sm font-bold group-hover:text-primary transition-colors">
            Carnet SRS
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">Pièges et révisions</p>
        </Link>
      </div>

      {/* Main Home Button */}
      <div className="mt-10">
        <Button asChild size="lg" className="font-bold shadow-xs px-8">
          <Link href="/">
            <Home className="mr-2 h-4 w-4" />
            Retourner à l&apos;accueil Super4C2
          </Link>
        </Button>
      </div>
    </div>
  );
}
