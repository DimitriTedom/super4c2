"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Mic,
  Volume2,
  VolumeX,
  CheckCircle2,
  AlertTriangle,
  Play,
  Square,
  Sparkles,
  ArrowRight,
  Headphones,
  ShieldCheck,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface OralHardwareCheckProps {
  seriesId: string;
}

export function OralHardwareCheck({ seriesId }: OralHardwareCheckProps) {
  // --- Micro State ---
  const [micStatus, setMicStatus] = useState<"idle" | "requesting" | "listening" | "passed" | "error">("idle");
  const [micErrorMsg, setMicErrorMsg] = useState<string | null>(null);
  const [audioLevel, setAudioLevel] = useState<number>(0);
  const [voiceDetected, setVoiceDetected] = useState<boolean>(false);

  // Audio Context / Stream refs
  const streamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const voiceDetectionTimer = useRef<NodeJS.Timeout | null>(null);

  // --- Speaker / Headphone State ---
  const [speakerStatus, setSpeakerStatus] = useState<"idle" | "playing" | "passed">("idle");
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

  // Clean up audio stream & animation frame
  const cleanupMic = useCallback(() => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== "closed") {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
    if (voiceDetectionTimer.current) {
      clearTimeout(voiceDetectionTimer.current);
      voiceDetectionTimer.current = null;
    }
    setAudioLevel(0);
  }, []);

  useEffect(() => {
    return () => {
      cleanupMic();
      if (audioPlayerRef.current) {
        audioPlayerRef.current.pause();
      }
    };
  }, [cleanupMic]);

  // Start microphone test
  const startMicTest = async () => {
    cleanupMic();
    setMicStatus("requesting");
    setMicErrorMsg(null);
    setVoiceDetected(false);

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("L'accès au microphone n'est pas pris en charge par ce navigateur.");
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      streamRef.current = stream;
      setMicStatus("listening");

      // Setup Web Audio Analyser
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const audioCtx = new AudioCtx();
      audioContextRef.current = audioCtx;

      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 128;
      analyser.smoothingTimeConstant = 0.5;
      source.connect(analyser);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      const checkLevel = () => {
        analyser.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i];
        }
        const avg = sum / dataArray.length;
        const normalized = Math.min(100, Math.round((avg / 128) * 100));
        setAudioLevel(normalized);

        // Detect substantial voice (> 15% volume)
        if (normalized > 15) {
          if (!voiceDetectionTimer.current) {
            voiceDetectionTimer.current = setTimeout(() => {
              setVoiceDetected(true);
              setMicStatus("passed");
            }, 600);
          }
        }

        animFrameRef.current = requestAnimationFrame(checkLevel);
      };

      checkLevel();
    } catch (err: unknown) {
      cleanupMic();
      setMicStatus("error");
      const error = err as Error;
      if (error.name === "NotAllowedError" || error.name === "PermissionDeniedError") {
        setMicErrorMsg("Autorisation refusée. Veuillez autoriser l'accès au microphone dans la barre d'adresse de votre navigateur (icône cadenas).");
      } else if (error.name === "NotFoundError" || error.name === "DevicesNotFoundError") {
        setMicErrorMsg("Aucun microphone détecté sur cet appareil. Veuillez brancher un casque ou un micro externe.");
      } else {
        setMicErrorMsg(error.message || "Impossible d'accéder au microphone.");
      }
    }
  };

  // Play audio test for headphones
  const playSpeakerTest = () => {
    if (!audioPlayerRef.current) return;

    if (speakerStatus === "playing") {
      audioPlayerRef.current.pause();
      audioPlayerRef.current.currentTime = 0;
      setSpeakerStatus("idle");
    } else {
      setSpeakerStatus("playing");
      audioPlayerRef.current.currentTime = 0;
      audioPlayerRef.current.play().catch(() => {
        setSpeakerStatus("idle");
      });
    }
  };

  const onAudioEnded = () => {
    setSpeakerStatus("passed");
  };

  const confirmSpeaker = () => {
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
      audioPlayerRef.current.currentTime = 0;
    }
    setSpeakerStatus("passed");
  };

  const allPassed = micStatus === "passed" && speakerStatus === "passed";

  return (
    <div className="space-y-6 rounded-2xl border border-primary/20 bg-gradient-to-br from-card via-card to-primary/5 p-6 sm:p-8 shadow-sm">
      {/* Hidden audio element for headphone test */}
      <audio
        ref={audioPlayerRef}
        src="/audio/eo/laurent-step1.mp3"
        onEnded={onAudioEnded}
        preload="auto"
      />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4">
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4" />
            Protocole Officiel FEI — Étape Préalable
          </span>
          <h2 className="font-display text-xl sm:text-2xl font-extrabold text-foreground">
            Vérification du Matériel Audio
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Assurez-vous d&apos;être entendu clairement par l&apos;examinateur IA et d&apos;entendre parfaitement ses relances.
          </p>
        </div>

        {allPassed ? (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>Matériel 100% Validé</span>
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-bold text-amber-600 dark:text-amber-400">
            <span>Calibrage Requis</span>
          </span>
        )}
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {/* TEST 1 : MICROPHONE */}
        <div className="rounded-xl border bg-background/80 p-5 space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Mic className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-display text-sm font-bold text-foreground">
                    1. Test du Microphone
                  </h3>
                  <span className="text-[11px] text-muted-foreground">
                    Parlez à voix haute pour tester le niveau
                  </span>
                </div>
              </div>

              {micStatus === "passed" && (
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>Validé</span>
                </span>
              )}
            </div>

            {/* Vu-mètre visuel 16 barres */}
            <div className="space-y-1.5 pt-2">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-muted-foreground">Signal d&apos;entrée :</span>
                <span className="font-mono font-bold text-foreground">{audioLevel}%</span>
              </div>

              <div className="flex h-5 items-center gap-1 rounded-lg border bg-muted/30 px-2">
                {Array.from({ length: 16 }).map((_, i) => {
                  const threshold = (i / 16) * 100;
                  const isActive = audioLevel >= threshold && micStatus === "listening";
                  const isHigh = i >= 13;
                  const isMid = i >= 8;

                  return (
                    <div
                      key={i}
                      className={cn(
                        "h-3 flex-1 rounded-xs transition-all duration-75",
                        !isActive
                          ? "bg-muted-foreground/15"
                          : isHigh
                          ? "bg-rose-500"
                          : isMid
                          ? "bg-amber-500"
                          : "bg-emerald-500"
                      )}
                    />
                  );
                })}
              </div>
            </div>

            {/* Feedback message */}
            {micStatus === "listening" && (
              <p className="text-xs text-muted-foreground animate-pulse">
                🎙️ Dites quelques mots (ex: &quot;Bonjour, je passe le TCF&quot;) pour valider...
              </p>
            )}

            {micStatus === "passed" && (
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                ✓ Voix captée avec un signal audio net et stable.
              </p>
            )}

            {micStatus === "error" && (
              <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-2.5 text-xs text-destructive space-y-1">
                <div className="flex items-center gap-1.5 font-bold">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  <span>Erreur d&apos;accès micro</span>
                </div>
                <p className="text-[11px] leading-relaxed">{micErrorMsg}</p>
              </div>
            )}
          </div>

          <div className="pt-2">
            {micStatus === "idle" && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={startMicTest}
                className="w-full gap-2 text-xs font-semibold"
              >
                <Mic className="h-3.5 w-3.5" />
                <span>Tester mon microphone</span>
              </Button>
            )}

            {micStatus === "requesting" && (
              <Button type="button" variant="outline" size="sm" disabled className="w-full gap-2 text-xs">
                <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                <span>Demande d&apos;autorisation...</span>
              </Button>
            )}

            {micStatus === "listening" && (
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => setMicStatus("passed")}
                className="w-full gap-2 text-xs font-semibold"
              >
                <span>Forcer la validation</span>
              </Button>
            )}

            {micStatus === "passed" && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={startMicTest}
                className="w-full gap-1.5 text-xs text-muted-foreground hover:text-foreground"
              >
                <RefreshCw className="h-3 w-3" />
                <span>Retester le micro</span>
              </Button>
            )}

            {micStatus === "error" && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={startMicTest}
                className="w-full gap-2 text-xs font-semibold"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                <span>Réessayer la connexion</span>
              </Button>
            )}
          </div>
        </div>

        {/* TEST 2 : CASQUE / AUDIO */}
        <div className="rounded-xl border bg-background/80 p-5 space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
                  <Headphones className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-display text-sm font-bold text-foreground">
                    2. Test du Casque / Audio
                  </h3>
                  <span className="text-[11px] text-muted-foreground">
                    Écoutez la voix d&apos;accueil de M. Laurent
                  </span>
                </div>
              </div>

              {speakerStatus === "passed" && (
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>Validé</span>
                </span>
              )}
            </div>

            {/* Lecteur interactif de la voix de test */}
            <div className="rounded-lg border bg-muted/20 p-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <Volume2 className="h-3.5 w-3.5 text-cyan-500" />
                  <span>Voix officielle de l&apos;examinateur</span>
                </span>
                <span className="text-[10px] font-mono text-muted-foreground">0:04</span>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={playSpeakerTest}
                  className="gap-2 text-xs font-semibold"
                >
                  {speakerStatus === "playing" ? (
                    <>
                      <Square className="h-3 w-3 fill-foreground" />
                      <span>Arrêter</span>
                    </>
                  ) : (
                    <>
                      <Play className="h-3 w-3 fill-foreground" />
                      <span>Écouter la voix test</span>
                    </>
                  )}
                </Button>

                {speakerStatus === "playing" && (
                  <div className="flex items-center gap-1 text-[11px] text-cyan-600 dark:text-cyan-400 animate-pulse font-medium">
                    <span>En cours de lecture...</span>
                  </div>
                )}
              </div>
            </div>

            {speakerStatus === "passed" ? (
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                ✓ Niveau de sortie audio confirmé par le candidat.
              </p>
            ) : (
              <p className="text-xs text-muted-foreground">
                Recommandé : portez des écouteurs pour éviter que le son des haut-parleurs ne soit réinjecté dans votre micro.
              </p>
            )}
          </div>

          <div className="pt-2">
            {speakerStatus !== "passed" ? (
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={confirmSpeaker}
                className="w-full gap-2 text-xs font-semibold"
              >
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>J&apos;entends distinctement M. Laurent</span>
              </Button>
            ) : (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={playSpeakerTest}
                className="w-full gap-1.5 text-xs text-muted-foreground hover:text-foreground"
              >
                <RefreshCw className="h-3 w-3" />
                <span>Réécouter la voix test</span>
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Barre d'action finale */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 border-t">
        <div className="text-xs text-muted-foreground">
          {allPassed ? (
            <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4" />
              Vos périphériques audio sont prêts pour l&apos;entretien oral.
            </span>
          ) : (
            <span>
              Validez les 2 étapes ci-dessus pour lancer l&apos;épreuve en toute sérénité.
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" asChild>
            <Link href="/examens">Retour au catalogue</Link>
          </Button>

          {allPassed ? (
            <Button
              asChild
              size="lg"
              className="bg-[#E51A31] hover:bg-[#B31224] text-white gap-2 shadow-md animate-in fade-in"
            >
              <Link href={`/examens/${seriesId}/eo`}>
                <Sparkles className="h-4 w-4" />
                <span>Entrer dans la Salle d&apos;Entretien</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          ) : (
            <Button asChild size="lg" variant="secondary" className="gap-2">
              <Link href={`/examens/${seriesId}/eo`}>
                <span>Entrer sans vérifier</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
