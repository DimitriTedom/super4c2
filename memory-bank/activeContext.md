# Active Context: Super4C2

## 1. Focus Actuel
- **Landing Page & Header Élevés avec le Globe 3D :**
  - Composant Globe 3D interactif WebGL (`components/ui/globe.tsx`) intégré en position basse et centrée dans la Hero section.
  - Textes d'origine, thématiques et sections conservés fidèlement (promesse "Décrochez vos 4 C2 et Débloquez les +50 Points d'Entrée Express", comparatif Objectif Canada, BentoGrid des 4 épreuves).
  - Navigation par pilule flottante et sélecteur de langue 🇨🇦 FR-CA intégrés dans `SiteHeader`.
  - Adaptation automatique aux thèmes Clair et Sombre (palette HSL réactive).
  - Serveur de dev opérationnel sur `http://localhost:3000` et build de production 100% validé.

## 2. Décisions Récentes
- **Globe WebGL :** Implémentation basée sur `cobe` v2 avec boucle `requestAnimationFrame` fluide, markers géographiques reliés aux candidats internationaux (Montréal, Toronto, Paris, Yaoundé, Douala, Casablanca, Dakar, Beyrouth) et dégradé d'horizon fondu dans la carte.
- **Git Commit :** `dab2919` sur `main`.

## 3. Prochaines Étapes Immédiates
1. Validation visuelle par l'utilisateur.
2. Schéma de données Prisma et amorçage des séries officielles.
3. Intégration du paiement Stripe pour les abonnements sur `/tarifs`.
