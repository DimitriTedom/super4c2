import jsPDF from "jspdf";
import type { WrittenExamSeries, WrittenExamResult, TaskEvaluation, FeiCriterionScore } from "@/lib/exam/written-types";

interface ExportPdfOptions {
  series: WrittenExamSeries;
  result: WrittenExamResult;
  texts: string[];
}

/**
 * Générateur PDF Vectoriel Haute Fidélité et 100% Résilient pour les Bilans d'Examen Super4C2.
 * Ne dépend d'aucun élément DOM externe et gère tous les cas de figure (textes vides, notes à 0, critères partiels).
 */
const PDF_CHAR_MAP: Record<string, string> = {
  "•": "-", "·": "-", "✓": "[OK]", "✔": "[OK]", "⚠": "(!)", "—": "-", "–": "-",
  "’": "'", "‘": "'", "“": '"', "”": '"', "…": "...", "→": "->", "★": "*", "\u00a0": " ", "\u202f": " ",
  "œ": "oe", "Œ": "OE", "€": "EUR",
};

/** Garde uniquement les caractères Latin-1 (WinAnsi) supportés par les polices cœur de jsPDF. */
export function sanitizePdfText(input: unknown): string {
  const s = typeof input === "string" ? input : String(input ?? "");
  let out = "";
  for (const ch of s) {
    if (PDF_CHAR_MAP[ch] !== undefined) out += PDF_CHAR_MAP[ch];
    else {
      const code = ch.codePointAt(0) ?? 0;
      if (code === 10 || code === 13 || (code >= 32 && code <= 126) || (code >= 160 && code <= 255)) out += ch;
      else if (code > 255) out += "";
    }
  }
  return out;
}

