"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Mic,
  Save,
  Monitor,
  Settings2,
  Volume2,
  User,
  Bot,
  Sparkles,
  Clock,
  Radio,
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
import { upsertOralTaskAction } from "@/app/admin/series-eo/[id]/tasks/actions";

interface OralScenarioData {
  situation?: string;
  candidateRole?: string;
  examinerRole?: string;
  instructions?: string;
}

interface OralTaskData {
  id?: string;
  seriesId: string;
  taskNumber: number;
  type: string;
  title: string;
  durationSeconds: number;
  examinerPrompt: string;
  roleplayScenario?: OralScenarioData | null;
}

interface OralTaskFormProps {
  seriesId: string;
  seriesNumber: number;
  task?: OralTaskData;
  defaultTaskNumber?: number;
}

const TASK_PRESETS: Record<
  number,
  {
    type: string;
    title: string;
    durationSeconds: number;
    level: string;
    description: string;
    situation: string;
    candidateRole: string;
    examinerRole: string;
    instructions: string;
    examinerPrompt: string;
  }
> = {
  1: {
    type: "task1_presentation",
    title: "Tâche 1 : Entretien dirigé sans préparation",
    durationSeconds: 120,
    level: "A1–B1",
    description: "Échange spontané pour présenter son parcours, son quotidien, ses goûts et son projet d'immigration.",
    situation: "Accueil officiel et prise de contact dans le cadre du test de français.",
    candidateRole: "Le candidat se présente spontanément et répond aux questions de l'examinateur.",
    examinerRole: "Examinateur officiel bienveillant accueillant le candidat pour briser la glace.",
    instructions: "Parlez de vous, de votre famille, de vos études ou de votre travail, et de vos projets au Canada.",
    examinerPrompt: `Tu es un examinateur officiel certifié France Éducation International pour l'épreuve d'Expression Orale du TCF Canada (Tâche 1 : Entretien dirigé sans préparation, 2 minutes).

Directives de conduite :
1. Accueil chaleureux et mise en confiance : Salue le candidat cordialement en français standard neutre.
2. Pose 3 à 4 questions progressives et adaptées :
   - Présentation générale (parcours, métier ou études)
   - Centres d'intérêt ou loisirs
   - Motivations pour le projet de vie ou d'installation au Canada
3. Relance avec bienveillance si le candidat hésite ou s'arrête prématurément, sans lui couper la parole.
4. N'utilise aucun jargon complexe ; reste naturel et professionnel.`,
  },
  2: {
    type: "task2_roleplay",
    title: "Tâche 2 : Exercice en interaction (Jeu de rôle)",
    durationSeconds: 210,
    level: "B1–B2",
    description: "Jeu de rôle interactif : le candidat pose des questions pour obtenir des informations précises sur une situation concrète.",
    situation: "Vous vous renseignez auprès d'un organisme communautaire ou d'un service public à Montréal au sujet d'activités bénévoles.",
    candidateRole: "Nouvel arrivant souhaitant s'impliquer dans la vie locale et obtenir des détails pratiques.",
    examinerRole: "Responsable de l'accueil de l'association, accueillant mais précis, répondant aux questions du candidat.",
    instructions: "Posez au moins 8 à 10 questions précises et variées pour obtenir toutes les informations nécessaires (horaires, conditions, tarifs, formalités).",
    examinerPrompt: `Tu incarnes l'interlocuteur dans le jeu de rôle de la Tâche 2 du TCF Canada (Exercice en interaction, 3 minutes 30).

Rôle incarné : Responsable d'accueil d'un centre communautaire montréalais.
Comportement attendu :
1. Laisse le candidat mener l'échange : c'est lui qui doit poser les questions.
2. Réponds de façon concise, naturelle et réaliste à chacune de ses interrogations.
3. Si le candidat hésite, stimule-le en disant par exemple : « Avez-vous d'autres questions concernant nos plannings ou les prérequis ? ».
4. Introduis une petite nuance ou condition réaliste (ex: « Nous demandons une disponibilité d'au moins 2 samedis par mois ») pour évaluer sa réactivité en français.`,
  },
  3: {
    type: "task3_opinion",
    title: "Tâche 3 : Expression d'un point de vue sans préparation",
    durationSeconds: 270,
    level: "B2–C2",
    description: "Monologue argumenté suivi d'une courte relance : exprimer son avis personnel sur un sujet de société.",
    situation: "Débat de société : Le télétravail généralisé nuit-il aux relations humaines et au tissu social ?",
    candidateRole: "Le candidat expose son opinion personnelle structurée avec des arguments et des exemples concrets.",
    examinerRole: "Examinateur attentif qui écoute l'exposé puis pose une question d'approfondissement nuancée.",
    instructions: "Donnez votre point de vue de manière claire, organisée et nuancée. Illustrez vos propos par des exemples personnels ou d'actualité.",
    examinerPrompt: `Tu es l'examinateur de la Tâche 3 du TCF Canada (Expression d'un point de vue, 4 minutes 30, niveau B2 à C2).

Directives d'évaluation :
1. Écoute active et silencieuse pendant les 2 à 3 premières minutes pendant que le candidat développe sa thèse.
2. Vers 3 minutes, interviens avec tact pour poser UNE question de relance contradictoire ou d'approfondissement (ex: « Pensez-vous néanmoins que certains secteurs ne pourront jamais adopter ce modèle ? »).
3. Observe la richesse lexicale, la variété des connecteurs logiques, la précision grammaticale et la capacité à nuancer sa pensée.
4. Maintiens une posture d'écoute bienveillante et intellectuellement stimulante.`,
  },
};

