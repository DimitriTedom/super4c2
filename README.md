# 🇨🇦 Super4C2 — Simulateur CBT & IA pour le TCF & TEF Canada

> **Décrochez vos 4 C2 et débloquez les +50 à +62 points bonus au bassin Entrée Express Canada.**

[![Next.js 15](https://img.shields.io/badge/Next.js-15.3-black?logo=next.js)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19.0-blue?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6.17-2D3748?logo=prisma)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-Proprietary-red)](#)

---

## 📌 Présentation du Projet

**Super4C2** est la plateforme EdTech / Fintech de référence dédiée à la préparation intensive du **TCF Canada** et du **TEF Canada**. 

Contrairement aux solutions traditionnelles basées sur des PDFs statiques ou des pages web à défilement infini de 18 000 px, Super4C2 reproduit **au pixel près** l'interface officielle des terminaux d'examen sur ordinateur (**Computer-Based Testing - CBT**) de **France Éducation International (FEI)** et de la **Chambre de Commerce et d'Industrie de Paris (CCI)**.

### 🎯 Proposition de Valeur Clé
* **Simulation CBT Réelle :** Écran scindé officiel, navigation par grille de 39 pastilles, compte à rebours strict non pausable en mode examen.
* **Correction & Décodage Immédiat :** Explications détaillées officielles et analyse systématique des pièges FEI (*trap analysis*).
* **Moteur Vocal IA Interactif :** Enregistrement dual-channel, examinateur IA live M. Laurent (voix HD ElevenLabs) pour le jeu de rôle et l'argumentation en Expression Orale.
* **Algorithme SRS SM-2 :** Carnet d'erreurs avec répétition espacée (J+1, J+3, J+7) pour ancrer les pièges linguistiques jusqu'au jour J.
* **Impact Direct Immigration :** Calculateur dynamique de points CRS reliant immédiatement les scores NCLC aux quotas de sélection Express Entry du gouvernement canadien.

---

## 🏛️ Les 4 Piliers CBT Officiels

| Épreuve | Format Officiel | Durée | Innovations Super4C2 |
| :--- | :--- | :--- | :--- |
| **Compréhension Écrite (CE)** | 39 Questions QCM | 60 min | **Dual Mode** (*Examen Strict* vs *Entraînement Didactique*), zoom typographique (`A- / A / A+`), outil de surlignage feutre ambre interactif avec persistance. |
| **Compréhension Orale (CO)** | 39 Questions Audio | 40 min | Lecteur audio Studio HTML5 natif, sélecteur de vitesse (`0.8x / 1.0x / 1.2x`), illustrations situationnelles 16:9 watermarquées, réécoute libre et transcription en mode didactique. |
| **Expression Écrite (EE)** | 3 Tâches (60 à 180 mots) | 60 min | Compteur de mots officiel FEI en temps réel, barre de caractères accentués (claviers QWERTY), **télémétrie d'autosave continu** avec horodatage, **Magic Rewrite C1/C2**. |
| **Expression Orale (EO)** | 3 Tâches d'entretien | 12 min | Visio-examen 16:9 avec examinateur M. Laurent, mixage audio dual-channel (micro + IA), **module de pré-test matériel** (Web Audio API vu-mètre & audio check). |

---

## 🛠️ Stack Technique

### Frontend & Rendu
* **Framework :** [Next.js 15.3](https://nextjs.org/) (App Router, React Server Components & Route Handlers)
* **Bibliothèque UI :** [React 19](https://react.dev/), [Tailwind CSS](https://tailwindcss.com/), [Shadcn UI](https://ui.shadcn.com/)
* **Animations :** [Framer Motion](https://www.framer.com/motion/)
* **Typographie :** *Bricolage Grotesque* (Titres & Brand), *DM Sans* (Interface & Documents), *Space Mono* (Timers & Scores)
* **Globe 3D :** [COBE](https://github.com/shuding/cobe) WebGL interactif
* **Bilinguisme :** Architecture bilingue officielle canadienne (🇨🇦 Français / Anglais)

### Backend & Données
* **Base de données :** PostgreSQL (port `5434` en conteneur Docker local)
* **ORM :** [Prisma ORM 6.17](https://www.prisma.io/)
* **Authentification & Stockage :** [Supabase](https://supabase.com/) (Auth SSR + Supabase Storage buckets)
* **Validation :** [Zod](https://zod.dev/)

### Audio, Médias & IA
* **Web Audio API :** `AudioContext`, `AnalyserNode` FFT pour vu-mètres en direct et mixage multi-pistes
* **Synthèse Vocale & STT :** ElevenLabs Charlie (audio HD) + Web Speech API
* **Traitement d'Images :** `sharp` pour le watermarking dynamique du logomark Super4C2
* **Moteur LLM :** OpenAI GPT-4o-mini & DeepSeek-V3 avec repli déterministe FEI

---

## 📂 Architecture du Projet

```
super4c2/
├── app/                                # Arborescence Next.js (App Router)
│   ├── account/                        # Espace Compte Candidat & Profil
│   ├── admin/                          # Back-office Admin (Séries, FAQ, Blogs, Assets)
│   ├── api/                            # API Route Handlers (Auth, AI, Exam, Account)
│   ├── auth/                           # Flux de connexion & inscription Supabase
│   ├── blog/                           # Moteur d'articles SEO & guides TCF
│   ├── carnet-erreurs/                 # Coffre mémoire SRS (Algorithme SM-2)
│   ├── dashboard/                      # Dashboard candidat (NCLC Radar & Compte à rebours J-X)
│   ├── examens/                        # Simulateurs CBT ([seriesId]/ce, co, ee, eo)
│   ├── nclc-calculator/                # Simulateur de points CRS Entrée Express
│   ├── tarifs/                         # Grille des formules & pass d'accès
│   └── test-gratuit/                   # Diagnostic gratuit 15 min haute conversion
├── components/                         # Composants React modulaires
│   ├── account/                        # Formulaire d'édition de profil candidat
│   ├── admin/                          # Outils back-office & formulaires de séries
│   ├── ai/                             # Widget Coach Aura C2™ & avatar animé
│   ├── dashboard/                      # Widget Compte à rebours J-X & jauges
│   ├── exam/                           # Composants CBT (CbtExam, AudioPlayer, SplitLayout, etc.)
│   ├── srs/                            # Lecteur de flashcards SM-2 & filtres
│   └── ui/                             # Primitives Shadcn UI & effets cinématiques
├── docs/                               # Documentation de cadrage & spécifications
│   ├── brand/                          # Brand Canvas & Guide Canva
│   └── specs/                          # Spécifications fonctionnelles 00 à 08
├── lib/                                # Logique métier & utilitaires
│   ├── ai/                             # Services d'évaluation IA & générateurs
│   ├── exam/                           # Banques de questions officielles (Séries 101, 102...)
│   ├── i18n/                           # Contexte & traductions FR / EN
│   ├── srs/                            # Algorithme mathématique SuperMemo-2 (SM-2)
│   └── supabase/                       # Clients Supabase Browser & Server SSR
├── memory-bank/                        # Système pérenne de suivi de contexte (Règles Agent)
└── prisma/                             # Schéma de base de données PostgreSQL
```

---

## 🚀 Démarrage Rapide (Développement Local)

### 1. Prérequis
* **Node.js :** v20+ ou v22+
* **npm :** v10+
* **Docker :** Pour le conteneur PostgreSQL local

### 2. Cloner et Installer les Dépendances

```bash
git clone git@github.com:DimitriTedom/super4c2.git
cd super4c2
npm install
```

### 3. Configurer l'Environnement

Dupliquez le fichier modèle et complétez vos clés :

```bash
cp .env.template .env
```

Variables requises principales :
```env
# Base de données PostgreSQL locale (Docker)
DATABASE_URL="postgresql://postgres:postgres@localhost:5434/super4c2?schema=public"
DIRECT_URL="postgresql://postgres:postgres@localhost:5434/super4c2?schema=public"

# Supabase Auth & Storage
NEXT_PUBLIC_SUPABASE_URL="https://votre-projet.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="votre_cle_anon"

# Moteurs IA (Optionnels en dev local grâce aux fallbacks déterministes)
OPENAI_API_KEY="sk-..."
DEEPSEEK_API_KEY="sk-..."
ELEVENLABS_API_KEY="..."
```

### 4. Démarrer la Base de Données & Synchroniser Prisma

```bash
# Lancer le conteneur PostgreSQL local (si configuré avec docker-compose)
docker-compose up -d

# Générer le client Prisma et synchroniser le schéma
npx prisma generate
npx prisma db push
```

### 5. Lancer le Serveur de Développement

```bash
npm run dev
```

Rendez-vous sur [http://localhost:3000](http://localhost:3000) dans votre navigateur.

---

## 🧪 Tests & Qualité du Code

Le projet impose une politique de **zéro warning / zéro erreur TypeScript** :

```bash
# Vérification stricte des types TypeScript
npx tsc --noEmit

# Analyse ESLint
npm run lint

# Formatage automatique avec Prettier & Tailwind
npm run format
```

---

## 📖 Spécifications & Documentation

Toutes les fonctionnalités majeures sont documentées dans le dossier `docs/specs/` :
* [00 - Master Product Roadmap](docs/specs/00-master-product-roadmap.md)
* [01 - Moteur d'Examen CBT Compréhension Écrite & Orale](docs/specs/01-cbt-exam-engine.md)
* [02 - Atelier d'Expression Écrite & Évaluation FEI](docs/specs/02-written-expression-engine.md)
* [03 - Salle d'Expression Orale & Voice Agent Interactif](docs/specs/03-oral-expression-engine.md)
* [04 - Blog & Moteur de Contenu SEO](docs/specs/04-blog-and-content-system.md)
* [05 - Tableaux de Bord, Onboarding & Espace Compte](docs/specs/05-multitenant-architecture-and-dashboards.md)
* [06 - Communauté VIP & Radar des Sujets Récents](docs/specs/06-community-topics-and-concierge.md)
* [07 - Générateur IA de Séries d'Examens 39Q](docs/specs/07-ai-bulk-series-generator.md)
* [08 - Moteur Scientifique SRS SM-2](docs/specs/08-srs-spaced-repetition-engine.md)

---

## 🔒 Confidentialité & Licence

© 2026 Dimitri Tedom / Super4C2. Tous droits réservés.  
Les contenus pédagogiques, formats de simulation et algorithmes d'évaluation sont protégés. TCF et TEF sont des marques déposées respectivement par France Éducation International et la CCI Paris Île-de-France.

