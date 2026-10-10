import fs from "fs";
import path from "path";
import dotenv from "dotenv";
dotenv.config();

import { QUESTIONS_CO_101 } from "../lib/exam/series-co-101";
import { generateSpeechWithElevenLabs, DEFAULT_FRENCH_VOICES } from "../lib/audio/elevenlabs";

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  const args = process.argv.slice(2);
  let startQ = 1;
  let endQ = 39;

  if (args.length >= 2) {
    startQ = parseInt(args[0], 10);
    endQ = parseInt(args[1], 10);
  } else if (args.length === 1) {
    endQ = parseInt(args[0], 10);
  }

  console.log(`🎙️ Traitement audio pour Série 101 CO (Questions Q${startQ} à Q${endQ})...`);

  const questionsToProcess = QUESTIONS_CO_101.filter(
    (q) => q.questionNumber >= startQ && q.questionNumber <= endQ
  );

  console.log(`📋 ${questionsToProcess.length} question(s) sélectionnée(s).`);

  let generatedCount = 0;
  let skippedCount = 0;
  let errorCount = 0;

  for (const q of questionsToProcess) {
    if (!q.audioTranscript) {
      console.warn(`⚠️ Question Q${q.questionNumber} : aucun transcript audio défini.`);
      continue;
    }

    const filename = `co-101-q${q.questionNumber}.mp3`;
    const outputPath = path.join(process.cwd(), "public", "audio", "co", filename);

    if (fs.existsSync(outputPath)) {
      console.log(`⏩ Q${q.questionNumber} ignorée : ${filename} existe déjà (${fs.statSync(outputPath).size} octets).`);
      skippedCount++;
      continue;
    }

    // Alternance de voix (Sarah / Charlie)
    const voiceId =
      q.questionNumber % 2 === 0
        ? DEFAULT_FRENCH_VOICES.charlie
        : DEFAULT_FRENCH_VOICES.sarah;
    const voiceName = q.questionNumber % 2 === 0 ? "Charlie (M)" : "Sarah (F)";

    console.log(`⏳ Génération Q${q.questionNumber} [Voix: ${voiceName}] (${q.audioTranscript.length} car.) -> ${filename}...`);
    const success = await generateSpeechWithElevenLabs({
      text: q.audioTranscript,
      outputPath,
      voiceId,
    });

    if (!success) {
      console.error(`❌ Échec de génération pour la question Q${q.questionNumber}`);
      errorCount++;
      break;
    }

    generatedCount++;
    // Pause de courtoisie pour éviter le rate-limiting
    await sleep(1200);
  }

  console.log(`\n✨ Résumé :`);
  console.log(`   - Fichiers générés : ${generatedCount}`);
  console.log(`   - Fichiers déjà existants (conservés) : ${skippedCount}`);
  console.log(`   - Échecs : ${errorCount}`);
}

main().catch(console.error);
