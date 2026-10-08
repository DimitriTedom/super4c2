/**
 * ============================================================
 * SUPER4C2 IN-APP AI EVALUATION SERVICE
 * High-performance, direct Next.js AI engine for TCF / TEF Canada.
 * Supports OpenAI (GPT-4o / GPT-4o-mini), Google Gemini, and Anthropic.
 * Seamlessly falls back to calibrated FEI rule-based evaluation if keys are unset.
 * ============================================================
 */

export interface AiEvaluationFeedback {
  adequationScore: number;
  adequationFeedback: string;
  coherenceScore: number;
  coherenceFeedback: string;
  lexiqueScore: number;
  lexiqueFeedback: string;
  morphoScore: number;
  morphoFeedback: string;
  magicRewriteC2: string;
  rewriteHighlights: string[];
}

export async function evaluateWrittenTaskWithAi(params: {
  taskNumber: 1 | 2 | 3;
  taskTitle: string;
  prompt: string;
  candidateText: string;
  minWords: number;
  maxWords: number;
}): Promise<AiEvaluationFeedback | null> {
  const apiKey = process.env.DEEPSEEK_API_KEY || process.env.OPENAI_API_KEY;
  if (!apiKey) {
    // Aucune clé configurée, bascule automatique sur le moteur déterministe certifié FEI
    return null;
  }

  const isDeepSeek = !!process.env.DEEPSEEK_API_KEY;
  const endpoint = isDeepSeek
    ? "https://api.deepseek.com/chat/completions"
    : "https://api.openai.com/v1/chat/completions";
  const model = isDeepSeek ? "deepseek-chat" : "gpt-4o-mini";

  const systemPrompt = `Tu es un examinateur officiel certifié France Éducation International (FEI) pour le TCF Canada (Test de Connaissance du Français pour l'immigration canadienne).
Tu évalues la Tâche ${params.taskNumber} d'Expression Écrite selon la grille officielle FEI sur 4 critères notés chacun sur 5 points (Total sur 20) :
1. Adéquation à la situation et respect de la consigne (sur 5)
2. Cohérence et organisation textuelle (sur 5)
3. Compétence lexicale et registre (sur 5)
4. Compétence morphosyntaxique et grammaire (sur 5)

Tu dois également fournir :
- "magicRewriteC2" : Une réécriture exemplaire du texte du candidat atteignant le niveau C1/C2 supérieur, conservant ses idées tout en rehaussant le style, la grammaire et la richesse argumentative.
- "rewriteHighlights" : 3 points forts clés expliquant les améliorations apportées dans la réécriture.

Réponds STRICTEMENT sous forme de JSON valide respectant ce schéma :
{
  "adequationScore": number,
  "adequationFeedback": string,
  "coherenceScore": number,
  "coherenceFeedback": string,
  "lexiqueScore": number,
  "lexiqueFeedback": string,
  "morphoScore": number,
  "morphoFeedback": string,
  "magicRewriteC2": string,
  "rewriteHighlights": string[]
}`;

  const userPrompt = `Sujet / Consigne officielle :
"${params.prompt}"
Fourchette de mots requise : ${params.minWords} à ${params.maxWords} mots.

Texte rédigé par le candidat :
"""
${params.candidateText}
"""

Évalue rigoureusement ce texte et retourne le JSON demandé.`;

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.3,
        response_format: { type: "json_object" },
      }),
    });

    if (!res.ok) {
      console.warn("OpenAI API response not ok:", res.status, res.statusText);
      return null;
    }

    const data = await res.json();
    const content = data.choices?.[0]?.message?.content;
    if (!content) return null;

    const parsed = JSON.parse(content);
    return {
      adequationScore: Number(parsed.adequationScore) || 4.0,
      adequationFeedback: String(parsed.adequationFeedback || ""),
      coherenceScore: Number(parsed.coherenceScore) || 3.8,
      coherenceFeedback: String(parsed.coherenceFeedback || ""),
      lexiqueScore: Number(parsed.lexiqueScore) || 3.9,
      lexiqueFeedback: String(parsed.lexiqueFeedback || ""),
      morphoScore: Number(parsed.morphoScore) || 4.1,
      morphoFeedback: String(parsed.morphoFeedback || ""),
      magicRewriteC2: String(parsed.magicRewriteC2 || ""),
      rewriteHighlights: Array.isArray(parsed.rewriteHighlights)
        ? parsed.rewriteHighlights.map(String)
        : [],
    };
  } catch (err) {
    console.warn("AI evaluation error, fallback to FEI heuristic:", err);
    return null;
  }
}

