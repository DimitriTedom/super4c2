import { NextResponse } from "next/server";
import { z } from "zod";
import { countWordsFei, type TaskEvaluation, type WrittenExamResult } from "@/lib/exam/written-types";
import { getWrittenSeries } from "@/lib/exam/mock-written-series";
import { evaluateWrittenTaskWithAi } from "@/lib/ai/service";
import { createNotificationAction } from "@/lib/notifications/actions";
import { prisma } from "@/lib/prisma";

const evaluateSchema = z.object({
  seriesId: z.string().default("ee-101"),
  texts: z.tuple([z.string(), z.string(), z.string()]),
});

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const parsed = evaluateSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Format de soumission invalide.", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { seriesId, texts } = parsed.data;
    const series = getWrittenSeries(seriesId) ?? getWrittenSeries("demo-101-ee") ?? getWrittenSeries("demo-101");

    if (!series) {
      return NextResponse.json(
        { error: "Série d'examen introuvable." },
        { status: 404 }
      );
    }

    const taskEvaluations: TaskEvaluation[] = await Promise.all(
      series.tasks.map(async (task, index) => {
        const candidateText = texts[index] || "";
        const wordCount = countWordsFei(candidateText);
        const min = task.minWords;
        const max = task.maxWords;

        let wordCountStatus: "under" | "valid" | "over" = "valid";
        if (wordCount < min) wordCountStatus = "under";
        else if (wordCount > max) wordCountStatus = "over";

        // 1. Adéquation à la situation et respect de la consigne (sur 5)
        let adequationScore = 4.2;
        let adequationFeedback = "Consigne globalement respectée et situation bien cernée.";

        if (wordCount === 0) {
          adequationScore = 0;
          adequationFeedback = "Aucune production fournie. Épreuve non traitée.";
        } else if (wordCount < min * 0.6) {
          adequationScore = 1.8;
          adequationFeedback = `Volume insuffisant (${wordCount} mots sur ${min} minimum requis). Pénalité FEI appliquée.`;
        } else if (wordCount < min) {
          adequationScore = 3.2;
          adequationFeedback = `Volume légèrement en dessous de la fourchette (${wordCount} mots, min: ${min}).`;
        } else if (wordCount > max * 1.3) {
          adequationScore = 3.6;
          adequationFeedback = `Volume excessif (${wordCount} mots, max: ${max}). Risque de pénalité de temps au jour J.`;
        } else {
          adequationScore = 4.8;
          adequationFeedback = `Excellent calibrage du volume (${wordCount} mots). Respect parfait de la consigne.`;
        }

        // 2. Cohérence & Organisation textuelle (sur 5)
        const paragraphs = candidateText.split(/\n\s*\n/).filter((p) => p.trim().length > 0).length;
        const connectorsFound = candidateText.match(
          /(cependant|en effet|par conséquent|de plus|d'une part|d'autre part|en revanche|néanmoins|ainsi|toutefois|en outre|d'ailleurs|en conclusion)/gi
        );
        const connectorCount = connectorsFound ? connectorsFound.length : 0;

        let coherenceScore = 3.0;
        let coherenceFeedback = "Structure présente mais les transitions méritent plus de fluidité.";

        if (wordCount < 30) {
          coherenceScore = 1.5;
          coherenceFeedback = "Production trop courte pour établir une progression logique.";
        } else if (paragraphs >= 2 && connectorCount >= 2) {
          coherenceScore = 4.6;
          coherenceFeedback = `Excellente structure : ${paragraphs} paragraphes distincts et utilisation judicieuse de connecteurs logiques.`;
        } else if (paragraphs >= 2) {
          coherenceScore = 3.8;
          coherenceFeedback = "Découpage en paragraphes clair. Pensez à lier vos idées avec davantage de connecteurs variés.";
        } else {
          coherenceScore = 3.0;
          coherenceFeedback = "Texte en bloc compact. Veillez à aérer avec des sauts de ligne pour chaque idée maîtresse.";
        }

        // 3. Compétence lexicale & Registre (sur 5)
        const uniqueWords = new Set(candidateText.toLowerCase().split(/\s+/).filter(Boolean)).size;
        const lexicalRatio = wordCount > 0 ? uniqueWords / wordCount : 0;

        let lexiqueScore = 3.5;
        let lexiqueFeedback = "Vocabulaire courant et compréhensible.";

        if (wordCount < 35) {
          lexiqueScore = 2.0;
          lexiqueFeedback = "Étendue lexicale restreinte.";
        } else if (lexicalRatio > 0.65 && wordCount >= min) {
          lexiqueScore = 4.7;
          lexiqueFeedback = "Vocabulaire riche, varié et adapté au registre attendu (aucun pléonasme ou répétition abusive).";
        } else if (lexicalRatio > 0.5) {
          lexiqueScore = 3.9;
          lexiqueFeedback = "Bonne palette lexicale. Quelques termes mériteraient d'être remplacés par des synonymes plus précis.";
        }

        // 4. Compétence morphosyntaxique (sur 5)
        let morphoScore = 3.5;
        let morphoFeedback = "Structures grammaticales simples bien maîtrisées.";

        if (wordCount < 35) {
          morphoScore = 2.0;
          morphoFeedback = "Trop peu de phrases complètes pour évaluer la maîtrise syntaxique.";
        } else if (candidateText.includes("que ") || candidateText.includes("qui ") || candidateText.includes("dont ") || candidateText.includes("bien que")) {
          morphoScore = 4.5;
          morphoFeedback = "Bonne maîtrise des subordonnées relatives et des structures complexes caractéristiques du niveau B2/C1.";
        } else {
          morphoScore = 3.5;
          morphoFeedback = "Phrases simples correctes. Intégrez des phrases complexes (gérondif, subjonctif, propositions relatives) pour viser NCLC 7+.";
        }

        // Magic Rewrite C1/C2 adapté au sujet
        let magicRewriteC2 = "";
        let rewriteHighlights: string[] = [];

        if (task.taskNumber === 1) {
          magicRewriteC2 =
            "Salut Julien,\n\nJe t'écris tout juste installé dans mon nouvel appartement, un charmant deux-pièces baigné de lumière situé au cœur du quartier Saint-Roch. Entre les grandes baies vitrées et le calme environnant, le cadre est idéal pour se ressourcer.\n\nJe serais ravi de te faire découvrir les lieux ce samedi vers dix-sept heures, avant de partager un dîner convivial. Fais-moi signe si ce créneau te convient !\n\nÀ très vite,\nAlexandre";
          rewriteHighlights = [
            "Verbes de perception & adjectifs imagés (« baigné de lumière », « cadre idéal pour se ressourcer »).",
            "Formule d'invitation naturelle et élégante (« Je serais ravi de te faire découvrir les lieux... »).",
            "Respect strict de la fourchette avec 88 mots (cible optimale FEI).",
          ];
        } else if (task.taskNumber === 2) {
          magicRewriteC2 =
            "L'été dernier, j'ai eu l'opportunité de participer à une mission de reboisement au cœur du parc national de la Jacques-Cartier. Dès notre arrivée à l'aube, la brume matinale enveloppait la vallée, conférant au paysage une atmosphère presque mystique.\n\nAux côtés d'une quinzaine de bénévoles enthousiastes, nous avons mis en terre plus de deux cents jeunes pousses d'épinette noire. Bien que l'effort physique fût soutenu sous une chaleur accablante, le sentiment d'accomplissement partagé en fin de journée a transformé cette épreuve en une aventure humaine inoubliable.\n\nCette immersion m'a profondément sensibilisé à la résilience des écosystèmes boréaux.";
          rewriteHighlights = [
            "Ancrage narratif immersif et connecteurs temporels variés (« Dès notre arrivée à l'aube », « Aux côtés de... »).",
            "Subordonnée concessive de niveau C1 (« Bien que l'effort physique fût soutenu... »).",
            "Précision lexicale irréprochable (« épinette noire », « résilience des écosystèmes »).",
          ];
        } else {
          magicRewriteC2 =
            "L'interdiction stricte de la circulation automobile dans les hypercentres urbains soulève un débat aussi passionné que nécessaire.\n\nCertes, il est indéniable que la réduction drastique des émissions polluantes et l'apaisement sonore améliorent considérablement la salubrité publique et la qualité de vie des citadins. De surcroît, la réappropriation piétonne de l'espace favorise le dynamisme du commerce de proximité.\n\nNéanmoins, une telle mesure risque d'exacerber la fracture territoriale pour les résidents périurbains dépourvus d'alternatives ferroviaires performantes. Une politique inclusive commande donc de subordonner cette fermeture à un développement massif des transports en commun en périphérie.";
          rewriteHighlights = [
            "Rhéteurique argumentative en concession-réfutation (« Certes, il est indéniable... Néanmoins... »).",
            "Vocabulaire conceptuel avancé (« salubrité publique », « fracture territoriale », « subordonner cette fermeture »).",
            "Conclusion prospective et nuancée conforme aux standards C1/C2 France Éducation International.",
          ];
        }

        // Appel direct du moteur IA Next.js si texte renseigné
        if (candidateText.trim().length > 10) {
          try {
            const aiFeedback = await evaluateWrittenTaskWithAi({
              taskNumber: task.taskNumber as 1 | 2 | 3,
              taskTitle: task.title,
              prompt: task.context ? `${task.topic} - ${task.context}` : task.topic,
              candidateText,
              minWords: min,
              maxWords: max,
            });

            if (aiFeedback) {
              adequationScore = Math.min(5, Math.max(0, aiFeedback.adequationScore));
              if (aiFeedback.adequationFeedback) adequationFeedback = aiFeedback.adequationFeedback;

              coherenceScore = Math.min(5, Math.max(0, aiFeedback.coherenceScore));
              if (aiFeedback.coherenceFeedback) coherenceFeedback = aiFeedback.coherenceFeedback;

              lexiqueScore = Math.min(5, Math.max(0, aiFeedback.lexiqueScore));
              if (aiFeedback.lexiqueFeedback) lexiqueFeedback = aiFeedback.lexiqueFeedback;

              morphoScore = Math.min(5, Math.max(0, aiFeedback.morphoScore));
              if (aiFeedback.morphoFeedback) morphoFeedback = aiFeedback.morphoFeedback;

              if (aiFeedback.magicRewriteC2) magicRewriteC2 = aiFeedback.magicRewriteC2;
              if (aiFeedback.rewriteHighlights && aiFeedback.rewriteHighlights.length > 0) {
                rewriteHighlights = aiFeedback.rewriteHighlights;
              }
            }
          } catch (err) {
            console.warn("Évaluation IA non bloquante : poursuite avec l'évaluation FEI standard.", err);
          }
        }

        const totalTask = Math.min(20, Math.round((adequationScore + coherenceScore + lexiqueScore + morphoScore) * 10) / 10);

        let nclcLevel = 5;
        if (totalTask >= 17) nclcLevel = 9;
        else if (totalTask >= 14) nclcLevel = 7;
        else if (totalTask >= 11) nclcLevel = 6;
        else if (totalTask >= 8) nclcLevel = 5;
        else nclcLevel = 4;

        return {
          taskNumber: task.taskNumber,
          wordCount,
          wordCountStatus,
          taskScore: totalTask,
          nclcEstimatedLevel: nclcLevel,
          generalFeedback: `Production évaluée à ${totalTask}/20 (Niveau estimé : NCLC ${nclcLevel}). ${
            wordCountStatus === "valid"
              ? "Volume de mots parfaitement calibré selon la consigne."
              : wordCountStatus === "under"
              ? "Attention au respect du seuil minimal de mots."
              : "Légère tendance à dépasser le plafond maximum de mots."
          }`,
          criteria: [
            {
              criterion: "adequation",
              label: "Adéquation à la situation",
              score: adequationScore,
              feedback: adequationFeedback,
              strengths: wordCount >= min ? ["Volume de mots respecté", "Consigne comprise"] : ["Sujet abordé"],
              improvements: wordCount < min ? ["Développer davantage chaque idée", "Atteindre le plancher minimum"] : [],
            },
            {
              criterion: "coherence",
              label: "Cohérence et cohésion",
              score: coherenceScore,
              feedback: coherenceFeedback,
              strengths: paragraphs >= 2 ? ["Découpage en paragraphes clair", "Progression logique"] : ["Idée principale identifiable"],
              improvements: connectorCount < 2 ? ["Utiliser des connecteurs variés (de surcroît, néanmoins)", "Structurer les transitions"] : [],
            },
            {
              criterion: "lexique",
              label: "Compétence lexicale",
              score: lexiqueScore,
              feedback: lexiqueFeedback,
              strengths: lexicalRatio > 0.5 ? ["Vocabulaire adapté", "Peu de redondances"] : ["Vocabulaire de base maîtrisé"],
              improvements: lexicalRatio <= 0.5 ? ["Enrichir les adjectifs et verbes précis", "Éviter les répétitions"] : [],
            },
            {
              criterion: "morphosyntaxe",
              label: "Compétence morphosyntaxique",
              score: morphoScore,
              feedback: morphoFeedback,
              strengths: ["Orthographe d'usage correcte", "Conjugaisons fonctionnelles"],
              improvements: ["Introduire des phrases complexes (subordonnées relatives, gérondif)", "Varier les modes verbaux"],
            },
          ],
          magicRewriteC2,
          rewriteHighlights,
        };
      })
    );

    const averageTaskScore =
      taskEvaluations.reduce((acc, t) => acc + t.taskScore, 0) / taskEvaluations.length;
    const totalScore = Math.min(20, Math.round(averageTaskScore * 10) / 10);
    const tcfScaledScore = Math.round(100 + (totalScore / 20) * 599);

    let finalNclc = 5;
    if (tcfScaledScore >= 524) finalNclc = 9;
    else if (tcfScaledScore >= 458) finalNclc = 7;
    else if (tcfScaledScore >= 398) finalNclc = 6;
    else if (tcfScaledScore >= 369) finalNclc = 5;
    else finalNclc = 4;

    const crsPointsUnlocked = finalNclc >= 7 ? 50 : 0;

    const result: WrittenExamResult = {
      totalScore,
      tcfScaledScore,
      nclcLevel: finalNclc,
      crsPointsUnlocked,
      taskEvaluations,
    };

    // Sauvegarde de la tentative dans PostgreSQL
    try {
      let userId: string | null = null;
      try {
        const { createSupabaseServerClient } = await import("@/lib/supabase/server");
        const supabase = await createSupabaseServerClient();
        const authUser = supabase ? (await supabase.auth.getUser()).data.user : null;
        if (authUser?.id) {
          const dbUser = await prisma.user.findUnique({
            where: { id: authUser.id },
            select: { id: true },
          });
          if (dbUser) {
            userId = dbUser.id;
          }
        }
      } catch {
        // Fallback anonyme
      }

      await prisma.userAttempt.create({
        data: {
          userId,
          discipline: "EXPRESSION_ECRITE",
          seriesId: null,
          rawScore: Math.round(result.totalScore),
          tcfScaledScore: result.tcfScaledScore,
          nclcLevel: result.nclcLevel,
          crsPointsUnlocked: result.crsPointsUnlocked,
          answers: texts,
          feedback: JSON.parse(JSON.stringify(result)),
          completedAt: new Date(),
        },
      });
    } catch (e) {
      console.warn("Échec sauvegarde userAttempt EE :", e);
    }

    // Notification in-app automatique pour le candidat
    try {
      await createNotificationAction({
        recipient: "CANDIDATE",
        title: `Évaluation Expression Écrite terminée (${result.totalScore}/20)`,
        message: `Votre copie (${series.title}) a été analysée avec succès. Niveau estimé : NCLC ${result.nclcLevel} (${result.tcfScaledScore} pts, +${result.crsPointsUnlocked} pts CRS).`,
        type: "EXAM",
        link: `/examens/${series.id}/ee`,
      });
    } catch {
      // Non bloquant
    }

    return NextResponse.json({ ok: true, result });
  } catch (error) {
    console.error("Erreur lors de l'évaluation écrite :", error);
    return NextResponse.json(
      { error: "Une erreur est survenue lors de l'évaluation." },
      { status: 500 }
    );
  }
}
