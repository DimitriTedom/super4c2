"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CircleHelp,
  Save,
  Eye,
  ChevronDown,
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

export const FAQ_CATEGORIES = [
  "Général",
  "Examen CBT",
  "NCLC & CRS",
  "Abonnements",
  "Stratégie",
  "Technique",
] as const;

interface FaqData {
  id?: string;
  question: string;
  answer: string;
  category: string;
  order: number;
  isActive: boolean;
}

interface FaqFormProps {
  action: (formData: FormData) => Promise<void>;
  faq?: FaqData;
  submitLabel?: string;
}

export function FaqForm({
  action,
  faq,
  submitLabel = "Enregistrer la FAQ",
}: FaqFormProps) {
  const [question, setQuestion] = useState(faq?.question || "");
  const [category, setCategory] = useState(faq?.category || "Général");
  const [order, setOrder] = useState<number>(faq?.order ?? 0);
  const [isActive, setIsActive] = useState<boolean>(faq?.isActive ?? true);
  const [isPreviewOpen, setIsPreviewOpen] = useState(true);

  const answerTemplates = [
    {
      label: "Format Réponse Clé + Puces",
      snippet:
        "**Oui, absolument.** Les simulations reproduisent fidèlement les conditions officielles de l'examen :\n\n- **Interface CBT :** Écran scindé officiel sans défilement vertical parasite.\n- **Chronomètre officiel :** 60 minutes avec alertes à 5 min et 1 min.\n- **Algorithme officiel :** Score échelonné officiel (100–699 pts) et équivalence NCLC.",
    },
    {
      label: "Règle Immigration / CRS",
      snippet:
        "Pour débloquer le **bonus maximal de 50 points CRS** dans le bassin Entrée Express Canada, vous devez impérativement valider le **seuil NCLC 7** (soit au moins **453 points en Compréhension Écrite** et **10/20 en Expression Écrite**).\n\nConsultez notre simulateur de score pour estimer vos points.",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Back Link */}
      <div className="flex items-center gap-2">
        <Button asChild variant="ghost" size="sm" className="gap-1.5 text-xs text-muted-foreground">
          <Link href="/admin/faqs">
            <ArrowLeft className="h-4 w-4" />
            <span>Retour aux Questions Fréquentes</span>
          </Link>
        </Button>
      </div>

      {/* Header */}
      <div className="border-b pb-4">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-primary/10 text-primary border border-primary/20 mb-1.5">
          <CircleHelp className="h-3 w-3" />
          Support Candidat &amp; Foire Aux Questions
        </div>
        <h1 className="font-display text-2xl sm:text-3xl font-black tracking-tight text-foreground">
          {faq ? "Modifier la Question Fréquente" : "Ajouter une Question Fréquente"}
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
          Renseignez une réponse claire et structurée en Markdown pour guider les candidats TCF &amp; TEF.
        </p>
      </div>

      {/* Form and Live Preview Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-6 items-start">
        {/* Left Form */}
        <form action={action} className="rounded-2xl border bg-card p-6 shadow-xs space-y-5">
          {faq?.id && <input type="hidden" name="id" value={faq.id} />}
          <input type="hidden" name="category" value={category} />

          {/* Question Title */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-foreground">
                Intitulé de la Question <span className="text-primary">*</span>
              </label>
              <span className="text-[11px] text-muted-foreground font-mono">
                {question.length} caractères
              </span>
            </div>
            <Input
              type="text"
              name="question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ex: Les séries sont-elles conformes au nouveau format 2026 ?"
              required
              className="h-10 text-xs rounded-xl bg-muted/20 font-semibold"
            />
          </div>

          {/* Category & Order with Shadcn Select */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground">
                Catégorie <span className="text-primary">*</span>
              </label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="h-10 text-xs rounded-xl bg-muted/20 border-border">
                  <SelectValue placeholder="Choisir une catégorie" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  {FAQ_CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground">
                Ordre d&apos;Affichage
              </label>
              <Input
                type="number"
                name="order"
                value={order}
                onChange={(e) => setOrder(Number(e.target.value))}
                min={0}
                className="h-10 text-xs rounded-xl bg-muted/20 font-mono"
              />
              <p className="text-[10px] text-muted-foreground">
                Ordre croissant (0 = affiché en premier).
              </p>
            </div>
          </div>

          {/* Markdown Answer */}
          <div className="pt-2">
            <MarkdownField
              id="answer"
              name="answer"
              label="Réponse Détaillée"
              description="Formatage Markdown pris en charge (gras, puces, liens, citations)."
              defaultValue={faq?.answer || ""}
              placeholder="Expliquez la réponse en détail..."
              rows={6}
              required
              templates={answerTemplates}
            />
          </div>

          {/* Status Checkbox */}
          <div className="pt-2 border-t">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                name="isActive"
                value="true"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="h-4 w-4 rounded-md border-border text-primary focus:ring-primary"
              />
              <div>
                <p className="text-xs font-bold text-foreground">FAQ active</p>
                <p className="text-[11px] text-muted-foreground">
                  Visible par les candidats sur la page d&apos;accueil et la section FAQ.
                </p>
              </div>
            </label>
          </div>

          {/* Submit Buttons */}
          <div className="flex items-center justify-between pt-4 border-t">
            <Button asChild variant="outline" size="sm">
              <Link href="/admin/faqs">Annuler</Link>
            </Button>

            <Button type="submit" size="sm" className="gap-2 font-bold shadow-xs">
              <Save className="h-4 w-4" />
              <span>{submitLabel}</span>
            </Button>
          </div>
        </form>

        {/* Right Live Preview Card (Model Pratik-IT) */}
        <aside className="rounded-2xl border bg-card/60 p-5 shadow-xs space-y-4 lg:sticky lg:top-4">
          <div className="flex items-center justify-between border-b pb-3">
            <h3 className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary">
              <Eye className="h-3.5 w-3.5" />
              <span>Aperçu Candidat Live</span>
            </h3>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                isActive
                  ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/30"
                  : "bg-muted text-muted-foreground border-border"
              }`}
            >
              {isActive ? "Visible" : "Masquée"}
            </span>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-muted text-[11px] font-bold text-muted-foreground">
                Catégorie : {category}
              </span>
              <span className="font-mono text-[11px] text-muted-foreground">
                Position #{order}
              </span>
            </div>

            {/* Accordion mockup */}
            <div className="rounded-xl border bg-card p-4 transition-all space-y-3">
              <button
                type="button"
                onClick={() => setIsPreviewOpen(!isPreviewOpen)}
                className="w-full flex items-center justify-between text-left text-xs font-bold text-foreground gap-2"
              >
                <span>{question || "L'intitulé de la question apparaîtra ici..."}</span>
                <ChevronDown
                  className={`h-4 w-4 text-muted-foreground transition-transform shrink-0 ${
                    isPreviewOpen ? "rotate-180 text-primary" : ""
                  }`}
                />
              </button>

              {isPreviewOpen && (
                <div className="pt-2 border-t text-xs text-foreground/80 leading-relaxed">
                  {faq?.answer ? (
                    <div className="whitespace-pre-wrap">{faq.answer}</div>
                  ) : (
                    <span className="italic text-muted-foreground">
                      La réponse apparaîtra ici pendant l&apos;édition...
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
