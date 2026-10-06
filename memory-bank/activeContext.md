# Active Context: Super4C2

## 1. Focus Actuel
- **Moteur CBT CE & CO (Phase 1) complété & fonctionnel :**
  - Catalogue des examens disponible sur `/examens`.
  - Écran de consignes & test audio sur `/examens/[seriesId]/intro`.
  - Simulateur Compréhension Écrite (CE) sur `/examens/demo-101/ce`.
  - Simulateur Compréhension Orale (CO) sur `/examens/demo-101-co/co` avec lecteur audio à écoute unique (`AudioPlayerCBT`).
  - Mode plein écran immersif géré par `AppShell` (masquage automatique du header en examen).
  - Nouveau Logomark détouré transparent intégré dans `BrandLogo` ; asset optimisé pour Favicon généré dans `public/brand/favicon-source-1024.png`.

## 2. Décisions Récentes
- **Logomark :** Utilisation de `Le Logomark.png` (fond transparent) pour le site ; création de `favicon-source-1024.png` sur fond opaque Imperial Navy (#0B132B) recommandé pour favicon.io.
- **Audios CO :** Mode démo avec synthèse vocale française navigateur native en fallback quand aucun fichier mp3 distant n'est fourni.
- **Git Commit :** `dcc8abc` validé sur `main` avec 0 erreur TypeScript.

## 3. Prochaines Étapes Immédiates
1. Spécification technique & développement de l'**Atelier d'Expression Écrite (EE)** (`docs/specs/02-written-expression-engine.md`).
2. Interface de rédaction 3 tâches avec compteur de mots dynamique et jauges FEI.
3. Intégration du moteur d'évaluation IA (grille 4 critères FEI + Magic Rewrite C1/C2).
