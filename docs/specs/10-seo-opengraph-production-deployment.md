# Spécification Technique — SEO, OpenGraph, Sitemap Dynamique & Build de Production

## 1. Objectifs & Périmètre
- **Objectif :** Équiper l'application Super4C2 d'une infrastructure SEO et OpenGraph exhaustive, standardisée et conforme aux spécifications W3C, Google Search Central et OpenGraph Protocol.
- **Livrables :**
  1. Configuration OpenGraph & Twitter Cards racine dans `app/layout.tsx`.
  2. Sitemap dynamique `app/sitemap.ts` recensant toutes les routes statiques et les séries d'examens dynamiques (`tcf-101`, `ielts-gen-18-1`, etc.).
  3. Fichier d'indexation `app/robots.ts` pour guider les moteurs de recherche et protéger les routes privées (`/admin`, `/account`, `/checkout`, `/api`).
  4. Données structurées JSON-LD Schema.org intégrées dans le `<head>` de `app/layout.tsx` (Organization, WebSite, Course).
  5. Métadonnées dynamiques et précises sur les routes clés : `/examens`, `/examens/[seriesId]`, `/tarifs`, `/calculateur-crs`, `/nclc-calculator`, `/carnet-erreurs`, `/test-gratuit`.
  6. Validation complète du build de production Next.js (`npm run build`).

## 2. Architecture des Métadonnées

### 2.1 Metadata Base URL & OpenGraph Racine (`app/layout.tsx`)
```ts
metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://super4c2.com")
```
- **Attributs OpenGraph :**
  - `type: "website"`
  - `locale: "fr_CA"` (avec alternative `"en_CA"`)
  - `url: "https://super4c2.com"`
  - `siteName: "Super4C2"`
  - `images: [{ url: "/brand/cbt-platform-preview.jpg", width: 1200, height: 630, alt: "Simulateur Officiel TCF Canada & IELTS CBT - Super4C2" }]`
- **Twitter Cards :**
  - `card: "summary_large_image"`
  - `title`, `description`, `images`
- **Robots :**
  - `index: true`, `follow: true`
  - `googleBot: { index: true, follow: true, "max-video-preview": -1, "max-image-preview": "large", "max-snippet": -1 }`

### 2.2 Sitemap Dynamique (`app/sitemap.ts`)
- Utilisation de la Metadata Route native Next.js `sitemap.ts` retournant `MetadataRoute.Sitemap`.
- **Pages Clés & Priorités :**
  - `/` : Priority 1.0, Changefreq: `daily`
  - `/examens` : Priority 0.9, Changefreq: `daily`
  - `/test-gratuit` : Priority 0.9, Changefreq: `weekly`
  - `/tarifs` : Priority 0.8, Changefreq: `weekly`
  - `/calculateur-crs` : Priority 0.8, Changefreq: `monthly`
  - `/nclc-calculator` : Priority 0.8, Changefreq: `monthly`
  - `/sujets-recents` : Priority 0.8, Changefreq: `daily`
  - `/communaute` : Priority 0.7, Changefreq: `weekly`
  - `/carnet-erreurs` : Priority 0.7, Changefreq: `weekly`
  - `/examens/[seriesId]` (Séries TCF 101, Démo, IELTS 18-1) : Priority 0.9, Changefreq: `weekly`
  - `/examens/[seriesId]/ce`, `/co`, `/ee/intro`, `/eo/intro`, `/examen-blanc` : Priority 0.8
  - `/confidentialite`, `/mentions-legales` : Priority 0.3, Changefreq: `monthly`

### 2.3 Robots.txt Dynamique (`app/robots.ts`)
- Autorise l'indexation de l'ensemble du contenu public.
- Interdit les routes internes et privées :
  - `/admin/`
  - `/account/`
  - `/checkout/`
  - `/api/`
- Référence le sitemap : `https://super4c2.com/sitemap.xml`

### 2.4 JSON-LD Schema.org
Composant JSON-LD injecté dans le layout :
- `EducationalOrganization` avec liens de profil, logo, description.
- `WebSite` avec SearchAction pour la recherche d'examens.
- `Course` décrivant les programmes de préparation TCF Canada et IELTS General Training.

## 3. Plan d'Implémentation & Tests
1. **Création de `app/sitemap.ts`** avec toutes les routes répertoriées.
2. **Création de `app/robots.ts`** avec les directives d'exploration.
3. **Création du composant JSON-LD `components/seo/json-ld.tsx`**.
4. **Mise à jour de `app/layout.tsx`** avec `metadataBase`, OpenGraph, Twitter, alternate links et le script JSON-LD.
5. **Enrichissement des métadonnées de pages :** `/tarifs`, `/examens`, `/test-gratuit`, `/calculateur-crs`, `/nclc-calculator`.
6. **Vérification du Build :** Exécution de `npm run build` et correction immédiate de toute anomalie éventuelle.
