"use client";

import React, { useState, useMemo } from "react";
import {
  Eye,
  Sparkles,
  CheckCircle2,
  Clock,
  User,
  Mail,
  PenTool,
  Mic,
  MessageSquare,
  AlertCircle,
  Quote,
  ChevronDown,
  ChevronUp,
  Code2,
  Volume2,
  Bot,
  UserCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  parseAnswers,
  getTaskEvaluations,
  getDisciplineMeta,
} from "@/lib/dashboard/attempt-utils";

interface AttemptInspectDialogProps {
  attempt: {
    id: string;
    discipline: string;
    rawScore: number;
    tcfScaledScore: number;
    nclcLevel: number;
    crsPointsUnlocked: number;
    answers: unknown;
    feedback: unknown;
    createdAt: string | Date;
    user?: {
      email: string;
      profile?: {
        displayName: string | null;
      } | null;
    } | null;
  };
}

interface OralDialogueMessage {
  sender: "examiner" | "candidate" | string;
  text: string;
  timestamp?: number | string;
  audioUrl?: string;
}

interface StructuredCriterion {
  criterion?: string;
  label: string;
  score: number;
  feedback?: string;
}

interface ParsedFeedback {
  generalFeedback?: string;
  examinerDebrief?: string;
  criteria?: StructuredCriterion[];
  strengths?: string[];
  improvements?: string[];
  recommendedPhrasesC2?: string[];
  wordsPerMinute?: number;
  raw?: unknown;
}

