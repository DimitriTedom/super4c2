"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  PenTool,
  Save,
  Monitor,
  Settings2,
  Sparkles,
  Type,
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
import { upsertWrittenTaskAction } from "@/app/admin/series-ee/[id]/tasks/actions";

interface WrittenTaskData {
  id?: string;
  seriesId: string;
  taskNumber: number;
  title: string;
  minWords: number;
  maxWords: number;
  suggestedDurationMinutes: number;
  topic: string;
  context: string | null;
  criteriaNote: string | null;
  sampleModelC2: string | null;
}

interface WrittenTaskFormProps {
  seriesId: string;
  seriesNumber: number;
  task?: WrittenTaskData;
  defaultTaskNumber?: number;
}

const TASK_PRESETS: Record<
  number,
  {
    title: string;
    minWords: number;
    maxWords: number;
    duration: number;
    level: string;
  }
> = {
  1: {
    title: "Tâche 1 : Rédaction d'un message descriptif ou informatif",
    minWords: 60,
    maxWords: 120,
    duration: 15,
    level: "A1–B1",
  },
  2: {
    title: "Tâche 2 : Rédaction d'un article ou courrier d'expérience",
    minWords: 120,
    maxWords: 150,
    duration: 20,
    level: "B1–B2",
  },
  3: {
    title: "Tâche 3 : Rédaction d'un texte d'opinion comparatif",
    minWords: 120,
    maxWords: 180,
    duration: 25,
    level: "B2–C2",
  },
};

