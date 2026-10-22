const fs = require('fs');
const path = require('path');

async function main() {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) {
    console.error('Missing ELEVENLABS_API_KEY');
    process.exit(1);
  }

  const voiceId = 'IKne3meq5aSn9XLyUdCD'; // Charlie / Laurent Mercier
  const text = "Bonjour et bienvenue dans l'espace d'Expression Écrite du TCF Canada. Je suis votre mentor de formation. Voici la structure de votre préparation : d'abord, la présentation détaillée de l'épreuve et des 4 critères officiels de notation sur 5 points. Ensuite, la méthodologie étape par étape de chacune des 3 tâches avec exercices d'application concrets et corrigés de niveau C1/C2. Enfin, l'examen blanc officiel en 60 minutes réelles avec barre de temps. Commençons sans attendre par la présentation de l'épreuve.";

  console.log('Sending request to ElevenLabs for Laurent Mercier (Charlie)...');
  const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'xi-api-key': apiKey,
    },
    body: JSON.stringify({
      text,
      model_id: 'eleven_multilingual_v2',
      voice_settings: {
        stability: 0.55,
        similarity_boost: 0.78,
        style: 0.15,
        use_speaker_boost: true,
      },
    }),
  });

  if (!res.ok) {
    console.error(`ElevenLabs Error [${res.status}]:`, await res.text());
    process.exit(1);
  }

  const arrayBuffer = await res.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const outDir = path.join(process.cwd(), 'public', 'audio', 'ee');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const outFile = path.join(outDir, 'laurent-methodologie.mp3');
  fs.writeFileSync(outFile, buffer);
  console.log(`✅ Fichier audio généré avec succès : ${outFile} (${buffer.length} octets)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
