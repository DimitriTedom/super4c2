# Project Brief: Super4C2 (Prépa TCF & TEF Canada SaaS)

## 1. Vision & Purpose
Super4C2 est une plateforme SaaS de nouvelle génération pour la préparation aux tests linguistiques d'immigration canadienne (**TCF Canada**, **TEF Canada**, et ultérieurement IELTS). 
Son objectif premier est de garantir aux candidats l'atteinte du niveau **NCLC 7+ (C1/C2)** afin de débloquer les **+50 points CRS** indispensables dans le bassin d'Entrée Express (Express Entry).

## 2. Core Value Proposition vs Objectif Canada TCF
- **Correction Instantanée (10s) vs 4h-24h :** Moteur IA entraîné sur la grille officielle de France Éducation International (FEI) pour l'Expression Écrite (EE) et Orale (EO).
- **Vrai Simulateur CBT (Computer-Based Test) :** Expérience d'examen officielle (écran scindé, pastilles 1 à 39, timer officiel, mode audio sans retour en arrière), remplaçant les pages de scroll de 18 000 px des concurrents.
- **Examinateur Vocal IA Interactif (EO Tâche 2) :** Vrai jeu de rôle en direct via agent vocal WebRTC (l'examinateur pose des questions, répond aux sollicitations du candidat).
- **Magic Rewrite C1/C2 :** Réécriture de la copie du candidat en version modèle perfectionnée.
- **Calculateur de Points CRS Entrée Express :** Visualisation directe du gain de points d'immigration en fonction de la progression des scores.
- **Carnet d'Erreurs Intelligent (SRS) :** Répétition espacée des fautes récurrentes et des pièges audio.

## 3. Scope & Phases
- **Phase 0 :** Branding & Design System (Brand Canvas, charte graphique, tokens de design, landing page).
- **Phase 1 :** Spécifications détaillées (PRD .md) & Architecture Data (Prisma + Supabase).
- **Phase 2 :** Moteur CBT pour Compréhension Écrite (CE) et Compréhension Orale (CO).
- **Phase 3 :** Module Expression Écrite avec éditeur et Correcteur IA (prompts FEI calibrés).
- **Phase 4 :** Simulateur Vocal Interactif pour Expression Orale (WebRTC / Whisper / TTS).
- **Phase 5 :** Dashboard NCLC / CRS, Monétisation (Stripe / Mobile Money) et Lancement.

## 4. Source of Truth
Ce fichier et l'ensemble du dossier `memory-bank/` constituent la source de vérité pérenne du projet. Tout agent intervenant sur le repository doit s'y référer et le maintenir à jour.