export function WrittenTaskForm({
  seriesId,
  seriesNumber,
  task,
  defaultTaskNumber = 1,
}: WrittenTaskFormProps) {
  const initialTaskNum = task?.taskNumber ?? defaultTaskNumber;
  const [taskNumber, setTaskNumber] = useState<string>(String(initialTaskNum));
  const [activeTab, setActiveTab] = useState<"form" | "cbt-preview">("form");

  // Title and word limits state
  const preset = TASK_PRESETS[Number(taskNumber)] || TASK_PRESETS[1];
  const [title, setTitle] = useState(task?.title || preset.title);
  const [minWords, setMinWords] = useState(task?.minWords ?? preset.minWords);
  const [maxWords, setMaxWords] = useState(task?.maxWords ?? preset.maxWords);
  const [duration, setDuration] = useState(
    task?.suggestedDurationMinutes ?? preset.duration
  );

  // Preview interactive typing simulation
  const [simulatedText, setSimulatedText] = useState("");
  const simulatedWordCount = simulatedText.trim()
    ? simulatedText.trim().split(/\s+/).length
    : 0;

  const handleTaskNumberChange = (val: string) => {
    setTaskNumber(val);
    const newPreset = TASK_PRESETS[Number(val)];
    if (newPreset && !task) {
      setTitle(newPreset.title);
      setMinWords(newPreset.minWords);
      setMaxWords(newPreset.maxWords);
      setDuration(newPreset.duration);
    }
  };

  const topicTemplates = [
    {
      label: "Modèle Tâche 1 (Invitation)",
      snippet:
        "Vous venez d'emménager dans une nouvelle ville au Canada. Vous écrivez un courriel à un ami pour lui décrire votre nouveau quartier et l'inviter à passer le week-end chez vous.\n\nDans votre message :\n- Décrivez votre logement et l'ambiance du quartier ;\n- Proposez deux activités à faire ensemble ;\n- Précisez les dates et demandez-lui sa réponse.",
    },
    {
      label: "Modèle Tâche 2 (Récit d'expérience)",
      snippet:
        "Vous avez récemment participé à un projet de bénévolat communautaire ou à une initiative écologique dans votre région. Vous écrivez un article pour le journal de votre association afin de partager cette expérience.\n\nDans votre texte :\n- Présentez les circonstances de cette action et vos motivations ;\n- Racontez le déroulement d'une journée marquante ;\n- Expliquez les bénéfices personnels et collectifs de cette initiative.",
    },
    {
      label: "Modèle Tâche 3 (Débat 2 opinions)",
      snippet:
        "Dans un forum en ligne consacré à l'avenir du travail, vous lisez les deux opinions suivantes :\n\n- **Document 1 :** *« Le travail en présentiel reste indispensable pour préserver la cohésion d'équipe et la créativité spontanée. »*\n- **Document 2 :** *« Le travail 100 % à distance offre une liberté sans égale et un équilibre de vie bien supérieur. »*\n\nRédigez un texte argumenté dans lequel vous comparez ces deux visions puis vous prenez position en illustrant votre avis par des arguments précis et des exemples concrets.",
    },
  ];

  const criteriaTemplates = [
    {
      label: "Grille Officielle FEI",
      snippet:
        "### Critères d'Évaluation Officiels FEI\n\n1. **Respect de la consigne et adéquation à la situation (sur 3 pts) :**\n   - Traitement exhaustif des points de la consigne.\n   - Respect strict de la fourchette de mots requise.\n2. **Cohérence et organisation textuelle (sur 3 pts) :**\n   - Structure logique, paragraphes clairs, connecteurs variés.\n3. **Compétence lexicale (sur 3 pts) :**\n   - Variété et précision du vocabulaire, pertinence du registre.\n4. **Correction morphosyntaxique (sur 3 pts) :**\n   - Maîtrise des temps verbaux, de l'accord et de la ponctuation.",
    },
  ];

  const c2ModelTemplates = [
    {
      label: "Exemple Magic Rewrite C2",
      snippet:
        "Chère Sarah,\n\nC'est avec un enthousiasme non dissimulé que je t'écris depuis mon nouvel appartement montréalais. Niché au cœur d'un quartier vibrant où se côtoient cafés artisanaux et parcs ombragés, ce lieu conjugue à merveille quiétude et vitalité citadine.\n\nPourquoi ne viendrais-tu pas découvrir cet écrin le week-end prochain ? Nous pourrions explorer le marché Jean-Talon samedi matin, puis gravir le mont Royal au crépuscule pour admirer le panorama. Fais-moi signe rapidement pour que je prépare ta chambre d'ami.\n\nAmicalement,\nAlexandre",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between">
        <Button asChild variant="ghost" size="sm" className="gap-1.5 text-xs text-muted-foreground">
          <Link href={`/admin/series-ee/${seriesId}/tasks`}>
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
            <span>Éditeur Avancé</span>
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
            <span>Aperçu Simulateur CBT</span>
          </button>
        </div>
      </div>

      {/* Header */}
      <div className="border-b pb-4">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-primary/10 text-primary border border-primary/20 mb-1.5">
          <PenTool className="h-3 w-3" />
          Série {seriesNumber} · Tâche {taskNumber} / 3 FEI
        </div>
        <h1 className="font-display text-2xl sm:text-3xl font-black tracking-tight text-foreground">
          {task ? `Modifier la Tâche ${task.taskNumber}` : `Configurer la Tâche ${taskNumber}`}
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
          Consigne officielle, fourchette de mots, grille de notation et modèle de référence niveau C2.
        </p>
      </div>

      {/* CBT LIVE PREVIEW TAB */}
      {activeTab === "cbt-preview" && (
        <div className="rounded-2xl border bg-card p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Simulateur CBT d&apos;Expression Écrite (Conditions Officielles FEI)
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs font-mono">
              <span className="bg-primary/10 text-primary font-bold px-2.5 py-1 rounded-lg border border-primary/20">
                Fourchette : {minWords} – {maxWords} mots
              </span>
              <span className="bg-muted text-muted-foreground px-2.5 py-1 rounded-lg border">
                Temps conseillé : {duration} min
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {/* Left side: Official Subject / Topic */}
            <div className="p-4 rounded-xl border bg-muted/20 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase text-primary tracking-wide">
                  SUJET OFFICIEL · TÂCHE {taskNumber}
                </span>
                <span className="text-[10px] text-muted-foreground font-semibold">
                  {preset.level}
                </span>
              </div>

              <h2 className="text-sm font-bold text-foreground">{title}</h2>

              {task?.context && (
                <div className="p-3 rounded-lg bg-card/80 border text-xs text-foreground/80 italic">
                  <strong>Contexte :</strong> {task.context}
                </div>
              )}

              <div className="text-xs text-foreground/90 whitespace-pre-wrap leading-relaxed">
                {task?.topic || "Rédigez la consigne dans l'onglet Éditeur pour visualiser le sujet ici."}
              </div>
            </div>

            {/* Right side: Candidate Composition Zone */}
            <div className="p-4 rounded-xl border bg-card space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <Type className="h-3.5 w-3.5 text-primary" />
                  <span>Zone de rédaction candidat</span>
                </span>

                {/* Word Counter Indicator */}
                <span
                  className={`text-xs font-mono font-bold px-2 py-0.5 rounded-md border ${
                    simulatedWordCount < minWords
                      ? "bg-amber-500/10 text-amber-600 border-amber-500/30"
                      : simulatedWordCount > maxWords
                      ? "bg-destructive/10 text-destructive border-destructive/30"
                      : "bg-emerald-500/10 text-emerald-600 border-emerald-500/30"
                  }`}
                >
                  {simulatedWordCount} / {minWords}–{maxWords} mots
                </span>
              </div>

              <textarea
                value={simulatedText}
                onChange={(e) => setSimulatedText(e.target.value)}
                placeholder="Zone d'écriture en direct... Testez la saisie pour vérifier le calcul de mots."
                rows={10}
                className="w-full text-xs rounded-xl bg-muted/20 border-border p-3 focus:ring-primary leading-relaxed resize-none font-sans"
              />

              {task?.sampleModelC2 && (
                <details className="text-xs border rounded-lg p-2.5 bg-muted/10 cursor-pointer">
                  <summary className="font-bold text-primary flex items-center gap-1.5">
                    <Sparkles className="h-3 w-3" />
                    <span>Consulter le Modèle Magic Rewrite C2</span>
                  </summary>
                  <p className="mt-2 text-foreground/80 whitespace-pre-wrap leading-relaxed border-t pt-2 text-[11px]">
                    {task.sampleModelC2}
                  </p>
                </details>
              )}
            </div>
          </div>
        </div>
      )}

      {/* FORM CONTAINER */}
      <form
        action={upsertWrittenTaskAction}
        className={`space-y-6 ${activeTab === "cbt-preview" ? "hidden" : "block"}`}
      >
        <input type="hidden" name="seriesId" value={seriesId} />
        {task?.id && <input type="hidden" name="id" value={task.id} />}
        <input type="hidden" name="taskNumber" value={taskNumber} />

        {/* 1. Meta / Classification */}
        <div className="rounded-2xl border bg-card p-6 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-primary" />
            <span>Paramètres de la Tâche FEI</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
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
                  <SelectItem value="1">Tâche 1 (60–120 mots)</SelectItem>
                  <SelectItem value="2">Tâche 2 (120–150 mots)</SelectItem>
                  <SelectItem value="3">Tâche 3 (120–180 mots)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground">
                Mots minimum <span className="text-primary">*</span>
              </label>
              <Input
                type="number"
                name="minWords"
                value={minWords}
                onChange={(e) => setMinWords(Number(e.target.value))}
                min={10}
                required
                className="h-10 text-xs rounded-xl bg-muted/20 font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground">
                Mots maximum <span className="text-primary">*</span>
              </label>
              <Input
                type="number"
                name="maxWords"
                value={maxWords}
                onChange={(e) => setMaxWords(Number(e.target.value))}
                min={minWords}
                required
                className="h-10 text-xs rounded-xl bg-muted/20 font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground">
                Temps conseillé (min)
              </label>
              <Input
                type="number"
                name="suggestedDurationMinutes"
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                min={5}
                max={60}
                className="h-10 text-xs rounded-xl bg-muted/20 font-mono"
              />
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
              placeholder="Ex: Tâche 1 : Rédaction d'un message d'invitation"
              className="h-10 text-xs rounded-xl bg-muted/20 font-semibold"
            />
          </div>
        </div>

        {/* 2. Sujet & Contexte avec MarkdownField */}
        <div className="rounded-2xl border bg-card p-6 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-primary" />
            <span>Consigne Officielle &amp; Situation de Communication</span>
          </h2>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground">
              Contexte ou Situation (Optionnel)
            </label>
            <Input
              type="text"
              name="context"
              defaultValue={task?.context || ""}
              placeholder="Ex: Vous écrivez un message privé à un ami canadien..."
              className="h-10 text-xs rounded-xl bg-muted/20"
            />
          </div>

          <MarkdownField
            id="topic"
            name="topic"
            label="Sujet & Consignes de Rédaction"
            description="Détaillez les puces obligatoires que le candidat doit impérativement traiter."
            defaultValue={task?.topic || ""}
            placeholder="Écrivez le sujet officiel ici..."
            rows={6}
            required
            templates={topicTemplates}
          />
        </div>

        {/* 3. Critères d'Évaluation & Modèle C2 avec MarkdownField */}
        <div className="rounded-2xl border bg-card p-6 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-primary" />
            <span>Critères FEI &amp; Modèle Magic Rewrite C2</span>
          </h2>

          <MarkdownField
            id="criteriaNote"
            name="criteriaNote"
            label="Grille d'Évaluation FEI & Critères de Notation"
            description="Barème appliqué lors de la correction et transmis aux évaluateurs."
            defaultValue={task?.criteriaNote || ""}
            placeholder="Critères FEI..."
            rows={4}
            templates={criteriaTemplates}
          />

          <MarkdownField
            id="sampleModelC2"
            name="sampleModelC2"
            label="Modèle Corrigé de Référence (Niveau C2 / NCLC 10+)"
            description="Texte d'excellence servant d'étalon à l'IA d'évaluation et de modèle d'apprentissage aux candidats."
            defaultValue={task?.sampleModelC2 || ""}
            placeholder="Texte de référence niveau C2..."
            rows={5}
            templates={c2ModelTemplates}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-2">
          <Button asChild variant="outline" size="sm">
            <Link href={`/admin/series-ee/${seriesId}/tasks`}>Annuler</Link>
          </Button>

          <Button type="submit" size="sm" className="gap-2 font-bold shadow-xs">
            <Save className="h-4 w-4" />
            <span>Enregistrer la Tâche EE</span>
          </Button>
        </div>
      </form>
    </div>
  );
}
