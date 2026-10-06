"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Points officiels Entrée Express IRCC (sans conjoint)
const POINTS_PAR_NCLC: Record<number, number> = {
  4: 6,
  5: 9,
  6: 17,
  7: 23,
  8: 23,
  9: 31,
  10: 34,
};

export function CrsCalculator() {
  const [ceLevel, setCeLevel] = useState<number>(7);
  const [coLevel, setCoLevel] = useState<number>(7);
  const [eeLevel, setEeLevel] = useState<number>(7);
  const [eoLevel, setEoLevel] = useState<number>(7);
  const [hasPostSecondary, setHasPostSecondary] = useState<boolean>(true);
  const [clbEnglish, setClbEnglish] = useState<"clb5_plus" | "clb4_minus">("clb5_plus");

  // Calculs
  const { basePoints, bonusFrancophone, bonusTransferability, totalCrsPoints, allNclc7Plus } = useMemo(() => {
    const base =
      POINTS_PAR_NCLC[ceLevel] +
      POINTS_PAR_NCLC[coLevel] +
      POINTS_PAR_NCLC[eeLevel] +
      POINTS_PAR_NCLC[eoLevel];

    const all7 = ceLevel >= 7 && coLevel >= 7 && eeLevel >= 7 && eoLevel >= 7;

    // Bonus Francophone officiel IRCC (Section C)
    let bFranco = 0;
    if (all7) {
      bFranco = clbEnglish === "clb5_plus" ? 50 : 25;
    }

    // Facteurs de transférabilité des compétences (diplôme + langue)
    let bTransfer = 0;
    if (hasPostSecondary) {
      bTransfer = all7 ? 50 : 25;
    }

    return {
      basePoints: base,
      bonusFrancophone: bFranco,
      bonusTransferability: bTransfer,
      totalCrsPoints: base + bFranco + bTransfer,
      allNclc7Plus: all7,
    };
  }, [ceLevel, coLevel, eeLevel, eoLevel, hasPostSecondary, clbEnglish]);

  return (
    <div className="grid gap-8 lg:grid-cols-12 max-w-6xl mx-auto items-start">
      {/* Colonne Gauche : Paramètres & Sliders */}
      <div className="lg:col-span-7 space-y-6">
        <div className="rounded-2xl border bg-card p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="border-b pb-4">
            <h2 className="font-display text-xl font-bold text-foreground">
              Configurez vos Niveaux NCLC par Épreuve
            </h2>
            <p className="text-xs text-muted-foreground mt-1">
              Évaluez l&apos;impact d&apos;un passage de NCLC 5 ou 6 au seuil critique NCLC 7 (B2 avancé)
            </p>
          </div>

          {/* Slider CE */}
          <SkillSlider
            label="Compréhension Écrite (CE)"
            value={ceLevel}
            onChange={setCeLevel}
            desc="Articles, notes de synthèse, documents d'actualité"
          />

          {/* Slider CO */}
          <SkillSlider
            label="Compréhension Orale (CO)"
            value={coLevel}
            onChange={setCoLevel}
            desc="Conversations, annonces radio, conférences"
          />

          {/* Slider EE */}
          <SkillSlider
            label="Expression Écrite (EE)"
            value={eeLevel}
            onChange={setEeLevel}
            desc="Messages, récits personnels et argumentation"
          />

          {/* Slider EO */}
          <SkillSlider
            label="Expression Orale (EO)"
            value={eoLevel}
            onChange={setEoLevel}
            desc="Entretien dirigé, jeu de rôle et prise de position"
          />

          {/* Options de Profil */}
          <div className="border-t pt-5 space-y-4">
            <h3 className="font-display text-sm font-bold text-foreground">
              Paramètres Complémentaires Entrée Express :
            </h3>

            <div className="flex items-center justify-between p-3 rounded-xl border bg-muted/30">
              <div>
                <p className="text-sm font-medium">Diplôme postsecondaire (Bac+3 ou plus)</p>
                <p className="text-xs text-muted-foreground">Débloque le facteur de transférabilité</p>
              </div>
              <input
                type="checkbox"
                checked={hasPostSecondary}
                onChange={(e) => setHasPostSecondary(e.target.checked)}
                className="h-5 w-5 rounded accent-primary cursor-pointer"
              />
            </div>

            <div className="p-3 rounded-xl border bg-muted/30 space-y-2">
              <p className="text-sm font-medium">Niveau d&apos;Anglais (IELTS / CELPIP) :</p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setClbEnglish("clb5_plus")}
                  className={cn(
                    "rounded-lg p-2.5 font-medium border text-left transition-all",
                    clbEnglish === "clb5_plus"
                      ? "border-primary bg-primary/10 text-primary font-bold shadow-sm"
                      : "bg-background text-muted-foreground"
                  )}
                >
                  CLB 5 ou plus (+50 pts)
                </button>
                <button
                  type="button"
                  onClick={() => setClbEnglish("clb4_minus")}
                  className={cn(
                    "rounded-lg p-2.5 font-medium border text-left transition-all",
                    clbEnglish === "clb4_minus"
                      ? "border-primary bg-primary/10 text-primary font-bold shadow-sm"
                      : "bg-background text-muted-foreground"
                  )}
                >
                  CLB 4 ou moins (+25 pts)
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Colonne Droite : Jauge de Points & Call to Action */}
      <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
        <div className="rounded-2xl border bg-card p-6 sm:p-8 space-y-6 shadow-lg border-primary/20">
          <div className="text-center space-y-1 border-b pb-6">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              Impact CRS Entrée Express Estimé
            </span>
            <div className="font-display text-6xl font-black text-foreground pt-2 tabular-nums">
              +{totalCrsPoints}
              <span className="text-2xl text-muted-foreground font-normal ml-1">pts</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Points additionnels apportés par votre niveau de français
            </p>
          </div>

          {/* Décomposition des gains */}
          <div className="space-y-3 text-sm">
            <div className="flex justify-between items-center py-1">
              <span className="text-muted-foreground">Points Linguistiques Directs :</span>
              <span className="font-mono font-bold">+{basePoints} pts</span>
            </div>

            <div className="flex justify-between items-center py-1 border-t border-dashed">
              <span className="text-muted-foreground">Bonus Francophone Officiel (C) :</span>
              <span className={cn("font-mono font-bold", bonusFrancophone > 0 ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground")}>
                +{bonusFrancophone} pts
              </span>
            </div>

            <div className="flex justify-between items-center py-1 border-t border-dashed">
              <span className="text-muted-foreground">Transférabilité des Compétences :</span>
              <span className="font-mono font-bold text-primary">+{bonusTransferability} pts</span>
            </div>
          </div>

          {/* Verdict NCLC 7 */}
          <div
            className={cn(
              "rounded-xl p-4 text-xs space-y-2 border",
              allNclc7Plus
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-900 dark:text-emerald-200"
                : "bg-amber-500/10 border-amber-500/30 text-amber-900 dark:text-amber-200"
            )}
          >
            <div className="flex items-center gap-2 font-bold text-sm">
              {allNclc7Plus ? (
                <>
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                  <span>Palier NCLC 7 Atteint dans les 4 Épreuves !</span>
                </>
              ) : (
                <>
                  <Flame className="h-5 w-5 text-amber-600 shrink-0" />
                  <span>Seuil NCLC 7 Incomplet</span>
                </>
              )}
            </div>

            <p className="leading-relaxed">
              {allNclc7Plus
                ? "Félicitations ! Vous débloquez l'intégralité des 50 points bonus francophones d'IRCC. Ce gain propulse votre profil parmi les premiers sélectionnés des rondes d'invitation Entrée Express."
                : "Attention : si une seule des 4 épreuves reste en dessous de NCLC 7, vous perdez la totalité du bonus de 50 points francophone d'IRCC !"}
            </p>
          </div>

          {/* CTA de conversion */}
          <div className="pt-2">
            <Button
              asChild
              size="lg"
              className="w-full bg-[#E51A31] hover:bg-[#B31224] text-white font-bold text-base shadow-md h-12"
            >
              <Link href="/examens" className="flex items-center justify-center gap-2">
                <span>Garantir mes +{totalCrsPoints} Points avec Super4C2</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SkillSlider({
  label,
  value,
  onChange,
  desc,
}: {
  label: string;
  value: number;
  onChange: (val: number) => void;
  desc: string;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div>
          <span className="font-display text-sm font-bold text-foreground block">{label}</span>
          <span className="text-[11px] text-muted-foreground">{desc}</span>
        </div>
        <div
          className={cn(
            "rounded-lg px-2.5 py-1 font-mono text-xs font-bold tabular-nums border",
            value >= 7
              ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
              : "bg-muted text-muted-foreground border-transparent"
          )}
        >
          NCLC {value} {value >= 7 ? "(B2+)" : "(< B2)"}
        </div>
      </div>

      <input
        type="range"
        min={4}
        max={10}
        step={1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-[#E51A31]"
      />

      <div className="flex justify-between text-[10px] text-muted-foreground font-mono">
        <span>NCLC 4 (A2)</span>
        <span>NCLC 5 (B1)</span>
        <span>NCLC 6</span>
        <span className="text-[#E51A31] font-bold">NCLC 7 (Seuil)</span>
        <span>NCLC 8</span>
        <span>NCLC 9 (C1)</span>
        <span>NCLC 10 (C2)</span>
      </div>
    </div>
  );
}
