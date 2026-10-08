import { NextResponse } from "next/server";

const DEFAULT_AGENT_ID =
  process.env.ELEVENLABS_AGENT_ID || "agent_9401m4d8cafdercsd2atwgnkm0zp";

export async function GET(req: Request) {
  try {
    const apiKey = process.env.ELEVENLABS_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "Clé API ElevenLabs non configurée." },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(req.url);
    const agentId = searchParams.get("agent_id") || DEFAULT_AGENT_ID;

    const response = await fetch(
      `https://api.elevenlabs.io/v1/convai/conversation/get-signed-url?agent_id=${encodeURIComponent(
        agentId
      )}`,
      {
        headers: {
          "xi-api-key": apiKey,
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[ElevenLabs ConvAI] Erreur signed URL:", response.status, errorText);
      return NextResponse.json(
        { error: "Impossible de générer l'URL signée de conversation." },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json({
      ok: true,
      signedUrl: data.signed_url,
      agentId,
    });
  } catch (error) {
    console.error("[ElevenLabs ConvAI] Exception:", error);
    return NextResponse.json(
      { error: "Erreur serveur lors de l'initialisation de l'appel." },
      { status: 500 }
    );
  }
}