export async function generateExamReportPdf({ series, result, texts }: ExportPdfOptions): Promise<void> {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  // Toute chaîne passe par le sanitizer avant d'atteindre le flux PDF
  const rawText = doc.text.bind(doc);
  (doc as unknown as { text: (t: unknown, ...a: unknown[]) => unknown }).text = (t: unknown, ...a: unknown[]) =>
    (rawText as (t: unknown, ...a: unknown[]) => unknown)(
      Array.isArray(t) ? t.map(sanitizePdfText) : sanitizePdfText(t),
      ...a
    );
  const rawSplit = doc.splitTextToSize.bind(doc);
  (doc as unknown as { splitTextToSize: (t: unknown, w: number) => string[] }).splitTextToSize = (t: unknown, w: number) =>
    rawSplit(sanitizePdfText(t), w);

  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 15;
  const contentWidth = pageWidth - margin * 2;
  let y = 14;

  const checkPageBreak = (neededHeight: number) => {
    if (y + neededHeight > pageHeight - 18) {
      doc.addPage();
      y = 15;
      renderMiniHeader();
    }
  };

  const renderMiniHeader = () => {
    doc.setFillColor(229, 26, 49);
    doc.rect(margin, y, contentWidth, 1.5, "F");
    y += 6;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text("SUPER4C2 • BILAN OFFICIEL DE SIMULATION TCF CANADA", margin, y);
    doc.text(`SESSION : ${series.title || "EXPRESSION ÉCRITE"}`, pageWidth - margin, y, { align: "right" });
    y += 8;
  };

  // ============================================
  // 1. BANDEAU PRINCIPAL & EN-TÊTE OFFICIEL
  // ============================================
  doc.setFillColor(229, 26, 49); // Brand crimson
  doc.rect(0, 0, pageWidth, 18, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text("SUPER4C2 • RAPPORT OFFICIEL D'ÉVALUATION CBT", margin, 12);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text("FRANCE ÉDUCATION INTERNATIONAL · NORMES 2026", pageWidth - margin, 12, { align: "right" });

  y = 26;

  // Titre du document
  doc.setTextColor(15, 23, 42);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text(`Rapport d'Évaluation — ${series.title || "Expression Écrite"}`, margin, y);
  y += 6;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  const formattedDate = new Date().toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
  doc.text(`Date de génération : ${formattedDate}  |  Durée réglementaire : 60 minutes`, margin, y);
  y += 8;

  // ============================================
  // 2. CARTE SCORE SYNTHÈSE (4 MÉTRIQUES CLÉS)
  // ============================================
  const scoreCardHeight = 26;
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(margin, y, contentWidth, scoreCardHeight, 3, 3, "F");
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, y, contentWidth, scoreCardHeight, 3, 3, "S");

  const colWidth = contentWidth / 4;

  // Col 1 : Note sur 20
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text("NOTE GLOBALE FEI", margin + colWidth * 0.5, y + 8, { align: "center" });
  doc.setFontSize(16);
  doc.setTextColor(229, 26, 49);
  doc.text(`${result.totalScore ?? 0} / 20`, margin + colWidth * 0.5, y + 18, { align: "center" });

  // Col 2 : Score Échelonné
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text("SCORE TCF ÉCHELONNÉ", margin + colWidth * 1.5, y + 8, { align: "center" });
  doc.setFontSize(16);
  doc.setTextColor(15, 23, 42);
  doc.text(`${result.tcfScaledScore ?? 100} / 699`, margin + colWidth * 1.5, y + 18, { align: "center" });

  // Col 3 : Palier NCLC
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text("PALIER NCLC ESTIMÉ", margin + colWidth * 2.5, y + 8, { align: "center" });
  doc.setFontSize(16);
  const nclcVal = result.nclcLevel ?? 4;
  if (nclcVal >= 7) {
    doc.setTextColor(16, 185, 129); // Vert
  } else {
    doc.setTextColor(217, 119, 6); // Ambre
  }
  doc.text(`NCLC ${nclcVal}`, margin + colWidth * 2.5, y + 18, { align: "center" });

  // Col 4 : Points CRS Entrée Express
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text("BONUS CRS CANADA", margin + colWidth * 3.5, y + 8, { align: "center" });
  doc.setFontSize(16);
  const crsVal = result.crsPointsUnlocked ?? (nclcVal >= 7 ? 50 : 0);
  if (crsVal >= 50) {
    doc.setTextColor(16, 185, 129);
    doc.text("+50 PTS CRS", margin + colWidth * 3.5, y + 18, { align: "center" });
  } else {
    doc.setTextColor(217, 119, 6);
    doc.text("0 / 50 PTS", margin + colWidth * 3.5, y + 18, { align: "center" });
  }

  y += scoreCardHeight + 8;

  // Bandeau Admissibilité
  checkPageBreak(12);
  doc.setFillColor(nclcVal >= 7 ? 236 : 254, nclcVal >= 7 ? 253 : 243, nclcVal >= 7 ? 245 : 199);
  doc.roundedRect(margin, y, contentWidth, 10, 2, 2, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(nclcVal >= 7 ? 21 : 180, nclcVal >= 7 ? 128 : 83, nclcVal >= 7 ? 61 : 9);
  const statutText =
    nclcVal >= 7
      ? "ADMISSIBLE : Le seuil NCLC 7 requis pour l'obtention des +50 points d'Entrée Express est atteint."
      : "PALIER DE PERFECTIONNEMENT : Visez la note de 10/20 pour débloquer automatiquement le NCLC 7 et les 50 pts CRS.";
  doc.text(statutText, margin + 4, y + 6.5);

  y += 16;

  // ============================================
  // 3. DÉTAIL DES 3 TÂCHES FEI
  // ============================================
  const taskEvals = result.taskEvaluations || [];

  taskEvals.forEach((taskEval: TaskEvaluation, index: number) => {
    checkPageBreak(35);

    const taskTitle = series.tasks?.[index]?.title || `Tâche ${index + 1}`;
    const candidateText = (texts[index] || "").trim();
    const wordCount = taskEval.wordCount ?? 0;
    const taskScore = taskEval.taskScore ?? 0;
    const taskNclc = taskEval.nclcEstimatedLevel ?? 4;

    // Entête de la Tâche
    doc.setFillColor(241, 245, 249);
    doc.roundedRect(margin, y, contentWidth, 8, 2, 2, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42);
    doc.text(`TÂCHE ${index + 1} — ${taskTitle.toUpperCase()}`, margin + 4, y + 5.5);

    doc.setFontSize(9);
    doc.setTextColor(229, 26, 49);
    doc.text(`Note : ${taskScore} / 20  (NCLC ${taskNclc})`, pageWidth - margin - 4, y + 5.5, { align: "right" });

    y += 12;

    // Métadonnées Mots & Évaluation
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(71, 85, 105);
    const volumeStatus =
      taskEval.wordCountStatus === "valid"
        ? "✓ Volume conforme aux exigences FEI"
        : taskEval.wordCountStatus === "under"
        ? "⚠ Volume insuffisant (pénalité de palier appliquée)"
        : "⚠ Volume excessif (risque de pénalité)";
    doc.text(`Volume rédigé : ${wordCount} mots  ·  ${volumeStatus}`, margin + 2, y);
    y += 6;

    // Texte Soumis par l'Apprenant
    checkPageBreak(25);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(30, 41, 59);
    doc.text("Production rédigée par le candidat :", margin + 2, y);
    y += 4.5;

    doc.setFillColor(248, 250, 252);
    doc.setFont("courier", "normal");
    doc.setFontSize(8);
    doc.setTextColor(51, 65, 85);

    const textToPrint = candidateText.length > 0 ? candidateText : "[Aucun texte saisi lors de cette session]";
    const splitCandidateText = doc.splitTextToSize(textToPrint, contentWidth - 8);
    const textBlockHeight = Math.min(splitCandidateText.length * 4.2 + 6, 60);

    doc.roundedRect(margin, y, contentWidth, textBlockHeight, 2, 2, "F");
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(margin, y, contentWidth, textBlockHeight, 2, 2, "S");

    doc.text(splitCandidateText.slice(0, 14), margin + 4, y + 5);
    y += textBlockHeight + 6;

    // Grille des 4 Critères Officiels FEI
    const criteria = taskEval.criteria || [];
    if (criteria.length > 0) {
      checkPageBreak(criteria.length * 6 + 10);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8.5);
      doc.setTextColor(30, 41, 59);
      doc.text("Évaluation selon la grille officielle FEI :", margin + 2, y);
      y += 5;

      criteria.forEach((crit: FeiCriterionScore) => {
        checkPageBreak(7);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(8);
        doc.setTextColor(229, 26, 49);
        doc.text(`• ${crit.label || "Critère"} (${crit.score ?? 0}/5) : `, margin + 4, y);

        doc.setFont("helvetica", "normal");
        doc.setTextColor(71, 85, 105);
        const fbText = (crit.feedback || "Évaluation standard FEI.").trim();
        const splitFb = doc.splitTextToSize(fbText, contentWidth - 65);
        doc.text(splitFb[0] || "", margin + 65, y);
        y += 5.5;
      });
      y += 2;
    }

    // Magic Rewrite C2 (si présent)
    if (taskEval.magicRewriteC2 && taskEval.magicRewriteC2.trim().length > 0) {
      checkPageBreak(25);
      doc.setFillColor(254, 252, 232); // Ambre clair
      doc.setDrawColor(253, 224, 71);

      const splitRewrite = doc.splitTextToSize(`« ${taskEval.magicRewriteC2} »`, contentWidth - 8);
      const rewriteHeight = Math.min(splitRewrite.length * 4 + 10, 40);

      doc.roundedRect(margin, y, contentWidth, rewriteHeight, 2, 2, "F");
      doc.roundedRect(margin, y, contentWidth, rewriteHeight, 2, 2, "S");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(161, 98, 7);
      doc.text("MODÈLE D'EXCELLENCE MAGIC REWRITE C2 :", margin + 4, y + 5);

      doc.setFont("helvetica", "italic");
      doc.setFontSize(7.5);
      doc.setTextColor(66, 32, 6);
      doc.text(splitRewrite.slice(0, 7), margin + 4, y + 10);

      y += rewriteHeight + 6;
    }

    y += 4;
  });

  // ============================================
  // 4. PIED DE PAGE ET NUMÉROTATION
  // ============================================
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(148, 163, 184);
    doc.text(
      `Super4C2 — Plateforme d'Entraînement Officielle TCF / TEF Canada  •  Document généré pour usage pédagogique individuel`,
      margin,
      pageHeight - 8
    );
    doc.text(`Page ${i} sur ${totalPages}`, pageWidth - margin, pageHeight - 8, { align: "right" });
  }

  // Sauvegarde et téléchargement immédiat
  const safeId = (series.id || "simulation").replace(/[^a-zA-Z0-9_-]/g, "_");
  doc.save(`Rapport-Super4C2-EE-${safeId}.pdf`);
}
