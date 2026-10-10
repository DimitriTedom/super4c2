# Brand & Design Canvas: Navigation Loaders & Feedback System

**Projet :** Super4C2  
**Date :** Octobre 2026  
**Objectif :** Éliminer tout sentiment de latence ou d'interface figée lors des navigations utilisateur et administrateur, en fournissant un retour visuel instantané et continu dès le clic sur un menu ou un lien.

---

## 1. Direction Artistique & Principes Visuels

### A. La Barre de Progression Supérieure (Top Navigation Progress Bar)
- **Position :** Fixée au sommet absolu de la fenêtre (`z-[9999]`, hauteur `3.5px`).
- **Palette Visuelle :**
  - Dégradé Crimson/Amber Super4C2 : `linear-gradient(90deg, #E51A31 0%, #FF4D6D 50%, #FFB703 100%)`.
  - Halo d'ambiance (Glow effect) : `box-shadow: 0 0 14px rgba(229, 26, 49, 0.85), 0 0 4px rgba(255, 183, 3, 0.6)`.
  - Shimmer d'extrémité : pointe lumineuse à 100% simulant un faisceau d'énergie haute vitesse.
- **Dynamique d'Animation :**
  - Clic détecté : jaillissement immédiat à 25% en 150ms.
  - Attente de rendu serveur (Server Component) : progression fluide asymptotique vers 85%.
  - Résolution du routage : bond éclair à 100% en 120ms suivi d'un fondu de disparition (*fade out* de 300ms).

### B. Micro-Indicateurs de Menu en Ligne (In-Menu Feedback)
- Dans la barre latérale du Back-Office (`AdminShell`) et les onglets du tableau de bord (`AdminDashboard`) :
  - Dès qu'un lien est cliqué, un micro-spinner haute précision ou un point pulsant apparaît immédiatement à droite du libellé de l'onglet cliqué.
  - Permet à l'administrateur de savoir sans l'ombre d'un doute que son clic a été pris en compte et que la page est en cours de rendu sur le serveur.

### C. Écrans Squelettes Thématiques (`loading.tsx`)
- Utilisation de surfaces sombres et claires avec effet de balayage lumineux (*Skeleton Shimmer*).
- Formes adaptées au contexte :
  - **Vue d'ensemble Admin :** 4 cartes KPI avec valeurs en pulsation et grille de cohortes.
  - **Tables CRUD (FAQs, Témoignages, Blog) :** Lignes de tableau alternées avec avatars et pastilles de statuts.
  - **Conciergerie Leads :** Cartes de prospects avec faux texte et badges d'intention.
  - **Simulateur CBT :** Sceau d'attente officiel et barre de progression de calibrage audio.
