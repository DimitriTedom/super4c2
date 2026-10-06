"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Mic, MicOff, Volume2, Clock, Send, RotateCcw, User, Bot, CheckCircle2, ChevronRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OralWaveform } from "@/components/exam/oral-waveform";
import { OralDebriefCard } from "@/components/exam/oral-debrief-card";
import { formatClock } from "@/components/exam/exam-header";
import type { OralDialogueMessage, OralExamEvaluation, OralSeries } from "@/lib/exam/oral-types";
import { evaluateOralExam } from "@/lib/exam/oral-evaluator";
import { cn } from "@/lib/utils";

interface OralExamRoomProps {
  series: OralSeries;
}

export function OralExamRoom({ series }: OralExamRoomProps) {
  const [currentTaskIndex, setCurrentTaskIndex] = useState<0 | 1 | 2>(0);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isExaminerSpeaking, setIsExaminerSpeaking] = useState<boolean>(false);
  const [remaining, setRemaining] = useState<number>(series.tasks[0].durationSeconds);
  const [dialogues, setDialogues] = useState<Record<number, OralDialogueMessage[]>>({
    0: [],
    1: [],
    2: [],
  });
  const [currentCandidateInput, setCurrentCandidateInput] = useState<string>("");
  const [isExamCompleted, setIsExamCompleted] = useState<boolean>(false);
  const [evaluation, setEvaluation] = useState<OralExamEvaluation | null>(null);

  const currentTask = series.tasks[currentTaskIndex];
  const dialogueEndRef = useRef<HTMLDivElement | null>(null);

  // Synthèse vocale de l'examinateur IA
  const speakExaminerText = useCallback((text: string, onEnd?: () => void) => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "fr-FR";
      utterance.rate = 1.0;
      utterance.pitch = 1.0;

      utterance.onstart = () => setIsExaminerSpeaking(true);
      utterance.onend = () => {
        setIsExaminerSpeaking(false);
        if (onEnd) onEnd();
      };
      utterance.onerror = () => {
        setIsExaminerSpeaking(false);
        if (onEnd) onEnd();
      };

      window.speechSynthesis.speak(utterance);
    } else {
      setIsExaminerSpeaking(false);
      if (onEnd) onEnd();
    }
  }, []);

  // Amorce de chaque tâche par l'examinateur
  useEffect(() => {
    if (isExamCompleted) return;

    setRemaining(series.tasks[currentTaskIndex].durationSeconds);

    // Message d'amorce
    const initialPrompt = series.tasks[currentTaskIndex].examinerPrompt;
    setDialogues((prev) => {
      if (prev[currentTaskIndex].length === 0) {
        return {
          ...prev,
          [currentTaskIndex]: [
            {
              id: `ex-${Date.now()}`,
              sender: "examiner",
              text: initialPrompt,
              timestamp: Date.now(),
            },
          ],
        };
      }
      return prev;
    });

    speakExaminerText(initialPrompt);

    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [currentTaskIndex, isExamCompleted, series.tasks, speakExaminerText]);

  // Minuteur de la tâche active
  useEffect(() => {
    if (isExamCompleted) return;

    const timer = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          // Fin de tâche automatique
          if (currentTaskIndex < 2) {
            setCurrentTaskIndex((t) => (t + 1) as 1 | 2);
            return series.tasks[currentTaskIndex + 1].durationSeconds;
          } else {
            handleCompleteExam();
            return 0;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentTaskIndex, isExamCompleted, series.tasks]);

  // Défilement automatique du chat
  useEffect(() => {
    dialogueEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [dialogues, currentTaskIndex]);

  // Clôture et évaluation de l'épreuve
  const handleCompleteExam = useCallback(() => {
    setIsExamCompleted(true);
    setIsRecording(false);
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    const evalResult = evaluateOralExam(series, dialogues);
    setEvaluation(evalResult);
  }, [dialogues, series]);

  // Envoi de la réplique du candidat
  const handleSendCandidateSpeech = (customSpeech?: string) => {
    const textToSend = customSpeech || currentCandidateInput;
    if (!textToSend.trim() || isExaminerSpeaking) return;

    const candidateMsg: OralDialogueMessage = {
      id: `cand-${Date.now()}`,
      sender: "candidate",
      text: textToSend.trim(),
      timestamp: Date.now(),
    };

    setDialogues((prev) => ({
      ...prev,
      [currentTaskIndex]: [...prev[currentTaskIndex], candidateMsg],
    }));

    setCurrentCandidateInput("");
    setIsRecording(false);

    // Réponse interactive de l'examinateur IA
    setTimeout(() => {
      generateExaminerResponse(textToSend.trim());
    }, 600);
  };

  // Logique du répondant IA (surtout pour le jeu de rôle en Tâche 2)
  const generateExaminerResponse = (candidateText: string) => {
    let reply = "";
    const lower = candidateText.toLowerCase();

    if (currentTaskIndex === 1) {
      // Tâche 2 : Jeu de rôle (cours de cuisine)
      if (lower.includes("horaire") || lower.includes("heure") || lower.includes("quand")) {
        reply = "Les ateliers ont lieu tous les mardis et jeudis soir, de 19h00 à 21h30. Est-ce que ces créneaux correspondent à vos disponibilités ?";
      } else if (lower.includes("prix") || lower.includes("tarif") || lower.includes("coûte") || lower.includes("combien")) {
        reply = "Le tarif est de 45 euros par séance, mais nous proposons un forfait mensuel de 150 euros pour quatre cours avec le carnet de recettes offert.";
      } else if (lower.includes("matériel") || lower.includes("ingrédient") || lower.includes("fourni") || lower.includes("apporter")) {
        reply = "Tout est entièrement fourni sur place ! Les tabliers, les ustensiles et l'ensemble des produits bio et de saison. Vous n'avez qu'à apporter votre bonne humeur.";
      } else if (lower.includes("débutant") || lower.includes("niveau") || lower.includes("expérience")) {
        reply = "Absolument aucun prérequis n'est nécessaire. Nos chefs accompagnent les participants pas à pas, même si vous n'avez jamais cuisiné auparavant !";
      } else {
        reply = "C'est une très bonne question. Nous limitons nos groupes à huit participants pour garantir une ambiance conviviale et un suivi personnalisé. Avez-vous d'autres questions sur l'organisation ?";
      }
    } else if (currentTaskIndex === 0) {
      // Tâche 1 : Présentation
      reply = "Je vous remercie pour cette présentation très claire. Pouvez-vous me dire ce qui vous attire particulièrement dans la culture canadienne ?";
    } else {
      // Tâche 3 : Argumentation
      reply = "Votre point de vue est très intéressant. Cependant, ne craignez-vous pas que cette mesure pénalise lourdement les commerçants du centre-ville et les personnes à mobilité réduite ?";
    }

    const examinerMsg: OralDialogueMessage = {
      id: `ex-${Date.now()}`,
      sender: "examiner",
      text: reply,
      timestamp: Date.now(),
    };

    setDialogues((prev) => ({
      ...prev,
      [currentTaskIndex]: [...prev[currentTaskIndex], examinerMsg],
    }));

    speakExaminerText(reply);
  };

  const handleRestart = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setCurrentTaskIndex(0);
    setIsRecording(false);
    setIsExaminerSpeaking(false);
    setIsExamCompleted(false);
    setEvaluation(null);
    setDialogues({ 0: [], 1: [], 2: [] });
    setCurrentCandidateInput("");
  };

  return (
    <div className="flex h-screen flex-col bg-background">
      {/* Header officiel */}
      <header className="flex h-16 shrink-0 items-center justify-between gap-4 border-b bg-card px-4 sm:px-6">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-widest text-primary">
            TCF Canada — Expression Orale
          </p>
          <h1 className="font-display text-base font-bold sm:text-lg truncate">
            {currentTask.title}
          </h1>
        </div>

        {/* Minuteur */}
        <div
          role="timer"
          className="flex items-center gap-2 rounded-full border px-4 py-1.5 font-mono text-xl font-bold tabular-nums"
        >
          <Clock className="h-4 w-4" />
          {formatClock(remaining)}
        </div>

        <div>
          {!isExamCompleted ? (
            <Button
              variant="outline"
              size="sm"
              onClick={handleCompleteExam}
              className="gap-2"
            >
              Terminer l&apos;épreuve
            </Button>
          ) : (
            <Button variant="outline" size="sm" onClick={handleRestart} className="gap-2">
              <RotateCcw className="h-4 w-4" /> Recommencer
            </Button>
          )}
        </div>
      </header>

      {/* Vue Résultats ou Salle Virtuelle */}
      {isExamCompleted && evaluation ? (
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 max-w-4xl mx-auto w-full">
          <OralDebriefCard evaluation={evaluation} />
        </div>
      ) : (
        <div className="flex min-h-0 flex-1 flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x">
          {/* Volet Gauche : Avatar Examinateur & Visualiseur Waveform */}
          <div className="flex flex-col items-center justify-between p-6 sm:p-8 bg-muted/20 lg:w-96 shrink-0">
            <div className="text-center space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Examinateur Officiel IA
              </span>
              <h2 className="font-display text-lg font-bold">M. Laurent (France Éducation Int.)</h2>
            </div>

            {/* Avatar immersif avec Halo */}
            <div className="relative my-6 flex items-center justify-center">
              <div
                className={cn(
                  "absolute h-36 w-36 rounded-full transition-all duration-300",
                  isExaminerSpeaking
                    ? "bg-cyan-500/20 scale-125 animate-pulse"
                    : isRecording
                    ? "bg-[#E51A31]/20 scale-110 animate-pulse"
                    : "bg-muted"
                )}
              />
              <div
                className={cn(
                  "relative flex h-28 w-28 items-center justify-center rounded-full border-4 shadow-xl transition-all duration-300",
                  isExaminerSpeaking
                    ? "border-cyan-500 bg-cyan-500/10 text-cyan-600"
                    : isRecording
                    ? "border-[#E51A31] bg-[#E51A31]/10 text-[#E51A31]"
                    : "border-border bg-card text-muted-foreground"
                )}
              >
                <Bot className="h-12 w-12" />
              </div>
            </div>

            {/* Waveform dynamique */}
            <div className="w-full text-center space-y-2">
              <OralWaveform
                isRecording={isRecording}
                isExaminerSpeaking={isExaminerSpeaking}
              />
              <p className="text-xs font-medium text-muted-foreground">
                {isExaminerSpeaking
                  ? "L'examinateur parle..."
                  : isRecording
                  ? "Micro ouvert : Parlez maintenant..."
                  : "En attente de votre réponse"}
              </p>
            </div>

            {/* Sujet de la tâche */}
            {currentTask.roleplayScenario && (
              <div className="w-full mt-4 rounded-xl border bg-card p-4 text-xs space-y-1.5 shadow-sm">
                <p className="font-bold text-primary uppercase text-[10px] tracking-wider">
                  Votre Mission (Jeu de rôle) :
                </p>
                <p className="font-medium text-foreground">
                  {currentTask.roleplayScenario.situation}
                </p>
                <ul className="list-disc pl-4 text-muted-foreground text-[11px] space-y-0.5 pt-1">
                  {currentTask.roleplayScenario.objectives.map((obj, i) => (
                    <li key={i}>{obj}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Volet Droit : Console de Dialogue Interactive */}
          <div className="flex min-h-0 flex-1 flex-col bg-background">
            {/* Fil de discussion */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {dialogues[currentTaskIndex]?.map((msg) => {
                const isEx = msg.sender === "examiner";
                return (
                  <div
                    key={msg.id}
                    className={cn(
                      "flex items-start gap-3 max-w-xl",
                      isEx ? "mr-auto" : "ml-auto flex-row-reverse"
                    )}
                  >
                    <div
                      className={cn(
                        "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                        isEx
                          ? "bg-cyan-500 text-white"
                          : "bg-[#E51A31] text-white"
                      )}
                    >
                      {isEx ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
                    </div>

                    <div
                      className={cn(
                        "rounded-2xl p-4 text-sm leading-relaxed shadow-sm",
                        isEx
                          ? "bg-card border text-foreground"
                          : "bg-primary text-primary-foreground"
                      )}
                    >
                      <p>{msg.text}</p>
                    </div>
                  </div>
                );
              })}
              <div ref={dialogueEndRef} />
            </div>

            {/* Zone d'action de réponse (Micro / Texte / Suggestions de relance) */}
            <div className="border-t bg-card p-4 sm:p-6 space-y-3">
              {/* Suggestions rapides en Tâche 2 pour aider le candidat à tester */}
              {currentTaskIndex === 1 && (
                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="text-muted-foreground pt-1 text-[11px]">Questions types :</span>
                  <button
                    type="button"
                    onClick={() => handleSendCandidateSpeech("Quels sont les jours et les horaires de ces ateliers culinaires ?")}
                    className="rounded-full border bg-muted/60 px-3 py-1 hover:bg-muted text-foreground transition-colors"
                  >
                    « Quels sont les horaires ? »
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSendCandidateSpeech("Combien coûte l'inscription et proposez-vous un tarif dégressif ?")}
                    className="rounded-full border bg-muted/60 px-3 py-1 hover:bg-muted text-foreground transition-colors"
                  >
                    « Quels sont les tarifs ? »
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSendCandidateSpeech("Est-ce que les ingrédients et le matériel de cuisine sont fournis ?")}
                    className="rounded-full border bg-muted/60 px-3 py-1 hover:bg-muted text-foreground transition-colors"
                  >
                    « Le matériel est-il fourni ? »
                  </button>
                </div>
              )}

              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant={isRecording ? "destructive" : "outline"}
                  size="icon"
                  className={cn("h-11 w-11 shrink-0 rounded-full", isRecording && "animate-pulse")}
                  onClick={() => setIsRecording(!isRecording)}
                  title={isRecording ? "Arrêter d'enregistrer" : "Activer le micro"}
                >
                  {isRecording ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                </Button>

                <input
                  type="text"
                  value={currentCandidateInput}
                  onChange={(e) => setCurrentCandidateInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleSendCandidateSpeech();
                    }
                  }}
                  placeholder={
                    isRecording
                      ? "Parlez dans votre micro ou écrivez..."
                      : "Tapez votre réponse ou utilisez le micro..."
                  }
                  className="flex-1 rounded-xl border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />

                <Button
                  type="button"
                  onClick={() => handleSendCandidateSpeech()}
                  disabled={!currentCandidateInput.trim() || isExaminerSpeaking}
                  className="shrink-0 gap-1.5"
                >
                  <span>Envoyer</span>
                  <Send className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex justify-between items-center text-xs text-muted-foreground pt-1">
                <span>Réglementation : 12 minutes d&apos;entretien global</span>
                {currentTaskIndex < 2 ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCurrentTaskIndex((t) => (t + 1) as 1 | 2)}
                    className="gap-1 text-primary hover:text-primary"
                  >
                    Passer à la Tâche {currentTaskIndex + 2}
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCompleteExam}
                    className="gap-1 text-primary font-bold"
                  >
                    Terminer et obtenir mon bilan FEI
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
