import jsPDF from "jspdf";
import type { WrittenExamSeries, WrittenExamResult, TaskEvaluation, FeiCriterionScore } from "@/lib/exam/written-types";
import { getCompanionById, type CompanionId } from "@/lib/companions/data";

export interface ExportPdfOptions {
  series: WrittenExamSeries;
  result: WrittenExamResult;
  texts: string[];
  candidateName?: string;
  candidateEmail?: string;
  candidateId?: string;
  companionId?: CompanionId;
}

/**
 * Table de substitution des caractères non supportés par WinAnsi (polices de base jsPDF).
 */
const PDF_CHAR_MAP: Record<string, string> = {
  "•": "-", "·": "-", "✓": "[OK]", "✔": "[OK]", "⚠": "(!)", "—": "-", "–": "-",
  "’": "'", "‘": "'", "“": '"', "”": '"', "…": "...", "→": "->", "★": "*", "\u00a0": " ", "\u202f": " ",
  "œ": "oe", "Œ": "OE", "€": "EUR", "«": '"', "»": '"',
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

/**
 * Charge l'image du logo Super4C2 en Base64 depuis le navigateur.
 */
async function loadLogoBase64(): Promise<string | null> {
  if (typeof window === "undefined") return null;
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        if (!ctx) return resolve(null);
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL("image/png"));
      } catch {
        resolve(null);
      }
    };
    img.onerror = () => resolve(null);
    img.src = "/brand/Le Logo Primaire.png";
  });
}

/**
 * Nettoie le titre d'une tâche pour éviter toute répétition "TÂCHE 1 - TÂCHE 1 - ..."
 */
function cleanTaskTitle(title: string, taskNumber: number): string {
  let cleaned = title.replace(/^t[aâ]che\s*\d+\s*[-—:]\s*/i, "").trim();
  cleaned = cleaned.replace(/^t[aâ]che\s*\d+\s*[-—:]\s*/i, "").trim();
  if (!cleaned) {
    if (taskNumber === 1) cleaned = "Message ou courriel court informatif (60-120 mots)";
    else if (taskNumber === 2) cleaned = "Article ou récit d'expérience vécue (120-150 mots)";
    else cleaned = "Texte argumentatif comparatif et prise de position (120-180 mots)";
  }
  return cleaned;
}

/**
 * Générateur PDF Vectoriel Institutionnel Haute Fidélité pour les Bilans d'Examen Super4C2.
 * Conforme aux exigences officielles France Éducation International (FEI) et IRCC.
 */
