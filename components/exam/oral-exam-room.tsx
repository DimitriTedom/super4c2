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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const conversationRef = useRef<any>(null);

  const currentTask = series.tasks[currentTaskIndex];
  const dialogueEndRef = useRef<HTMLDivElement | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);

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

  // Synthèse vocale de secours (Web Speech API locale en cas de panne réseau)
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
    <div className="flex h-screen flex-col bg-background">
      {/* Header officiel */}
      <header className="flex h-16 shrink-0 items-center justify-between gap-4 border-b bg-card px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <Button asChild variant="ghost" size="sm" className="gap-1.5 text-muted-foreground hover:text-foreground">
            <Link href={`/examens/${series.id}`}>
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Menu Série</span>
            </Link>
          </Button>

          <div className="border-l pl-3">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-primary">
              TCF Canada — Expression Orale
            </p>
            <h1 className="font-display text-base font-bold sm:text-lg truncate">
              {currentTask.title}
            </h1>
          </div>

          {isLiveCallActive && (
            <div className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
              <Radio className="h-3.5 w-3.5 animate-pulse" />
              <span>Appel Live Actif</span>
            </div>
          )}
        </div>

        {/* Minuteur */}
        {!isExamCompleted && (
          <div
            role="timer"
            className="flex items-center gap-2 rounded-full border px-4 py-1.5 font-mono text-xl font-bold tabular-nums"
          >
            <Clock className="h-4 w-4" />
            {formatClock(remaining)}
          </div>
        )}

        <div className="flex items-center gap-2">
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
            <div className="flex items-center gap-2">
              <Button asChild variant="outline" size="sm" className="gap-2">
                <Link href="/examens">
                  <BookOpen className="h-4 w-4" />
                  Catalogue Examens
                </Link>
              </Button>
              <Button variant="default" size="sm" onClick={handleRestart} className="gap-2">
                <RotateCcw className="h-4 w-4" /> Recommencer
              </Button>
            </div>
          )}
        </div>
      </header>

      {/* Vue Résultats ou Salle Virtuelle */}
      {isExamCompleted && evaluation ? (
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 max-w-4xl mx-auto w-full space-y-6">
          <OralDebriefCard evaluation={evaluation} />

          {/* Barre d'action de retour au menu proéminente */}
          <div className="rounded-2xl border bg-card p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <h3 className="font-display text-base font-bold text-foreground">
                Session terminée et sauvegardée dans votre profil
              </h3>
              <p className="text-xs text-muted-foreground">
                Votre score et vos tournures d&apos;excellence ont été synchronisés avec votre carnet de révision.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              <Button asChild variant="outline" size="lg" className="flex-1 sm:flex-initial gap-2 font-bold">
                <Link href="/examens">
                  <ArrowLeft className="h-4 w-4" />
                  Retour au catalogue
                </Link>
              </Button>
              <Button asChild variant="ghost" size="lg" className="flex-1 sm:flex-initial gap-2">
                <Link href={`/examens/${series.id}`}>
                  Menu de la Série {series.seriesNumber || 101}
                </Link>
              </Button>
              <Button onClick={handleRestart} variant="default" size="lg" className="flex-1 sm:flex-initial gap-2 font-bold">
                <RotateCcw className="h-4 w-4" />
                Refaire l&apos;épreuve
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex min-h-0 flex-1 flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x">
          {/* Volet Gauche : Avatar Examinateur & Contrôle de l'Appel Live */}
          <div className="flex flex-col items-center justify-between p-6 sm:p-8 bg-muted/20 lg:w-96 shrink-0 overflow-y-auto">
            <div className="text-center space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Examinateur Officiel IA (Voix ElevenLabs)
              </span>
              <h2 className="font-display text-lg font-bold">M. Laurent (France Éducation Int.)</h2>
            </div>

            {/* Avatar immersif avec Halo */}
            <div className="relative my-4 flex items-center justify-center">
              <div
                className={cn(
                  "absolute h-36 w-36 rounded-full transition-all duration-300",
                  isLiveCallActive
                    ? isExaminerSpeaking
                      ? "bg-cyan-500/25 scale-125 animate-pulse"
                      : "bg-emerald-500/25 scale-110 animate-pulse"
                    : isExaminerSpeaking
                    ? "bg-cyan-500/20 scale-125 animate-pulse"
                    : isRecording
                    ? "bg-[#E51A31]/20 scale-110 animate-pulse"
                    : "bg-muted"
                )}
              />
              <div
                className={cn(
                  "relative flex h-28 w-28 items-center justify-center rounded-full border-4 shadow-xl transition-all duration-300",
                  isLiveCallActive
                    ? isExaminerSpeaking
                      ? "border-cyan-500 bg-cyan-500/10 text-cyan-600"
                      : "border-emerald-500 bg-emerald-500/10 text-emerald-600"
                    : isExaminerSpeaking
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
                isRecording={isRecording || (isLiveCallActive && !isExaminerSpeaking)}
                isExaminerSpeaking={isExaminerSpeaking}
              />
              <p className="text-xs font-medium text-muted-foreground">
                {isLiveCallActive ? (
                  isExaminerSpeaking ? (
                    <span className="text-cyan-600 dark:text-cyan-400 font-bold">
                      M. Laurent vous parle... (vous pouvez l&apos;interrompre)
                    </span>
                  ) : (
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                      Micro ouvert : Parlez librement, M. Laurent vous écoute
                    </span>
                  )
                ) : isExaminerSpeaking ? (
                  "L'examinateur parle (Voix Charlie ElevenLabs)..."
                ) : isRecording ? (
                  "Micro ouvert : Parlez maintenant..."
                ) : (
                  "En attente de votre réponse"
                )}
              </p>
            </div>

            {/* CARTE DE CONTRÔLE D'APPEL VOCAL TEMPS RÉEL (ELEVENLABS) */}
            <div className="w-full my-4">
              {!isLiveCallActive ? (
                <div className="rounded-2xl border-2 border-emerald-500/30 bg-gradient-to-b from-emerald-500/10 to-transparent p-4 text-center space-y-2.5 shadow-sm">
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
                    <Sparkles className="h-3 w-3" /> Nouveau · Sans latence
                  </div>
                  <h3 className="font-display text-sm font-bold text-foreground">
                    Mode Appel Téléphonique Live
                  </h3>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    Discutez en continu comme au téléphone avec M. Laurent, sans cliquer sur Envoyer.
                  </p>

                  {callError && (
                    <div className="flex items-center gap-1.5 rounded-lg bg-destructive/10 p-2 text-[11px] text-destructive text-left">
                      <AlertCircle className="h-4 w-4 shrink-0" />
                      <span>{callError}</span>
                    </div>
                  )}

                  <Button
                    type="button"
                    onClick={startLiveCall}
                    disabled={isCallConnecting}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold gap-2 shadow-md shadow-emerald-600/20"
                  >
                    {isCallConnecting ? (
                      <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        Connexion à M. Laurent...
                      </>
                    ) : (
                      <>
                        <PhoneCall className="h-4 w-4" />
                        Démarrer l&apos;Appel Vocal en Direct
                      </>
                    )}
                  </Button>
                </div>
              ) : (
                <div className="rounded-2xl border-2 border-emerald-500 bg-emerald-500/10 p-4 text-center space-y-3 shadow-lg animate-in fade-in zoom-in-95">
                  <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-700 dark:text-emerald-300">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                    En communication avec M. Laurent
                  </div>
                  <p className="text-xs text-muted-foreground">
                    L&apos;entretien se déroule en direct. Parlez naturellement, le système gère les tours de parole.
                  </p>
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={endLiveCall}
                    className="w-full font-bold gap-2 shadow-md"
                  >
                    <PhoneOff className="h-4 w-4" />
                    Raccrocher l&apos;Appel Live
                  </Button>
                </div>
              )}
            </div>

            {/* Sujet de la tâche */}
            {currentTask.roleplayScenario && (
              <div className="w-full rounded-xl border bg-card p-4 text-xs space-y-1.5 shadow-sm">
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
            {/* Bannière explicative si appel en cours */}
            {isLiveCallActive && (
              <div className="flex items-center justify-between border-b bg-emerald-500/10 px-6 py-2 text-xs font-semibold text-emerald-800 dark:text-emerald-300">
                <span className="flex items-center gap-2">
                  <Radio className="h-3.5 w-3.5 animate-pulse text-emerald-600" />
                  Mode Appel Direct actif : vos échanges vocaux sont transcrits en temps réel ci-dessous.
                </span>
                <span className="text-[11px] text-muted-foreground">
                  Alimenté par l&apos;Agent Élite Super4C2
                </span>
              </div>
            )}

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
              {/* Suggestions rapides en Tâche 2 pour aider le candidat */}
              {currentTaskIndex === 1 && !isLiveCallActive && (
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
                  onClick={toggleRecording}
                  disabled={isLiveCallActive}
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
                  disabled={isLiveCallActive}
                  placeholder={
                    isLiveCallActive
                      ? "Appel en direct actif : parlez librement dans votre micro..."
                      : isRecording
                      ? "Parlez dans votre micro ou écrivez..."
                      : "Tapez votre réponse ou utilisez le micro..."
                  }
                  className="flex-1 rounded-xl border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-60"
                />

                <Button
                  type="button"
                  onClick={() => handleSendCandidateSpeech()}
                  disabled={!currentCandidateInput.trim() || isExaminerSpeaking || isLiveCallActive}
                  className="shrink-0 gap-1.5"
                >
                  <span>Envoyer</span>
                  <Send className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex justify-between items-center text-xs text-muted-foreground pt-1">
                <span>Réglementation : 12 minutes d&apos;entretien global (FEI)</span>
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
