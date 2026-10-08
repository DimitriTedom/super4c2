import { NextResponse } from "next/server";
import { generateSpeechBufferWithElevenLabs, DEFAULT_FRENCH_VOICES } from "@/lib/audio/elevenlabs";

export async function POST(req: Request) {
  try {
    const { text, voiceId } = await req.json();

    if (!text || typeof text !== "string") {
      return NextResponse.json(
        { error: "Texte manquant pour la synthèse vocale." },
        { status: 400 }
      );
    }

    const audioBuffer = await generateSpeechBufferWithElevenLabs({
      text,
      voiceId: voiceId || DEFAULT_FRENCH_VOICES.charlie,
      modelId: "eleven_turbo_v2_5",
    });

    if (!audioBuffer) {
      return NextResponse.json(
        { error: "Échec de génération audio ElevenLabs." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      audioBase64: audioBuffer.toString("base64"),
    });
  } catch (error) {
    console.error("[Oral TTS Route] Erreur:", error);
    return NextResponse.json(
      { error: "Erreur serveur lors de la synthèse vocale." },
      { status: 500 }
    );
  }
}
