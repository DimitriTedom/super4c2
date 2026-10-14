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
  ChevronLeft,
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
  FastForward,
  Keyboard,
  MessageSquare,
  Award,
  Layers,
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

  // Mode Clavier (Accessibilité fallback discrète)
  const [showKeyboardInput, setShowKeyboardInput] = useState<boolean>(false);
  const [showFullTranscriptModal, setShowFullTranscriptModal] = useState<boolean>(false);

  // Références d'état synchrones pour éliminer les conflits audio et les doubles voix
  const isExamCompletedRef = useRef<boolean>(false);
  const isLiveCallActiveRef = useRef<boolean>(false);
  const activeTtsAbortRef = useRef<AbortController | null>(null);
  const speechSessionIdRef = useRef<number>(0);

  // Enregistrement Audio Intégral & Mixeur Deux Canaux (Candidat + Examinateur)
  const audioCtxRef = useRef<AudioContext | null>(null);
  const audioDestRef = useRef<MediaStreamAudioDestinationNode | null>(null);
  const micSourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const currentAudioSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const [sessionAudioUrl, setSessionAudioUrl] = useState<string | null>(null);

  // Obtention / Réveil du Master AudioContext & Destination
  const getAudioContext = useCallback(() => {
    if (typeof window === "undefined") return null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return null;

    if (!audioCtxRef.current) {
      audioCtxRef.current = new AudioContextClass();
      audioDestRef.current = audioCtxRef.current.createMediaStreamDestination();
    }
    if (audioCtxRef.current.state === "suspended") {
      void audioCtxRef.current.resume();
    }
    return { ctx: audioCtxRef.current, dest: audioDestRef.current };
  }, []);

  // États pour le Mode Appel Vocal Temps Réel (WebRTC / ElevenLabs Conversational AI)
  const [isLiveCallActive, setIsLiveCallActive] = useState<boolean>(false);
  const [isCallConnecting, setIsCallConnecting] = useState<boolean>(false);
  const [callError, setCallError] = useState<string | null>(null);
  const [callSeconds, setCallSeconds] = useState<number>(0);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const conversationRef = useRef<any>(null);

  const currentTask = series.tasks[currentTaskIndex];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);

  // Synchronisation des refs
  useEffect(() => {
    isExamCompletedRef.current = isExamCompleted;
  }, [isExamCompleted]);

  useEffect(() => {
    isLiveCallActiveRef.current = isLiveCallActive;
  }, [isLiveCallActive]);

  // Arrêt autoritaire et synchrone de TOUS les flux audio (MP3, Synthèse WebSpeech, Fetch en cours)
  const stopAllAudio = useCallback(() => {
    // 1. Incrémenter le jeton de session pour invalider toute promesse audio asynchrone en vol
    speechSessionIdRef.current += 1;

    // 2. Annuler immédiatement tout fetch TTS ElevenLabs en cours
    if (activeTtsAbortRef.current) {
      activeTtsAbortRef.current.abort();
      activeTtsAbortRef.current = null;
    }

    // 3. Annuler immédiatement la synthèse vocale locale du navigateur
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }

    // 4. Stopper le buffer Web Audio de l'examinateur
    if (currentAudioSourceRef.current) {
      try {
        currentAudioSourceRef.current.stop();
        currentAudioSourceRef.current.disconnect();
      } catch {
        // ignore
      }
      currentAudioSourceRef.current = null;
    }

    // 5. Stopper et désactiver l'élément HTML5 Audio sans déclencher son handler d'erreur
    if (currentAudioRef.current) {
      currentAudioRef.current.onended = null;
      currentAudioRef.current.onerror = null;
      currentAudioRef.current.onplay = null;
      try {
        currentAudioRef.current.pause();
        currentAudioRef.current.src = "";
      } catch {
        // ignore
      }
      currentAudioRef.current = null;
    }

    setIsExaminerSpeaking(false);
  }, []);

  // Synthèse vocale de secours (Web Speech API locale) protégée contre les déclenchements parasites
  const speakExaminerFallback = useCallback(
    (text: string, onEnd?: () => void, targetSessionId?: number) => {
      if (typeof window === "undefined" || !("speechSynthesis" in window)) {
        setIsExaminerSpeaking(false);
        if (onEnd) onEnd();
        return;
      }

      const expectedSession = targetSessionId ?? speechSessionIdRef.current;
      // Ne jamais parler si la session est expirée, terminée ou si un appel live est actif
      if (
        expectedSession !== speechSessionIdRef.current ||
        isExamCompletedRef.current ||
        isLiveCallActiveRef.current
      ) {
        return;
      }

      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "fr-FR";
      utterance.rate = 1.0;
      utterance.pitch = 1.0;

      utterance.onstart = () => {
        if (
          expectedSession === speechSessionIdRef.current &&
          !isExamCompletedRef.current &&
          !isLiveCallActiveRef.current
        ) {
          setIsExaminerSpeaking(true);
        } else {
          window.speechSynthesis.cancel();
          setIsExaminerSpeaking(false);
        }
      };

      utterance.onend = () => {
        if (expectedSession === speechSessionIdRef.current) {
          setIsExaminerSpeaking(false);
          if (onEnd) onEnd();
        }
      };

      utterance.onerror = () => {
        if (expectedSession === speechSessionIdRef.current) {
          setIsExaminerSpeaking(false);
          if (onEnd) onEnd();
        }
      };

      window.speechSynthesis.speak(utterance);
    },
    []
  );

  // Lecture d'audio MP3 ElevenLabs (Charlie) avec routage mixé dans l'enregistrement
  const playOrFetchExaminerSpeech = useCallback(
    async (text: string, existingBase64?: string | null, onEnd?: () => void) => {
      if (typeof window === "undefined") return;
      if (isExamCompletedRef.current || isLiveCallActiveRef.current) return;

      // Stopper tout audio précédent et générer un jeton de session unique
      stopAllAudio();
      const thisSessionId = speechSessionIdRef.current;

      const isValidSession = () =>
        thisSessionId === speechSessionIdRef.current &&
        !isExamCompletedRef.current &&
        !isLiveCallActiveRef.current;

      // Fonction d'aide pour jouer l'audio via Web Audio API (diffusion + capture dans le mix d'enregistrement)
      const playViaWebAudio = async (base64Str: string) => {
        const audioSetup = getAudioContext();
        if (!audioSetup?.ctx) return false;

        try {
          const binaryString = atob(base64Str);
          const bytes = new Uint8Array(binaryString.length);
          for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
          }
          const audioBuffer = await audioSetup.ctx.decodeAudioData(bytes.buffer.slice(0));

          if (!isValidSession()) return false;

          const bufferSource = audioSetup.ctx.createBufferSource();
          bufferSource.buffer = audioBuffer;

          // 1. Sortie audio vers les haut-parleurs/casque du candidat
          bufferSource.connect(audioSetup.ctx.destination);

          // 2. Sortie vers le mixeur d'enregistrement (pour archiver la voix de l'examinateur !)
          if (audioSetup.dest) {
            bufferSource.connect(audioSetup.dest);
          }

          bufferSource.onended = () => {
            if (isValidSession()) {
              setIsExaminerSpeaking(false);
              currentAudioSourceRef.current = null;
              if (onEnd) onEnd();
            }
          };

          setIsExaminerSpeaking(true);
          bufferSource.start(0);
          currentAudioSourceRef.current = bufferSource;
          return true;
        } catch (decodeErr) {
          console.warn("[WebAudio] Décodage échoué, repli HTML5 :", decodeErr);
          return false;
        }
      };

      // 1. Si nous avons déjà le MP3 en base64
      if (existingBase64) {
        const played = await playViaWebAudio(existingBase64);
        if (played) return;

        // Repli HTML5 Audio standard
        try {
          const audio = new Audio(`data:audio/mp3;base64,${existingBase64}`);
          currentAudioRef.current = audio;

          audio.onplay = () => {
            if (isValidSession()) {
              setIsExaminerSpeaking(true);
            } else {
              audio.pause();
              audio.src = "";
            }
          };

          audio.onended = () => {
            if (isValidSession()) {
              setIsExaminerSpeaking(false);
              currentAudioRef.current = null;
              if (onEnd) onEnd();
            }
          };

          audio.onerror = () => {
            if (isValidSession()) {
              currentAudioRef.current = null;
              speakExaminerFallback(text, onEnd, thisSessionId);
            }
          };

          await audio.play();
          return;
        } catch (err: unknown) {
          const errorName = (err as { name?: string })?.name;
          if (errorName === "AbortError" || !isValidSession()) return;
          if (isValidSession()) {
            speakExaminerFallback(text, onEnd, thisSessionId);
          }
          return;
        }
      }

      // 2. Sinon, générer l'audio ElevenLabs via notre route API sécurisée
      const controller = new AbortController();
      activeTtsAbortRef.current = controller;

      try {
        const res = await fetch("/api/ai/oral-tts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text }),
          signal: controller.signal,
        });

        if (!isValidSession()) return;

        if (res.ok) {
          const data = await res.json();
          if (!isValidSession()) return;

          if (data.ok && data.audioBase64) {
            const played = await playViaWebAudio(data.audioBase64);
            if (played) return;

            // Repli HTML5
            const audio = new Audio(`data:audio/mp3;base64,${data.audioBase64}`);
            currentAudioRef.current = audio;

            audio.onplay = () => {
              if (isValidSession()) {
                setIsExaminerSpeaking(true);
              } else {
                audio.pause();
                audio.src = "";
              }
            };

            audio.onended = () => {
              if (isValidSession()) {
                setIsExaminerSpeaking(false);
                currentAudioRef.current = null;
                if (onEnd) onEnd();
              }
            };

            audio.onerror = () => {
              if (isValidSession()) {
                currentAudioRef.current = null;
                speakExaminerFallback(text, onEnd, thisSessionId);
              }
            };

            await audio.play();
            return;
          }
        }
      } catch (err: unknown) {
        const errorName = (err as { name?: string })?.name;
        if (errorName === "AbortError" || !isValidSession()) return;
        console.warn("[TTS ElevenLabs] Repli local :", err);
      }

      // Repli si le serveur ou la clé est inaccessible et que la session est toujours valide
      if (isValidSession()) {
        speakExaminerFallback(text, onEnd, thisSessionId);
      }
    },
    [getAudioContext, speakExaminerFallback, stopAllAudio]
  );

  // Démarrage de l'enregistrement de la session globale (MediaRecorder avec mixeur Candidat + Examinateur)
  const ensureMediaRecordingStarted = useCallback(async () => {
    if (typeof window === "undefined" || !navigator.mediaDevices?.getUserMedia) return;
    try {
      if (!mediaStreamRef.current) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaStreamRef.current = stream;
      }

      // Connexion du microphone au mixeur audio
      const audioSetup = getAudioContext();
      if (audioSetup?.ctx && audioSetup?.dest && mediaStreamRef.current) {
        if (!micSourceRef.current) {
          micSourceRef.current = audioSetup.ctx.createMediaStreamSource(mediaStreamRef.current);
          micSourceRef.current.connect(audioSetup.dest);
        }
      }

      // Flux mixte regroupant le microphone du candidat ET la voix de l'examinateur
      const recordingStream = audioSetup?.dest?.stream || mediaStreamRef.current;

      if (!mediaRecorderRef.current || mediaRecorderRef.current.state === "inactive") {
        const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
          ? "audio/webm;codecs=opus"
          : "audio/webm";
        const recorder = new MediaRecorder(recordingStream, { mimeType });
        recorder.ondataavailable = (event) => {
          if (event.data && event.data.size > 0) {
            recordedChunksRef.current.push(event.data);
          }
        };
        recorder.onstop = () => {
          if (recordedChunksRef.current.length > 0) {
            const fullBlob = new Blob(recordedChunksRef.current, { type: "audio/webm" });
            const url = URL.createObjectURL(fullBlob);
            setSessionAudioUrl(url);
          }
        };
        recorder.start(1000);
        mediaRecorderRef.current = recorder;
      }
    } catch (err) {
      console.warn("[MediaRecorder] Microphone non disponible pour capture globale:", err);
    }
  }, [getAudioContext]);

  const stopMediaRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      try {
        mediaRecorderRef.current.stop();
      } catch {
        // ignore
      }
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
  }, []);

  // Passer les consignes immédiatement (Bouton Skip) : coupe net la voix
  const handleSkipConsigne = useCallback(() => {
    stopAllAudio();
    setIsExaminerSpeaking(false);
  }, [stopAllAudio]);

  // Fermeture propre et immédiate de l'appel live
  const endLiveCall = useCallback(async () => {
    isLiveCallActiveRef.current = false;
    setIsLiveCallActive(false);
    setIsCallConnecting(false);
    setIsExaminerSpeaking(false);

    if (conversationRef.current) {
      try {
        await conversationRef.current.endSession();
      } catch (err) {
        console.warn("[Live Call] Erreur fermeture session:", err);
      }
      conversationRef.current = null;
    }
  }, []);

  // Lancement de l'Appel Vocal Continu avec l'Examinateur ElevenLabs (WebRTC)
  const startLiveCall = async () => {
    try {
      setCallError(null);
      setIsCallConnecting(true);
      // Couper immédiatement tout TTS concurrent pour éviter la double voix !
      stopAllAudio();
      isLiveCallActiveRef.current = true;

      // 1. Autorisation du microphone & démarrage de l'enregistrement de session
      await ensureMediaRecordingStarted();

      // 2. URL signée sécurisée
      const res = await fetch("/api/ai/oral-signed-url");
      const data = await res.json();
      if (!data.ok || !data.signedUrl) {
        throw new Error(data.error || "Impossible d'obtenir le jeton d'appel.");
      }

      // 3. Démarrage de la conversation avec Worklets auto-hébergés
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
          isLiveCallActiveRef.current = true;
          setIsCallConnecting(false);
          setCallError(null);
        },
        onDisconnect: () => {
          setIsLiveCallActive(false);
          isLiveCallActiveRef.current = false;
          setIsCallConnecting(false);
          setIsExaminerSpeaking(false);
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onError: (err: any) => {
          console.error("[Live Call] Erreur:", err);
          const msg = typeof err === "string" ? err : err?.message || "Erreur de connexion audio.";
          setCallError(msg);
          setIsLiveCallActive(false);
          isLiveCallActiveRef.current = false;
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
      isLiveCallActiveRef.current = false;
    }
  };

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
      void ensureMediaRecordingStarted();
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
    if (isExamCompletedRef.current) return;

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
    if (!isLiveCallActiveRef.current) {
      void playOrFetchExaminerSpeech(initialPrompt);
    }

    return () => {
      stopAllAudio();
    };
  }, [currentTaskIndex, series.tasks, playOrFetchExaminerSpeech, stopAllAudio]);

  // Clôture et évaluation définitive de l'épreuve
  const handleCompleteExam = useCallback(() => {
    isExamCompletedRef.current = true;
    setIsExamCompleted(true);
    setIsRecording(false);
    // Couper net tout audio et tout appel immédiatement
    stopAllAudio();
    void endLiveCall();
    stopMediaRecording();

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
  }, [dialogues, endLiveCall, series, stopAllAudio, stopMediaRecording]);

  // Minuteur de la tâche active
  useEffect(() => {
    if (isExamCompleted) return;

    const timer = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          if (currentTaskIndex < 2) {
            stopAllAudio();
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
  }, [currentTaskIndex, handleCompleteExam, isExamCompleted, series.tasks, stopAllAudio]);

  // Envoi de la réplique du candidat (Mode Tour par Tour)
  const handleSendCandidateSpeech = async (customSpeech?: string) => {
    const textToSend = customSpeech || currentCandidateInput || (isRecording ? "[Réponse enregistrée au micro]" : "");
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
    if (isExamCompletedRef.current) return;
    let reply = "";
    const lower = candidateText.toLowerCase();

    if (currentTaskIndex === 1) {
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
      if (lower.includes("d'accord") || lower.includes("oui") || lower.includes("pour")) {
        reply = "Je comprends bien votre argument. Cependant, ne pensez-vous pas que cette mesure pénaliserait lourdement les travailleurs résidant en grande banlieue ?";
      } else {
        reply = "C'est une position intéressante. Quelles solutions concrètes proposeriez-vous alors pour concilier mobilité urbaine et transition écologique ?";
      }
    } else {
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
    isExamCompletedRef.current = false;
    isLiveCallActiveRef.current = false;
    void endLiveCall();
    stopAllAudio();
    stopMediaRecording();
    recordedChunksRef.current = [];
    setSessionAudioUrl(null);
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
      isExamCompletedRef.current = true;
      void endLiveCall();
      stopAllAudio();
      stopMediaRecording();
    };
  }, [endLiveCall, stopAllAudio, stopMediaRecording]);

  // Messages de la tâche active
  const currentTaskDialogues = dialogues[currentTaskIndex] || [];
  const latestExaminerMsg = [...currentTaskDialogues].reverse().find((m) => m.sender === "examiner");
  const latestCandidateMsg = [...currentTaskDialogues].reverse().find((m) => m.sender === "candidate");

  return (
    <div className="flex h-screen flex-col bg-background selection:bg-primary/20">
      {/* HEADER DE LUXE — CERTIFICATION OFFICIELLE & TÉLÉMÉTRIE */}
      <header className="flex h-16 shrink-0 items-center justify-between gap-4 border-b bg-card/90 backdrop-blur-md px-4 sm:px-6 z-20">
        <div className="flex items-center gap-3">
          <Button
            asChild
            variant="ghost"
            size="sm"
            onClick={stopAllAudio}
            className="gap-1.5 text-muted-foreground hover:text-foreground font-semibold rounded-full"
          >
            <Link href={`/examens/${series.id}`}>
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Quitter</span>
            </Link>
          </Button>

          <div className="border-l pl-3">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20">
                <ShieldCheck className="h-3 w-3" /> TCF CANADA · SÉRIE {series.seriesNumber || 101}
              </span>
              <span className="hidden md:inline-flex items-center gap-1 text-[10px] font-medium text-muted-foreground">
                <Headphones className="h-3 w-3 text-cyan-500" /> Visio-Examen FEI
              </span>
            </div>
            <h1 className="font-display text-sm font-extrabold sm:text-base truncate tracking-tight text-foreground">
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
              className="gap-2 font-bold rounded-full border-border/80 hover:border-primary/50 text-xs sm:text-sm cursor-pointer"
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
              <Button variant="default" size="sm" onClick={handleRestart} className="gap-2 rounded-full font-bold shadow-md cursor-pointer">
                <RotateCcw className="h-4 w-4" /> Recommencer
              </Button>
            </div>
          )}
        </div>
      </header>

      {/* VUE RÉSULTATS OU SALLE VIRTUELLE */}
      {isExamCompleted && evaluation ? (
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 max-w-4xl mx-auto w-full space-y-6">
          <OralDebriefCard
            evaluation={evaluation}
            sessionAudioUrl={sessionAudioUrl}
            dialogues={dialogues}
          />

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
                Vos points CRS et votre flux audio complet ont été ajoutés à votre espace candidat.
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
              <Button onClick={handleRestart} variant="default" size="lg" className="flex-1 sm:flex-initial gap-2 font-bold rounded-2xl shadow-md cursor-pointer">
                <RotateCcw className="h-4 w-4" />
                Refaire l&apos;Épreuve Orale
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex min-h-0 flex-1 flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x overflow-hidden">
          {/* COLONNE GAUCHE — DOSSIER DE L'ÉPREUVE & PROGRESSION (340px) */}
          <aside className="flex flex-col p-5 sm:p-6 bg-card/40 lg:w-84 xl:w-96 shrink-0 overflow-y-auto space-y-5">
            {/* CARTE 1 : SUJET OFFICIEL DE LA TÂCHE */}
            <div className="rounded-2xl border bg-card p-4 sm:p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider text-primary bg-primary/10 px-2.5 py-0.5 rounded-full border border-primary/20">
                  Tâche {currentTaskIndex + 1} / 3
                </span>
                <span className="text-[11px] font-bold text-muted-foreground flex items-center gap-1 font-mono">
                  <Clock className="h-3 w-3" />
                  {Math.floor(currentTask.durationSeconds / 60)} min
                </span>
              </div>

              <div>
                <h2 className="font-display text-base font-black text-foreground">
                  {currentTask.title}
                </h2>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  {currentTaskIndex === 0
                    ? "Entretien dirigé sans temps de préparation. Présentez-vous et échangez avec l'examinateur sur votre vie quotidienne et vos projets."
                    : currentTaskIndex === 1
                    ? "Exercice en interaction. Posez une série de questions pertinentes pour obtenir des renseignements complets sur le sujet."
                    : "Expression d'un point de vue argumenté. Développez une argumentation structurée avec exemples concrets et nuances."}
                </p>
              </div>

              {/* Scénario spécifique pour Tâche 2 (Jeu de Rôle) */}
              {currentTask.roleplayScenario && (
                <div className="rounded-xl border bg-muted/40 p-3 text-xs space-y-2">
                  <div className="flex items-center justify-between border-b pb-1.5">
                    <span className="font-bold text-primary uppercase text-[10px] tracking-wider">
                      Situation de l&apos;annonce :
                    </span>
                    <span className="text-[10px] font-mono text-muted-foreground">Barème B1/B2</span>
                  </div>
                  <p className="font-medium text-foreground leading-snug">
                    {currentTask.roleplayScenario.situation}
                  </p>
                  <div className="space-y-1 pt-1">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase">
                      Vos objectifs à aborder :
                    </p>
                    {currentTask.roleplayScenario.objectives.map((obj, i) => (
                      <div key={i} className="flex items-start gap-1.5 text-muted-foreground text-[11px]">
                        <CheckCircle2 className="h-3 w-3 text-primary shrink-0 mt-0.5" />
                        <span>{obj}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Règle officielle FEI */}
              <div className="rounded-xl bg-primary/5 border border-primary/20 p-2.5 text-[11px] text-muted-foreground space-y-1">
                <span className="font-bold text-primary flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5" /> Consigne FEI Officielle
                </span>
                <p className="leading-relaxed">
                  Exprimez-vous de manière naturelle et continue. Vous êtes noté sur l&apos;aisance, la richesse lexicale et la pertinence communicative.
                </p>
              </div>
            </div>

            {/* CARTE 2 : PROGRESSION DE L'ÉPREUVE (STEPPER VERTICAL) */}
            <div className="rounded-2xl border bg-card p-4 sm:p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Layers className="h-3.5 w-3.5 text-primary" />
                  Progression de l&apos;épreuve
                </h3>
                <span className="text-[10px] font-mono font-semibold text-primary">3 ÉTAPES</span>
              </div>

              <div className="space-y-2.5">
                {series.tasks.map((task, idx) => {
                  const isCurrent = idx === currentTaskIndex;
                  const isPast = idx < currentTaskIndex;

                  return (
                    <button
                      key={task.taskNumber}
                      type="button"
                      onClick={() => {
                        stopAllAudio();
                        setCurrentTaskIndex(idx as 0 | 1 | 2);
                      }}
                      className={cn(
                        "w-full text-left rounded-xl p-3 border transition-all flex items-start gap-3 cursor-pointer",
                        isCurrent
                          ? "border-primary bg-primary/10 shadow-sm"
                          : isPast
                          ? "border-border/60 bg-muted/20 opacity-80 hover:opacity-100"
                          : "border-border/40 bg-card hover:border-border"
                      )}
                    >
                      <div
                        className={cn(
                          "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold mt-0.5",
                          isCurrent
                            ? "bg-primary text-primary-foreground animate-pulse"
                            : isPast
                            ? "bg-emerald-500 text-white"
                            : "bg-muted text-muted-foreground"
                        )}
                      >
                        {isPast ? "✓" : idx + 1}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <p className="text-xs font-bold truncate text-foreground">
                            {task.title.split(":")[0] || `Tâche ${idx + 1}`}
                          </p>
                          <span className="text-[10px] font-mono text-muted-foreground">
                            {Math.floor(task.durationSeconds / 60)}m
                          </span>
                        </div>
                        <p className="text-[11px] text-muted-foreground truncate">
                          {idx === 0
                            ? "Niveau A1 - B1 · Entretien"
                            : idx === 1
                            ? "Niveau B1 - B2 · Interaction"
                            : "Niveau B2 - C2 · Point de vue"}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* CALL TO ACTION APPEL DIRECT PRO (ELEVENLABS WEBRTC) */}
            <div className="rounded-2xl border-2 border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent p-4 space-y-2.5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
                  <Sparkles className="h-3 w-3" /> Mode Élite Mains-Libres
                </span>
                <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400">WebRTC</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Interagissez en continu avec l&apos;examinateur Charlie sans appuyer sur aucun bouton.
              </p>
              {!isLiveCallActive ? (
                <Button
                  type="button"
                  onClick={startLiveCall}
                  disabled={isCallConnecting}
                  size="sm"
                  className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold gap-2 rounded-xl shadow-md cursor-pointer"
                >
                  {isCallConnecting ? (
                    <>
                      <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Connexion...
                    </>
                  ) : (
                    <>
                      <PhoneCall className="h-4 w-4" />
                      Démarrer Appel Vocal Live
                    </>
                  )}
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={endLiveCall}
                  className="w-full font-bold gap-2 rounded-xl shadow-md cursor-pointer"
                >
                  <PhoneOff className="h-4 w-4" />
                  Raccrocher l&apos;Appel
                </Button>
              )}
            </div>
          </aside>

          {/* ZONE PRINCIPALE — POD VIDÉO HAUTE VISIBILITÉ & SCÈNE D'INTERACTION */}
          <main className="flex min-h-0 flex-1 flex-col bg-background p-4 sm:p-6 overflow-y-auto space-y-4">
            {/* POD VIDÉO ANIMÉ DE L'EXAMINATEUR M. LAURENT (BOUCLE D'ATTENTE & BOUCLE DE PAROLE) */}
            <div className="relative w-full h-[260px] sm:h-[320px] md:h-[380px] rounded-3xl overflow-hidden border-2 border-border/80 bg-slate-950 shadow-2xl flex items-center justify-center shrink-0">
              {/* Fond d'affiche photographique de secours */}
              <img
                src="/brand/examiner-laurent.jpg"
                alt="M. Laurent - Examinateur Officiel FEI TCF Canada"
                className="absolute inset-0 w-full h-full object-cover object-top opacity-40 filter blur-[1px]"
              />

              {/* 1. Vidéo en boucle d'attente / écoute attentive (Idle Loop avec micro-mouvements des yeux et respiration) */}
              <video
                autoPlay
                loop
                muted
                playsInline
                className={cn(
                  "absolute inset-0 w-full h-full object-cover object-top transition-all duration-700",
                  !isExaminerSpeaking ? "opacity-100 scale-100" : "opacity-0 pointer-events-none scale-[0.99]"
                )}
              >
                <source src="/brand/examiner/examiner_idle.mp4" type="video/mp4" />
                <img src="/brand/examiner/examiner_idle.gif" alt="M. Laurent - En écoute" className="w-full h-full object-cover object-top" />
              </video>

              {/* 2. Vidéo en boucle de parole / mime explicatif (Speaking Loop avec mimique articulatoire et cadence d'échange) */}
              <video
                autoPlay
                loop
                muted
                playsInline
                className={cn(
                  "absolute inset-0 w-full h-full object-cover object-top transition-all duration-700",
                  isExaminerSpeaking ? "opacity-100 scale-[1.01] brightness-105" : "opacity-0 pointer-events-none scale-100"
                )}
              >
                <source src="/brand/examiner/examiner_speaking.mp4" type="video/mp4" />
                <img src="/brand/examiner/examiner_speaking.gif" alt="M. Laurent - En parole" className="w-full h-full object-cover object-top" />
              </video>

              {/* Halo réactif subtil sur le contour */}
              <div
                className={cn(
                  "absolute inset-0 pointer-events-none transition-all duration-500",
                  isExaminerSpeaking
                    ? "ring-4 ring-inset ring-cyan-500/60 shadow-[inset_0_0_40px_rgba(6,182,212,0.25)]"
                    : isRecording || (isLiveCallActive && !isExaminerSpeaking)
                    ? "ring-4 ring-inset ring-emerald-500/60 shadow-[inset_0_0_40px_rgba(16,185,129,0.25)]"
                    : ""
                )}
              />

              {/* Gradient bas uniquement pour lisibilité des badges (laisse le visage totalement dégagé) */}
              <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent pointer-events-none" />

              {/* OVERLAY HAUT GAUCHE : EN DIRECT & EXAMINATEUR */}
              <div className="absolute top-4 left-4 flex flex-wrap items-center gap-2 z-10">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-slate-900/85 backdrop-blur-md px-3 py-1 text-xs font-bold text-white border border-white/15 shadow-lg">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-500 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-600" />
                  </span>
                  <span>EN DIRECT</span>
                </div>

                <div className="inline-flex items-center gap-1.5 rounded-full bg-slate-900/80 backdrop-blur-md px-3 py-1 text-xs font-semibold text-slate-200 border border-white/10 shadow-sm">
                  <Signal className="h-3 w-3 text-cyan-400" />
                  <span>M. Laurent · Examinateur FEI</span>
                </div>
              </div>

              {/* OVERLAY HAUT DROIT : BOUTON PASSER LES CONSIGNES & QUALITÉ AUDIO */}
              <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
                {isExaminerSpeaking && (
                  <Button
                    type="button"
                    onClick={handleSkipConsigne}
                    size="sm"
                    className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold gap-1.5 rounded-full shadow-lg shadow-amber-500/25 border border-amber-300 text-xs animate-in fade-in zoom-in-95 cursor-pointer"
                    title="Arrêter la voix de l'examinateur immédiatement"
                  >
                    <FastForward className="h-3.5 w-3.5 fill-current" />
                    Passer les consignes
                  </Button>
                )}

                <div className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-slate-900/80 backdrop-blur-md px-3 py-1 text-xs font-medium text-slate-300 border border-white/10">
                  <Headphones className="h-3 w-3 text-cyan-400" />
                  <span>Audio Studio Charlie</span>
                </div>
              </div>

              {/* OVERLAY BAS : PILULE D'ÉTAT DYNAMIQUE & BOUTON RÉÉCOUTER */}
              <div className="absolute bottom-4 inset-x-4 flex items-center justify-between z-10">
                <div className="inline-flex items-center gap-2 rounded-full bg-slate-900/90 backdrop-blur-md px-4 py-1.5 text-xs font-bold border border-white/15 shadow-xl">
                  {isExaminerSpeaking ? (
                    <>
                      <Volume2 className="h-4 w-4 text-cyan-400 animate-pulse" />
                      <span className="text-cyan-300">M. Laurent s&apos;exprime...</span>
                      <span className="flex gap-0.5 items-end h-3">
                        <span className="w-1 bg-cyan-400 animate-[bounce_0.6s_infinite_100ms] h-3 rounded-full" />
                        <span className="w-1 bg-cyan-400 animate-[bounce_0.6s_infinite_200ms] h-2 rounded-full" />
                        <span className="w-1 bg-cyan-400 animate-[bounce_0.6s_infinite_300ms] h-3.5 rounded-full" />
                      </span>
                    </>
                  ) : isLiveCallActive ? (
                    <>
                      <Radio className="h-4 w-4 text-emerald-400 animate-pulse" />
                      <span className="text-emerald-300">Microphone ouvert · Vous pouvez parler</span>
                      <span className="flex gap-0.5 items-end h-3">
                        <span className="w-1 bg-emerald-400 animate-[bounce_0.6s_infinite_100ms] h-2.5 rounded-full" />
                        <span className="w-1 bg-emerald-400 animate-[bounce_0.6s_infinite_200ms] h-3.5 rounded-full" />
                        <span className="w-1 bg-emerald-400 animate-[bounce_0.6s_infinite_300ms] h-2 rounded-full" />
                      </span>
                    </>
                  ) : isRecording ? (
                    <>
                      <Mic className="h-4 w-4 text-rose-400 animate-pulse" />
                      <span className="text-rose-300">Microphone actif · Parlez distinctement</span>
                    </>
                  ) : (
                    <>
                      <User className="h-4 w-4 text-slate-300" />
                      <span className="text-slate-300">En attente de votre réponse</span>
                    </>
                  )}
                </div>

                {/* Bouton pour réécouter la consigne */}
                {latestExaminerMsg && !isExaminerSpeaking && (
                  <Button
                    type="button"
                    onClick={() => playOrFetchExaminerSpeech(latestExaminerMsg.text)}
                    variant="secondary"
                    size="sm"
                    className="bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-white/10 rounded-full text-xs gap-1.5 shadow-md cursor-pointer backdrop-blur-md"
                  >
                    <Volume2 className="h-3.5 w-3.5 text-cyan-400" />
                    Réécouter
                  </Button>
                )}
              </div>
            </div>

            {/* BANDEAU D'ÉTAT DU MICROPHONE & SOUS-TITRE / CONSIGNE EN COURS */}
            <div className="rounded-2xl border bg-card p-4 sm:p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b pb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
                  <Bot className="h-4 w-4" /> Consigne & Question de M. Laurent
                </span>
                <span className="text-[11px] text-muted-foreground font-mono">
                  {currentTaskDialogues.length} réplique(s) dans cette tâche
                </span>
              </div>

              {/* Texte de la question de l'examinateur */}
              <div className="bg-muted/30 rounded-xl p-3.5 border border-border/60">
                <p className="text-sm sm:text-base font-medium text-foreground leading-relaxed">
                  « {latestExaminerMsg?.text || currentTask.examinerPrompt} »
                </p>
              </div>

              {/* Transcription en temps réel de la réponse du candidat */}
              {(currentCandidateInput || latestCandidateMsg) && (
                <div className="rounded-xl border border-primary/20 bg-primary/[0.03] p-3 text-xs space-y-1">
                  <div className="flex items-center justify-between text-muted-foreground font-semibold text-[11px]">
                    <span className="flex items-center gap-1 text-primary">
                      <User className="h-3.5 w-3.5" /> Votre réponse {isRecording && "(Transcription en direct)"} :
                    </span>
                    {isRecording && (
                      <span className="h-2 w-2 rounded-full bg-rose-500 animate-ping" />
                    )}
                  </div>
                  <p className="text-foreground font-medium leading-relaxed italic">
                    {currentCandidateInput || latestCandidateMsg?.text}
                  </p>
                </div>
              )}

              {/* Visualiseur de Spectre Fréquentiel 21st.dev MCP */}
              <div className="pt-2">
                <OralWaveform
                  isRecording={isRecording}
                  isExaminerSpeaking={isExaminerSpeaking}
                  isLiveCallActive={isLiveCallActive}
                />
              </div>

              {/* État synthétique du micro */}
              <div className="flex items-center justify-between text-xs pt-1">
                <p className="font-semibold">
                  {isExaminerSpeaking ? (
                    <span className="text-amber-600 dark:text-amber-400 inline-flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5" />
                      Microphone inactif pendant la consigne. Écoutez ou cliquez sur « Passer les consignes ».
                    </span>
                  ) : isLiveCallActive ? (
                    <span className="text-emerald-600 dark:text-emerald-400 inline-flex items-center gap-1.5">
                      <Radio className="h-3.5 w-3.5 animate-pulse" />
                      Microphone actif (WebRTC). Parlez librement, l&apos;examinateur vous écoute en temps réel.
                    </span>
                  ) : isRecording ? (
                    <span className="text-rose-600 dark:text-rose-400 inline-flex items-center gap-1.5">
                      <Mic className="h-3.5 w-3.5 animate-pulse" />
                      Microphone actif. Exprimez votre réponse puis cliquez sur « Valider ma réponse ».
                    </span>
                  ) : (
                    <span className="text-muted-foreground inline-flex items-center gap-1.5">
                      <MicOff className="h-3.5 w-3.5" />
                      Microphone en pause. Cliquez sur le micro pour répondre à M. Laurent.
                    </span>
                  )}
                </p>

                {/* Bouton pour afficher le tiroir complet des échanges */}
                {currentTaskDialogues.length > 1 && (
                  <button
                    type="button"
                    onClick={() => setShowFullTranscriptModal(true)}
                    className="text-primary text-[11px] font-bold hover:underline inline-flex items-center gap-1 cursor-pointer"
                  >
                    <MessageSquare className="h-3 w-3" />
                    Historique ({currentTaskDialogues.length})
                  </button>
                )}
              </div>
            </div>

            {/* CONSOLE DE COMMANDES ET D'ENVOI */}
            <div className="rounded-2xl border bg-card p-4 sm:p-5 shadow-xs space-y-3">
              {/* Suggestions rapides en Tâche 2 (Jeu de rôle) */}
              {currentTaskIndex === 1 && !isLiveCallActive && (
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="text-muted-foreground text-[11px] font-bold">Suggestions d&apos;amorce :</span>
                  <button
                    type="button"
                    onClick={() => handleSendCandidateSpeech("Quels sont les jours et les horaires précis de ces séances ?")}
                    className="rounded-full border bg-muted/60 hover:bg-muted px-3 py-1 text-foreground transition-all hover:border-primary/40 text-[11px] cursor-pointer"
                  >
                    « Quels sont les horaires ? »
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSendCandidateSpeech("Combien coûte l'inscription et proposez-vous un tarif réduit ?")}
                    className="rounded-full border bg-muted/60 hover:bg-muted px-3 py-1 text-foreground transition-all hover:border-primary/40 text-[11px] cursor-pointer"
                  >
                    « Quels sont les tarifs ? »
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSendCandidateSpeech("Est-ce que le matériel et les ingrédients sont entièrement fournis ?")}
                    className="rounded-full border bg-muted/60 hover:bg-muted px-3 py-1 text-foreground transition-all hover:border-primary/40 text-[11px] cursor-pointer"
                  >
                    « Le matériel est-il fourni ? »
                  </button>
                </div>
              )}

              {/* Barre Principale d'Action Micro / Envoi */}
              <div className="flex items-center gap-3">
                {/* Bouton Micro Grand Format */}
                <Button
                  type="button"
                  variant={isRecording ? "destructive" : "default"}
                  size="lg"
                  className={cn(
                    "flex-1 sm:flex-initial h-13 px-6 rounded-2xl font-bold gap-2.5 shadow-md transition-all cursor-pointer",
                    isRecording && "animate-pulse shadow-destructive/30 scale-102"
                  )}
                  onClick={toggleRecording}
                  disabled={isLiveCallActive}
                >
                  {isRecording ? (
                    <>
                      <MicOff className="h-5 w-5" />
                      <span>Terminer la prise de parole</span>
                    </>
                  ) : (
                    <>
                      <Mic className="h-5 w-5" />
                      <span>Prendre la parole (Micro)</span>
                    </>
                  )}
                </Button>

                {/* Bouton de Validation / Envoi de la réponse */}
                <Button
                  type="button"
                  onClick={() => handleSendCandidateSpeech()}
                  disabled={isLiveCallActive || (!currentCandidateInput.trim() && !isRecording)}
                  size="lg"
                  variant="outline"
                  className="h-13 px-6 rounded-2xl font-bold gap-2 border-primary/40 text-primary hover:bg-primary/10 shadow-xs cursor-pointer"
                >
                  <span>Valider ma réponse</span>
                  <Send className="h-4 w-4" />
                </Button>

                {/* Bouton Clavier pour Bascule Discrète d'Accessibilité */}
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowKeyboardInput((prev) => !prev)}
                  title={showKeyboardInput ? "Masquer la saisie clavier" : "Saisie clavier de secours"}
                  className="h-13 w-13 rounded-2xl border text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  <Keyboard className="h-5 w-5" />
                </Button>
              </div>

              {/* Champ Clavier Optionnel (Discret / Dépliable) */}
              {showKeyboardInput && (
                <div className="flex items-center gap-2 pt-2 animate-in fade-in">
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
                    placeholder="Saisie clavier de secours si votre microphone est défaillant..."
                    className="flex-1 rounded-xl border border-border/80 bg-background px-4 py-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => handleSendCandidateSpeech()}
                    disabled={!currentCandidateInput.trim()}
                    className="rounded-xl font-bold text-xs cursor-pointer"
                  >
                    Envoyer
                  </Button>
                </div>
              )}

              {/* Navigation entre les 3 tâches de l'examen */}
              <div className="flex items-center justify-between text-xs text-muted-foreground pt-3 border-t">
                {currentTaskIndex > 0 ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      stopAllAudio();
                      setCurrentTaskIndex((t) => (t - 1) as 0 | 1);
                    }}
                    className="gap-1 rounded-full text-xs cursor-pointer"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Tâche {currentTaskIndex}
                  </Button>
                ) : (
                  <div />
                )}

                {currentTaskIndex < 2 ? (
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => {
                      stopAllAudio();
                      setCurrentTaskIndex((t) => (t + 1) as 1 | 2);
                    }}
                    className="gap-1.5 font-bold rounded-full shadow-sm text-xs cursor-pointer"
                  >
                    Passer à la Tâche {currentTaskIndex + 2}
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    variant="default"
                    size="sm"
                    onClick={handleCompleteExam}
                    className="gap-1.5 font-bold rounded-full shadow-md text-xs bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
                  >
                    <Award className="h-4 w-4" />
                    Terminer et générer mon Bilan FEI
                  </Button>
                )}
              </div>
            </div>
          </main>
        </div>
      )}

      {/* MODAL HISTORIQUE DES ÉCHANGES DE LA TÂCHE */}
      {showFullTranscriptModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-card border rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-display font-bold text-foreground text-sm flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-primary" />
                Historique des Répliques — Tâche {currentTaskIndex + 1}
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowFullTranscriptModal(false)}
                className="rounded-full h-8 w-8 p-0 cursor-pointer"
              >
                ✕
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-xs">
              {currentTaskDialogues.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    "p-3 rounded-2xl space-y-1",
                    msg.sender === "examiner"
                      ? "bg-muted/50 border border-border/80 mr-6"
                      : "bg-primary/10 border border-primary/20 ml-6 text-foreground"
                  )}
                >
                  <div className="flex items-center justify-between font-bold text-[10px] text-muted-foreground">
                    <span>{msg.sender === "examiner" ? "M. Laurent" : "Vous (Candidat)"}</span>
                    {msg.sender === "examiner" && (
                      <button
                        type="button"
                        onClick={() => playOrFetchExaminerSpeech(msg.text)}
                        className="hover:text-primary transition-colors cursor-pointer"
                      >
                        🔊 Réécouter
                      </button>
                    )}
                  </div>
                  <p className="leading-relaxed">{msg.text}</p>
                </div>
              ))}
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={() => setShowFullTranscriptModal(false)}
              className="w-full rounded-xl font-bold cursor-pointer"
            >
              Fermer l&apos;historique
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
