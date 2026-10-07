# Active Context: Super4C2

## 1. Focus Actuel
- **Moteur IA & Acquisition (100% Fonctionnel sans Docker) :**
  - **Évaluation Expression Écrite IA (`/api/ai/evaluate-written`) :** Analyse instantanée des 3 tâches selon la grille officielle FEI (Adéquation, Cohérence, Lexique, Morphosyntaxe) et génération du modèle Magic Rewrite C1/C2 adapté au sujet. Écran d'analyse IA animé dans [`written-exam-editor.tsx`](file:///d:/SnowDev/Documents/super4c2/components/exam/written-exam-editor.tsx).
  - **Expression Orale & SpeechRecognition (`/api/ai/oral-roleplay`) :** Reconnaissance vocale Web Speech API (`SpeechRecognition` / `webkitSpeechRecognition`) branchée sur le micro dans [`oral-exam-room.tsx`](file:///d:/SnowDev/Documents/super4c2/components/exam/oral-exam-room.tsx). L'examinateur IA répond de manière contextuelle avec relances naturelles et synthèse vocale TTS `speechSynthesis`.
  - **Test Diagnostique Express 5 min (`/test-gratuit`) :** Parcours d'évaluation rapide (CE, CO audio simulé, grammaire C1) avec calcul NCLC immédiat, projection des +50 points CRS, et débrief personnalisé. CTA "Essai Gratuit" du header redirige directement vers ce tunnel.
  - **Validation & TypeScript :** 0 erreur (`tsc --noEmit`), dev server opérationnel sur `http://localhost:3000`.

## 2. Décisions Récentes
- **Architecture sans Docker :** Priorité aux fonctionnalités à forte valeur ajoutée directement exécutables sur Next.js (Web Speech API, routes API IA, tunnel diagnostique, WebGL Globe).

## 3. Prochaines Étapes Immédiates
1. Tunnel de paiement Stripe pour les abonnements sur `/tarifs` (sessions checkout sans dépendance Docker).
2. Seed Prisma étendu et persistance des résultats de diagnostic et d'épreuves.


