# 📚 Spécification Fonctionnelle & Technique : Système de Blog & Stratégie SEO (Super4C2)

**Version :** 1.0 — Octobre 2026  
**Statut :** Approuvé & En cours d'implémentation  
**Module :** Acquisition & Marketing Organique (`/blog`, `/blog/[slug]`)

---

## 1. Objectifs & Stratégie d'Acquisition Organique

Le système de blog de Super4C2 est le moteur d'acquisition SEO principal de la plateforme. Son rôle est de capter l'intention de recherche transactionnelle et informationnelle des candidats à l'immigration canadienne (Entrée Express, Arrima, permis d'études/travail) sur Google et les moteurs de recherche IA.

### Piliers Thématiques Cibles
1. **Stratégies TCF & TEF Canada :** Méthodologie par compétence, gestion du temps CBT, contournement des pièges FEI.
2. **Entrée Express & Points CRS :** Débloquer les +50 points bonus francophones au palier NCLC 7, calculs de seuils d'extraction IRCC.
3. **IELTS General Training vs TCF :** Comparatifs de score, stratégie bilingue pour maximiser le score de transférabilité des compétences.
4. **Sujets Récents & Actualités IRCC :** Décryptage des réformes d'immigration, sessions d'examen récentes.

---

## 2. Modèle de Données & Typage (`lib/blog/types.ts`)

```typescript
export type BlogCategory = 
  | "METHODE_TCF" 
  | "ENTREE_EXPRESS" 
  | "IELTS_CANADA" 
  | "ACTUALITES_EXAMENS" 
  | "REUSSITE_CANDIDATS";

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: BlogCategory;
  categoryLabel: string;
  publishedAt: string;
  readTimeMinutes: number;
  author: {
    name: string;
    role: string;
    avatarUrl?: string;
  };
  coverImage?: string;
  featured?: boolean;
  tags: string[];
  content: string; // Markdown enrichi
  targetCta: {
    type: "CBT_EXAM" | "CRS_CALCULATOR" | "FREE_TEST" | "IELTS_MODULE";
    label: string;
    href: string;
  };
}
```

---

## 3. Parcours Utilisateur & Expérience de Lecture (UX/UI)

### A. Page Catalogue Blog (`/blog`)
- **Hero d'actualité :** Mise en avant de l'article vedette (*Featured Post*) avec badge thématique et temps de lecture.
- **Filtres par Catégorie :** Onglets interactifs (`Toutes`, `Méthodologie TCF`, `Entrée Express & CRS`, `IELTS General`, `Sujets Récents`).
- **Moteur de Recherche Instantané :** Filtrage par mots-clés dans les titres et résumés.
- **Grille de Cartes Premium :** Cartes avec micro-interactions, typographie *Bricolage Grotesque*, temps de lecture estimé et tag de niveau cible (ex. *NCLC 7*).

### B. Page Article Détaillé (`/blog/[slug]`)
- **Barre de Progression de Lecture :** Jauge dynamique au scroll en haut de page.
- **Sommaire Flottant (Table of Contents) :** Navigation rapide vers les sections clés.
- **Typographie Optimisée Lecture Longue :** Styles soignés (interlignage 1.7, callouts informatifs, citations, listes clés).
- **Cartes CTA Intégrées Haute Conversion :** Liens contextuels vers le simulateur CBT (`/examens/demo-101-ce/ce`) ou le calculateur CRS (`/nclc-calculator`).
- **Bloc Auteur & Partage Social :** Crédibilité de l'expertise linguistique et partage en un clic.

---

## 4. Métadonnées & SEO Technique
- Génération automatique des balises Open Graph (`og:title`, `og:description`, `og:type = "article"`).
- Données structurées JSON-LD (`Article`, `BreadcrumbList`).
- Fil d'Ariane sémantique.
- Liens internes croisés entre articles connexes et séries d'entraînement.