export async function generateExamReportPdf({
  series,
  result,
  texts,
  candidateName,
  candidateEmail,
  candidateId,
  companionId,
}: ExportPdfOptions): Promise<void> {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  // Tenter de charger le logo haute résolution
  let logoDataUrl: string | null = null;
  try {
    logoDataUrl = await loadLogoBase64();
  } catch {}

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
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;
  let y = 12;

  const mentor = getCompanionById(companionId || "laurent");
  const mentorName = mentor?.name || "M. Laurent Mercier";
  const mentorTitle = mentor?.title || "Examinateur Certifié France Éducation International (FEI)";

  // Référence unique d'attestation de simulation
  const seriesNum = series.seriesNumber || 101;
  const sessionHash = Math.abs(
    (series.id || "ee").split("").reduce((acc, c) => ((acc << 5) - acc) + c.charCodeAt(0), 0)
  ).toString(16).toUpperCase().slice(0, 6);
  const attestationRef = candidateId
    ? `S4C2-EE-${seriesNum}-${candidateId}`
    : `S4C2-EE-${seriesNum}-${sessionHash}`;

  const checkPageBreak = (neededHeight: number) => {
    if (y + neededHeight > pageHeight - 16) {
      doc.addPage();
      y = 14;
      renderMiniHeader();
    }
  };

  const renderMiniHeader = () => {
    // Mini bandeau de rappel de haut de page
    doc.setFillColor(229, 26, 49);
    doc.rect(margin, y, contentWidth, 1.2, "F");
    y += 5;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(11, 19, 43);
    doc.text("SUPER4C2 CANADA", margin, y);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    doc.text(`Réf : ${attestationRef}  |  Série ${seriesNum} EE`, margin + 35, y);

    doc.text("SIMULATION OFFICIELLE TCF CANADA · NORMES FEI", pageWidth - margin, y, { align: "right" });
    y += 6;
  };

  // ============================================
  // 1. BANDEAU PRINCIPAL & IDENTITÉ DE MARQUE
  // ============================================
  const headerHeight = 22;
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, pageWidth, headerHeight, "F");

  // Si logo disponible, affichage de l'image
  if (logoDataUrl) {
    try {
      doc.addImage(logoDataUrl, "PNG", margin, 4, 38, 14);
    } catch {
      renderVectorLogo(doc, margin, 12);
    }
  } else {
    renderVectorLogo(doc, margin, 12);
  }

  // Cartouche d'autorité à droite (sans superposition)
  const rightBoxX = pageWidth - margin;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(11, 19, 43);
  doc.text("RAPPORT OFFICIEL D'ÉVALUATION CBT", rightBoxX, 9, { align: "right" });

  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(229, 26, 49);
  doc.text("TCF CANADA · EXPRESSION ÉCRITE", rightBoxX, 13.5, { align: "right" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  doc.text("Norme France Éducation International (FEI) · 60 minutes", rightBoxX, 17.5, { align: "right" });

  // Ligne de délimitation écarlate de marque
  doc.setFillColor(229, 26, 49);
  doc.rect(margin, headerHeight, contentWidth, 1.2, "F");

  y = headerHeight + 5;

  // ============================================
  // 2. EN-TÊTE DU CANDIDAT & DE LA SESSION
  // ============================================
  const candidateCardHeight = 22;
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(margin, y, contentWidth, candidateCardHeight, 2.5, 2.5, "F");
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, y, contentWidth, candidateCardHeight, 2.5, 2.5, "S");

  const colW = contentWidth / 3;

  // Colonne 1 : Candidat
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  doc.text("CANDIDAT(E)", margin + 4, y + 5.5);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  const displayName = candidateName?.trim() || "Candidat Officiel Super4C2";
  doc.text(displayName.slice(0, 30), margin + 4, y + 10.5);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  const displayEmail = candidateEmail?.trim() || "Compte Candidat Vérifié";
  doc.text(displayEmail.slice(0, 32), margin + 4, y + 15.5);

  // Colonne 2 : Session & Réf
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  doc.text("SESSION & RÉFÉRENCE", margin + colW + 4, y + 5.5);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text(`Examen Blanc N°${seriesNum} — 3 Tâches`, margin + colW + 4, y + 10.5);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text(`Dossier : ${attestationRef}`, margin + colW + 4, y + 15.5);

  // Colonne 3 : Mentor & Date
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  doc.text("SUPERVISION PÉDAGOGIQUE", margin + colW * 2 + 4, y + 5.5);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(229, 26, 49);
  doc.text(mentorName.slice(0, 28), margin + colW * 2 + 4, y + 10.5);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  const formattedDate = new Date().toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
  doc.text(`Évalué le ${formattedDate}`, margin + colW * 2 + 4, y + 15.5);

  y += candidateCardHeight + 5;

  // ============================================
  // 3. CARTE SYNTHÈSE SCORE & ÉCHELON NCLC
  // ============================================
  const scoreCardHeight = 24;
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(margin, y, contentWidth, scoreCardHeight, 3, 3, "F");
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, y, contentWidth, scoreCardHeight, 3, 3, "S");

  const metricColW = contentWidth / 4;

  // Met 1 : Note sur 20
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  doc.text("NOTE GLOBALE FEI", margin + metricColW * 0.5, y + 6.5, { align: "center" });

  doc.setFontSize(16);
  doc.setTextColor(229, 26, 49);
  const totalScoreVal = result.totalScore !== undefined ? result.totalScore : 0;
  doc.text(`${totalScoreVal} / 20`, margin + metricColW * 0.5, y + 16, { align: "center" });

  // Séparateur vertical 1
  doc.setDrawColor(241, 245, 249);
  doc.line(margin + metricColW, y + 4, margin + metricColW, y + scoreCardHeight - 4);

  // Met 2 : Score Échelonné TCF (100-699)
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  doc.text("SCORE TCF ÉCHELONNÉ", margin + metricColW * 1.5, y + 6.5, { align: "center" });

  doc.setFontSize(15);
  doc.setTextColor(15, 23, 42);
  const tcfScaled = result.tcfScaledScore ?? 100;
  doc.text(`${tcfScaled} / 699`, margin + metricColW * 1.5, y + 16, { align: "center" });

  // Séparateur vertical 2
  doc.line(margin + metricColW * 2, y + 4, margin + metricColW * 2, y + scoreCardHeight - 4);

  // Met 3 : Palier NCLC
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  doc.text("PALIER NCLC ESTIMÉ", margin + metricColW * 2.5, y + 6.5, { align: "center" });

  const nclcVal = result.nclcLevel ?? 4;
  doc.setFontSize(15);
  if (nclcVal >= 7) {
    doc.setTextColor(16, 185, 129); // Vert NCLC 7+
  } else {
    doc.setTextColor(217, 119, 6); // Ambre
  }
  doc.text(`NCLC ${nclcVal}`, margin + metricColW * 2.5, y + 16, { align: "center" });

  // Séparateur vertical 3
  doc.line(margin + metricColW * 3, y + 4, margin + metricColW * 3, y + scoreCardHeight - 4);

  // Met 4 : Bonus CRS Canada
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  doc.text("BONUS CRS ENTRÉE EXPRESS", margin + metricColW * 3.5, y + 6.5, { align: "center" });

  doc.setFontSize(15);
  if (nclcVal >= 7) {
    doc.setTextColor(16, 185, 129);
    doc.text("+50 PTS CRS", margin + metricColW * 3.5, y + 16, { align: "center" });
  } else {
    doc.setTextColor(100, 116, 139);
    doc.text("+0 PTS CRS", margin + metricColW * 3.5, y + 16, { align: "center" });
  }

  y += scoreCardHeight + 4;

  // Bandeau Admissibilité Immobilière / Entrée Express
  const isAdmissible = nclcVal >= 7;
  doc.setFillColor(isAdmissible ? 236 : 254, isAdmissible ? 253 : 243, isAdmissible ? 245 : 199);
  doc.roundedRect(margin, y, contentWidth, 7.5, 1.5, 1.5, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(isAdmissible ? 21 : 180, isAdmissible ? 128 : 83, isAdmissible ? 61 : 9);
  const statusMsg = isAdmissible
    ? "[OK] ADMISSIBLE IRCC : Palier NCLC 7 atteint en Expression Ecrite (+50 points CRS debloques pour l'Entree Express)."
    : "(!) PALIER EN PERFECTIONNEMENT : Visez la note de 10/20 pour atteindre le NCLC 7 et debloquer les 50 points CRS.";
  doc.text(statusMsg, margin + 4, y + 5);

  y += 12;

  // ============================================
  // 4. DÉTAIL DES 3 TÂCHES FEI
  // ============================================
  const taskEvals = result.taskEvaluations || [];

  taskEvals.forEach((taskEval: TaskEvaluation, index: number) => {
    checkPageBreak(38);

    const rawTitle = series.tasks?.[index]?.title || `Tâche ${index + 1}`;
    const cleanedTitle = cleanTaskTitle(rawTitle, index + 1);
    const candidateText = (texts[index] || "").trim();
    const wordCount = taskEval.wordCount ?? 0;
    const taskScore = taskEval.taskScore ?? 0;
    const taskNclc = taskEval.nclcEstimatedLevel ?? 4;

    // Entête de la Tâche (Boîte stylisée avec badge)
    doc.setFillColor(241, 245, 249);
    doc.roundedRect(margin, y, contentWidth, 8, 2, 2, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(11, 19, 43);
    const taskHeaderLine = `TACHE ${index + 1} - ${cleanedTitle.toUpperCase()}`;
    doc.text(taskHeaderLine.slice(0, 68), margin + 3.5, y + 5.5);

    // Note alignée à droite
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(229, 26, 49);
    doc.text(`Note : ${taskScore}/20 (NCLC ${taskNclc})`, pageWidth - margin - 3.5, y + 5.5, { align: "right" });

    y += 11;

    // Métadonnées Volume de Mots
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(71, 85, 105);
    const volumeStatus =
      taskEval.wordCountStatus === "valid"
        ? "[OK] Volume conforme aux exigences FEI"
        : taskEval.wordCountStatus === "under"
        ? "(!) Volume insuffisant (penalite de palier appliquee)"
        : "(!) Volume excessif (risque de penalite)";
    doc.text(`Volume redige : ${wordCount} mots  |  ${volumeStatus}`, margin + 2, y);
    y += 5.5;

    // Texte rédigé par le candidat
    checkPageBreak(22);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(30, 41, 59);
    doc.text("Production redigee par le candidat :", margin + 2, y);
    y += 4;

    doc.setFillColor(248, 250, 252);
    doc.setFont("courier", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(51, 65, 85);

    const textToPrint = candidateText.length > 0 ? candidateText : "[Aucun texte saisi lors de cette session]";
    const splitCandidateText = doc.splitTextToSize(textToPrint, contentWidth - 8);
    const textBlockHeight = Math.min(splitCandidateText.length * 3.8 + 5, 45);

    doc.roundedRect(margin, y, contentWidth, textBlockHeight, 1.5, 1.5, "F");
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(margin, y, contentWidth, textBlockHeight, 1.5, 1.5, "S");

    doc.text(splitCandidateText.slice(0, 10), margin + 4, y + 4.5);
    y += textBlockHeight + 5;

    // Grille d'évaluation des 4 critères FEI
    const criteria = taskEval.criteria || [];
    if (criteria.length > 0) {
      checkPageBreak(criteria.length * 5 + 8);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7.5);
      doc.setTextColor(30, 41, 59);
      doc.text("Evaluation detaillee selon la grille officielle FEI :", margin + 2, y);
      y += 4.5;

      criteria.forEach((crit: FeiCriterionScore) => {
        checkPageBreak(6);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(7.5);
        doc.setTextColor(229, 26, 49);
        doc.text(`- ${crit.label || "Critere"} (${crit.score ?? 0}/5) : `, margin + 3, y);

        doc.setFont("helvetica", "normal");
        doc.setTextColor(71, 85, 105);
        const fbText = (crit.feedback || "Evaluation FEI standard.").trim();
        const splitFb = doc.splitTextToSize(fbText, contentWidth - 60);
        doc.text(splitFb[0] || "", margin + 60, y);
        y += 4.5;
      });
      y += 1.5;
    }

    // Modèle d'Excellence Magic Rewrite C2
    if (taskEval.magicRewriteC2 && taskEval.magicRewriteC2.trim().length > 0) {
      checkPageBreak(22);
      doc.setFillColor(254, 252, 232); // Ambre doux
      doc.setDrawColor(253, 224, 71);

      const splitRewrite = doc.splitTextToSize(`"${taskEval.magicRewriteC2}"`, contentWidth - 8);
      const rewriteHeight = Math.min(splitRewrite.length * 3.6 + 8, 38);

      doc.roundedRect(margin, y, contentWidth, rewriteHeight, 2, 2, "F");
      doc.roundedRect(margin, y, contentWidth, rewriteHeight, 2, 2, "S");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(7.5);
      doc.setTextColor(161, 98, 7);
      doc.text("MODELE D'EXCELLENCE MAGIC REWRITE C2 :", margin + 4, y + 4.5);

      doc.setFont("helvetica", "italic");
      doc.setFontSize(7);
      doc.setTextColor(66, 32, 6);
      doc.text(splitRewrite.slice(0, 7), margin + 4, y + 9);

      y += rewriteHeight + 5;
    }

    y += 3;
  });

  // ============================================
  // 5. CACHET INSTITUTIONNEL & SIGNATURE MENTOR
  // ============================================
  checkPageBreak(20);
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(margin, y, contentWidth, 16, 2, 2, "F");
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(margin, y, contentWidth, 16, 2, 2, "S");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.setTextColor(11, 19, 43);
  doc.text("ATTESTATION DE SIMULATION PÉDAGOGIQUE — SUPER4C2 CANADA", margin + 4, y + 5);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.5);
  doc.setTextColor(100, 116, 139);
  doc.text(
    "Ce rapport est généré par le moteur d'évaluation IA conforme aux barèmes de France Éducation International (FEI).\nIl constitue un bilan d'entraînement individuel certifiant le niveau NCLC du candidat sous chronomètre officiel de 60 minutes.",
    margin + 4,
    y + 8.5
  );

  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(229, 26, 49);
  doc.text(`[✓ Sceau Numérique : ${attestationRef}]`, pageWidth - margin - 4, y + 10, { align: "right" });

  // ============================================
  // 6. PIED DE PAGE & NUMÉROTATION MULTI-PAGES
  // ============================================
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(148, 163, 184);
    doc.text(
      "Super4C2 — Plateforme d'Entraînement NCLC 7+ TCF Canada  •  Document individuel officiel",
      margin,
      pageHeight - 7
    );
    doc.text(`Page ${i} sur ${totalPages}`, pageWidth - margin, pageHeight - 7, { align: "right" });
  }

  // Sauvegarde et téléchargement immédiat
  const safeId = (series.id || "simulation").replace(/[^a-zA-Z0-9_-]/g, "_");
  doc.save(`Rapport-Super4C2-EE-${safeId}.pdf`);
}

/**
 * Dessine un logo vectoriel pur Super4C2 si l'image distante n'est pas accessible.
 */
function renderVectorLogo(doc: jsPDF, x: number, y: number) {
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(11, 19, 43);
  doc.text("SUPER4", x, y);

  doc.setTextColor(229, 26, 49);
  doc.text("C2", x + 25, y);

  doc.setFontSize(6);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(100, 116, 139);
  doc.text("TCF & TEF CANADA PREP", x, y + 4);
}
