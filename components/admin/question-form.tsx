"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  Save,
  CheckCircle2,
  Monitor,
  Settings2,
  Sparkles,
  Loader2,
  Image as ImageIcon,
  Trash2,
  ExternalLink,
} from "lucide-react";
import Image from "next/image";
import { toast } from "react-toastify";
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
import { upsertQuestionAction } from "@/app/admin/series-ce/[id]/questions/actions";

interface QuestionData {
  id?: string;
  seriesId: string;
  questionNumber: number;
  cefrLevel: string | null;
  nclcTargetLevel: number | null;
  documentTitle: string | null;
  documentText: string | null;
  documentImageUrl?: string | null;
  prompt: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctOption: string;
  explanation: string;
  trapAnalysis: string | null;
}

interface QuestionFormProps {
  seriesId: string;
  seriesNumber: number;
  question?: QuestionData;
  defaultNumber?: number;
}

export function QuestionForm({
  seriesId,
  seriesNumber,
  question,
  defaultNumber = 1,
}: QuestionFormProps) {
  const [correct, setCorrect] = useState<string>(question?.correctOption || "B");
  const [cefrLevel, setCefrLevel] = useState<string>(question?.cefrLevel || "B2");
  const [nclcTargetLevel, setNclcTargetLevel] = useState<string>(
    String(question?.nclcTargetLevel || 7)
  );
  const [activeTab, setActiveTab] = useState<"form" | "cbt-preview">("form");

  // Visual Image state (Supabase Storage / local CDN)
  const [imageUrl, setImageUrl] = useState<string>(question?.documentImageUrl || "");
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);

  // Form states for live CBT preview
  const [promptPreview, setPromptPreview] = useState(question?.prompt || "");
  const [docTitlePreview, setDocTitlePreview] = useState(question?.documentTitle || "");
  const [optA, setOptA] = useState(question?.optionA || "");
  const [optB, setOptB] = useState(question?.optionB || "");
  const [optC, setOptC] = useState(question?.optionC || "");
  const [optD, setOptD] = useState(question?.optionD || "");

  async function handleGenerateAiAsset() {
    setIsGeneratingImage(true);
    try {
      const promptToUse = promptPreview || docTitlePreview || "Mise en situation pour épreuve d'examen TCF Canada";
      const qNum = question?.questionNumber ?? defaultNumber;

      const res = await fetch("/api/admin/generate-asset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: promptToUse,
          discipline: "CE",
          questionNumber: qNum,
          seriesNumber,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Échec de génération");
      }

      setImageUrl(data.url);
      const isCloud = data.provider === "supabase";
      toast.success(
        `Illustration 16:9 générée et filigranée ! (${isCloud ? "Stockée sur Supabase Storage" : "Stockée en CDN local"})`
      );
    } catch (err: any) {
      toast.error(err.message || "Erreur lors de la génération de l'illustration");
    } finally {
      setIsGeneratingImage(false);
    }
  }

  const documentTemplates = [
    {
      label: "Affiche Promo / Flyer (A1)",
      snippet:
        "### 🌟 GRANDE OUVERTURE DU CENTRE AQUATIQUE DE MONTRÉAL !\n\nVenez découvrir nos nouveaux bassins et notre espace bien-être.\n\n- **Date d'inauguration :** Samedi 18 novembre dès 10h00\n- **Offre spéciale :** Entrée gratuite pour les moins de 12 ans et -50% sur les abonnements annuels\n- **Adresse :** 450 avenue du Parc, Montréal\n\n*Restauration sur place et animations tout le week-end.*",
    },
    {
      label: "Horaires & Tarifs (A1/A2)",
      snippet:
        "### MUSÉE NATIONAL DES BEAUX-ARTS — INFORMATIONS PRATIQUES\n\n| Période | Horaires d'ouverture | Tarif Adulte | Tarif Réduit |\n| :--- | :--- | :--- | :--- |\n| Mardi au Vendredi | 10h00 – 18h00 | 14,00 $ | 9,00 $ |\n| Samedi & Dimanche | 10h00 – 20h00 | 16,00 $ | 10,00 $ |\n| Lundi | Fermeture hebdomadaire | — | — |\n\n*Audioguide inclus dans le billet d'entrée. Réservation en ligne fortement conseillée.*",
    },
    {
      label: "Avis / Annonce (A2)",
      snippet:
        "### AVIS AUX RÉSIDENTS\n\nEn raison de travaux de maintenance prévus le **mardi 14 octobre**, l'accès aux locaux techniques sera temporairement suspendu entre **08h00 et 17h00**.\n\nNous vous prions de prendre vos dispositions.\n\n*La Direction du Syndic*",
    },
    {
      label: "Courriel interne (B1)",
      snippet:
        "**De :** Direction des Ressources Humaines  \n**À :** L'ensemble du personnel  \n**Objet :** Mise en place du nouveau calendrier de travail hybride  \n\nChères et chers collègues,\n\nConformément aux discussions issues du dernier comité, les collaborateurs pourront choisir **deux jours de télétravail** fixes par semaine dès le 1er du mois prochain.\n\nMerci de valider votre planning auprès de votre responsable hiérarchique.",
    },
    {
      label: "Article d'actualité (B2/C1)",
      snippet:
        "## L'essor des tiers-lieux dans les métropoles canadiennes\n\nLongtemps cantonnés aux périphéries, les espaces de cotravail redéfinissent l'urbanisme commercial à Montréal et Toronto. Selon une enquête récente de l'Institut de la statistique, plus de 42 % des professionnels autonomes privilégient désormais ces structures collaboratives pour rompre avec l'isolement du domicile.",
    },
  ];

  const trapTemplates = [
    {
      label: "Décodage A/B/C/D",
      snippet:
        "- **Option A :** Contresens direct avec la consigne temporelle (mentionne le passé et non l'échéance à venir).\n- **Option C :** Distracteur lexical reprenant un mot exact du texte mais dans un contexte erroné.\n- **Option D :** Généralisation abusive non validée par les données du document.",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Back Link */}
      <div className="flex items-center justify-between">
        <Button asChild variant="ghost" size="sm" className="gap-1.5 text-xs text-muted-foreground">
          <Link href={`/admin/series-ce/${seriesId}/questions`}>
            <ArrowLeft className="h-4 w-4" />
            <span>Retour aux questions de la Série {seriesNumber}</span>
          </Link>
        </Button>

        {/* Tab switch between form and CBT visual simulator preview */}
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
          <BookOpen className="h-3 w-3" />
          Série {seriesNumber} · Compréhension Écrite
        </div>
        <h1 className="font-display text-2xl sm:text-3xl font-black tracking-tight text-foreground">
          {question ? `Modifier la Question ${question.questionNumber}` : `Ajouter la Question ${defaultNumber}`}
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
          Interface enrichie Markdown &amp; contrôles natifs conformes aux standards officiels France Éducation International.
        </p>
      </div>

      {/* CBT LIVE PREVIEW TAB */}
      {activeTab === "cbt-preview" && (
        <div className="rounded-2xl border bg-card p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Rendu Exact en Conditions Réelles d&apos;Examen (France Éducation International)
              </span>
            </div>
            <span className="text-xs font-mono font-bold bg-primary/10 text-primary px-2.5 py-1 rounded-lg border border-primary/20">
              Palier {cefrLevel} · NCLC {nclcTargetLevel}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {/* Left side: Document */}
            <div className="p-4 rounded-xl border bg-muted/20 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase text-primary tracking-wide">
                  {docTitlePreview || "DOCUMENT DE RÉFÉRENCE"}
                </span>
                <span className="text-[10px] text-muted-foreground">Volet de lecture officiel</span>
              </div>

              {imageUrl && (
                <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-inner">
                  <Image
                    src={imageUrl}
                    alt="Support visuel officiel"
                    fill
                    className="object-contain"
                  />
                </div>
              )}

              <div className="text-xs text-foreground/90 whitespace-pre-wrap leading-relaxed">
                {question?.documentText || "Rédigez le texte du document dans l'onglet Éditeur pour visualiser le rendu ici."}
              </div>
            </div>

            {/* Right side: Question & 4 proposals */}
            <div className="p-4 rounded-xl border bg-card space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black font-mono text-primary">
                  QUESTION {question?.questionNumber ?? defaultNumber} / 39
                </span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                  Bonne réponse : Option {correct}
                </span>
              </div>

              <p className="text-xs font-bold text-foreground">
                {promptPreview || "Intitulé de la question..."}
              </p>

              <div className="space-y-2">
                {[
                  { key: "A", val: optA },
                  { key: "B", val: optB },
                  { key: "C", val: optC },
                  { key: "D", val: optD },
                ].map((item) => (
                  <div
                    key={item.key}
                    className={`flex items-center gap-2.5 p-2.5 rounded-lg border text-xs transition-all ${
                      correct === item.key
                        ? "border-emerald-500 bg-emerald-500/10 font-bold text-emerald-800 dark:text-emerald-200"
                        : "bg-muted/10 border-border text-foreground"
                    }`}
                  >
                    <span
                      className={`h-6 w-6 rounded-md flex items-center justify-center font-mono font-bold text-[11px] ${
                        correct === item.key
                          ? "bg-emerald-600 text-white"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {item.key}
                    </span>
                    <span className="flex-1">{item.val || `Option ${item.key}...`}</span>
                    {correct === item.key && (
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FORM CONTAINER */}
      <form
        action={upsertQuestionAction}
        className={`space-y-6 ${activeTab === "cbt-preview" ? "hidden" : "block"}`}
      >
        <input type="hidden" name="seriesId" value={seriesId} />
        {question?.id && <input type="hidden" name="id" value={question.id} />}
        <input type="hidden" name="cefrLevel" value={cefrLevel} />
        <input type="hidden" name="nclcTargetLevel" value={nclcTargetLevel} />

        {/* 1. Meta / Classification using Shadcn Select */}
        <div className="rounded-2xl border bg-card p-6 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-primary" />
            <span>Classification &amp; Position dans la Série</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground">
                Numéro (1 à 39) <span className="text-primary">*</span>
              </label>
              <Input
                type="number"
                name="questionNumber"
                defaultValue={question?.questionNumber ?? defaultNumber}
                min={1}
                max={39}
                required
                className="h-10 text-xs rounded-xl bg-muted/20"
              />
            </div>

            {/* Premium Shadcn Select for CEFR */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground">
                Palier CECRL <span className="text-primary">*</span>
              </label>
              <Select value={cefrLevel} onValueChange={setCefrLevel}>
                <SelectTrigger className="h-10 text-xs rounded-xl bg-muted/20 border-border">
                  <SelectValue placeholder="Sélectionnez un palier" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  <SelectItem value="A1">A1 — Découverte (Q1-Q6)</SelectItem>
                  <SelectItem value="A2">A2 — Élémentaire (Q7-Q12)</SelectItem>
                  <SelectItem value="B1">B1 — Intermédiaire (Q13-Q18)</SelectItem>
                  <SelectItem value="B2">B2 — Avancé / Seuil NCLC 7 (Q19-Q28)</SelectItem>
                  <SelectItem value="C1">C1 — Autonome (Q29-Q35)</SelectItem>
                  <SelectItem value="C2">C2 — Maîtrise (Q36-Q39)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Premium Shadcn Select for NCLC */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground">
                Équivalence NCLC <span className="text-primary">*</span>
              </label>
              <Select value={nclcTargetLevel} onValueChange={setNclcTargetLevel}>
                <SelectTrigger className="h-10 text-xs rounded-xl bg-muted/20 border-border">
                  <SelectValue placeholder="Sélectionnez un niveau NCLC" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  <SelectItem value="3">NCLC 3 (A1)</SelectItem>
                  <SelectItem value="4">NCLC 4 (A2)</SelectItem>
                  <SelectItem value="5">NCLC 5 (B1 débutant)</SelectItem>
                  <SelectItem value="6">NCLC 6 (B1 avancé)</SelectItem>
                  <SelectItem value="7">NCLC 7 (B2 — Seuil Entrée Express +50 pts)</SelectItem>
                  <SelectItem value="8">NCLC 8 (B2 supérieur)</SelectItem>
                  <SelectItem value="9">NCLC 9 (C1)</SelectItem>
                  <SelectItem value="10">NCLC 10+ (C2)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* 2. Document Source with MarkdownField Interface */}
        <div className="rounded-2xl border bg-card p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <div>
              <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-primary" />
                <span>Document Source (Volet Gauche CBT)</span>
              </h2>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Utilisez les boutons de mise en forme ou les modèles prêts à l&apos;emploi pour structurer l&apos;annonce officielle.
              </p>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground">
              Titre ou Nature du Document (Optionnel)
            </label>
            <Input
              type="text"
              name="documentTitle"
              defaultValue={question?.documentTitle || ""}
              onChange={(e) => setDocTitlePreview(e.target.value)}
              placeholder="Ex: AVIS AUX LOCATAIRES, Courriel d'entreprise, Article de presse..."
              className="h-10 text-xs rounded-xl bg-muted/20"
            />
          </div>

          {/* Markdown editor for document text */}
          <MarkdownField
            id="documentText"
            name="documentText"
            label="Texte Intégral du Document"
            description="Prend en charge le gras, les listes, les tableaux et les citations pour reproduire fidèlement l'épreuve."
            defaultValue={question?.documentText || ""}
            placeholder="Rédigez ou collez ici le texte du document officiel..."
            rows={6}
            templates={documentTemplates}
          />
        </div>

        {/* Support Visuel & Illustration 16:9 (Optionnel · Supabase Storage & IA) */}
        <div className="rounded-2xl border bg-card p-6 shadow-xs space-y-4">
          <input type="hidden" name="documentImageUrl" value={imageUrl} />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-3">
            <div>
              <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
                <ImageIcon className="h-4 w-4 text-primary" />
                <span>Support Visuel &amp; Illustration 16:9 (Optionnel)</span>
              </h2>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Idéal pour les affiches A1 ou mises en situation. Pour les articles B1-C2, laissez vide pour un affichage 100% texte officiel.
              </p>
            </div>

            <Button
              type="button"
              onClick={handleGenerateAiAsset}
              disabled={isGeneratingImage}
              size="sm"
              className="bg-primary hover:bg-primary/90 text-white font-bold text-xs rounded-xl shadow-xs shrink-0 gap-1.5"
            >
              {isGeneratingImage ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Génération &amp; Watermark...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-3.5 w-3.5 text-amber-300" />
                  <span>🎨 Générer Visuel IA (16:9)</span>
                </>
              )}
            </Button>
          </div>

          {imageUrl ? (
            <div className="space-y-3">
              <div className="relative aspect-video w-full max-w-lg mx-auto overflow-hidden rounded-2xl border-2 border-primary/20 bg-muted/20 shadow-sm">
                <Image
                  src={imageUrl}
                  alt="Aperçu support visuel"
                  fill
                  className="object-contain"
                />
              </div>

              <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
                <div className="flex items-center gap-2 truncate max-w-md">
                  <span className="font-mono text-[11px] text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md border border-emerald-200">
                    {imageUrl.includes("supabase.co") ? "Supabase Storage" : "CDN Local"}
                  </span>
                  <span className="truncate text-[11px] font-mono">{imageUrl}</span>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setImageUrl("")}
                  className="text-xs text-destructive hover:text-destructive hover:bg-destructive/10 rounded-lg h-7 gap-1"
                >
                  <Trash2 className="h-3 w-3" />
                  <span>Retirer l&apos;image</span>
                </Button>
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-border p-6 text-center space-y-2 bg-muted/5">
              <ImageIcon className="h-7 w-7 text-muted-foreground mx-auto opacity-50" />
              <p className="text-xs font-semibold text-foreground">
                Aucun visuel associé — Affichage en pur texte haute lisibilité (Recommandé pour 85% des épreuves)
              </p>
              <p className="text-[11px] text-muted-foreground max-w-md mx-auto">
                Si cette question nécessite une affiche ou une scène visuelle, cliquez sur <strong>« Générer Visuel IA »</strong>. L&apos;IA produira une illustration 16:9, appliquera le filigrane Super4C2 et l&apos;enregistrera automatiquement sur le stockage.
              </p>
            </div>
          )}
        </div>

        {/* 3. Question & 4 Options */}
        <div className="rounded-2xl border bg-card p-6 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-primary" />
            <span>Question &amp; Propositions A / B / C / D</span>
          </h2>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground">
              Intitulé de la Question <span className="text-primary">*</span>
            </label>
            <Input
              type="text"
              name="prompt"
              defaultValue={question?.prompt || ""}
              onChange={(e) => setPromptPreview(e.target.value)}
              placeholder="Ex: Pourquoi le local à vélos sera-t-il fermé ?"
              required
              className="h-10 text-xs rounded-xl bg-muted/20 font-semibold"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {(["A", "B", "C", "D"] as const).map((key) => {
              const defaultVal =
                key === "A"
                  ? question?.optionA
                  : key === "B"
                  ? question?.optionB
                  : key === "C"
                  ? question?.optionC
                  : question?.optionD;
              const isSelected = correct === key;
              return (
                <div
                  key={key}
                  className={`p-3 rounded-xl border transition-all ${
                    isSelected
                      ? "border-emerald-500/50 bg-emerald-500/5 ring-1 ring-emerald-500/30"
                      : "bg-muted/10 border-border"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-mono font-bold text-foreground flex items-center gap-1.5">
                      <span className="h-5 w-5 rounded-md bg-muted text-foreground flex items-center justify-center text-[11px]">
                        {key}
                      </span>
                      <span>Option {key}</span>
                    </label>

                    <label className="flex items-center gap-1 text-[11px] font-bold cursor-pointer text-emerald-600 dark:text-emerald-400">
                      <input
                        type="radio"
                        name="correctOption"
                        value={key}
                        checked={isSelected}
                        onChange={() => setCorrect(key)}
                        className="text-emerald-600 focus:ring-emerald-500"
                      />
                      <span>Bonne réponse</span>
                    </label>
                  </div>
                  <Input
                    type="text"
                    name={`option${key}`}
                    defaultValue={defaultVal || ""}
                    onChange={(e) => {
                      if (key === "A") setOptA(e.target.value);
                      if (key === "B") setOptB(e.target.value);
                      if (key === "C") setOptC(e.target.value);
                      if (key === "D") setOptD(e.target.value);
                    }}
                    placeholder={`Texte de la proposition ${key}...`}
                    required
                    className="h-9 text-xs rounded-lg bg-background"
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* 4. Explications & Pièges with MarkdownField Interface */}
        <div className="rounded-2xl border bg-card p-6 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-primary" />
            <span>Analyse Pédagogique &amp; Décodage des Pièges FEI</span>
          </h2>

          <MarkdownField
            id="explanation"
            name="explanation"
            label="Explication Officielle (Pourquoi cette réponse est exacte)"
            description="Justifiez la règle grammaticale ou l'indice textuel précis. Cette explication sera visible dans le bilan candidat."
            defaultValue={question?.explanation || ""}
            placeholder="Détaillez la justification..."
            rows={4}
            required
          />

          <MarkdownField
            id="trapAnalysis"
            name="trapAnalysis"
            label="Décodage des Pièges & Distracteurs FEI (Export Carnet SRS)"
            description="Expliquez pourquoi les candidats tombent dans les pièges de cette question. Exporté vers le Carnet d'Erreurs à Répétition Espacée."
            defaultValue={question?.trapAnalysis || ""}
            placeholder="Détaillez chaque distracteur..."
            rows={4}
            templates={trapTemplates}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-2">
          <Button asChild variant="outline" size="sm">
            <Link href={`/admin/series-ce/${seriesId}/questions`}>Annuler</Link>
          </Button>

          <Button type="submit" size="sm" className="gap-2 font-bold shadow-xs">
            <Save className="h-4 w-4" />
            <span>Enregistrer la Question</span>
          </Button>
        </div>
      </form>
    </div>
  );
}
