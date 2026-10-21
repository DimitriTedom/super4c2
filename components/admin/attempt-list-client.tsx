"use client";

import React, { useState } from "react";
import {
  GraduationCap,
  Sparkles,
  Trash2,
  Copy,
  Mail,
  Square,
  CheckSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfirmActionDialog } from "@/components/admin/ConfirmActionDialog";
import { AdminBatchActionBar } from "@/components/admin/admin-batch-action-bar";
import { AttemptInspectDialog } from "@/components/admin/attempt-inspect-dialog";
import { getDisciplineMeta } from "@/lib/dashboard/attempt-utils";
import { downloadCsv } from "@/lib/admin-csv-export";
import { toast } from "sonner";
import {
  deleteAttemptAction,
  batchDeleteAttemptsAction,
} from "@/app/admin/tentatives/actions";

export interface AttemptRowData {
  id: string;
  discipline: string;
  rawScore: number;
  tcfScaledScore: number;
  nclcLevel: number;
  crsPointsUnlocked: number;
  answers: unknown;
  feedback: unknown;
  createdAt: Date | string;
  user?: {
    email: string;
    profile?: {
      displayName: string | null;
    } | null;
  } | null;
}

interface AttemptListClientProps {
  attempts: AttemptRowData[];
}

export function AttemptListClient({ attempts }: AttemptListClientProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const isAllSelected =
    attempts.length > 0 && selectedIds.length === attempts.length;

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(attempts.map((a) => a.id));
    }
  };

  const toggleSelectOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const selectedAttempts = attempts.filter((a) => selectedIds.includes(a.id));

  // 1. Export CSV ciblé
  const handleExportCsv = () => {
    const itemsToExport =
      selectedAttempts.length > 0 ? selectedAttempts : attempts;

    downloadCsv(
      `copies-examen-super4c2-${new Date().toISOString().slice(0, 10)}`,
      itemsToExport.map((a) => {
        const candidateName =
          a.user?.profile?.displayName ||
          a.user?.email?.split("@")[0] ||
          "Anonyme";
        const meta = getDisciplineMeta(a.discipline);

        return {
          id: a.id,
          candidat: candidateName,
          email: a.user?.email || "Visiteur",
          epreuve: meta.label,
          score_brut: a.rawScore,
          score_tcf: a.tcfScaledScore,
          niveau_nclc: `NCLC ${a.nclcLevel}`,
          points_crs: a.crsPointsUnlocked > 0 ? `+${a.crsPointsUnlocked} pts` : "0 pt",
          date_passation: new Date(a.createdAt).toLocaleString("fr-FR"),
        };
      }),
      [
        { key: "candidat", label: "Candidat" },
        { key: "email", label: "Email" },
        { key: "epreuve", label: "Épreuve" },
        { key: "score_brut", label: "Score Brut" },
        { key: "score_tcf", label: "Score TCF (/699)" },
        { key: "niveau_nclc", label: "Niveau NCLC" },
        { key: "points_crs", label: "Points CRS Canada" },
        { key: "date_passation", label: "Date de Passation" },
      ]
    );
    toast.success(`${itemsToExport.length} copie(s) exportée(s) en CSV.`);
  };

  // 2. Copie groupée des e-mails des candidats sélectionnés
  const handleCopyEmails = async () => {
    const emails = Array.from(
      new Set(
        selectedAttempts
          .map((a) => a.user?.email)
          .filter((e): e is string => Boolean(e && e.includes("@")))
      )
    );

    if (emails.length === 0) {
      toast.warning("Aucune adresse e-mail dans la sélection.");
      return;
    }

    try {
      await navigator.clipboard.writeText(emails.join(", "));
      toast.success(
        `${emails.length} adresse(s) e-mail copiée(s) dans le presse-papier.`
      );
    } catch {
      toast.error("Impossible de copier les adresses e-mail.");
    }
  };

  // 3. Suppression en lot (Purge)
  const handleBatchDelete = async () => {
    if (selectedIds.length === 0) return;
    try {
      const res = await batchDeleteAttemptsAction(selectedIds);
      toast.success(`${res.count} copie(s) de session supprimée(s).`);
      setSelectedIds([]);
    } catch {
      toast.error("Erreur lors de la suppression en lot.");
    }
  };

  if (attempts.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed p-12 text-center bg-card/40 space-y-3">
        <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto text-primary">
          <GraduationCap className="h-6 w-6" />
        </div>
        <h3 className="font-bold text-base text-foreground">
          Aucune tentative trouvée
        </h3>
        <p className="text-xs text-muted-foreground max-w-sm mx-auto">
          Aucune session d&apos;examen ne correspond à vos filtres actuels.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-2xl border bg-card shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b bg-muted/30 text-muted-foreground font-semibold">
                <th className="py-3 px-4 w-10 text-center">
                  <button
                    type="button"
                    onClick={toggleSelectAll}
                    className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                    title={isAllSelected ? "Tout désélectionner" : "Tout sélectionner"}
                  >
                    {isAllSelected ? (
                      <CheckSquare className="h-4 w-4 text-primary" />
                    ) : (
                      <Square className="h-4 w-4" />
                    )}
                  </button>
                </th>
                <th className="py-3 px-4">Candidat</th>
                <th className="py-3 px-4">Épreuve</th>
                <th className="py-3 px-4 text-center">Score Brut</th>
                <th className="py-3 px-4 text-center">Score TCF</th>
                <th className="py-3 px-4 text-center">Niveau NCLC</th>
                <th className="py-3 px-4 text-center">Bonus CRS</th>
                <th className="py-3 px-4">Date de Passation</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {attempts.map((attempt) => {
                const isSelected = selectedIds.includes(attempt.id);
                const meta = getDisciplineMeta(attempt.discipline);
                const candidateName =
                  attempt.user?.profile?.displayName ||
                  attempt.user?.email?.split("@")[0] ||
                  "Anonyme";
                const candidateEmail =
                  attempt.user?.email || "Visiteur non connecté";
                const isNclc7Plus = attempt.nclcLevel >= 7;

                return (
                  <tr
                    key={attempt.id}
                    className={`transition-colors ${
                      isSelected ? "bg-primary/5 hover:bg-primary/10" : "hover:bg-muted/30"
                    }`}
                  >
                    {/* Checkbox */}
                    <td className="py-3 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => toggleSelectOne(attempt.id)}
                        className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                        title={isSelected ? "Désélectionner" : "Sélectionner"}
                      >
                        {isSelected ? (
                          <CheckSquare className="h-4 w-4 text-primary" />
                        ) : (
                          <Square className="h-4 w-4" />
                        )}
                      </button>
                    </td>

                    {/* Candidate */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="h-8 w-8 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center shrink-0">
                          {candidateName.slice(0, 2).toUpperCase()}
                        </div>
                        <div className="space-y-0.5">
                          <p className="font-bold text-foreground text-xs">
                            {candidateName}
                          </p>
                          <p className="text-[11px] text-muted-foreground font-mono">
                            {candidateEmail}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Discipline */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5 font-semibold text-foreground">
                        <span>{meta.emoji}</span>
                        <span>{meta.label}</span>
                      </div>
                    </td>

                    {/* Raw Score */}
                    <td className="py-3 px-4 text-center font-mono">
                      {attempt.discipline === "EXPRESSION_ECRITE"
                        ? `${attempt.rawScore} / 20`
                        : attempt.discipline === "EXPRESSION_ORALE"
                        ? `${attempt.rawScore} / 20`
                        : `${attempt.rawScore} / 39`}
                    </td>

                    {/* Scaled Score */}
                    <td className="py-3 px-4 text-center font-mono font-bold text-primary">
                      {attempt.tcfScaledScore} / 699
                    </td>

                    {/* NCLC Level */}
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border ${
                          isNclc7Plus
                            ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/30"
                            : "bg-muted text-muted-foreground border-border"
                        }`}
                      >
                        NCLC {attempt.nclcLevel}
                      </span>
                    </td>

                    {/* Bonus CRS */}
                    <td className="py-3 px-4 text-center">
                      {attempt.crsPointsUnlocked > 0 ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 font-mono">
                          <Sparkles className="h-2.5 w-2.5" />
                          +{attempt.crsPointsUnlocked} pts
                        </span>
                      ) : (
                        <span className="text-[11px] text-muted-foreground font-mono">
                          0 pt
                        </span>
                      )}
                    </td>

                    {/* Date */}
                    <td className="py-3 px-4 text-muted-foreground text-[11px]">
                      {new Date(attempt.createdAt).toLocaleString("fr-FR", {
                        dateStyle: "short",
                        timeStyle: "short",
                      })}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <AttemptInspectDialog attempt={attempt} />

                        <form
                          id={`del-attempt-${attempt.id}`}
                          action={deleteAttemptAction}
                        >
                          <input type="hidden" name="id" value={attempt.id} />
                        </form>

                        <ConfirmActionDialog
                          trigger={
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                              title="Supprimer la session"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          }
                          title="Supprimer cette session d'examen ?"
                          description="Êtes-vous sûr de vouloir supprimer définitivement cette tentative de la base de données ? Cette action est irréversible."
                          confirmLabel="Supprimer"
                          formId={`del-attempt-${attempt.id}`}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Barre d'Actions en Lot Flottante */}
      <AdminBatchActionBar
        selectedCount={selectedIds.length}
        onClearSelection={() => setSelectedIds([])}
        itemName="copies d'examen"
        onExportCsv={handleExportCsv}
        onDeleteSelected={handleBatchDelete}
        customActions={
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyEmails}
            className="h-8 gap-1.5 text-xs font-semibold bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700 hover:text-white"
            title="Copier les adresses e-mail des candidats sélectionnés"
          >
            <Mail className="h-3.5 w-3.5" />
            <span>Copier Emails</span>
          </Button>
        }
      />
    </>
  );
}
