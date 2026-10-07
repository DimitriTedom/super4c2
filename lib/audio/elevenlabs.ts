import fs from "fs";
import path from "path";

export interface ElevenLabsSpeechParams {
  text: string;
  outputPath: string;
  voiceId?: string;
  modelId?: string;
}

// Voix françaises naturelles et expressives par défaut
export const DEFAULT_FRENCH_VOICES = {
  sarah: "EXAVITQu4vr4xnSDxMaL", // Voix féminine posée, annonce officielle
  charlie: "IKne3meq5aSn9XLyUdCD", // Voix masculine dynamique
  george: "JBFqnCBsd6RMkjVDRZzb", // Voix masculine chaleureuse
} as const;

export async function generateSpeechWithElevenLabs({
  text,
  outputPath,
  voiceId = DEFAULT_FRENCH_VOICES.sarah,
  modelId = "eleven_multilingual_v2",
}: ElevenLabsSpeechParams): Promise<boolean> {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) {
    console.warn("⚠️ ELEVENLABS_API_KEY absente dans les variables d'environnement.");
    return false;
  }

  try {
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "xi-api-key": apiKey,
      },
      body: JSON.stringify({
        text,
        model_id: modelId,
        voice_settings: {
          stability: 0.55,
          similarity_boost: 0.78,
          style: 0.15,
          use_speaker_boost: true,
        },
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error(`Erreur ElevenLabs [${response.status}]:`, errText);
      return false;
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(outputPath, buffer);
    console.log(`✅ Fichier audio généré avec succès : ${outputPath} (${buffer.length} octets)`);
    return true;
  } catch (error) {
    console.error("Échec de la génération audio ElevenLabs :", error);
    return false;
  }
}
