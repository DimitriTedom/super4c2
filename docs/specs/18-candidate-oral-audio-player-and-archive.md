# Spécification Technique 18 — Lecteur Audio de Réécoute Candidat & Archivage des Sessions Orales (V1)

## 1. Contexte & Problématique
Lors de la simulation d'Expression Orale (12 minutes face à l'examinateur IA M. Laurent Mercier), un mixage audio bicanal (micro candidat + voix de Laurent) est enregistré en continu au format WebM/Opus. 
Jusqu'alors, cette archive audio était uniquement accessible immédiatement après l'épreuve dans la vue de résultat temporaire (`OralDebriefCard`). Lorsque le candidat revenait ultérieurement dans son espace historique (`/dashboard/historique/[attemptId]`), il ne disposait que de la retranscription textuelle et de la note chiffrée FEI.

## 2. Objectifs Pédagogiques & UX
1. **Écoute Réflexive :** Permettre au candidat de réécouter sa propre prestation pour prendre conscience de son intonation, de ses hésitations vocales, de ses temps de pause et de son débit réel (mots/min).
2. **Navigation Synchronisée par Tâche :** Pouvoir sauter directement aux moments clés de l'épreuve (Tâche 1 : 00:00, Tâche 2 : 02:00, Tâche 3 : 05:30) en résonance avec la transcription des dialogues.
3. **Contrôle Avancé :** Vitesse de lecture ajustable (0.75x, 1x, 1.25x, 1.5x), saut rapide ±10s, barre de progression fluide et téléchargement de l'archive (.webm).
4. **Persistance Fiable :** Sauvegarde automatique du flux audio via le driver universel de stockage (`lib/storage/exam-storage.ts` vers Supabase Storage / local fallback) et indexation dans PostgreSQL (`attempt.feedback.audioUrl` & `attempt.answers.audioUrl`).
5. **Mode Démo Immédiat :** Sur `/dashboard/historique/demo-oral`, mise à disposition d'un flux audio de démonstration pour que tout candidat puisse tester l'expérience sans avoir encore passé d'épreuve.

## 3. Schéma de Données & Architecture

### API Endpoint : `POST /api/exam/oral-audio`
- **Payload :** `multipart/form-data` avec le fichier audio `audio` (Blob WebM/Opus), `seriesId` et `attemptId`.
- **Traitement :** Stockage via `uploadExamAsset` dans le sous-dossier `oral-recordings` (ou bucket public Supabase `exam-assets`).
- **Réponse JSON :**
  ```json
  {
    "ok": true,
    "audioUrl": "https://.../storage/v1/object/public/exam-assets/oral-recordings/session-...webm"
  }
  ```

### Persistance Tentative (`POST /api/exam/attempt`)
- L'URL de l'enregistrement est enregistrée dans `answers.audioUrl` et `feedback.audioUrl`.
- La fonction utilitaire `parseOralAudioUrl(attempt)` extrait cette URL de manière rétrocompatible.

## 4. Composant UI : `CandidateOralAudioPlayer`
- **Emplacement :** `components/dashboard/candidate-oral-audio-player.tsx`
- **Caractéristiques Visuelles :**
  - Carte premium avec gradient institutionnel, bordure sémantique et badge d'accréditation FEI.
  - Bouton Play / Pause stylisé avec ondes sonores animées (CSS bars).
  - Chronomètre précis (temps écoulé / durée totale).
  - Curseur de seekbar interactif.
  - Boutons de saut -10s / +10s (`RotateCcw`, `RotateCw`).
  - Menu de vitesse de lecture (0.75x, 1.0x, 1.25x, 1.5x).
  - Puces de saut direct aux Tâches 1, 2, 3 (avec scroll automatique vers la transcription correspondante si le mode dialogue est activé).
  - Bouton de téléchargement direct de l'audio.
