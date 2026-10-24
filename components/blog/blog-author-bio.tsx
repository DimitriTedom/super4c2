import React from "react";
import { CheckCircle2, ShieldCheck, Award } from "lucide-react";

interface BlogAuthorBioProps {
  name: string;
  role: string;
}

export function BlogAuthorBio({ name, role }: BlogAuthorBioProps) {
  // Initials
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-4">
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-crimson to-amber-600 font-display text-lg font-black text-white shadow-md">
          {initials || "DT"}
        </div>

        {/* Info */}
        <div className="space-y-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="font-display text-base font-bold text-foreground">
              {name}
            </h4>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <CheckCircle2 className="h-3 w-3" />
              Expert Vérifié
            </span>
          </div>

          <p className="text-xs font-semibold text-primary">
            {role}
          </p>

          <p className="text-xs text-muted-foreground leading-relaxed pt-1">
            Spécialiste de la préparation aux examens de français et d&apos;anglais pour l&apos;immigration canadienne (Entrée Express, Arrima, permis d&apos;études). Concepteur des simulateurs CBT et de l&apos;examinateur vocal interactif Super4C2.
          </p>
        </div>
      </div>

      {/* Trust & E-E-A-T Note */}
      <div className="pt-3 border-t border-border/60 flex items-center gap-2 text-[11px] text-muted-foreground">
        <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0" />
        <span>
          Guide édité et mis à jour conformément aux grilles officielles de France Éducation International (FEI) et des seuils IRCC 2026.
        </span>
      </div>
    </div>
  );
}
