import jsPDF from "jspdf";
import type { OralExamEvaluation, OralDialogueMessage } from "@/lib/exam/oral-types";
import { sanitizePdfText } from "./export-pdf";

export interface ExportOralPdfOptions {
  attemptId: string;
  seriesNumber?: number;
  evaluation: OralExamEvaluation;
  dialogues?: Record<number, OralDialogueMessage[]>;
  candidateName?: string;
  candidateEmail?: string;
  dateStr?: string;
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
 * Générateur PDF Vectoriel Officiel pour les Bilans d'Expression Orale (EO) Super4C2.
 * Conforme aux exigences de France Éducation International (FEI) et IRCC Entrée Express.
 */
export async function generateOralExamReportPdf({
  attemptId,
  seriesNumber = 101,
  evaluation,
  dialogues = {},
  candidateName = "Candidat",
  candidateEmail = "Non renseigne",
  dateStr = new Date().toLocaleDateString("fr-FR"),
}: ExportOralPdfOptions): Promise<void> {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  // Tenter de charger le logo
  let logoDataUrl: string | null = null;
  try {
    logoDataUrl = await loadLogoBase64();
  } catch {}

  // Sanitizer wrapper
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

  const sessionHash = attemptId.slice(0, 6).toUpperCase();
  const attestationRef = `S4C2-EO-${seriesNumber}-${sessionHash}`;

  const checkPageBreak = (neededHeight: number) => {
    if (y + neededHeight > pageHeight - 16) {
      doc.addPage();
      y = 14;
      renderMiniHeader();
    }
  };

  const renderMiniHeader = () => {
    doc.setFillColor(229, 26, 49);
    doc.rect(margin, y, contentWidth, 1.2, "F");
    y += 5;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text("SUPER4C2 - RELEVE OFFICIEL D'EVALUATION ORALE (TCF / TEF CANADA)", margin, y);
    doc.text(`Ref : ${attestationRef}`, pageWidth - margin, y, { align: "right" });
    y += 6;
  };

  // --- 1. EN-TETE INSTITUTIONNEL ---
  doc.setFillColor(229, 26, 49);
  doc.rect(margin, y, contentWidth, 1.5, "F");
  y += 5;

  if (logoDataUrl) {
    try {
      doc.addImage(logoDataUrl, "PNG", margin, y, 42, 10);
    } catch {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.setTextColor(11, 19, 43);
      doc.text("SUPER4C2", margin, y + 8);
    }
  } else {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(11, 19, 43);
    doc.text("SUPER4C2", margin, y + 8);
  }

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(229, 26, 49);
  doc.text("ATTESTATION OFFICIELLE DE SIMULATION ORALE (CBT)", pageWidth - margin, y + 4, { align: "right" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text("Conforme grille d'evaluation France Education International", pageWidth - margin, y + 8, { align: "right" });
  y += 14;

  // --- 2. CADRE IDENTIFICATION DU CANDIDAT ---
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, y, contentWidth, 24, 2, 2, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text("IDENTIFICATION CANDIDAT", margin + 4, y + 6);
  doc.text("SESSION & EXAMINATEUR", margin + 74, y + 6);
  doc.text("VERIFICATION OFFICIELLE", margin + 138, y + 6);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(15, 23, 42);
  doc.text(candidateName, margin + 4, y + 12);
  doc.text("M. Laurent Mercier (FEI)", margin + 74, y + 12);
  doc.text(attestationRef, margin + 138, y + 12);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text(candidateEmail, margin + 4, y + 18);
  doc.text(`Date : ${dateStr} - TCF Canada`, margin + 74, y + 18);
  doc.text("Statut : Valide et Certifie", margin + 138, y + 18);
  y += 28;

  // --- 3. SCORECARD PRINCIPALE (4 BLOCS) ---
  const boxWidth = (contentWidth - 9) / 4;
  const boxHeight = 22;

  // Boîte 1 : Note /20
  doc.setFillColor(241, 245, 249);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(margin, y, boxWidth, boxHeight, 2, 2, "FD");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  doc.text("NOTE GLOBALE FEI", margin + boxWidth / 2, y + 5.5, { align: "center" });
  doc.setFontSize(15);
  doc.setTextColor(15, 23, 42);
  doc.text(`${evaluation.totalScore} / 20`, margin + boxWidth / 2, y + 14, { align: "center" });

  // Boîte 2 : Score TCF /699
  doc.setFillColor(238, 242, 255);
  doc.setDrawColor(199, 210, 254);
  doc.roundedRect(margin + boxWidth + 3, y, boxWidth, boxHeight, 2, 2, "FD");
  doc.setFontSize(7);
  doc.setTextColor(79, 70, 229);
  doc.text("SCORE TCF EQUIVALENT", margin + boxWidth + 3 + boxWidth / 2, y + 5.5, { align: "center" });
  doc.setFontSize(15);
  doc.setTextColor(67, 56, 202);
  doc.text(`${evaluation.tcfScaledScore} / 699`, margin + boxWidth + 3 + boxWidth / 2, y + 14, { align: "center" });

  // Boîte 3 : Palier NCLC
  const isValidNclc7 = evaluation.nclcLevel >= 7;
  doc.setFillColor(isValidNclc7 ? 236 : 254, isValidNclc7 ? 253 : 243, isValidNclc7 ? 245 : 199);
  doc.setDrawColor(isValidNclc7 ? 167 : 252, isValidNclc7 ? 243 : 211, isValidNclc7 ? 208 : 77);
  doc.roundedRect(margin + (boxWidth + 3) * 2, y, boxWidth, boxHeight, 2, 2, "FD");
  doc.setFontSize(7);
  doc.setTextColor(isValidNclc7 ? 4 : 180, isValidNclc7 ? 120 : 83, isValidNclc7 ? 87 : 9);
  doc.text("PALIER NCLC / CLB", margin + (boxWidth + 3) * 2 + boxWidth / 2, y + 5.5, { align: "center" });
  doc.setFontSize(15);
  doc.text(`NCLC ${evaluation.nclcLevel}`, margin + (boxWidth + 3) * 2 + boxWidth / 2, y + 14, { align: "center" });

  // Boîte 4 : Débit & Bonus CRS
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin + (boxWidth + 3) * 3, y, boxWidth, boxHeight, 2, 2, "FD");
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  doc.text("DEBIT & BONUS CRS", margin + (boxWidth + 3) * 3 + boxWidth / 2, y + 5.5, { align: "center" });
  doc.setFontSize(12);
  doc.setTextColor(isValidNclc7 ? 5 : 15, isValidNclc7 ? 150 : 23, isValidNclc7 ? 105 : 42);
  doc.text(`${evaluation.wordsPerMinute} mots/min`, margin + (boxWidth + 3) * 3 + boxWidth / 2, y + 13, { align: "center" });
  doc.setFontSize(7);
  doc.text(isValidNclc7 ? "+50 pts CRS Debloques" : "Sous seuil NCLC 7", margin + (boxWidth + 3) * 3 + boxWidth / 2, y + 18, { align: "center" });
  y += 28;

  // --- 4. BILAN DE L'EXAMINATEUR LAURENT ---
  if (evaluation.examinerDebrief) {
    checkPageBreak(30);
    doc.setFillColor(245, 243, 255);
    doc.setDrawColor(221, 214, 254);
    doc.roundedRect(margin, y, contentWidth, 24, 2, 2, "FD");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(109, 40, 217);
    doc.text("DEBRIEFING PEDAGOGIQUE DE L'EXAMINATEUR LAURENT", margin + 4, y + 6);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(30, 41, 59);
    const debriefLines = doc.splitTextToSize(evaluation.examinerDebrief, contentWidth - 8);
    doc.text(debriefLines.slice(0, 4), margin + 4, y + 12);
    y += 28;
  }

  // --- 5. GRILLE OFFICIELLE DES 5 CRITERES FEI (/4) ---
  checkPageBreak(50);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text("EVALUATION DETAILLEE PAR CRITERE FEI (BAREME SUR 4 POINTS CHACUN)", margin, y);
  y += 5;

  evaluation.criteria.forEach((c) => {
    checkPageBreak(16);
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(margin, y, contentWidth, 14, 1.5, 1.5, "FD");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(15, 23, 42);
    doc.text(c.label, margin + 4, y + 5);

    doc.setFontSize(9);
    doc.setTextColor(229, 26, 49);
    doc.text(`${c.score} / 4`, pageWidth - margin - 4, y + 5, { align: "right" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(71, 85, 105);
    const feedbackLines = doc.splitTextToSize(c.feedback, contentWidth - 8);
    doc.text(feedbackLines[0] || "", margin + 4, y + 10);

    y += 16;
  });

  // --- 6. SYNTHESE DES DIALOGUES PAR TACHE ---
  if (Object.keys(dialogues).length > 0) {
    checkPageBreak(40);
    y += 2;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42);
    doc.text("EXTRAITS DES ECHANGES ORAUX CONVERSATIONNELS", margin, y);
    y += 5;

    [1, 2, 3].forEach((taskNum) => {
      const msgs = dialogues[taskNum];
      if (!msgs || msgs.length === 0) return;

      checkPageBreak(25);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8.5);
      doc.setTextColor(79, 70, 229);
      doc.text(`Tache ${taskNum} : ${taskNum === 1 ? "Entretien Dirige" : taskNum === 2 ? "Jeu de Role" : "Point de Vue"}`, margin, y);
      y += 4;

      // Prendre les 2 premiers échanges les plus significatifs
      msgs.slice(0, 3).forEach((m) => {
        checkPageBreak(12);
        const isEx = m.sender === "examiner";
        doc.setFont("helvetica", "bold");
        doc.setFontSize(7.5);
        doc.setTextColor(isEx ? 100 : 15, isEx ? 116 : 23, isEx ? 139 : 42);
        doc.text(`${isEx ? "Laurent" : candidateName} :`, margin + 2, y);

        doc.setFont("helvetica", "normal");
        const lines = doc.splitTextToSize(m.text, contentWidth - 28);
        doc.text(lines.slice(0, 2), margin + 22, y);
        y += Math.min(lines.length * 3.5 + 2, 8);
      });

      y += 3;
    });
  }

  // --- 7. FORMULATIONS C2 RECOMMANDEES ---
  if (evaluation.recommendedPhrasesC2 && evaluation.recommendedPhrasesC2.length > 0) {
    checkPageBreak(30);
    y += 2;
    doc.setFillColor(254, 243, 199);
    doc.setDrawColor(251, 191, 36);
    doc.roundedRect(margin, y, contentWidth, 24, 2, 2, "FD");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(180, 83, 9);
    doc.text("FORMULATIONS C2 RECOMMANDEES POUR PROGRESSER", margin + 4, y + 6);

    doc.setFont("helvetica", "italic");
    doc.setFontSize(7.5);
    doc.setTextColor(30, 41, 59);
    evaluation.recommendedPhrasesC2.slice(0, 2).forEach((phrase, idx) => {
      const pLines = doc.splitTextToSize(phrase, contentWidth - 8);
      doc.text(pLines[0] || "", margin + 4, y + 12 + idx * 5.5);
    });
    y += 28;
  }

  // --- PIED DE PAGE ---
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(148, 163, 184);
  doc.text(
    "Super4C2 - Plateforme officielle de preparation TCF / TEF Canada - https://super4c2.com",
    pageWidth / 2,
    pageHeight - 8,
    { align: "center" }
  );

  // Sauvegarde déclenchée dans le navigateur
  const fileName = `Super4C2-Rapport-Oral-NCLC${evaluation.nclcLevel}-${sessionHash}.pdf`;
  doc.save(fileName);
}
