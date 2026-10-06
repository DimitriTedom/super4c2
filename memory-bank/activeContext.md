# Active Context: Super4C2

## 1. Focus Actuel
- **Hero Landing Premium & Alignement Globe 3D :**
  - **Positionnement & Coupe du Globe :** Le conteneur du Globe 980px est ancré à `bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2` dans une section hero en `overflow-hidden`. Son équateur est parfaitement calé sur le bord inférieur du Hero, coupant la moitié basse et faisant monter la coupole supérieure en arrière-plan.
  - **Axe Z & Hiérarchie :** Le globe réside en arrière-plan strict (`z-0 pointer-events-none`), tandis que le badge, le grand titre H1, le paragraphe de sous-titre et les boutons CTA résident au premier plan (`z-10`). Le texte et les boutons s'affichent par-dessus la coupole du globe avec une netteté totale et zéro blocage d'interaction.
  - **Composants Magic UI :** `ShimmerButton` (Brand Crimson #E51A31), `InteractiveHoverButton`, `AnimatedShinyText`, `BlurFade`.
  - **Vérification Browser :** Tests de hit-testing DOM (`document.elementFromPoint`) validés à 100% (les clics atteignent directement les CTA sans interférence de canvas).
  - **TypeScript & Lint :** 0 erreur.

## 2. Décisions Récentes
- **Globe WebGL :** Implémentation basée sur `cobe` v2 avec boucle `requestAnimationFrame` fluide, marqueurs discrets et élégants (taille réduite à 0.25x), rotation inertielle douce.
- **Z-Index :** Globe à `z-0`, contenu à `z-10` pour garantir que le globe ne bloque jamais la lisibilité ni les interactions.

## 3. Prochaines Étapes Immédiates
1. Phase suivante du produit : Simulateur officiel CBT (/examens) et test diagnostique (/test-gratuit).
2. Schéma de données Prisma et amorçage des séries officielles TCF/TEF.
3. Intégration du paiement Stripe pour les abonnements sur `/tarifs`.