export function OralTaskForm({
  seriesId,
  seriesNumber,
  task,
  defaultTaskNumber = 1,
}: OralTaskFormProps) {
  const initialTaskNum = task?.taskNumber ?? defaultTaskNumber;
  const [taskNumber, setTaskNumber] = useState<string>(String(initialTaskNum));
  const [activeTab, setActiveTab] = useState<"form" | "cbt-preview">("form");

  const preset = TASK_PRESETS[Number(taskNumber)] || TASK_PRESETS[1];
  const [taskType, setTaskType] = useState(task?.type || preset.type);
  const [title, setTitle] = useState(task?.title || preset.title);
  const [durationSeconds, setDurationSeconds] = useState(
    task?.durationSeconds ?? preset.durationSeconds
  );

  // Scenario state
  const initialScenario = (task?.roleplayScenario as OralScenarioData) || {};
  const [situation, setSituation] = useState(initialScenario.situation || preset.situation);
  const [candidateRole, setCandidateRole] = useState(
    initialScenario.candidateRole || preset.candidateRole
  );
  const [examinerRole, setExaminerRole] = useState(
    initialScenario.examinerRole || preset.examinerRole
  );
  const [instructions, setInstructions] = useState(
    initialScenario.instructions || preset.instructions
  );

  const handleTaskNumberChange = (val: string) => {
    setTaskNumber(val);
    const newPreset = TASK_PRESETS[Number(val)];
    if (newPreset && !task) {
      setTaskType(newPreset.type);
      setTitle(newPreset.title);
      setDurationSeconds(newPreset.durationSeconds);
      setSituation(newPreset.situation);
      setCandidateRole(newPreset.candidateRole);
      setExaminerRole(newPreset.examinerRole);
      setInstructions(newPreset.instructions);
    }
  };

  const examinerPromptTemplates = [
    {
      label: "Directives Standard TCF Canada",
      snippet: preset.examinerPrompt,
    },
    {
      label: "Relance Examen B2/C1",
      snippet:
        "Tu es un examinateur expert TCF Canada. Évalue la fluidité et l'aisance du candidat. Si le candidat s'arrête avant la fin du chronomètre, pose une question ouverte pour l'amener à préciser ses idées et utiliser des structures au subjonctif ou au conditionnel.",
    },
  ];

  const formatDurationMinutes = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins} min ${secs > 0 ? `${secs} s` : ""}`.trim();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between">
        <Button asChild variant="ghost" size="sm" className="gap-1.5 text-xs text-muted-foreground">
          <Link href={`/admin/series-eo/${seriesId}/tasks`}>
            <ArrowLeft className="h-4 w-4" />
            <span>Retour aux 3 tâches de la Série {seriesNumber}</span>
          </Link>
        </Button>

        {/* Tab switch between editor and live CBT visual simulator */}
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
            <span>Éditeur de Tâche</span>
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
            <span>Aperçu Simulateur Vocal IA</span>
          </button>
        </div>
      </div>

      {/* Header */}
      <div className="border-b pb-4">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-primary/10 text-primary border border-primary/20 mb-1.5">
          <Mic className="h-3 w-3" />
          Série {seriesNumber} · Tâche {taskNumber} / 3 FEI
        </div>
        <h1 className="font-display text-2xl sm:text-3xl font-black tracking-tight text-foreground">
          {task ? `Modifier la Tâche ${task.taskNumber}` : `Configurer la Tâche ${taskNumber}`}
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
          Directives pour l&apos;examinateur IA, scénario d&apos;interaction et chronométrage officiel.
        </p>
      </div>

      {/* CBT LIVE PREVIEW TAB */}
      {activeTab === "cbt-preview" && (
        <div className="rounded-2xl border bg-card p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b pb-3">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Simulateur Vocal CBT d&apos;Expression Orale (Normes Officielles FEI)
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs font-mono">
              <span className="bg-primary/10 text-primary font-bold px-2.5 py-1 rounded-lg border border-primary/20 flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                Chronomètre : {formatDurationMinutes(durationSeconds)} ({durationSeconds}s)
              </span>
              <span className="bg-muted text-muted-foreground px-2.5 py-1 rounded-lg border">
                Niveau ciblé : {preset.level}
              </span>
            </div>
          </div>

          {/* Simulated CBT Candidate Screen */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            {/* Left Col: Subject & Scenario */}
            <div className="md:col-span-2 space-y-4">
              <div className="p-5 rounded-2xl border bg-muted/20 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase text-primary tracking-wide flex items-center gap-1.5">
                    <Radio className="h-3.5 w-3.5 animate-pulse text-primary" />
                    CONSIGNE OFFICIELLE CANDIDAT · TÂCHE {taskNumber}
                  </span>
                  <span className="text-xs font-mono font-bold text-muted-foreground">
                    {taskType === "task1_presentation" && "Entretien Dirigé"}
                    {taskType === "task2_roleplay" && "Jeu de Rôle"}
                    {taskType === "task3_opinion" && "Point de Vue"}
                  </span>
                </div>

                <h2 className="text-base font-bold text-foreground">{title}</h2>

                <div className="p-3.5 rounded-xl bg-card border space-y-2 text-xs">
                  <p className="font-bold text-foreground">Situation &amp; Contexte :</p>
                  <p className="text-muted-foreground leading-relaxed">{situation}</p>
                </div>

                {instructions && (
                  <div className="p-3.5 rounded-xl bg-primary/5 border border-primary/20 space-y-1 text-xs">
                    <p className="font-bold text-primary">Consignes pour le candidat :</p>
                    <p className="text-foreground/90 leading-relaxed">{instructions}</p>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                  <div className="p-3 rounded-lg border bg-card/60">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase">Rôle Candidat</span>
                    <p className="font-semibold text-foreground mt-0.5">{candidateRole}</p>
                  </div>
                  <div className="p-3 rounded-lg border bg-card/60">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase">Rôle Examinateur IA</span>
                    <p className="font-semibold text-foreground mt-0.5">{examinerRole}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Col: AI Examiner & Voice Status Simulation */}
            <div className="space-y-4">
              <div className="p-5 rounded-2xl border bg-card text-center space-y-4">
                <div className="relative mx-auto w-20 h-20 rounded-full bg-primary/10 border-2 border-primary/30 flex items-center justify-center">
                  <Bot className="h-10 w-10 text-primary" />
                  <span className="absolute bottom-0 right-0 h-4 w-4 rounded-full bg-emerald-500 border-2 border-card" />
                </div>

                <div>
                  <h3 className="font-bold text-sm text-foreground">Examinateur IA FEI</h3>
                  <p className="text-[11px] text-muted-foreground mt-0.5">Synthèse Vocale &amp; Reconnaissance Active</p>
                </div>

                <div className="p-3 rounded-xl bg-muted/30 border space-y-1.5 text-left">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                    <Volume2 className="h-3.5 w-3.5 text-primary" />
                    <span>Microphone Candidat</span>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 w-3/4 animate-pulse rounded-full" />
                  </div>
                  <p className="text-[10px] text-muted-foreground">Volume optimal — Prêt pour l&apos;enregistrement</p>
                </div>

                <div className="pt-2 border-t text-[11px] text-muted-foreground italic text-left">
                  <Sparkles className="h-3 w-3 text-primary inline mr-1" />
                  Directives injectées dans le modèle vocal d&apos;évaluation.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FORM CONTAINER */}
      <form
        action={upsertOralTaskAction}
        className={`space-y-6 ${activeTab === "cbt-preview" ? "hidden" : "block"}`}
      >
        <input type="hidden" name="seriesId" value={seriesId} />
        {task?.id && <input type="hidden" name="id" value={task.id} />}
        <input type="hidden" name="taskNumber" value={taskNumber} />

        {/* 1. Meta / Classification */}
        <div className="rounded-2xl border bg-card p-6 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-primary" />
            <span>Paramètres de la Tâche Orale FEI</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Task Number with Shadcn Select */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground">
                Numéro de Tâche <span className="text-primary">*</span>
              </label>
              <Select value={taskNumber} onValueChange={handleTaskNumberChange}>
                <SelectTrigger className="h-10 text-xs rounded-xl bg-muted/20 border-border">
                  <SelectValue placeholder="Choisir la tâche" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  <SelectItem value="1">Tâche 1 : Entretien dirigé (120 s)</SelectItem>
                  <SelectItem value="2">Tâche 2 : Jeu de rôle (210 s)</SelectItem>
                  <SelectItem value="3">Tâche 3 : Point de vue (270 s)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Task Type */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground">
                Type d&apos;Exercice <span className="text-primary">*</span>
              </label>
              <Select name="type" value={taskType} onValueChange={setTaskType}>
                <SelectTrigger className="h-10 text-xs rounded-xl bg-muted/20 border-border">
                  <SelectValue placeholder="Type d'exercice" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  <SelectItem value="task1_presentation">Tâche 1 : Entretien dirigé sans préparation</SelectItem>
                  <SelectItem value="task2_roleplay">Tâche 2 : Jeu de rôle en interaction</SelectItem>
                  <SelectItem value="task3_opinion">Tâche 3 : Expression d&apos;un point de vue</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Duration Seconds */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground">
                Durée (en secondes) <span className="text-primary">*</span>
              </label>
              <Input
                type="number"
                name="durationSeconds"
                value={durationSeconds}
                onChange={(e) => setDurationSeconds(Number(e.target.value))}
                min={30}
                max={600}
                step={10}
                required
                className="h-10 text-xs rounded-xl bg-muted/20 font-mono"
              />
              <p className="text-[11px] text-muted-foreground">
                {formatDurationMinutes(durationSeconds)} officielles.
              </p>
            </div>
          </div>

          <div className="space-y-1.5 pt-2">
            <label className="text-xs font-bold text-foreground">
              Intitulé Officiel de la Tâche <span className="text-primary">*</span>
            </label>
            <Input
              type="text"
              name="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="Ex: Tâche 2 : Exercice en interaction (Jeu de rôle)"
              className="h-10 text-xs rounded-xl bg-muted/20 font-semibold"
            />
          </div>
        </div>

        {/* 2. Scénario de Jeu de Rôle & Contexte */}
        <div className="rounded-2xl border bg-card p-6 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-primary" />
            <span>Scénario &amp; Situation d&apos;Échange</span>
          </h2>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground">
              Situation d&apos;Interaction
            </label>
            <Input
              type="text"
              name="scenario_situation"
              value={situation}
              onChange={(e) => setSituation(e.target.value)}
              placeholder="Ex: Vous souhaitez vous inscrire à un club sportif à Montréal..."
              className="h-10 text-xs rounded-xl bg-muted/20"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                <User className="h-3.5 w-3.5 text-primary" />
                <span>Rôle du Candidat</span>
              </label>
              <Input
                type="text"
                name="scenario_candidateRole"
                value={candidateRole}
                onChange={(e) => setCandidateRole(e.target.value)}
                placeholder="Ex: Nouvel arrivant se renseignant sur les activités"
                className="h-10 text-xs rounded-xl bg-muted/20"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                <Bot className="h-3.5 w-3.5 text-primary" />
                <span>Rôle de l&apos;Examinateur IA</span>
              </label>
              <Input
                type="text"
                name="scenario_examinerRole"
                value={examinerRole}
                onChange={(e) => setExaminerRole(e.target.value)}
                placeholder="Ex: Responsable d'accueil au guichet du club"
                className="h-10 text-xs rounded-xl bg-muted/20"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground">
              Consignes Officielles pour le Candidat
            </label>
            <Input
              type="text"
              name="scenario_instructions"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="Ex: Posez une dizaine de questions pour obtenir des informations complètes..."
              className="h-10 text-xs rounded-xl bg-muted/20"
            />
          </div>
        </div>

        {/* 3. Directives d'Incarnation pour l'Examinateur IA */}
        <div className="rounded-2xl border bg-card p-6 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-primary" />
            <span>Directives IA (System Prompt de l&apos;Examinateur Vocal)</span>
          </h2>

          <MarkdownField
            id="examinerPrompt"
            name="examinerPrompt"
            label="Prompt & Directives de Conduite de l'Examinateur IA"
            description="Instructions directes dictant la voix, l'accueil, les relances et la rigueur d'évaluation de l'IA pendant la tâche orale."
            defaultValue={task?.examinerPrompt || preset.examinerPrompt}
            placeholder="Directives IA..."
            rows={8}
            required
            templates={examinerPromptTemplates}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-2">
          <Button asChild variant="outline" size="sm">
            <Link href={`/admin/series-eo/${seriesId}/tasks`}>Annuler</Link>
          </Button>

          <Button type="submit" size="sm" className="gap-2 font-bold shadow-xs">
            <Save className="h-4 w-4" />
            <span>Enregistrer la Tâche EO</span>
          </Button>
        </div>
      </form>
    </div>
  );
}