export function AttemptInspectDialog({ attempt }: AttemptInspectDialogProps) {
  const [open, setOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<number>(1);
  const [selectedOralTask, setSelectedOralTask] = useState<number>(1);
  const [showRawJson, setShowRawJson] = useState(false);

  const meta = getDisciplineMeta(attempt.discipline);
  const candidateName =
    attempt.user?.profile?.displayName || attempt.user?.email || "Candidat Anonyme";
  const candidateEmail = attempt.user?.email || "Non renseigné";
  const dateFormatted = new Date(attempt.createdAt).toLocaleString("fr-FR", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  const isWritten = attempt.discipline === "EXPRESSION_ECRITE";
  const isOral = attempt.discipline === "EXPRESSION_ORALE";

  // Données Rédaction (EE)
  const writtenAnswers = isWritten ? parseAnswers(attempt as never) : [];
  const taskEvaluations = isWritten ? getTaskEvaluations(attempt as never) : [];
  const currentTaskEval = taskEvaluations.find((t) => t.taskNumber === selectedTask);
  const currentAnswer = writtenAnswers[selectedTask - 1] || "";

  // Données Orales (EO) et retour IA universel
  const parsedFeedback: ParsedFeedback | null = useMemo(() => {
    if (!attempt.feedback) return null;
    let obj: any = attempt.feedback;
    if (typeof obj === "string") {
      try {
        obj = JSON.parse(obj);
      } catch {
        return { generalFeedback: obj };
      }
    }
    if (typeof obj !== "object" || obj === null) {
      return { generalFeedback: String(obj) };
    }

    return {
      generalFeedback: obj.generalFeedback || obj.feedback || obj.debrief || undefined,
      examinerDebrief: obj.examinerDebrief || undefined,
      criteria: Array.isArray(obj.criteria) ? obj.criteria : undefined,
      strengths: Array.isArray(obj.strengths) ? obj.strengths : undefined,
      improvements: Array.isArray(obj.improvements) ? obj.improvements : undefined,
      recommendedPhrasesC2: Array.isArray(obj.recommendedPhrasesC2)
        ? obj.recommendedPhrasesC2
        : undefined,
      wordsPerMinute: typeof obj.wordsPerMinute === "number" ? obj.wordsPerMinute : undefined,
      raw: obj,
    };
  }, [attempt.feedback]);

  // Dialogues oraux par tâche
  const oralDialoguesByTask = useMemo(() => {
    if (!isOral || !attempt.answers) return null;
    let ans: any = attempt.answers;
    if (typeof ans === "string") {
      try {
        ans = JSON.parse(ans);
      } catch {
        return null;
      }
    }
    if (typeof ans !== "object" || ans === null) return null;

    // Format Record<number, OralDialogueMessage[]>
    const record: Record<number, OralDialogueMessage[]> = {};
    if (Array.isArray(ans)) {
      record[1] = ans;
    } else {
      [1, 2, 3].forEach((taskNum) => {
        if (Array.isArray(ans[taskNum]) || Array.isArray(ans[String(taskNum)])) {
          record[taskNum] = ans[taskNum] || ans[String(taskNum)];
        }
      });
    }
    return Object.keys(record).length > 0 ? record : null;
  }, [isOral, attempt.answers]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-8 gap-1.5 text-xs font-semibold rounded-xl"
        >
          <Eye className="h-3.5 w-3.5 text-primary" />
          <span>Inspecter</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto rounded-2xl bg-card border-border p-6 shadow-2xl">
        <DialogHeader className="border-b pb-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xl">{meta.emoji}</span>
              <div>
                <DialogTitle className="text-base font-bold text-foreground flex items-center gap-2">
                  <span>{meta.label}</span>
                  <Badge variant="outline" className="font-mono text-[10px]">
                    ID: {attempt.id.slice(0, 8)}...
                  </Badge>
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground mt-0.5 flex items-center gap-2 flex-wrap">
                  <span className="flex items-center gap-1">
                    <User className="h-3 w-3" /> {candidateName}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 font-mono">
                    <Mail className="h-3 w-3" /> {candidateEmail}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {dateFormatted}
                  </span>
                </DialogDescription>
              </div>
            </div>

            {/* Score Badges */}
            <div className="flex items-center gap-2 font-mono">
              <div className="px-3 py-1 rounded-xl bg-primary/10 border border-primary/20 text-center">
                <p className="text-[9px] uppercase font-bold text-muted-foreground">Score TCF</p>
                <p className="text-sm font-black text-primary">{attempt.tcfScaledScore} / 699</p>
              </div>
              <div className="px-3 py-1 rounded-xl bg-card border text-center">
                <p className="text-[9px] uppercase font-bold text-muted-foreground">Palier</p>
                <p className="text-sm font-black text-foreground">NCLC {attempt.nclcLevel}</p>
              </div>
              {attempt.crsPointsUnlocked > 0 && (
                <div className="px-2.5 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center">
                  <p className="text-[9px] uppercase font-bold text-emerald-600">Bonus CRS</p>
                  <p className="text-sm font-black text-emerald-600">+{attempt.crsPointsUnlocked} pts</p>
                </div>
              )}
            </div>
          </div>
        </DialogHeader>

        {/* Written Exam Details (EE) */}
        {isWritten ? (
          <div className="space-y-5 pt-2">
            {/* Task Selector Tabs */}
            <div className="flex items-center gap-1.5 p-1 bg-muted/40 rounded-xl border border-border/50 text-xs font-bold">
              {[1, 2, 3].map((num) => {
                const evalData = taskEvaluations.find((t) => t.taskNumber === num);
                const score = evalData?.taskScore ?? 0;
                return (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setSelectedTask(num)}
                    className={`flex-1 py-1.5 px-3 rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      selectedTask === num
                        ? "bg-card text-foreground shadow-xs border"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <span>Tâche {num}</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-md bg-muted">
                      {score}/20
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Candidate Submission View */}
            <div className="rounded-xl border bg-muted/20 p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <PenTool className="h-3.5 w-3.5 text-primary" />
                  <span>Rédaction du candidat (Tâche {selectedTask})</span>
                </span>
                <span className="text-[11px] font-mono font-bold text-muted-foreground">
                  {currentTaskEval?.wordCount || 0} mots rédigés
                </span>
              </div>
              <div className="p-3.5 rounded-lg bg-card border text-xs text-foreground/90 whitespace-pre-wrap leading-relaxed font-sans min-h-[90px]">
                {currentAnswer || <span className="italic text-muted-foreground">Aucun texte rédigé pour cette tâche.</span>}
              </div>
            </div>

            {/* FEI Criteria Breakdown */}
            {currentTaskEval && currentTaskEval.criteria && currentTaskEval.criteria.length > 0 && (
              <div className="rounded-xl border bg-card p-4 space-y-3">
                <h4 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                  <span>Grille d&apos;Évaluation FEI (Note : {currentTaskEval.taskScore}/20)</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {currentTaskEval.criteria.map((c, i) => (
                    <div key={i} className="p-3 rounded-lg border bg-muted/10 space-y-1">
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span className="text-foreground">{c.label}</span>
                        <span className="font-mono text-primary">{c.score} / 5</span>
                      </div>
                      <p className="text-[11px] text-muted-foreground leading-snug">
                        {c.feedback}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Magic Rewrite C2 */}
            {currentTaskEval?.magicRewriteC2 && (
              <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 space-y-2">
                <h4 className="text-xs font-bold text-primary flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Modèle Corrigé Magic Rewrite C2 (IA)</span>
                </h4>
                <p className="text-xs text-foreground/90 whitespace-pre-wrap leading-relaxed italic bg-card/60 p-3 rounded-lg border">
                  {currentTaskEval.magicRewriteC2}
                </p>
              </div>
            )}
          </div>
        ) : (
          /* Oral (EO) & Other Disciplines (CE, CO) Rich View */
          <div className="space-y-4 pt-2">
            {/* Session Stats */}
            <div className="rounded-xl border bg-card p-4 space-y-2">
              <h4 className="text-xs font-bold text-foreground">Bilan de la Session</h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono pt-1">
                <div className="p-2.5 rounded-lg bg-muted/20 border">
                  <span className="text-[10px] text-muted-foreground uppercase block">Score Brut</span>
                  <span className="font-bold text-foreground">{attempt.rawScore}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-muted/20 border">
                  <span className="text-[10px] text-muted-foreground uppercase block">Score TCF</span>
                  <span className="font-bold text-primary">{attempt.tcfScaledScore} / 699</span>
                </div>
                <div className="p-2.5 rounded-lg bg-muted/20 border">
                  <span className="text-[10px] text-muted-foreground uppercase block">Niveau NCLC</span>
                  <span className="font-bold text-foreground">NCLC {attempt.nclcLevel}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-muted/20 border">
                  <span className="text-[10px] text-muted-foreground uppercase block">
                    {parsedFeedback?.wordsPerMinute ? "Débit Élocution" : "Bonus CRS"}
                  </span>
                  <span className="font-bold text-emerald-600">
                    {parsedFeedback?.wordsPerMinute
                      ? `${parsedFeedback.wordsPerMinute} mots/min`
                      : `+${attempt.crsPointsUnlocked} pts`}
                  </span>
                </div>
              </div>
            </div>

            {/* Oral Transcripts / Dialogues (if present) */}
            {oralDialoguesByTask && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <Mic className="h-3.5 w-3.5 text-primary" />
                    <span>Échanges Oraux avec l&apos;Examinateur</span>
                  </span>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3].map((num) => {
                      if (!oralDialoguesByTask[num]) return null;
                      return (
                        <button
                          key={num}
                          type="button"
                          onClick={() => setSelectedOralTask(num)}
                          className={`text-xs px-2.5 py-1 rounded-lg border font-semibold cursor-pointer transition-all ${
                            selectedOralTask === num
                              ? "bg-primary text-primary-foreground border-primary"
                              : "bg-muted/30 text-muted-foreground hover:bg-muted"
                          }`}
                        >
                          Tâche {num}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="rounded-xl border bg-muted/10 p-4 space-y-3 max-h-[300px] overflow-y-auto">
                  {oralDialoguesByTask[selectedOralTask] && oralDialoguesByTask[selectedOralTask].length > 0 ? (
                    oralDialoguesByTask[selectedOralTask].map((msg, idx) => {
                      const isExaminer = msg.sender === "examiner" || msg.sender === "evaluator";
                      return (
                        <div
                          key={idx}
                          className={`flex items-start gap-2.5 ${
                            isExaminer ? "justify-start" : "justify-end"
                          }`}
                        >
                          {isExaminer && (
                            <div className="w-6 h-6 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                              <Bot className="h-3.5 w-3.5 text-primary" />
                            </div>
                          )}
                          <div
                            className={`max-w-[80%] rounded-2xl p-3 text-xs leading-relaxed ${
                              isExaminer
                                ? "bg-card border text-card-foreground rounded-tl-xs"
                                : "bg-primary text-primary-foreground rounded-tr-xs"
                            }`}
                          >
                            <div className="flex items-center justify-between gap-4 mb-1 text-[10px] opacity-75 font-mono">
                              <span>{isExaminer ? "Examinateur Laurent" : "Candidat"}</span>
                            </div>
                            <p className="whitespace-pre-wrap">{msg.text}</p>
                          </div>
                          {!isExaminer && (
                            <div className="w-6 h-6 rounded-full bg-muted border flex items-center justify-center shrink-0 mt-0.5">
                              <UserCheck className="h-3.5 w-3.5 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-xs text-muted-foreground italic text-center py-4">
                      Aucun dialogue enregistré pour la Tâche {selectedOralTask}.
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Debrief / General Feedback */}
            {(parsedFeedback?.examinerDebrief || parsedFeedback?.generalFeedback) && (
              <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 space-y-1.5">
                <span className="text-xs font-bold text-primary flex items-center gap-1.5">
                  <Quote className="h-3.5 w-3.5" />
                  <span>Bilan Pédagogique de l&apos;Examinateur</span>
                </span>
                <p className="text-xs text-foreground/90 leading-relaxed">
                  {parsedFeedback.examinerDebrief || parsedFeedback.generalFeedback}
                </p>
              </div>
            )}

            {/* FEI Criteria Breakdown (Oral or other structured feedback) */}
            {parsedFeedback?.criteria && parsedFeedback.criteria.length > 0 && (
              <div className="rounded-xl border bg-card p-4 space-y-3">
                <h4 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                  <span>Grille d&apos;Évaluation FEI</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {parsedFeedback.criteria.map((c, i) => (
                    <div key={i} className="p-3 rounded-lg border bg-muted/10 space-y-1">
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span className="text-foreground">{c.label}</span>
                        <span className="font-mono text-primary">{c.score} / 4</span>
                      </div>
                      {c.feedback && (
                        <p className="text-[11px] text-muted-foreground leading-snug">
                          {c.feedback}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Strengths & Improvements */}
            {((parsedFeedback?.strengths && parsedFeedback.strengths.length > 0) ||
              (parsedFeedback?.improvements && parsedFeedback.improvements.length > 0)) && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {parsedFeedback.strengths && parsedFeedback.strengths.length > 0 && (
                  <div className="p-3.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 space-y-2">
                    <span className="text-xs font-bold text-emerald-600 flex items-center gap-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>Points Forts Validés</span>
                    </span>
                    <ul className="text-[11px] text-foreground/90 space-y-1 list-disc list-inside">
                      {parsedFeedback.strengths.map((str, i) => (
                        <li key={i}>{str}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {parsedFeedback.improvements && parsedFeedback.improvements.length > 0 && (
                  <div className="p-3.5 rounded-xl border border-amber-500/20 bg-amber-500/5 space-y-2">
                    <span className="text-xs font-bold text-amber-600 flex items-center gap-1.5">
                      <AlertCircle className="h-3.5 w-3.5" />
                      <span>Axes de Progression</span>
                    </span>
                    <ul className="text-[11px] text-foreground/90 space-y-1 list-disc list-inside">
                      {parsedFeedback.improvements.map((imp, i) => (
                        <li key={i}>{imp}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Recommended C2 Phrases */}
            {parsedFeedback?.recommendedPhrasesC2 && parsedFeedback.recommendedPhrasesC2.length > 0 && (
              <div className="rounded-xl border border-primary/20 bg-card p-4 space-y-2">
                <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-primary" />
                  <span>Formulations C2 / Recommandations Ciblées</span>
                </span>
                <div className="space-y-1.5">
                  {parsedFeedback.recommendedPhrasesC2.map((phrase, i) => (
                    <div
                      key={i}
                      className="p-2.5 rounded-lg bg-muted/20 border text-xs font-sans text-foreground/90 italic"
                    >
                      {phrase}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Collapsible Raw JSON for Tech & Audit */}
        {Boolean(attempt.feedback || attempt.answers) && (
          <div className="pt-2 border-t mt-4">
            <button
              type="button"
              onClick={() => setShowRawJson(!showRawJson)}
              className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Code2 className="h-3.5 w-3.5" />
              <span>{showRawJson ? "Masquer les données brutes (JSON)" : "Afficher les données brutes (JSON)"}</span>
              {showRawJson ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
            </button>

            {showRawJson && (
              <pre className="mt-2 text-[10px] text-muted-foreground p-3 rounded-lg bg-muted/30 border overflow-x-auto font-mono whitespace-pre-wrap max-h-56">
                {JSON.stringify(
                  {
                    answers: attempt.answers,
                    feedback: attempt.feedback,
                  },
                  null,
                  2
                )}
              </pre>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
