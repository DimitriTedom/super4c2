"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  ArrowLeft,
  Award,
  Download,
  FileText,
  Loader2,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Trash2,
  Bot,
  UserCheck,
  Mic,
  MessageSquare,
  Quote,
  CheckCircle2,
  Gauge,
  HelpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  getAttemptDate,
  getDisciplineMeta,
  getTaskEvaluations,
  parseAnswers,
  parseOralFeedback,
  parseOralDialogues,
  type UserAttemptFull,
} from "@/lib/dashboard/attempt-utils";
import { exportAttemptPdf } from "@/lib/dashboard/attempt-export";
import { deleteUserAttemptAction } from "@/app/dashboard/historique/actions";
import { toast } from "sonner";

interface AttemptDetailViewProps {
  attempt: UserAttemptFull;
  isDemo?: boolean;
}

export function AttemptDetailView({ attempt, isDemo = false }: AttemptDetailViewProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("task-0");
  const [oralActiveTask, setOralActiveTask] = useState<number>(1);
  const [oralViewMode, setOralViewMode] = useState<"bilan" | "transcript">("bilan");
  const [isExporting, setIsExporting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const meta = getDisciplineMeta(attempt.discipline);
  const date = getAttemptDate(attempt);
  const validated = attempt.nclcLevel >= 7;
  const isWritten = attempt.discipline === "EXPRESSION_ECRITE";
  const isOral = attempt.discipline === "EXPRESSION_ORALE";

  // Données Écrites
  const evaluations = isWritten ? getTaskEvaluations(attempt) : [];
  const answers = isWritten ? parseAnswers(attempt) : [];

  // Données Orales
  const oralEvaluation = isOral ? parseOralFeedback(attempt) : null;
  const oralDialogues = isOral ? parseOralDialogues(attempt) : {};

  const handleExport = async () => {
    try {
      setIsExporting(true);
      await exportAttemptPdf(attempt);
    } catch (err) {
      console.error("Échec de l'export PDF :", err);
      toast.error("Impossible de générer le rapport PDF.");
    } finally {
      setIsExporting(false);
    }
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const res = await deleteUserAttemptAction(attempt.id);
      if (res.ok) {
        toast.success("Correction supprimée de votre historique.");
        router.push("/dashboard");
      } else {
        toast.error(res.error || "Impossible de supprimer cette correction.");
      }
    } catch {
      toast.error("Erreur réseau lors de la suppression.");
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDialogueTime = (ms?: number | string) => {
    if (ms === undefined || ms === null) return "";
    const num = Number(ms);
    if (isNaN(num)) return "";
    const totalSec = Math.floor(num / 1000);
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <div className="space-y-6">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Retour à l&apos;historique
      </Link>

      {isDemo && (
        <div className="flex items-center gap-2 rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-2.5 text-xs font-semibold text-amber-700 dark:text-amber-300">
          <Sparkles className="h-4 w-4 shrink-0" />
          Exemple illustratif : vos propres corrections apparaîtront ici avec le même niveau de détail et de personnalisation.
        </div>
      )}

      {/* En-tête Rapport de Correction */}
      <div className="rounded-3xl border bg-gradient-to-r from-brand-crimson/10 via-primary/5 to-amber-500/10 p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
              Rapport d&apos;Évaluation Officiel FEI
            </span>
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-foreground flex items-center gap-2">
              <span>{meta.emoji}</span>
              {meta.label}
            </h1>
            <p className="text-xs text-muted-foreground">
              {date.toLocaleDateString("fr-FR", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}{" "}
              à {date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6">
            <div>
              <span className="text-[10px] font-bold uppercase text-muted-foreground block">Note FEI</span>
              <span className="font-mono text-2xl font-black text-foreground">{attempt.rawScore}</span>
              <span className="text-sm text-muted-foreground"> / 20</span>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase text-muted-foreground block">Score TCF</span>
              <span className="font-mono text-2xl font-black text-foreground">{attempt.tcfScaledScore}</span>
              <span className="text-sm text-muted-foreground"> / 699</span>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase text-muted-foreground block">Palier NCLC</span>
              <span
                className={`inline-flex items-center rounded-full border px-3 py-1 font-mono text-xs font-extrabold ${
                  validated
                    ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30"
                    : "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30"
                }`}
              >
                NCLC {attempt.nclcLevel}
              </span>
            </div>
            {isOral && oralEvaluation?.wordsPerMinute ? (
              <div>
                <span className="text-[10px] font-bold uppercase text-muted-foreground block">Débit de parole</span>
                <span className="font-mono text-2xl font-black text-foreground">{oralEvaluation.wordsPerMinute}</span>
                <span className="text-sm text-muted-foreground"> mots/min</span>
              </div>
            ) : null}
          </div>
        </div>

        {/* Bandeau validation CRS */}
        <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t pt-5">
          <div
            className={`flex items-center gap-2 text-xs font-semibold ${
              validated ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"
            }`}
          >
            {validated ? <ShieldCheck className="h-4 w-4 shrink-0" /> : <AlertCircle className="h-4 w-4 shrink-0" />}
            <span>
              {validated
                ? "NCLC 7+ atteint : +50 points CRS Entrée Express débloqués."
                : "Palier à consolider : visez 10/20 pour atteindre le seuil NCLC 7 (+50 pts CRS)."}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button onClick={handleExport} disabled={isExporting} variant="outline" size="sm" className="gap-2 font-bold cursor-pointer">
              {isExporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
              {isExporting ? "Génération…" : "Export PDF"}
            </Button>
            <Button asChild size="sm" className="gap-2 bg-brand-crimson hover:bg-brand-crimson-dark text-white font-bold cursor-pointer">
              <Link href={`/examens?discipline=${isWritten ? "ee" : "eo"}`}>
                <RotateCcw className="h-4 w-4" />
                Refaire l&apos;épreuve
              </Link>
            </Button>
            {!isDemo && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowDeleteDialog(true)}
                className="gap-2 text-destructive border-destructive/30 hover:bg-destructive/10 hover:text-destructive font-bold text-xs cursor-pointer"
                title="Supprimer cette correction"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Supprimer</span>
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* CAS 1 : Épreuve d'Expression Écrite (EE) */}
      {isWritten ? (
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 rounded-2xl p-1 bg-muted/60 h-auto">
            {evaluations.map((ev, idx) => (
              <TabsTrigger key={idx} value={`task-${idx}`} className="rounded-xl py-2 text-xs sm:text-sm font-bold cursor-pointer">
                <span className="flex flex-col sm:flex-row sm:gap-1.5 items-center">
                  <span>Tâche {ev.taskNumber}</span>
                  <span className="font-mono opacity-70">{ev.taskScore}/20</span>
                </span>
              </TabsTrigger>
            ))}
          </TabsList>

          {evaluations.map((ev, idx) => (
            <TabsContent key={idx} value={`task-${idx}`} className="space-y-6 pt-4">
              {/* Copie soumise */}
              <div className="rounded-2xl border bg-card p-5 sm:p-6 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground">
                    Votre rédaction
                  </h3>
                  <span className="font-mono text-xs font-semibold text-muted-foreground">
                    {ev.wordCount} mots
                  </span>
                </div>
                <div className="rounded-xl border bg-muted/30 p-4 font-sans text-xs leading-relaxed whitespace-pre-wrap text-foreground">
                  {answers[idx] || (
                    <span className="italic text-muted-foreground">Aucun texte enregistré pour cette tâche.</span>
                  )}
                </div>
              </div>

              {/* Grille critériée FEI */}
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {ev.criteria.map((c) => (
                  <div key={c.criterion} className="rounded-2xl border bg-card p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-muted-foreground uppercase">{c.label}</span>
                      <span className="font-mono text-sm font-black text-foreground">{c.score} / 5</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all"
                        style={{ width: `${(c.score / 5) * 100}%` }}
                      />
                    </div>
                    <p className="text-[11px] text-muted-foreground leading-relaxed pt-1">{c.feedback}</p>
                  </div>
                ))}
              </div>

              {/* Feedback général */}
              {ev.generalFeedback && (
                <div className="rounded-2xl border bg-card p-5 space-y-2">
                  <h3 className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-primary">
                    <Award className="h-4 w-4" />
                    Commentaire pédagogique
                  </h3>
                  <p className="text-xs sm:text-sm text-foreground leading-relaxed">{ev.generalFeedback}</p>
                </div>
              )}

              {/* Points forts & Axes d'amélioration */}
              {ev.criteria.some((c) => c.strengths.length > 0 || c.improvements.length > 0) && (
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5 space-y-2">
                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4" /> Points forts constatés
                    </h3>
                    {ev.criteria.map((c) => (
                      <div key={`s-${c.criterion}`} className="space-y-1">
                        {c.strengths.map((s, i) => (
                          <div key={i} className="flex items-start gap-2 text-xs text-foreground">
                            <span className="text-emerald-500 font-bold">•</span>
                            <span>{s}</span>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>

                  <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5 space-y-2">
                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-2">
                      <AlertCircle className="h-4 w-4" /> Axes de progression prioritaires
                    </h3>
                    {ev.criteria.map((c) => (
                      <div key={`imp-${c.criterion}`} className="space-y-1">
                        {c.improvements.map((imp, i) => (
                          <div key={i} className="flex items-start gap-2 text-xs text-foreground">
                            <span className="text-amber-500 font-bold">•</span>
                            <span>{imp}</span>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Magic Rewrite C2 */}
              {ev.magicRewriteC2 && (
                <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 via-card to-amber-500/5 p-5 space-y-3">
                  <h3 className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                    <Sparkles className="h-4 w-4" />
                    Version idéale Magic Rewrite C2
                  </h3>
                  <p className="text-sm font-serif italic leading-relaxed whitespace-pre-wrap rounded-xl border bg-background/60 p-4">
                    {ev.magicRewriteC2}
                  </p>
                  {ev.rewriteHighlights.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {ev.rewriteHighlights.map((hl, i) => (
                        <span
                          key={i}
                          className="rounded-lg border border-amber-500/30 bg-amber-500/15 px-2 py-0.5 text-[11px] font-semibold text-amber-800 dark:text-amber-300"
                        >
                          {hl}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      ) : isOral ? (
        /* CAS 2 : Épreuve d'Expression Orale (EO) */
        <div className="space-y-6">
          {/* Sélecteur de mode d'affichage Oral */}
          <div className="flex items-center justify-between border-b pb-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setOralViewMode("bilan")}
                className={`text-xs sm:text-sm font-bold px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
                  oralViewMode === "bilan"
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                }`}
              >
                <Award className="h-4 w-4" />
                <span>Grille FEI &amp; Bilan</span>
              </button>
              <button
                type="button"
                onClick={() => setOralViewMode("transcript")}
                className={`text-xs sm:text-sm font-bold px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
                  oralViewMode === "transcript"
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                }`}
              >
                <MessageSquare className="h-4 w-4" />
                <span>Transcription des Échanges</span>
              </button>
            </div>

            <Badge variant="outline" className="text-xs font-mono font-bold">
              3 Tâches FEI · 12 min
            </Badge>
          </div>

          {oralViewMode === "bilan" ? (
            <div className="space-y-6">
              {/* Bilan Pédagogique de l'Examinateur Laurent */}
              {oralEvaluation?.examinerDebrief && (
                <div className="rounded-3xl border border-primary/20 bg-primary/5 p-6 sm:p-7 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-2">
                      <Quote className="h-4 w-4" />
                      <span>Débriefing Personnalisé de l&apos;Examinateur Laurent</span>
                    </span>
                    <Badge variant="secondary" className="text-[10px] font-mono">
                      Évaluateur Certifié Super4C2
                    </Badge>
                  </div>
                  <p className="text-sm text-foreground/95 leading-relaxed font-sans">
                    {oralEvaluation.examinerDebrief}
                  </p>
                </div>
              )}

              {/* Grille d'Évaluation FEI 5 Critères sur 4 */}
              <div className="rounded-3xl border bg-card p-6 sm:p-7 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    <span>Barème Officiel France Éducation International (20 Points)</span>
                  </h3>
                  <span className="text-xs font-mono font-bold text-primary">
                    Total : {oralEvaluation?.totalScore ?? attempt.rawScore} / 20
                  </span>
                </div>

                <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
                  {oralEvaluation?.criteria && oralEvaluation.criteria.length > 0 ? (
                    oralEvaluation.criteria.map((c, i) => (
                      <div key={i} className="rounded-2xl border bg-muted/20 p-4 space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-foreground">{c.label}</span>
                          <span className="font-mono text-sm font-black text-primary">
                            {c.score} / 4
                          </span>
                        </div>
                        <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                          <div
                            className="h-full bg-primary transition-all"
                            style={{ width: `${(c.score / 4) * 100}%` }}
                          />
                        </div>
                        {c.feedback && (
                          <p className="text-xs text-muted-foreground leading-snug pt-1">
                            {c.feedback}
                          </p>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full py-4 text-center text-xs text-muted-foreground">
                      Grille d&apos;évaluation en cours de synchronisation.
                    </div>
                  )}
                </div>
              </div>

              {/* Formulations & Recommandations C2 */}
              {oralEvaluation?.recommendedPhrasesC2 && oralEvaluation.recommendedPhrasesC2.length > 0 && (
                <div className="rounded-3xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 via-card to-amber-500/5 p-6 sm:p-7 space-y-4">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                      Expressions Modèles &amp; Tournures d&apos;Autorité C2 Recommandées
                    </h3>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Intégrez ces formulations lors de vos prochaines simulations orales pour séduire les examinateurs FEI et sécuriser le palier NCLC 8+.
                  </p>
                  <div className="grid gap-2.5 sm:grid-cols-2">
                    {oralEvaluation.recommendedPhrasesC2.map((phrase, i) => (
                      <div
                        key={i}
                        className="rounded-xl border bg-background/70 p-3.5 text-xs text-foreground italic leading-relaxed"
                      >
                        {phrase}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Mode Retranscription des Dialogues */
            <div className="space-y-4">
              {/* Sélecteur de Tâche 1, 2, 3 */}
              <div className="flex items-center gap-2 p-1.5 bg-muted/40 rounded-2xl border border-border/50 text-xs font-bold">
                {[
                  { num: 1, label: "Tâche 1 : Entretien Dirigé (2 min)" },
                  { num: 2, label: "Tâche 2 : Jeu de Rôle & Questions (3.5 min)" },
                  { num: 3, label: "Tâche 3 : Expression d'un Point de Vue (4.5 min)" },
                ].map((task) => (
                  <button
                    key={task.num}
                    type="button"
                    onClick={() => setOralActiveTask(task.num)}
                    className={`flex-1 py-2 px-3 rounded-xl transition-all cursor-pointer text-center ${
                      oralActiveTask === task.num
                        ? "bg-card text-foreground shadow-xs border"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <span>{task.label}</span>
                  </button>
                ))}
              </div>

              {/* Boîte de Transcription */}
              <div className="rounded-3xl border bg-card p-6 space-y-4">
                <div className="flex items-center justify-between border-b pb-3">
                  <span className="text-xs font-bold text-foreground flex items-center gap-2">
                    <Mic className="h-4 w-4 text-primary" />
                    <span>Échanges Audio &amp; Retranscription — Tâche {oralActiveTask}</span>
                  </span>
                  <span className="text-[11px] font-mono text-muted-foreground">
                    {oralDialogues[oralActiveTask]?.length || 0} intervention(s)
                  </span>
                </div>

                <div className="space-y-3.5 max-h-[460px] overflow-y-auto pr-1">
                  {oralDialogues[oralActiveTask] && oralDialogues[oralActiveTask].length > 0 ? (
                    oralDialogues[oralActiveTask].map((msg, idx) => {
                      const isExaminer = msg.sender === "examiner";
                      return (
                        <div
                          key={idx}
                          className={`flex items-start gap-3 ${
                            isExaminer ? "justify-start" : "justify-end"
                          }`}
                        >
                          {isExaminer && (
                            <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                              <Bot className="h-4 w-4 text-primary" />
                            </div>
                          )}

                          <div
                            className={`max-w-[82%] rounded-2xl p-4 text-xs leading-relaxed space-y-1 ${
                              isExaminer
                                ? "bg-muted/30 border text-foreground rounded-tl-xs"
                                : "bg-primary text-primary-foreground rounded-tr-xs"
                            }`}
                          >
                            <div className="flex items-center justify-between gap-4 text-[10px] opacity-75 font-mono">
                              <span className="font-bold">
                                {isExaminer ? "Examinateur Laurent" : "Candidat"}
                              </span>
                              {msg.timestamp !== undefined && (
                                <span>{formatDialogueTime(msg.timestamp)}</span>
                              )}
                            </div>
                            <p className="whitespace-pre-wrap">{msg.text}</p>
                          </div>

                          {!isExaminer && (
                            <div className="w-8 h-8 rounded-full bg-muted border flex items-center justify-center shrink-0 mt-0.5">
                              <UserCheck className="h-4 w-4 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                      );
                    })
                  ) : (
                    <div className="py-12 text-center text-xs text-muted-foreground italic">
                      Aucun dialogue enregistré pour la Tâche {oralActiveTask}.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Autres épreuves (QCM ou épreuves en cours de calibrage) */
        <div className="rounded-3xl border border-dashed bg-card/60 p-10 text-center text-sm text-muted-foreground space-y-2">
          <p className="font-bold text-foreground">Épreuve Standard FEI</p>
          <p>Le détail question par question de cette épreuve est en cours de synchronisation avec le simulateur.</p>
        </div>
      )}

      {/* 🗑️ Modale de Confirmation de Suppression */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-destructive/10 text-destructive mb-2">
              <Trash2 className="h-6 w-6" />
            </div>
            <DialogTitle className="text-center font-display text-lg font-black">
              Supprimer cette correction ?
            </DialogTitle>
            <DialogDescription className="text-center text-xs text-muted-foreground pt-1">
              Cette action est irréversible. Cette simulation ({meta.label} · Note {attempt.rawScore}/20 · NCLC {attempt.nclcLevel}) sera définitivement effacée de votre historique et vos statistiques moyennes seront recalculées.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="flex-col sm:flex-row gap-2 pt-2">
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
              disabled={isDeleting}
              className="w-full sm:w-auto text-xs font-semibold cursor-pointer"
            >
              Annuler
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
              className="w-full sm:w-auto text-xs font-bold gap-1.5 cursor-pointer"
            >
              {isDeleting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
              <span>{isDeleting ? "Suppression…" : "Supprimer définitivement"}</span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
