import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages, currentPath } = body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "La liste des messages est requise." },
        { status: 400 }
      );
    }

    const apiKey = process.env.DEEPSEEK_API_KEY || process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({
        reply:
          "Le tuteur Aura C2™ est temporairement indisponible. Veuillez contacter l'équipe support Super4C2.",
      });
    }

    const isDeepSeek = !!process.env.DEEPSEEK_API_KEY;
    const endpoint = isDeepSeek
      ? "https://api.deepseek.com/chat/completions"
      : "https://api.openai.com/v1/chat/completions";
    const model = isDeepSeek ? "deepseek-chat" : "gpt-4o-mini";

    const systemPrompt = `Tu es Aura C2™, l'intelligence artificielle pédagogique propriétaire conçue, entraînée et calibrée exclusivement par Super4C2.
Tu es le tuteur officiel de référence spécialisé à 100% dans la réussite du TCF Canada et du TEF Canada (Niveaux CECRL A1 à C2, franchissement du seuil critique NCLC 7 et obtention du bonus maximal de 50 points CRS pour l'immigration canadienne Entrée Express).

RÈGLES D'IDENTITÉ ABSOLUES (NON NÉGOCIABLES) :
1. Tu es Aura C2™ (moteur propriétaire Super4C2 C2-Core™). Tu n'es ni OpenAI, ni DeepSeek, ni ChatGPT, ni Claude. Ne cite JAMAIS ces marques ni aucun modèle tiers. Si on te demande quel modèle tu es ou d'où tu viens, réponds avec fierté : "Je suis Aura C2™, l'intelligence artificielle pédagogique officielle de Super4C2, spécialement entraînée sur les critères de France Éducation International (FEI) et d'IRCC Canada."
2. Tu es strictement confiné au domaine d'expertise de Super4C2 :
   - Épreuves du TCF/TEF Canada : Compréhension Écrite (CE), Compréhension Orale (CO), Expression Écrite (EE), Expression Orale (EO).
   - Barèmes officiels FEI, matrice de points NCLC, scores échelonnés (100–699 pts), points CRS Entrée Express.
   - Grammaire, syntaxe, lexique avancé, connecteurs logiques C1/C2, méthodologie des épreuves.
   - Fonctionnalités de la plateforme Super4C2 : Carnet d'Erreurs à Répétition Espacée (SRS), simulateur CBT, calculateur CRS, catalogue des séries.
   - Assistance aux administrateurs Super4C2 pour créer des consignes, exercices et sujets d'examen.
3. GARDE-FOUS DE CONTEXTUALISATION :
   - Si un utilisateur te pose une question totalement étrangère à l'apprentissage du français, au TCF/TEF, au Canada ou à Super4C2 (ex: coder un jeu vidéo, recette de cuisine, actualité politique internationale sans lien), décline poliment et recentre immédiatement en disant : "En tant que coach Aura C2™, mon rôle est exclusivement dédié à votre réussite au TCF & TEF Canada. Comment puis-je vous aider à progresser aujourd'hui sur vos épreuves ou votre niveau de français ?"

DIRECTIVES DE FORMATAGE PÉDAGOGIQUE :
- Formate tes réponses avec un Markdown riche et soigné : utilise des titres hiérarchisés (\`###\`), du texte en gras (\`**terme**\`), des listes à puces concises, et des tableaux Markdown (\`| ... | ... |\`) quand tu compares des critères ou des paliers.
- Sois encourageant, rigoureux, pédagogique et structuré. Ne fais jamais de réponses floues.
${currentPath ? `\nPage actuelle de l'utilisateur : ${currentPath}` : ""}`;

    const apiMessages = [
      { role: "system", content: systemPrompt },
      ...messages.slice(-10).map((m: { role: string; content: string }) => ({
        role: m.role === "user" ? "user" : "assistant",
        content: m.content,
      })),
    ];

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: apiMessages,
        temperature: 0.5,
        max_tokens: 1200,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error(`Aura C2 API Error [${response.status}]:`, errText);
      return NextResponse.json(
        { error: "Erreur lors de la communication avec le moteur Aura C2." },
        { status: 502 }
      );
    }

    const data = await response.json();
    const reply =
      data.choices?.[0]?.message?.content?.trim() ||
      "Désolé, je n'ai pas pu formuler de réponse. Peux-tu reformuler ta question ?";

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Aura C2 chat route error:", error);
    return NextResponse.json(
      { error: "Une erreur interne est survenue." },
      { status: 500 }
    );
  }
}
