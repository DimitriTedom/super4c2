import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages, context } = body;

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
          "Le tuteur IA est temporairement indisponible (clé API non configurée). Veuillez contacter un administrateur.",
      });
    }

    const isDeepSeek = !!process.env.DEEPSEEK_API_KEY;
    const endpoint = isDeepSeek
      ? "https://api.deepseek.com/chat/completions"
      : "https://api.openai.com/v1/chat/completions";
    const model = isDeepSeek ? "deepseek-chat" : "gpt-4o-mini";

    const systemPrompt = `Tu es l'Assistant & Coach Officiel de Super4C2, expert de référence pour la préparation au TCF Canada et TEF Canada (immigration canadienne Express Entry / NCLC 7 à 10+).

Ton rôle :
1. Pour les candidats : Tu réponds à toutes leurs questions pédagogiques avec clarté, bienveillance et rigueur académique (stratégies d'examen, grammaire, pièges de Compréhension Écrite/Orale, structures pour l'Expression Écrite et Orale, calcul des scores NCLC et points CRS).
2. Pour les administrateurs : Tu les aides à concevoir des exercices, trouver des thèmes d'actualité pour les tâches d'écriture, rédiger des consignes authentiques et calibrer des questions à choix multiples.
3. Style et ton : Encourageant, structuré, précis, en français soigné. Utilise des listes à puces ou des exemples concrets quand c'est pertinent.
${context ? `Contexte actuel de la page : ${context}` : ""}`;

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
        temperature: 0.6,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error(`AI Chat API Error [${response.status}]:`, errText);
      return NextResponse.json(
        { error: "Erreur lors de la communication avec le moteur IA." },
        { status: 502 }
      );
    }

    const data = await response.json();
    const reply =
      data.choices?.[0]?.message?.content?.trim() ||
      "Désolé, je n'ai pas pu formuler de réponse. Peux-tu reformuler ta question ?";

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Chat route error:", error);
    return NextResponse.json(
      { error: "Une erreur interne est survenue." },
      { status: 500 }
    );
  }
}
