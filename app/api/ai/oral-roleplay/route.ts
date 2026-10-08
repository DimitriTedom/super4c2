import { NextResponse } from "next/server";
import { z } from "zod";
import { generateOralExaminerReplyWithAi } from "@/lib/ai/service";
import { generateSpeechBufferWithElevenLabs, DEFAULT_FRENCH_VOICES } from "@/lib/audio/elevenlabs";

const roleplaySchema = z.object({
  taskIndex: z.number().min(0).max(2),
  candidateSpeech: z.string().min(1),
  history: z
    .array(
      z.object({
        sender: z.enum(["candidate", "examiner"]),
        text: z.string(),
      })
    )
    .optional(),
});

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const parsed = roleplaySchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Paramètres de dialogue invalides." },
        { status: 400 }
      );
    }

    const { taskIndex, candidateSpeech, history } = parsed.data;

    // 1. Priorité au moteur IA direct Next.js (DeepSeek-V3 / OpenAI)
    const taskTitles = [
      "Tâche 1 : Entretien dirigé",
      "Tâche 2 : Jeu de rôle (échange interactif)",
      "Tâche 3 : Monologue suivi d'un échange argumenté",
    ];

    const aiReply = await generateOralExaminerReplyWithAi({
      taskIndex,
      taskTitle: taskTitles[taskIndex] || "Expression Orale TCF",
      candidateSpeech,
      history,
    });

    if (aiReply) {
      // Synthèse audio studio ElevenLabs de la réplique
      const audioBuffer = await generateSpeechBufferWithElevenLabs({
        text: aiReply,
        voiceId: DEFAULT_FRENCH_VOICES.charlie,
      });

      return NextResponse.json({
        ok: true,
        reply: aiReply,
        audioBase64: audioBuffer ? audioBuffer.toString("base64") : null,
        provider: "ai",
      });
    }

    // 2. Moteur de dialogue déterministe certifié FEI en fallback
    const lower = candidateSpeech.toLowerCase();
    let reply = "";

    if (taskIndex === 1) {
      // TÂCHE 2 : JEU DE RÔLE (Ex: Renseignements Cours de Cuisine du Monde)
      if (lower.includes("horaire") || lower.includes("heure") || lower.includes("quand") || lower.includes("jour")) {
        reply = "Les ateliers se déroulent les mardis et jeudis de dix-neuf heures à vingt-et-une heures trente, ainsi que le samedi matin. Seriez-vous plutôt disponible en soirée ou en week-end ?";
      } else if (lower.includes("prix") || lower.includes("tarif") || lower.includes("coût") || lower.includes("combien") || lower.includes("euro") || lower.includes("dollar")) {
        reply = "La séance individuelle est à quarante-cinq euros. Nous proposons également un forfait mensuel de quatre cours à cent cinquante euros avec les fiches recettes offertes. Souhaitez-vous vous inscrire seul ou à deux ?";
      } else if (lower.includes("matériel") || lower.includes("ingrédient") || lower.includes("fourni") || lower.includes("apporter") || lower.includes("couteau") || lower.includes("tablier")) {
        reply = "Tout est entièrement fourni dans notre atelier : tabliers professionnels, ustensiles et produits bio frais de saison. Vous repartez même avec vos préparations dans des contenants recyclables !";
      } else if (lower.includes("débutant") || lower.includes("niveau") || lower.includes("expérience") || lower.includes("difficile") || lower.includes("peur")) {
        reply = "Absolument aucun niveau préalable n'est requis ! Nos chefs formateurs adaptent chaque étape aux débutants complets dans une atmosphère très bienveillante.";
      } else if (lower.includes("nombre") || lower.includes("groupe") || lower.includes("personne") || lower.includes("combien de")) {
        reply = "Nous limitons chaque session à huit participants maximum afin que le chef puisse guider chacun individuellement. Avez-vous une préférence pour un type de cuisine en particulier ?";
      } else if (lower.includes("végétarien") || lower.includes("allergie") || lower.includes("régime") || lower.includes("sans gluten")) {
        reply = "Tout à fait, nous adaptons les recettes sur simple demande préalable lors de la réservation : options végétariennes, sans gluten ou sans lactose.";
      } else if (lower.includes("inscri") || lower.includes("réserver") || lower.includes("paiement") || lower.includes("annul")) {
        reply = "Les inscriptions se font directement en ligne sur notre site ou sur place. Les annulations sont gratuites jusqu'à quarante-huit heures avant l'atelier. Souhaitez-vous d'autres précisions ?";
      } else {
        reply = "C'est un point tout à fait pertinent. Nous tenons beaucoup à la convivialité et à la dégustation commune à la fin de chaque cours. Avez-vous une autre question concernant l'organisation ?";
      }
    } else if (taskIndex === 0) {
      // TÂCHE 1 : ENTRETIEN DIRIGÉ (Présentation personnelle & projet)
      if (lower.includes("canada") || lower.includes("québec") || lower.includes("montréal") || lower.includes("immigration")) {
        reply = "C'est un beau projet d'avenir. Quelles démarches avez-vous déjà entreprises pour préparer votre installation au Canada ?";
      } else if (lower.includes("travail") || lower.includes("métier") || lower.includes("profession") || lower.includes("emploi") || lower.includes("ingénieur") || lower.includes("informati")) {
        reply = "Votre parcours professionnel est très intéressant. Comment comptez-vous valoriser cette expérience sur le marché du travail canadien ?";
      } else {
        reply = "Merci beaucoup pour ce partage. Pouvez-vous me parler d'une expérience ou d'une passion qui vous tient particulièrement à cœur dans votre quotidien ?";
      }
    } else {
      // TÂCHE 3 : EXPRESSION D'UN POINT DE VUE (Monologue & échange argumenté)
      if (lower.includes("écolog") || lower.includes("climat") || lower.includes("environnement") || lower.includes("voiture") || lower.includes("transport")) {
        reply = "Votre argumentation est solide. Toutefois, certains détracteurs affirment que bannir la voiture pénalise les personnes vivant en banlieue éloignée. Que leur répondriez-vous ?";
      } else {
        reply = "Vous défendez votre thèse avec conviction. Cependant, comment concilier cette approche avec les contraintes budgétaires et économiques actuelles ?";
      }
    }

    const fallbackBuffer = await generateSpeechBufferWithElevenLabs({
      text: reply,
      voiceId: DEFAULT_FRENCH_VOICES.charlie,
    });

    return NextResponse.json({
      ok: true,
      reply,
      audioBase64: fallbackBuffer ? fallbackBuffer.toString("base64") : null,
      provider: "heuristic",
    });
  } catch (error) {
    console.error("Erreur roleplay oral :", error);
    return NextResponse.json(
      { error: "Erreur serveur lors de la génération de la réponse orale." },
      { status: 500 }
    );
  }
}
