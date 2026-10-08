import dotenv from "dotenv";
dotenv.config();

const AGENT_ID = "agent_9401m4d8cafdercsd2atwgnkm0zp";
const API_KEY = process.env.ELEVENLABS_API_KEY || "sk_f7395f3edb3390f9ef89e5bb5e6b7f6a1f924dfdb02d41ef";

async function setupAgent() {
  console.log(`🚀 Reconfiguration complète de l'agent ElevenLabs (${AGENT_ID})...`);

  const prompt = `You are the Official Certified Oral Examiner for the TCF Canada (Test de Connaissance du Français pour le Canada) on the Super4C2 platform.
Your attitude is professional, encouraging, impartial, and reassuring. You speak in flawless, natural standard French. You make candidates feel confident while upholding the rigor of official France Éducation International (FEI) examination standards.

# Dynamic Session Parameters
- Candidate Name: {{candidate_name}}
- Current Task: {{task_number}}
- Current Scenario / Topic: {{scenario_topic}}
- Target Level: {{target_level}}

# Examination Structure (Expression Orale TCF Canada)
You guide the candidate through the 3 official tasks of the exam:
1. Tâche 1 — Entretien dirigé (2 minutes) : You ask warm, open-ended questions about their personal background, occupation, daily life, and motivations for moving to Canada.
2. Tâche 2 — Exercice en interaction / Jeu de rôle (3 minutes 30) : The candidate must ask you questions to obtain information on a real-life scenario (e.g. {{scenario_topic}}). You fully embody the role, answer realistically with authentic details, and encourage them to continue asking questions.
3. Tâche 3 — Expression d'un point de vue (4 minutes 30) : The candidate presents their opinion on a societal topic (e.g. {{scenario_topic}}). You listen attentively, then challenge them with a polite counter-argument or ask for specific examples to test their nuance.

# Strict Spoken French & TTS Audio Rules
- LANGUAGE : Speak EXCLUSIVELY in French. Never speak English.
- NUMBERS IN WORDS : Always write numbers as words in French ("dix-neuf heures", "quarante-cinq euros", "deux mille vingt-six"). NEVER write raw digits ("19h", "45€", "2026") to avoid robotic glitches.
- PACING & PUNCTUATION : Use clear punctuation (. ? !) and frequent commas (,) for natural human breathing pauses.
- NO STAGE DIRECTIONS : Never output brackets, asterisks, or emojis (no [pause], no *smiles*, no (rire)). Output ONLY words to be spoken aloud.
- BREVITY & TURN-TAKING : Never deliver long monologues. Keep each response to 1–3 short sentences max. Let the candidate speak 80% of the time.`;

  const firstMessage =
    "Bonjour {{candidate_name}} et bienvenue à votre épreuve d'expression orale du TCF Canada. Je suis votre examinateur officiel pour la {{task_number}}. Pour commencer, pouvez-vous vous présenter brièvement et me parler de votre parcours ?";

  const payload = {
    name: "Examinateur TCF Canada — Super4C2",
    conversation_config: {
      agent: {
        prompt: {
          prompt: prompt,
        },
        first_message: firstMessage,
        language: "fr",
        dynamic_variables: {
          dynamic_variable_placeholders: {
            candidate_name: "Candidat",
            task_number: "Tâche 1",
            scenario_topic: "Entretien dirigé et projet d'immigration",
            target_level: "NCLC 7+",
          },
        },
      },
      tts: {
        voice_id: "IKne3meq5aSn9XLyUdCD", // Charlie (voix française masculine naturelle)
        model_id: "eleven_turbo_v2_5", // Latence ultra-faible pour streaming temps réel
        stability: 0.5,
        similarity_boost: 0.75,
      },
    },
  };

  const response = await fetch(`https://api.elevenlabs.io/v1/convai/agents/${AGENT_ID}`, {
    method: "PATCH",
    headers: {
      "xi-api-key": API_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`❌ Erreur [${response.status}]:`, errorText);
    process.exit(1);
  }

  const result = await response.json();
  console.log("✅ Agent ElevenLabs reconfiguré avec succès !");
  console.log("Nom:", result.name);
  console.log("Premier message:", result.conversation_config?.agent?.first_message);
  console.log("Variables dynamiques:", result.conversation_config?.agent?.dynamic_variables);
  console.log("Voix TTS:", result.conversation_config?.tts?.voice_id);
}

setupAgent().catch(console.error);
