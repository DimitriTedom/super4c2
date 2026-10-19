"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Headphones,
  Save,
  Monitor,
  Settings2,
  Volume2,
  Play,
  Pause,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MarkdownField } from "@/components/admin/markdown-field";
import { upsertCoQuestionAction } from "@/app/admin/series-co/[id]/questions/actions";

interface CoQuestionData {
  id?: string;
  seriesId: string;
  questionNumber: number;
  cefrLevel: string | null;
  nclcTargetLevel: number | null;
  audioUrl?: string | null;
  audioTranscript?: string | null;
  documentTitle?: string | null;
  documentImageUrl?: string | null;
  prompt: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctOption: string;
  explanation: string;
  trapAnalysis?: string | null;
}

interface CoQuestionFormProps {
  seriesId: string;
  seriesNumber: number;
  question?: CoQuestionData;
  defaultNumber?: number;
}

export function CoQuestionForm({
  seriesId,
  seriesNumber,
  question,
  defaultNumber = 1,
}: CoQuestionFormProps) {
  const [questionNumber, setQuestionNumber] = useState<number>(
    question?.questionNumber ?? defaultNumber
  );
  const [activeTab, setActiveTab] = useState<"form" | "cbt-preview">("form");
  const [cefrLevel, setCefrLevel] = useState<string>(question?.cefrLevel || "B2");
  const [correctOption, setCorrectOption] = useState<string>(question?.correctOption || "A");
  const [audioUrl, setAudioUrl] = useState<string>(question?.audioUrl || "");
  const [prompt, setPrompt] = useState<string>(question?.prompt || "");
  const [optionA, setOptionA] = useState<string>(question?.optionA || "");
  const [optionB, setOptionB] = useState<string>(question?.optionB || "");
  const [optionC, setOptionC] = useState<string>(question?.optionC || "");
  const [optionD, setOptionD] = useState<string>(question?.optionD || "");
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const testAudioPlay = () => {
    if (!audioUrl) return;
    try {
      const audio = new Audio(audioUrl);
      if (isPlayingAudio) {
        setIsPlayingAudio(false);
      } else {
        setIsPlayingAudio(true);
        audio.play().catch(() => setIsPlayingAudio(false));
        audio.onended = () => setIsPlayingAudio(false);
      }
    } catch {
      setIsPlayingAudio(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <Button asChild variant="ghost" size="sm" className="gap-1.5 text-xs text-muted-foreground">
          <Link href={`/admin/series-co/${seriesId}/questions`}>
            <ArrowLeft className="h-4 w-4" />
            <span>Retour aux questions de la Série CO #{seriesNumber}</span>
          </Link>
        </Button>

        <div className="flex items-center gap-1 bg-muted/40 p-1 rounded-xl border border-border/50 text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab("form")}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === "form"
                ? "bg-card text-foreground shadow-xs border"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Settings2 className="h-3.5 w-3.5" />
            <span>Éditeur de Question</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("cbt-preview")}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === "cbt-preview"
                ? "bg-primary text-white shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Monitor className="h-3.5 w-3.5" />
            <span>Aperçu Simulateur Écoute</span>
          </button>
        </div>
      </div>

      {/* Header */}
      <div className="border-b pb-4">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-primary/10 text-primary border border-primary/20 mb-1.5">
          <Headphones className="h-3 w-3" />
          Série CO #{seriesNumber} · Question {questionNumber} / 39 FEI
        </div>
        <h1 className="font-display text-2xl sm:text-3xl font-black tracking-tight text-foreground">
          {question ? `Modifier la Question ${question.questionNumber}` : `Ajouter la Question ${questionNumber}`}
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
          Piste audio officielle, transcription, intitulé, options A/B/C/D et analyse didactique des pièges.
        </p>
      </div>

      {/* CBT LIVE PREVIEW TAB */}
      {activeTab === "cbt-preview" && (
        <div className="rounded-2xl border bg-card p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b pb-3">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Simulateur CBT de Compréhension Orale (Conditions Officielles FEI)
              </span>
            </div>
            <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-primary/10 text-primary border border-primary/20">
              Niveau {cefrLevel}
            </span>
          </div>

          <div className="p-5 rounded-2xl border bg-muted/20 space-y-4">
            {/* Audio player simulator */}
            <div className="p-4 rounded-xl border bg-card flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={testAudioPlay}
                  className="h-10 w-10 rounded-full bg-primary text-white flex items-center justify-center shadow-xs hover:bg-primary/90 transition-all cursor-pointer"
                  title="Écouter l'extrait audio"
                >
                  {isPlayingAudio ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
                </button>
                <div>
                  <p className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <Volume2 className="h-3.5 w-3.5 text-primary" />
                    Extrait Sonore · Écoute Unique Officielle
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    {audioUrl ? audioUrl : "Aucune URL audio renseignée."}
                  </p>
                </div>
              </div>
            </div>

            {/* Prompt */}
            <div className="space-y-2 pt-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                Question {questionNumber} sur 39
              </span>
              <h2 className="text-sm font-bold text-foreground leading-relaxed">
                {prompt || "Intitulé de la question..."}
              </h2>
            </div>

            {/* Options Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {[
                { key: "A", val: optionA },
                { key: "B", val: optionB },
                { key: "C", val: optionC },
                { key: "D", val: optionD },
              ].map((opt) => (
                <div
                  key={opt.key}
                  className={`p-3 rounded-xl border flex items-center gap-3 transition-all ${
                    correctOption === opt.key
                      ? "bg-emerald-500/10 border-emerald-500/40 text-foreground"
                      : "bg-card text-muted-foreground border-border"
                  }`}
                >
                  <span
                    className={`h-6 w-6 rounded-lg font-mono font-bold text-xs flex items-center justify-center shrink-0 ${
                      correctOption === opt.key
                        ? "bg-emerald-500 text-white"
                        : "bg-muted text-foreground"
                    }`}
                  >
                    {opt.key}
                  </span>
                  <span className="text-xs font-medium leading-snug">
                    {opt.val || `Option ${opt.key}`}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* FORM */}
      <form
        action={upsertCoQuestionAction}
        className={`space-y-6 ${activeTab === "cbt-preview" ? "hidden" : "block"}`}
      >
        <input type="hidden" name="seriesId" value={seriesId} />
        {question?.id && <input type="hidden" name="id" value={question.id} />}

        {/* 1. Meta / Number / Levels */}
        <div className="rounded-2xl border bg-card p-6 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-primary" />
            <span>Paramètres de la Question d&apos;Écoute</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground">
                Numéro de Question (1 à 39) <span className="text-primary">*</span>
              </label>
              <Input
                type="number"
                name="questionNumber"
                value={questionNumber}
                onChange={(e) => setQuestionNumber(Number(e.target.value))}
                min={1}
                max={39}
                required
                className="h-10 text-xs rounded-xl bg-muted/20 font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground">
                Niveau CECRL <span className="text-primary">*</span>
              </label>
              <Select value={cefrLevel} onValueChange={setCefrLevel}>
                <SelectTrigger className="h-10 text-xs rounded-xl bg-muted/20 border-border">
                  <SelectValue placeholder="Sélectionner le niveau" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  <SelectItem value="A1">A1 (Q1 à Q5)</SelectItem>
                  <SelectItem value="A2">A2 (Q6 à Q12)</SelectItem>
                  <SelectItem value="B1">B1 (Q13 à Q22)</SelectItem>
                  <SelectItem value="B2">B2 (Q23 à Q32 · Seuil NCLC 7)</SelectItem>
                  <SelectItem value="C1">C1 (Q33 à Q37)</SelectItem>
                  <SelectItem value="C2">C2 (Q38 et Q39)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground">
                Palier NCLC Cible
              </label>
              <Input
                type="number"
                name="nclcTargetLevel"
                defaultValue={question?.nclcTargetLevel ?? 7}
                min={3}
                max={10}
                className="h-10 text-xs rounded-xl bg-muted/20 font-mono"
              />
            </div>
          </div>
        </div>

        {/* 2. Piste Audio & Transcription */}
        <div className="rounded-2xl border bg-card p-6 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-primary" />
            <span>Fichier Audio &amp; Transcription Officielle</span>
          </h2>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <Volume2 className="h-3.5 w-3.5 text-primary" />
                <span>URL de la Piste Audio MP3 / AAC</span>
              </label>
              {audioUrl && (
                <button
                  type="button"
                  onClick={testAudioPlay}
                  className="text-[11px] font-bold text-primary hover:underline flex items-center gap-1 cursor-pointer"
                >
                  {isPlayingAudio ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
                  <span>Tester la lecture</span>
                </button>
              )}
            </div>
            <Input
              type="url"
              name="audioUrl"
              value={audioUrl}
              onChange={(e) => setAudioUrl(e.target.value)}
              placeholder="https://cdn.super4c2.com/audio/tcf-co-101-q1.mp3"
              className="h-10 text-xs rounded-xl bg-muted/20 font-mono"
            />
            <p className="text-[11px] text-muted-foreground">
              Lien direct sécurisé (HTTPS) vers le fichier sonore de l&apos;extrait.
            </p>
          </div>

          <MarkdownField
            id="audioTranscript"
            name="audioTranscript"
            label="Transcription Textuelle de l'Extrait Sonore"
            description="Le script exact des répliques entendues (affiché dans la correction et pour le débriefing des erreurs)."
            defaultValue={question?.audioTranscript || ""}
            placeholder="Ex: — Bonjour Madame, pourriez-vous me donner les horaires d'ouverture de la bibliothèque ? ..."
            rows={4}
          />
        </div>

        {/* 3. Intitulé & 4 Options */}
        <div className="rounded-2xl border bg-card p-6 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-primary" />
            <span>Question &amp; Options de Réponse</span>
          </h2>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground">
              Intitulé de la Question <span className="text-primary">*</span>
            </label>
            <Input
              type="text"
              name="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              required
              placeholder="Ex: Que demande l'homme à son interlocutrice ?"
              className="h-10 text-xs rounded-xl bg-muted/20 font-semibold"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <span className="h-5 w-5 rounded-md bg-muted font-mono flex items-center justify-center text-[10px]">A</span>
                <span>Option A <span className="text-primary">*</span></span>
              </label>
              <Input
                type="text"
                name="optionA"
                value={optionA}
                onChange={(e) => setOptionA(e.target.value)}
                required
                className="h-10 text-xs rounded-xl bg-muted/20"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <span className="h-5 w-5 rounded-md bg-muted font-mono flex items-center justify-center text-[10px]">B</span>
                <span>Option B <span className="text-primary">*</span></span>
              </label>
              <Input
                type="text"
                name="optionB"
                value={optionB}
                onChange={(e) => setOptionB(e.target.value)}
                required
                className="h-10 text-xs rounded-xl bg-muted/20"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <span className="h-5 w-5 rounded-md bg-muted font-mono flex items-center justify-center text-[10px]">C</span>
                <span>Option C <span className="text-primary">*</span></span>
              </label>
              <Input
                type="text"
                name="optionC"
                value={optionC}
                onChange={(e) => setOptionC(e.target.value)}
                required
                className="h-10 text-xs rounded-xl bg-muted/20"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <span className="h-5 w-5 rounded-md bg-muted font-mono flex items-center justify-center text-[10px]">D</span>
                <span>Option D <span className="text-primary">*</span></span>
              </label>
              <Input
                type="text"
                name="optionD"
                value={optionD}
                onChange={(e) => setOptionD(e.target.value)}
                required
                className="h-10 text-xs rounded-xl bg-muted/20"
              />
            </div>
          </div>

          <div className="space-y-1.5 pt-2">
            <label className="text-xs font-bold text-foreground">
              Bonne Réponse Validée <span className="text-primary">*</span>
            </label>
            <Select name="correctOption" value={correctOption} onValueChange={setCorrectOption}>
              <SelectTrigger className="h-10 text-xs rounded-xl bg-muted/20 border-border max-w-xs font-mono font-bold">
                <SelectValue placeholder="Choisir la bonne réponse" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                <SelectItem value="A">Option A</SelectItem>
                <SelectItem value="B">Option B</SelectItem>
                <SelectItem value="C">Option C</SelectItem>
                <SelectItem value="D">Option D</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* 4. Explication & Analyse des Pièges Auditifs */}
        <div className="rounded-2xl border bg-card p-6 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-primary" />
            <span>Explication Didactique &amp; Pièges Auditifs</span>
          </h2>

          <MarkdownField
            id="explanation"
            name="explanation"
            label="Explication de la Bonne Réponse"
            description="Justification claire aidant le candidat à comprendre pourquoi cette option est la seule correcte."
            defaultValue={question?.explanation || ""}
            placeholder="Ex: La locutrice indique expressément à la 15e seconde que..."
            rows={4}
            required
          />

          <MarkdownField
            id="trapAnalysis"
            name="trapAnalysis"
            label="Analyse des Pièges Auditifs (Distracteurs)"
            description="Explication des leurres phonétiques, mots-clés trompeurs ou fausses pistes glissés dans l'enregistrement."
            defaultValue={question?.trapAnalysis || ""}
            placeholder="Ex: Piège classique : le mot 'vendredi' est prononcé mais renvoie à une autre réunion..."
            rows={3}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-2">
          <Button asChild variant="outline" size="sm">
            <Link href={`/admin/series-co/${seriesId}/questions`}>Annuler</Link>
          </Button>

          <Button type="submit" size="sm" className="gap-2 font-bold shadow-xs">
            <Save className="h-4 w-4" />
            <span>Enregistrer la Question CO</span>
          </Button>
        </div>
      </form>
    </div>
  );
}
