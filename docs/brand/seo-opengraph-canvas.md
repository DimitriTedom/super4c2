# Brand & Design Canvas — SEO, OpenGraph & Visual Identity Social Cards

## 1. Vision & Tonalité Visuelle pour le Partage Social
- **Identité :** Super4C2 — Plateforme d'entraînement officielle et d'excellence aux examens TCF Canada, TEF Canada et Cambridge IELTS General Training.
- **Tonalité des Cartes Sociales (Twitter / LinkedIn / WhatsApp / Facebook) :**
  - **Autorité & Prestige :** L'apparence doit inspirer une totale confiance institutionnelle (homologue à France Éducation International et British Council/Cambridge Assessment).
  - **Désirabilité & Clarté :** Mettre immédiatement en avant la promesse de valeur : *Objectif NCLC 7+ / C2*, *+50 Points CRS Entrée Express*, *Simulateur CBT officiel*, *Voice Agent IA Examinateur*.
  - **Codes Graphiques Super4C2 :**
    - Arrière-plan : Bleu Impérial profond (`#0B132B`) et dégradé subtil vers l'Érable Pourpre (`#E51A31`).
    - Typographie : `Bricolage Grotesque` (titres percutants) et `DM Sans` (corps fluide).
    - Accents : Or 24 carats (`#F59E0B`), feuille d'érable canadienne stylisée, badges 3D et mention officielle.

## 2. Spécifications des Assets OpenGraph (1200 × 630 px)
- **Dimensions Standards :** `1200 × 630 px` (Ratio 1.91:1) recommandé par OpenGraph et Twitter Cards (`summary_large_image`).
- **Zone de Sécurité (Safe Area) :** Contenu textuel et logos centrés dans un rectangle de `1080 × 560 px` (marge de 60px tout autour) pour éviter tout rognage sur mobile ou feed WhatsApp.
- **Image Principale (OG Default) :** `/brand/cbt-platform-preview.jpg` avec fallback et OpenGraph dynamique généré via `@vercel/og` ou Next.js Metadata API.
- **Favicon & Icônes App :**
  - `/favicon.ico` (multi-résolution)
  - `/apple-touch-icon.png` (180x180)
  - `/favicon-32x32.png` et `/favicon-16x16.png`
  - `/site.webmanifest` avec métadonnées PWA

## 3. Hiérarchie des Titres & Descriptions SEO (Google SERP)
- **Format Titre Global :** `[Titre de la Page] | Super4C2 — Préparation TCF, TEF Canada & IELTS`
- **Longueur Recommandée :** 50 à 60 caractères pour le titre, 140 à 155 caractères pour la description (optimisé pour affichage SERP sans troncature mobile).
- **Mots-clés Primaires :**
  - `TCF Canada`, `TEF Canada`, `NCLC 7`, `Entrée Express`, `Immigration Canada`, `Simulateur CBT`, `Expression Orale IA`, `Compréhension Écrite`, `Compréhension Orale`, `IELTS General Training`, `CLB 9`.

## 4. Données Structurées JSON-LD (Schema.org)
- **Organization / EducationalOrganization :**
  - Nom : Super4C2
  - URL : https://super4c2.com
  - Logo : https://super4c2.com/brand/Le%20Logo%20Primaire.png
  - Description : Plateforme EdTech d'entraînement officiel au TCF Canada, TEF Canada et IELTS.
- **Course / EducationalOccupationalCredential :**
  - Préparation TCF Canada NCLC 7 / C2 (+50 pts CRS).
  - Préparation IELTS General Training CLB 9.
- **BreadcrumbList :** Pour un fil d'Ariane clair dans les résultats de recherche Google.
