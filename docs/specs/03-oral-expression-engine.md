# 📋 Spécification Technique : 03 - Salle d'Expression Orale (EO) & Voice Agent Interactif

## 1. Contexte & Enjeu Décisif
L'Expression Orale (EO) est l'épreuve la plus anxiogène du TCF Canada.
Sur le marché actuel (notamment chez *Objectif Canada*), le simulateur oral est **totalement dysfonctionnel** :
* En Tâche 2 (exercice en interaction / jeu de rôle de 3 min 30 s), le concurrent demande au candidat de "parler tout seul" face à un compte à rebours sans aucun répondant ! L'étudiant pose ses questions dans le vide absolu, ce qui ne prépare absolument pas à l'examen réel où un examinateur humain réagit, pose des conditions et nuance ses réponses.

**La proposition de valeur disruptive de Super4C2 :**
* Une véritable **salle d'entretien immersif avec un Examinateur Vocal IA interactif**.
* En Tâche 2, l'agent IA joue le rôle de l'interlocuteur (ex: le gérant de la salle de sport, le propriétaire de l'appartement, le responsable associatif) et **répond vocalement en direct**, introduisant les contraintes et relances réalistes de l'épreuve officielle FEI.
* Enregistrement audio haute fidélité (`MediaRecorder` web standard avec annulation d'écho).
* Waveform interactive animée en temps réel.
* Débriefing IA instantané post-épreuve :
  1. Transcription synchronisée de l'échange.
  2. Analyse du débit de parole (mots/minute) et des temps de silence/hésitations.
  3. Grille officielle FEI sur 20 points (Aisance, Lexique, Morphosyntaxe, Interaction).
  4. Suggestions de formulations de haut niveau pour atteindre le palier NCLC 7 / B2.

---

## 2. Déroulé Réglementaire Officiel de l'Expression Orale (TCF Canada)

* **Durée totale de l'entretien :** ~12 minutes (sans temps de préparation).
* **Tâche 1 — Entretien dirigé (2 minutes) :**
  * Objectif : Se présenter, parler de son environnement quotidien (famille, métier, loisirs).
  * L'examinateur pose 2 à 3 questions d'amorce simples.
* **Tâche 2 — Exercice en interaction / Jeu de rôle (3 minutes 30 secondes) :**
  * Objectif : Le candidat doit poser des questions variées pour obtenir des informations précises sur une situation de la vie courante.
  * L'examinateur IA donne des réponses réalistes, hésite parfois, et demande des précisions.
* **Tâche 3 — Expression d'un point de vue argumenté (4 minutes 30 secondes) :**
  * Objectif : Prendre position sur un sujet de société controversé, structurer une argumentation et répondre aux relances de l'examinateur.

---

## 3. Parcours Utilisateur & Interface

1. **Écran de Préparation & Vérification Micro & Casque (`/examens/[seriesId]/eo/intro`) :**
   * **Module Interactif de Vérification Matérielle (`OralHardwareCheck`) :**
     - **Test du Microphone en temps réel (Web Audio API) :**
       - Demande de permission micro avec gestion d'erreurs (accès refusé, absence de périphérique).
       - Jauge de volume dynamique (Vu-mètre fluide 16 segments) mesurant le niveau d'entrée via `AnalyserNode`.
       - Détection de voix active (> seuil d'élocution) confirmant la sensibilité adéquate du micro.
     - **Test du Casque / Sortie Audio :**
       - Extrait audio de calibrage joué directement avec la voix officielle de M. Laurent (`/audio/eo/laurent-step1.mp3`).
       - Confirmation auditive en un clic (*« J'entends distinctement l'examinateur »*).
     - **Porte d'Accès Sécurisée :**
       - Déblocage automatique du bouton de lancement de l'épreuve une fois le diagnostic matériel validé.
       - Option de contournement courtois pour les utilisateurs expérimentés.
   * **Rappel des Consignes & Stratégie FEI :**
     - Durée, grille de notation par critères et consignes spécifiques aux 3 tâches.

2. **La Salle d'Examen Orale Virtuelle (`/examens/[seriesId]/eo`) :**
   * Présentation du visage/avatar stylisé de l'examinateur IA (style épuré EdTech/Fintech avec halo d'écoute réactif).
   * Visualiseur audio en onde (Waveform Canvas / Framer Motion).
   * Minuteur strict pour la tâche active.
   * Bouton microphone réactif (*Appuyer pour parler / Mode mains libres avec détection de voix VAD*).
   * Console d'échange affichant les répliques avec transcription en direct.

3. **Écran de Débriefing Oral (`/examens/[seriesId]/eo/resultats`) :**
   * Score estimé sur 20 et échelon NCLC (NCLC 4 à 10).
   * Radar des compétences FEI (Aisance & Fluidité, Compétence Phonologique, Richesse Lexicale, Morphosyntaxe, Capacité d'Interaction).
   * Transcription annotée du dialogue avec surlignage des maladresses et propositions de tournures C1/C2.

---

## 4. Architecture Technique

* **Audio Capture :** `navigator.mediaDevices.getUserMedia({ audio: true })` avec conversion WebM / WAV.
* **Voice Agent Loop :**
  1. Capture de la parole de l'utilisateur.
  2. Transcription vocale (STT / Speech-to-Text).
  3. Génération de la réplique contextuelle du rôle (LLM configuré avec le persona de l'examinateur FEI).
  4. Synthèse vocale fluide (TTS / Web Speech API en démo locale, compatible Cartesia/ElevenLabs en production).
