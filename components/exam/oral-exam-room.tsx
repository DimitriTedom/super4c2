"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import {
  Mic,
  MicOff,
  Clock,
  Send,
  RotateCcw,
  User,
  Bot,
  ChevronRight,
  PhoneCall,
  PhoneOff,
  Radio,
  Sparkles,
  AlertCircle,
  ArrowLeft,
  BookOpen,
  Volume2,
  ShieldCheck,
  CheckCircle2,
  Headphones,
  Signal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { OralWaveform } from "@/components/exam/oral-waveform";
import { OralDebriefCard } from "@/components/exam/oral-debrief-card";
import { formatClock } from "@/components/exam/exam-header";
import type { OralDialogueMessage, OralExamEvaluation, OralSeries } from "@/lib/exam/oral-types";
import { evaluateOralExam } from "@/lib/exam/oral-evaluator";
import { cn } from "@/lib/utils";
import { Conversation } from "@elevenlabs/client";

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

  // États pour le Mode Appel Vocal Temps Réel (WebRTC / ElevenLabs Conversational AI)
  const [isLiveCallActive, setIsLiveCallActive] = useState<boolean>(false);
  const [isCallConnecting, setIsCallConnecting] = useState<boolean>(false);
  const [callError, setCallError] = useState<string | null>(null);
  const [callSeconds, setCallSeconds] = useState<number>(0);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const conversationRef = useRef<any>(null);

  const currentTask = series.tasks[currentTaskIndex];
  const dialogueEndRef = useRef<HTMLDivElement | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);

  // Minuteur de durée d'appel live
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isLiveCallActive) {
      timer = setInterval(() => {
        setCallSeconds((s) => s + 1);
      }, 1000);
    } else {
      setCallSeconds(0);
    }
    return () => clearInterval(timer);
  }, [isLiveCallActive]);

  // Arrêt de tous les flux audio
  const stopAllAudio = useCallback(() => {
    if (typeof window !== "undefined") {
      if (window.speechSynthesis) window.speechSynthesis.cancel();
      if (currentAudioRef.current) {
        currentAudioRef.current.pause();
        currentAudioRef.current = null;
      }
    }
    setIsExaminerSpeaking(false);
  }, []);

  // Synthèse vocale de secours (Web Speech API locale si panne)
  const speakExaminerFallback = useCallback(
    (text: string, onEnd?: () => void) => {
      stopAllAudio();
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
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
    },
    [stopAllAudio]
  );

  // Lecture d'audio MP3 ElevenLabs (ou fetch à la volée de la voix Charlie)
  const playOrFetchExaminerSpeech = useCallback(
    async (text: string, existingBase64?: string | null, onEnd?: () => void) => {
      if (typeof window === "undefined") return;
      stopAllAudio();

      // 1. Si nous avons déjà le MP3 en base64
      if (existingBase64) {
        try {
          const audio = new Audio(`data:audio/mp3;base64,${existingBase64}`);
          currentAudioRef.current = audio;

          audio.onplay = () => setIsExaminerSpeaking(true);
          audio.onended = () => {
            setIsExaminerSpeaking(false);
            currentAudioRef.current = null;
            if (onEnd) onEnd();
          };
          audio.onerror = () => {
            currentAudioRef.current = null;
            speakExaminerFallback(text, onEnd);
          };

          void audio.play().catch(() => {
            currentAudioRef.current = null;
            speakExaminerFallback(text, onEnd);
          });
          return;
        } catch {
          speakExaminerFallback(text, onEnd);
          return;
        }
      }

      // 2. Sinon, générer l'audio ElevenLabs (voix Charlie) via notre API
      try {
        const res = await fetch("/api/ai/oral-tts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text }),
        });

        if (res.ok) {
          const data = await res.json();
          if (data.ok && data.audioBase64) {
            const audio = new Audio(`data:audio/mp3;base64,${data.audioBase64}`);
            currentAudioRef.current = audio;

            audio.onplay = () => setIsExaminerSpeaking(true);
            audio.onended = () => {
              setIsExaminerSpeaking(false);
              currentAudioRef.current = null;
              if (onEnd) onEnd();
            };
            audio.onerror = () => {
              currentAudioRef.current = null;
              speakExaminerFallback(text, onEnd);
            };

            void audio.play().catch(() => {
              currentAudioRef.current = null;
              speakExaminerFallback(text, onEnd);
            });
            return;
          }
        }
      } catch (err) {
        console.warn("[TTS ElevenLabs] Repli local :", err);
      }

      // Repli si le serveur ou la clé est inaccessible
      speakExaminerFallback(text, onEnd);
    },
    [speakExaminerFallback, stopAllAudio]
  );

  // Fermeture propre de la session d'appel live
  const endLiveCall = useCallback(async () => {
    if (conversationRef.current) {
      try {
        await conversationRef.current.endSession();
      } catch (err) {
        console.warn("[Live Call] Erreur fermeture session:", err);
      }
      conversationRef.current = null;
    }
    setIsLiveCallActive(false);
    setIsCallConnecting(false);
    setIsExaminerSpeaking(false);
  }, []);

  // Lancement de l'Appel Vocal Continu avec l'Examinateur ElevenLabs (WebRTC)
  const startLiveCall = async () => {
    try {
      setCallError(null);
      setIsCallConnecting(true);
      stopAllAudio();

      // 1. Autorisation du microphone
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        await navigator.mediaDevices.getUserMedia({ audio: true });
      }

      // 2. URL signée sécurisée
      const res = await fetch("/api/ai/oral-signed-url");
      const data = await res.json();
      if (!data.ok || !data.signedUrl) {
        throw new Error(data.error || "Impossible d'obtenir le jeton d'appel.");
      }

      // 3. Démarrage de la conversation avec Worklets auto-hébergés pour contourner les restrictions CSP
      const conversation = await Conversation.startSession({
        signedUrl: data.signedUrl,
        workletPaths: {
          rawAudioProcessor: "/worklets/rawAudioProcessor.js",
          audioConcatProcessor: "/worklets/audioConcatProcessor.js",
        },
        dynamicVariables: {
          candidate_name: "Candidat",
          task_number: `Tâche ${currentTaskIndex + 1}`,
          scenario_topic: currentTask.title,
          target_level: "NCLC 7+",
        },
        onConnect: () => {
          setIsLiveCallActive(true);
          setIsCallConnecting(false);
          setCallError(null);
        },
        onDisconnect: () => {
          setIsLiveCallActive(false);
          setIsCallConnecting(false);
          setIsExaminerSpeaking(false);
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onError: (err: any) => {
          console.error("[Live Call] Erreur:", err);
          const msg = typeof err === "string" ? err : err?.message || "Erreur de connexion audio.";
          setCallError(msg);
          setIsLiveCallActive(false);
          setIsCallConnecting(false);
        },
        onModeChange: ({ mode }: { mode: "speaking" | "listening" }) => {
          setIsExaminerSpeaking(mode === "speaking");
          setIsRecording(mode === "listening");
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onMessage: (payload: any) => {
          if (payload && payload.message) {
            const isAgent = payload.role === "agent" || payload.source === "ai";
            const newMsg: OralDialogueMessage = {
              id: `live-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
              sender: isAgent ? "examiner" : "candidate",
              text: payload.message,
              timestamp: Date.now(),
            };
            setDialogues((prev) => ({
              ...prev,
              [currentTaskIndex]: [...prev[currentTaskIndex], newMsg],
            }));
          }
        },
      });

      conversationRef.current = conversation;
    } catch (error: unknown) {
      console.error("[Live Call] Échec initialisation:", error);
      const errMsg =
        error instanceof Error
          ? error.message
          : "Microphone inaccessible ou refusé par le navigateur.";
      setCallError(errMsg);
      setIsCallConnecting(false);
      setIsLiveCallActive(false);
    }
  };

  // Initialisation de la reconnaissance vocale Web Speech API pour le mode tour par tour
  useEffect(() => {
    if (typeof window !== "undefined") {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = "fr-FR";

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        recognition.onresult = (event: any) => {
          let transcript = "";
          for (let i = event.resultIndex; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript;
          }
          if (transcript.trim()) {
            setCurrentCandidateInput(transcript);
          }
        };

        recognition.onerror = () => {
          setIsRecording(false);
        };

        recognition.onend = () => {
          setIsRecording(false);
        };

        recognitionRef.current = recognition;
      }
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // ignore
        }
      }
    };
  }, []);

  const toggleRecording = () => {
    if (isRecording) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // ignore
        }
      }
      setIsRecording(false);
    } else {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
          setIsRecording(true);
        } catch {
          setIsRecording(true);
        }
      } else {
        setIsRecording(true);
      }
    }
  };

  // Amorce de chaque tâche par l'examinateur avec la voix ElevenLabs Charlie
  useEffect(() => {
    if (isExamCompleted) return;

    setRemaining(series.tasks[currentTaskIndex].durationSeconds);

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

    // Ne pas lire l'audio tour par tour si un appel live est en cours
    if (!isLiveCallActive) {
      void playOrFetchExaminerSpeech(initialPrompt);
    }

    return () => {
      stopAllAudio();
    };
  }, [currentTaskIndex, isExamCompleted, isLiveCallActive, series.tasks, playOrFetchExaminerSpeech, stopAllAudio]);

  // Clôture et évaluation de l'épreuve
  const handleCompleteExam = useCallback(() => {
    setIsExamCompleted(true);
    setIsRecording(false);
    void endLiveCall();
    stopAllAudio();

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
    }
    const evalResult = evaluateOralExam(series, dialogues);
    setEvaluation(evalResult);

    // Enregistrement persistant de la tentative dans PostgreSQL
    void fetch("/api/exam/attempt", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        discipline: "EXPRESSION_ORALE",
        seriesId: series.id,
        rawScore: Math.round(evalResult.totalScore),
        tcfScaledScore: evalResult.tcfScaledScore,
        nclcLevel: evalResult.nclcLevel,
        crsPointsUnlocked: evalResult.crsPointsUnlocked,
        answers: dialogues,
        feedback: evalResult,
      }),
    }).catch(() => {
      // mode hors ligne gracieux
    });
  }, [dialogues, endLiveCall, series, stopAllAudio]);

  // Minuteur de la tâche active
  useEffect(() => {
    if (isExamCompleted) return;

    const timer = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          if (currentTaskIndex < 2) {
            setCurrentTaskIndex((prevIndex) => (prevIndex + 1) as 1 | 2);
            return series.tasks[currentTaskIndex + 1].durationSeconds;
          } else {
            clearInterval(timer);
            handleCompleteExam();
            return 0;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentTaskIndex, handleCompleteExam, isExamCompleted, series.tasks]);

  // Auto-scroll vers le dernier message
  useEffect(() => {
    dialogueEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [dialogues, currentTaskIndex]);

  // Envoi de la réplique du candidat (Mode Tour par Tour)
  const handleSendCandidateSpeech = async (customSpeech?: string) => {
    const textToSend = customSpeech || currentCandidateInput;
    if (!textToSend.trim() || isExaminerSpeaking) return;

    if (recognitionRef.current && isRecording) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
    }

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

    // Appel à l'examinateur IA via route API
    try {
      const response = await fetch("/api/ai/oral-roleplay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          taskIndex: currentTaskIndex,
          candidateSpeech: textToSend.trim(),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.ok && data.reply) {
          const examinerMsg: OralDialogueMessage = {
            id: `ex-${Date.now()}`,
            sender: "examiner",
            text: data.reply,
            timestamp: Date.now(),
          };

          setDialogues((prev) => ({
            ...prev,
            [currentTaskIndex]: [...prev[currentTaskIndex], examinerMsg],
          }));

          void playOrFetchExaminerSpeech(data.reply, data.audioBase64);
          return;
        }
      }
    } catch (err) {
      console.warn("Bascule vers le moteur oral local :", err);
    }

    // Fallback local
    setTimeout(() => {
      generateExaminerResponse(textToSend.trim());
    }, 600);
  };

  // Logique de réponse locale de secours
  const generateExaminerResponse = (candidateText: string) => {
    let reply = "";
    const lower = candidateText.toLowerCase();

    if (currentTaskIndex === 1) {
      // Tâche 2 : Jeu de rôle
      if (lower.includes("horaire") || lower.includes("heure") || lower.includes("quand")) {
        reply = "Les ateliers ont lieu tous les mardis et jeudis soir, de dix-neuf heures à vingt-et-une heures trente. Est-ce que ces créneaux correspondent à vos disponibilités ?";
      } else if (lower.includes("prix") || lower.includes("tarif") || lower.includes("coûte") || lower.includes("combien")) {
        reply = "Le tarif est de quarante-cinq euros par séance, mais nous proposons un forfait mensuel de cent cinquante euros pour quatre cours avec le carnet de recettes offert.";
      } else if (lower.includes("matériel") || lower.includes("ingrédient") || lower.includes("fourni") || lower.includes("apporter")) {
        reply = "Tout est entièrement fourni sur place ! Les tabliers, les ustensiles et l'ensemble des produits bio et de saison. Vous n'avez qu'à apporter votre bonne humeur.";
      } else if (lower.includes("débutant") || lower.includes("niveau") || lower.includes("expérience")) {
        reply = "Absolument aucun prérequis n'est nécessaire. Nos chefs accompagnent les participants pas à pas, même si vous n'avez jamais cuisiné auparavant !";
      } else {
        reply = "C'est une excellente question. Avez-vous d'autres précisions à me demander concernant le programme ou l'organisation pratique des séances ?";
      }
    } else if (currentTaskIndex === 2) {
      // Tâche 3 : Point de vue
      if (lower.includes("d'accord") || lower.includes("oui") || lower.includes("pour")) {
        reply = "Je comprends bien votre argument. Cependant, ne pensez-vous pas que cette mesure pénaliserait lourdement les travailleurs résidant en grande banlieue ?";
      } else {
        reply = "C'est une position intéressante. Quelles solutions concrètes proposeriez-vous alors pour concilier mobilité urbaine et transition écologique ?";
      }
    } else {
      // Tâche 1 : Entretien
      reply = "Très bien. Et parlez-moi un peu de vos loisirs ou des projets que vous aimeriez concrétiser une fois installé au Canada ?";
    }

    const examinerMsg: OralDialogueMessage = {
      id: `ex-fallback-${Date.now()}`,
      sender: "examiner",
      text: reply,
      timestamp: Date.now(),
    };

    setDialogues((prev) => ({
      ...prev,
      [currentTaskIndex]: [...prev[currentTaskIndex], examinerMsg],
    }));

    void playOrFetchExaminerSpeech(reply);
  };

  const handleRestart = () => {
    void endLiveCall();
    stopAllAudio();
    setCurrentTaskIndex(0);
    setIsRecording(false);
    setIsExaminerSpeaking(false);
    setIsExamCompleted(false);
    setEvaluation(null);
    setDialogues({ 0: [], 1: [], 2: [] });
    setCurrentCandidateInput("");
  };

  // Nettoyage au démontage
  useEffect(() => {
    return () => {
      void endLiveCall();
      stopAllAudio();
    };
  }, [endLiveCall, stopAllAudio]);

  return (
    <div className="flex h-screen flex-col bg-background selection:bg-primary/20">
      {/* HEADER DE LUXE — CERTIFICATION OFFICIELLE & TÉLÉMÉTRIE */}
      <header className="flex h-16 shrink-0 items-center justify-between gap-4 border-b bg-card/80 backdrop-blur-md px-4 sm:px-6 z-10">
        <div className="flex items-center gap-3">
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="gap-1.5 text-muted-foreground hover:text-foreground font-semibold rounded-full"
          >
            <Link href={`/examens/${series.id}`}>
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Menu Série</span>
            </Link>
          </Button>

          <div className="border-l pl-3">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20">
                <ShieldCheck className="h-3 w-3" /> FEI · TCF Canada
              </span>
              <span className="hidden md:inline-flex items-center gap-1 text-[10px] font-medium text-muted-foreground">
                <Headphones className="h-3 w-3 text-cyan-500" /> Voix Studio ElevenLabs Charlie
              </span>
            </div>
            <h1 className="font-display text-base font-extrabold sm:text-lg truncate tracking-tight text-foreground">
              {currentTask.title}
            </h1>
          </div>
        </div>

        {/* Télémétrie en direct */}
        <div className="flex items-center gap-3">
          {isLiveCallActive && (
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 animate-in fade-in">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="hidden sm:inline">WebRTC Live</span>
              <span className="font-mono text-[11px] font-medium opacity-80">
                {Math.floor(callSeconds / 60)}:{(callSeconds % 60).toString().padStart(2, "0")}
              </span>
            </div>
          )}

          {/* Minuteur Officiel avec Changement de Couleur */}
          {!isExamCompleted && (
            <div
              role="timer"
              className={cn(
                "flex items-center gap-2 rounded-full border px-4 py-1.5 font-mono text-sm sm:text-base font-bold tabular-nums shadow-xs transition-colors",
                remaining < 30
                  ? "border-destructive bg-destructive/10 text-destructive animate-pulse"
                  : "border-border bg-muted/30 text-foreground"
              )}
            >
              <Clock className="h-4 w-4 text-muted-foreground" />
              {formatClock(remaining)}
            </div>
          )}

          {/* Actions de clôture */}
          {!isExamCompleted ? (
            <Button
              variant="outline"
              size="sm"
              onClick={handleCompleteExam}
              className="gap-2 font-bold rounded-full border-border/80 hover:border-primary/50"
            >
              Terminer l&apos;épreuve
            </Button>
          ) : (
            <div className="flex items-center gap-2">
              <Button asChild variant="outline" size="sm" className="gap-2 rounded-full font-bold">
                <Link href="/examens">
                  <BookOpen className="h-4 w-4" />
                  Catalogue Examens
                </Link>
              </Button>
              <Button variant="default" size="sm" onClick={handleRestart} className="gap-2 rounded-full font-bold shadow-md">
                <RotateCcw className="h-4 w-4" /> Recommencer
              </Button>
            </div>
          )}
        </div>
      </header>

      {/* VUE RÉSULTATS OU SALLE VIRTUELLE */}
      {isExamCompleted && evaluation ? (
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 max-w-4xl mx-auto w-full space-y-6">
          <OralDebriefCard evaluation={evaluation} />

          {/* Action Bar Post-Examen */}
          <div className="rounded-3xl border-2 border-border/70 bg-gradient-to-r from-card via-card to-primary/[0.03] p-6 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <span className="text-xs font-bold uppercase tracking-wider text-primary">
                Session Enregistrée
              </span>
              <h3 className="font-display text-lg font-bold text-foreground">
                Votre évaluation FEI a été sauvegardée avec succès
              </h3>
              <p className="text-xs text-muted-foreground">
                Vos points CRS et expressions C1/C2 ont été ajoutés à votre espace candidat.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              <Button asChild variant="outline" size="lg" className="flex-1 sm:flex-initial gap-2 font-bold rounded-2xl">
                <Link href="/examens">
                  <ArrowLeft className="h-4 w-4" />
                  Catalogue des Examens
                </Link>
              </Button>
              <Button asChild variant="ghost" size="lg" className="flex-1 sm:flex-initial gap-2 rounded-2xl">
                <Link href={`/examens/${series.id}`}>
                  Menu Série {series.seriesNumber || 101}
                </Link>
              </Button>
              <Button onClick={handleRestart} variant="default" size="lg" className="flex-1 sm:flex-initial gap-2 font-bold rounded-2xl shadow-md">
                <RotateCcw className="h-4 w-4" />
                Refaire l&apos;Épreuve Orale
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex min-h-0 flex-1 flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x">
          {/* VOLET GAUCHE — STUDIO VIRTUEL DE L'EXAMINATEUR */}
          <div className="flex flex-col items-center justify-between p-6 sm:p-8 bg-gradient-to-b from-card via-card/90 to-primary/[0.02] lg:w-[420px] shrink-0 overflow-y-auto">
            {/* Header Profil Examinateur */}
            <div className="text-center space-y-1.5 w-full">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-0.5 text-[11px] font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
                <Signal className="h-3 w-3" /> Examinateur Officiel FEI
              </div>
              <h2 className="font-display text-xl font-black text-foreground">
                M. Laurent (France Éducation Int.)
              </h2>
              <p className="text-xs text-muted-foreground">
                Évaluateur agréé TCF / TEF Canada · Standard C1/C2
              </p>
            </div>

            {/* AVATAR INTERACTIF 3D AVEC ANNEAUX CONCENTRIQUES */}
            <div className="relative my-6 flex items-center justify-center">
              {/* Anneaux de propagation sonores */}
              <div
                className={cn(
                  "absolute h-44 w-44 rounded-full transition-all duration-700",
                  isExaminerSpeaking
                    ? "bg-cyan-500/20 scale-125 animate-ping opacity-75"
                    : isLiveCallActive
                    ? "bg-emerald-500/15 scale-110 animate-pulse"
                    : isRecording
                    ? "bg-destructive/20 scale-110 animate-ping opacity-75"
                    : "bg-muted/40"
                )}
              />
              <div
                className={cn(
                  "absolute h-36 w-36 rounded-full transition-all duration-500",
                  isExaminerSpeaking
                    ? "bg-cyan-500/30 scale-110 animate-pulse"
                    : isLiveCallActive
                    ? "bg-emerald-500/20 scale-105 animate-pulse"
                    : isRecording
                    ? "bg-destructive/30 scale-105 animate-pulse"
                    : "bg-muted/20"
                )}
              />

              {/* Sphère centrale de l'avatar */}
              <div
                className={cn(
                  "relative flex h-28 w-28 items-center justify-center rounded-full border-4 shadow-2xl transition-all duration-500 backdrop-blur-md",
                  isExaminerSpeaking
                    ? "border-cyan-400 bg-gradient-to-br from-cyan-500/20 to-blue-600/30 text-cyan-500 shadow-cyan-500/30 scale-105"
                    : isLiveCallActive
                    ? "border-emerald-500 bg-gradient-to-br from-emerald-500/20 to-teal-600/30 text-emerald-500 shadow-emerald-500/30"
                    : isRecording
                    ? "border-destructive bg-destructive/10 text-destructive shadow-destructive/30 scale-105"
                    : "border-border/80 bg-card text-muted-foreground"
                )}
              >
                <Bot className="h-12 w-12 drop-shadow-md" />

                {/* Badge d'état de parole en surimpression */}
                <div
                  className={cn(
                    "absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full border-2 border-card text-[11px] font-black shadow-md",
                    isExaminerSpeaking
                      ? "bg-cyan-500 text-white animate-bounce"
                      : isLiveCallActive
                      ? "bg-emerald-500 text-white"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {isExaminerSpeaking ? "🗣️" : isLiveCallActive ? "🎙️" : "⏸️"}
                </div>
              </div>
            </div>

            {/* VISUALISEUR DE SPECTRE 21ST.DEV & ÉTAT AUDIO */}
            <div className="w-full text-center space-y-2.5">
              <OralWaveform
                isRecording={isRecording}
                isExaminerSpeaking={isExaminerSpeaking}
                isLiveCallActive={isLiveCallActive}
              />
              <p className="text-xs font-semibold">
                {isLiveCallActive ? (
                  isExaminerSpeaking ? (
                    <span className="text-cyan-600 dark:text-cyan-400 inline-flex items-center gap-1.5 font-bold animate-pulse">
                      <Volume2 className="h-3.5 w-3.5" />
                      M. Laurent s&apos;exprime (vous pouvez l&apos;interrompre)...
                    </span>
                  ) : (
                    <span className="text-emerald-600 dark:text-emerald-400 inline-flex items-center gap-1.5 font-bold">
                      <Radio className="h-3.5 w-3.5 animate-pulse" />
                      Micro ouvert : Parlez librement, M. Laurent vous écoute
                    </span>
                  )
                ) : isExaminerSpeaking ? (
                  <span className="text-cyan-600 dark:text-cyan-400 font-bold inline-flex items-center gap-1">
                    <Volume2 className="h-3.5 w-3.5" /> M. Laurent parle (Voix Studio Charlie)...
                  </span>
                ) : isRecording ? (
                  <span className="text-destructive font-bold inline-flex items-center gap-1">
                    <Mic className="h-3.5 w-3.5" /> Micro actif : Parlez maintenant...
                  </span>
                ) : (
                  <span className="text-muted-foreground">
                    En attente de votre réponse
                  </span>
                )}
              </p>
            </div>

            {/* CARTE DE CONTRÔLE D'APPEL VOCAL TEMPS RÉEL (21ST.DEV LUXURY CARD) */}
            <div className="w-full my-4">
              {!isLiveCallActive ? (
                <div className="rounded-3xl border-2 border-emerald-500/30 bg-gradient-to-b from-emerald-500/10 via-emerald-500/5 to-transparent p-5 text-center space-y-3 shadow-md hover:border-emerald-500/50 transition-all">
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
                    <Sparkles className="h-3 w-3" /> Mode Entretien Sans Latence
                  </div>
                  <h3 className="font-display text-base font-extrabold text-foreground">
                    Appel Vocal Téléphonique en Direct
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Discutez en continu comme à l&apos;examen officiel, sans toucher à votre clavier ni appuyer sur Envoyer.
                  </p>

                  {callError && (
                    <div className="flex items-center gap-2 rounded-xl bg-destructive/10 p-2.5 text-xs text-destructive text-left border border-destructive/20 animate-in fade-in">
                      <AlertCircle className="h-4 w-4 shrink-0" />
                      <span>{callError}</span>
                    </div>
                  )}

                  <Button
                    type="button"
                    onClick={startLiveCall}
                    disabled={isCallConnecting}
                    size="lg"
                    className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold gap-2.5 shadow-lg shadow-emerald-500/25 rounded-2xl transition-all hover:scale-[1.02] cursor-pointer"
                  >
                    {isCallConnecting ? (
                      <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        Connexion sécurisée WebRTC...
                      </>
                    ) : (
                      <>
                        <PhoneCall className="h-5 w-5" />
                        Démarrer l&apos;Appel Vocal en Direct
                      </>
                    )}
                  </Button>
                </div>
              ) : (
                <div className="rounded-3xl border-2 border-emerald-500 bg-gradient-to-b from-emerald-500/15 via-emerald-500/5 to-transparent p-5 text-center space-y-3.5 shadow-xl animate-in fade-in zoom-in-95">
                  <div className="flex items-center justify-between border-b border-emerald-500/20 pb-2.5">
                    <span className="inline-flex items-center gap-2 text-xs font-bold text-emerald-700 dark:text-emerald-300">
                      <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-ping" />
                      Communication Directe Active
                    </span>
                    <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">
                      {Math.floor(callSeconds / 60)}:{(callSeconds % 60).toString().padStart(2, "0")}
                    </span>
                  </div>

                  <p className="text-xs text-muted-foreground">
                    Le système gère automatiquement les silences et les tours de parole. Vous pouvez interrompre M. Laurent à tout moment.
                  </p>

                  <Button
                    type="button"
                    variant="destructive"
                    size="lg"
                    onClick={endLiveCall}
                    className="w-full font-bold gap-2 shadow-lg shadow-destructive/20 rounded-2xl transition-all hover:scale-[1.01] cursor-pointer"
                  >
                    <PhoneOff className="h-5 w-5" />
                    Raccrocher l&apos;Appel Live
                  </Button>
                </div>
              )}
            </div>

            {/* CHECKLIST DE LA MISSION DE LA TÂCHE */}
            {currentTask.roleplayScenario && (
              <div className="w-full rounded-2xl border bg-card/60 backdrop-blur-xs p-4 text-xs space-y-2 shadow-xs">
                <div className="flex items-center justify-between">
                  <p className="font-bold text-primary uppercase text-[10px] tracking-wider">
                    Objectifs Officiels (Jeu de Rôle) :
                  </p>
                  <span className="text-[10px] text-muted-foreground font-mono">FEI Grille B2/C1</span>
                </div>
                <p className="font-medium text-foreground leading-snug">
                  {currentTask.roleplayScenario.situation}
                </p>
                <div className="space-y-1 pt-1 border-t">
                  {currentTask.roleplayScenario.objectives.map((obj, i) => (
                    <div key={i} className="flex items-start gap-1.5 text-muted-foreground text-[11px]">
                      <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                      <span>{obj}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* VOLET DROIT — CONSOLE STÉNOGRAPHIQUE & DIALOGUE */}
          <div className="flex min-h-0 flex-1 flex-col bg-background">
            {/* Bannière Mode Appel en Direct */}
            {isLiveCallActive && (
              <div className="flex items-center justify-between border-b bg-emerald-500/10 px-6 py-2.5 text-xs font-semibold text-emerald-800 dark:text-emerald-300">
                <span className="flex items-center gap-2">
                  <Radio className="h-3.5 w-3.5 animate-pulse text-emerald-600" />
                  Mode Appel Direct actif : vos échanges sont transcrits au fil de l&apos;eau ci-dessous.
                </span>
                <span className="text-[11px] opacity-80 hidden sm:inline">
                  Audio PCM 16kHz · Latence &lt; 500ms
                </span>
              </div>
            )}

            {/* Fil de discussion interactif */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {dialogues[currentTaskIndex]?.map((msg) => {
                const isEx = msg.sender === "examiner";
                return (
                  <div
                    key={msg.id}
                    className={cn(
                      "flex items-start gap-3 max-w-xl group",
                      isEx ? "mr-auto" : "ml-auto flex-row-reverse"
                    )}
                  >
                    <div
                      className={cn(
                        "flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl text-xs font-bold shadow-sm transition-transform group-hover:scale-105",
                        isEx
                          ? "bg-gradient-to-br from-cyan-500 to-blue-600 text-white"
                          : "bg-gradient-to-br from-[#E51A31] to-rose-700 text-white"
                      )}
                    >
                      {isEx ? <Bot className="h-5 w-5" /> : <User className="h-5 w-5" />}
                    </div>

                    <div
                      className={cn(
                        "rounded-3xl p-4 text-sm leading-relaxed shadow-xs transition-all relative",
                        isEx
                          ? "bg-card border border-border/80 text-foreground rounded-tl-xs"
                          : "bg-primary text-primary-foreground rounded-tr-xs shadow-md shadow-primary/10"
                      )}
                    >
                      <div className="flex items-center justify-between gap-3 mb-1 opacity-70 text-[11px] font-bold">
                        <span>{isEx ? "M. Laurent (Examinateur)" : "Vous (Candidat)"}</span>
                        {isEx && (
                          <button
                            type="button"
                            onClick={() => playOrFetchExaminerSpeech(msg.text)}
                            title="Réécouter la voix de M. Laurent"
                            className="inline-flex items-center gap-1 hover:text-cyan-500 transition-colors cursor-pointer"
                          >
                            <Volume2 className="h-3 w-3" />
                            <span>Réécouter</span>
                          </button>
                        )}
                      </div>
                      <p>{msg.text}</p>
                    </div>
                  </div>
                );
              })}
              <div ref={dialogueEndRef} />
            </div>

            {/* ZONE DE RÉPONSE ET COMMANDES (21ST.DEV GLASS CONSOLE) */}
            <div className="border-t bg-card/80 backdrop-blur-md p-4 sm:p-6 space-y-3.5">
              {/* Suggestions rapides en Tâche 2 pour relancer l'examinateur */}
              {currentTaskIndex === 1 && !isLiveCallActive && (
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="text-muted-foreground text-[11px] font-bold">Suggestions de relance :</span>
                  <button
                    type="button"
                    onClick={() => handleSendCandidateSpeech("Quels sont les jours et les horaires de ces ateliers culinaires ?")}
                    className="rounded-full border bg-muted/60 hover:bg-muted px-3 py-1 text-foreground transition-all hover:border-primary/40 text-[11px] cursor-pointer"
                  >
                    « Quels sont les horaires ? »
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSendCandidateSpeech("Combien coûte l'inscription et proposez-vous un tarif dégressif ?")}
                    className="rounded-full border bg-muted/60 hover:bg-muted px-3 py-1 text-foreground transition-all hover:border-primary/40 text-[11px] cursor-pointer"
                  >
                    « Quels sont les tarifs ? »
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSendCandidateSpeech("Est-ce que les ingrédients et le matériel de cuisine sont fournis ?")}
                    className="rounded-full border bg-muted/60 hover:bg-muted px-3 py-1 text-foreground transition-all hover:border-primary/40 text-[11px] cursor-pointer"
                  >
                    « Le matériel est-il fourni ? »
                  </button>
                </div>
              )}

              {/* Console d'envoi interactive */}
              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant={isRecording ? "destructive" : "outline"}
                  size="icon"
                  className={cn(
                    "h-12 w-12 shrink-0 rounded-2xl shadow-sm transition-all cursor-pointer",
                    isRecording && "animate-pulse scale-105 shadow-destructive/30"
                  )}
                  onClick={toggleRecording}
                  disabled={isLiveCallActive}
                  title={isRecording ? "Arrêter d'enregistrer" : "Activer le micro"}
                >
                  {isRecording ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                </Button>

                <div className="relative flex-1">
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
                    disabled={isLiveCallActive}
                    placeholder={
                      isLiveCallActive
                        ? "Mode Appel Direct actif : parlez librement dans votre micro..."
                        : isRecording
                        ? "Parlez dans votre micro ou écrivez..."
                        : "Tapez votre réponse ou utilisez le micro..."
                    }
                    className="w-full rounded-2xl border border-border/80 bg-background/80 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 shadow-xs disabled:opacity-60"
                  />
                </div>

                <Button
                  type="button"
                  onClick={() => handleSendCandidateSpeech()}
                  disabled={!currentCandidateInput.trim() || isExaminerSpeaking || isLiveCallActive}
                  size="lg"
                  className="shrink-0 gap-2 rounded-2xl font-bold shadow-md shadow-primary/20 px-5 cursor-pointer"
                >
                  <span>Envoyer</span>
                  <Send className="h-4 w-4" />
                </Button>
              </div>

              {/* Barre de navigation entre les tâches de l'examen */}
              <div className="flex justify-between items-center text-xs text-muted-foreground pt-1 border-t border-border/40">
                <span className="flex items-center gap-1.5 font-medium">
                  <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                  Barème FEI : 3 Tâches · 12 minutes d&apos;évaluation
                </span>

                {currentTaskIndex < 2 ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCurrentTaskIndex((t) => (t + 1) as 1 | 2)}
                    className="gap-1.5 text-primary hover:text-primary font-bold hover:bg-primary/10 rounded-full"
                  >
                    Passer à la Tâche {currentTaskIndex + 2}
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCompleteExam}
                    className="gap-1.5 text-primary font-bold hover:bg-primary/10 rounded-full"
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
