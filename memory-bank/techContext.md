# Tech Context: Super4C2

## 1. Technologies & Dépendances
- **Framework :** Next.js 15 (App Router), React 19, TypeScript 5.
- **Styling & UI :** Tailwind CSS, Shadcn UI (`components.json`), Framer Motion, Lucide Icons, Sonner (Toasts).
- **ORM & Base de données :** Prisma 6 + Supabase PostgreSQL.
- **Authentification :** Supabase Auth SSR (`@supabase/ssr`).
- **Validation :** Zod + React Hook Form (`@hookform/resolvers`).
- **Audio & Multimédia :** Web Audio API, MediaRecorder, WaveSurfer.js.
- **Intelligence Artificielle :**
  - Correction écrite : OpenAI (GPT-4o) / Claude 3.5 Sonnet avec prompts calibrés FEI.
  - Transcription & Évaluation orale : Whisper API / Groq Whisper + Cartesia / ElevenLabs pour la voix québécoise/française.
- **Paiements :** Stripe SDK (+ passerelle Mobile Money pour zones Afrique francophone).

## 2. Contraintes Techniques
- Zéro dépendance superflue : respecter le design system unifié Shadcn/Tailwind.
- Performance audio : chargement streaming des pistes de Compréhension Orale.
- Mode Hors-ligne / Résilience réseau : buffering des réponses d'examen pour éviter toute déconnexion fatale.