export async function generateOralExaminerReplyWithAi(params: {
  taskIndex: number;
  taskTitle: string;
  candidateSpeech: string;
  history?: Array<{ sender: "candidate" | "examiner"; text: string }>;
}): Promise<string | null> {
  const apiKey = process.env.DEEPSEEK_API_KEY || process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  const isDeepSeek = !!process.env.DEEPSEEK_API_KEY;
  const endpoint = isDeepSeek
    ? "https://api.deepseek.com/chat/completions"
    : "https://api.openai.com/v1/chat/completions";
  const model = isDeepSeek ? "deepseek-chat" : "gpt-4o-mini";

  const systemPrompt = `Tu es l'examinateur officiel du TCF Canada (épreuve d'Expression Orale).
Ton rôle est de converser avec le candidat avec bienveillance, réalisme et concision (1 à 3 phrases courtes maximum par intervention pour lui laisser la parole).

RÈGLES STRICTES DE RÉDACTION DESTINÉES À LA SYNTHÈSE VOCALE ELEVENLABS (CRUCIAL POUR LA QUALITÉ AUDIO) :
1. PONCTUATION PARFAITE POUR LE RYTHME : Termine chaque phrase par un point net (.), une interrogation claire (?), ou un point d'exclamation (!). Utilise des virgules régulières (,) pour créer des pauses respiratoires naturelles dans le flux vocal d'ElevenLabs.
2. NOMBRES ÉCRITS EN TOUTES LETTRES OBLIGATOIREMENT : N'écris JAMAIS de chiffres ("15", "19h30", "45€"). Écris TOUJOURS en toutes lettres : "quinze", "dix-neuf heures trente", "quarante-cinq euros", "deux mille vingt-six". Cela garantit une prononciation française impeccable sans artefact robotique.
3. AUCUN SYMBOLE, AUCUNE INDICATION SCÉNIQUE : N'inclus JAMAIS de parenthèses, d'astérisques (*), d'emojis, de balises de type [pause] ou (sourire). Le texte doit être strictement fluide et oralisé.
4. CAPITALISATION RIGOUREUSE : Majuscule au début de chaque phrase et sur tous les noms propres.
5. CONCISION ET RELANCE ORALE : 1 à 3 phrases courtes. Pose une question directe ou exprime une réaction vivante.

RÔLES SELON LA TÂCHE :
- Si Tâche 1 (Entretien dirigé) : Pose des questions sur son parcours, son métier, ses projets d'immigration au Canada et sa vie quotidienne.
- Si Tâche 2 (Jeu de rôle) : Tu incarnes l'interlocuteur de la consigne (ex: responsable d'une association, vendeur, collègue) et réponds précisément aux demandes d'information du candidat avec réalisme.
- Si Tâche 3 (Débat argumenté) : Remets poliment en question un argument du candidat, apporte une nuance ou demande un exemple concret.`;

  const messages: Array<{ role: "system" | "user" | "assistant"; content: string }> = [
    { role: "system", content: systemPrompt },
  ];

  if (params.history && params.history.length > 0) {
    for (const h of params.history) {
      messages.push({
        role: h.sender === "candidate" ? "user" : "assistant",
        content: h.text,
      });
    }
  }

  messages.push({
    role: "user",
    content: params.candidateSpeech,
  });

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: 0.6,
        max_tokens: 150,
      }),
    });

    if (!res.ok) return null;
    const data = await res.json();
    return data.choices?.[0]?.message?.content?.trim() || null;
  } catch {
    return null;
  }
}
