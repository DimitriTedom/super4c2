const API_KEY = "sk_f7395f3edb3390f9ef89e5bb5e6b7f6a1f924dfdb02d41ef";

async function run() {
  console.log("Fetching agents from ElevenLabs...");
  const res = await fetch("https://api.elevenlabs.io/v1/convai/agents", {
    headers: { "xi-api-key": API_KEY }
  });
  console.log("Status:", res.status);
  const data = await res.json();
  console.log("Agents:", JSON.stringify(data, null, 2));
}

run().catch(console.error);
