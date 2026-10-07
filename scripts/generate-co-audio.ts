import path from "path";
import dotenv from "dotenv";
dotenv.config();

import { QUESTIONS_CO_101 } from "../lib/exam/series-co-101";
import { generateSpeechWithElevenLabs, DEFAULT_FRENCH_VOICES } from "../lib/audio/elevenlabs";

async function main() {
  const args = process.argv.slice(2);
  const count = args[0] ? parseInt(args[0], 10) : 5; // Par défaut, générer les 5 premières questions pour tester le quota

  console.log(`🎙️ Génération de ${count} fichiers audio studio via ElevenLabs pour la Série 101 CO...`);

  const questionsToProcess = QUESTIONS_CO_101.slice(0, count);

  for (const q of questionsToProcess) {
    if (!q.audioTranscript) continue;

    const filename = `co-101-q${q.questionNumber}.mp3`;
    const outputPath = path.join(process.cwd(), "public", "audio", "co", filename);

    // Alternance de voix (féminine pour les annonces, masculine pour les conversations)
    const voiceId =
      q.questionNumber % 2 === 0
        ? DEFAULT_FRENCH_VOICES.charlie
        : DEFAULT_FRENCH_VOICES.sarah;

    console.log(`⏳ Génération Q${q.questionNumber} (${q.audioTranscript.length} car.) -> ${filename}...`);
    const success = await generateSpeechWithElevenLabs({
      text: q.audioTranscript,
      outputPath,
      voiceId,
    });

    if (!success) {
      console.error(`❌ Échec pour la question ${q.questionNumber}`);
      break;
    }
  }

  console.log("✨ Génération terminée !");
}

main().catch(console.error);
