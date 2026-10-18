# Brand & Design Canvas : Catalogue Multi-Séries EE & EO en Base de Données

**Version :** 1.0 — Octobre 2026  
**Auteur :** Antigravity Agent & Dimitri (@dimitri-snowdev)  
**Projet :** Super4C2 — Préparation Officielle TCF & TEF Canada  

---

## 1. Vision & Philosophie de Marque

Super4C2 se distingue radicalement des plateformes traditionnelles ou concurrentes (notamment Objectif Canada TCF) en éliminant toute donnée statique artificielle au profit d'un **moteur de données relationnel dynamique connecté en temps réel à PostgreSQL**.

L'extension du catalogue multi-séries (Séries 101 à 105) pour les deux épreuves reines de l'admission Express Entry (+50 points CRS) :
- **Expression Écrite (EE)** : 3 tâches par série (Message descriptif A1-B1, Récit citoyen B1-B2, Prise de position contradictoire B2-C2).
- **Expression Orale (EO)** : 3 tâches par série (Entretien dirigé, Jeu de rôle interactif avec l'examinateur IA M. Laurent, Monologue argumenté).

---

## 2. Direction Visuelle & Codes Épreuves

| Épreuve | Couleur Primaire | Icône 3D | Badge d'Examen | Ambiance & Tonalité |
|---|---|---|---|---|
| **Expression Écrite (EE)** | Maple Crimson (`#E51A31`) | `expression-ecrite-pen.png` | `100% Gratuit · Correction IA FEI` | Sérieuse, académique, typographie contrastée, clavier de caractères accentués |
| **Expression Orale (EO)** | Golden Amber (`#F59E0B`) | `expression-orale-microphone.png` | `100% Gratuit · Examinateur Live 16:9` | Visio cockpit, immersion directe avec M. Laurent, spectre fréquentiel réactif |

---

## 3. Matrice Thématique des Séries Officielles (101 à 105)

Pour garantir une préparation réaliste et conforme aux annales officielles de France Éducation International (FEI), chaque série aborde un pôle sociétal distinct :

1. **Série 101 (Série Initiale Fondatrice) :**
   - *EE :* Emménagement et logement (T1), bénévolat associatif (T2), interdiction des smartphones à l'école (T3).
   - *EO :* Présentation & projet Canada (T1), inscription cours de cuisine écoresponsable (T2), interdiction des voitures en centre-ville (T3).
2. **Série 102 (Économie & Nouveaux Modes de Vie) :**
   - *EE :* Recommandation d'une librairie indépendante (T1), article sur le renouveau des commerces de proximité (T2), la semaine de 4 jours de travail (T3).
   - *EO :* Parcours professionnel & compétences (T1), covoiturage en entreprise (T2), intelligence artificielle et destruction d'emplois (T3).
3. **Série 103 (Environnement, Climat & Transition) :**
   - *EE :* Invitation à une randonnée en parc naturel québécois (T1), récit d'un défi zéro déchet en famille (T2), obligation du tri des biodéchets et sanctions (T3).
   - *EO :* Loisirs & rapport à la nature (T1), abonnement à une coopérative solaire locale (T2), taxe carbone sur les vols court-courriers (T3).
4. **Série 104 (Culture, Patrimoine & Vivre-Ensemble) :**
   - *EE :* Message de remerciement pour un séjour culturel (T1), fête de quartier multiculturelle (T2), gratuité universelle des musées nationaux (T3).
   - *EO :* Intérêts artistiques & culturels (T1), inscription à une troupe de théâtre amateur (T2), uniformes scolaires et mixité sociale (T3).
5. **Série 105 (Santé, Bien-Être & Société Numérique) :**
   - *EE :* Conseil d'un sentier de course à pied urbain (T1), séjour sans connexion Internet (T2), télémédecine vs consultations présentielles (T3).
   - *EO :* Gestion du stress & hygiène de vie (T1), abonnement à une salle de sport 24/7 (T2), limitation du temps d'écran des enfants par la loi (T3).

---

## 4. Principes Ergonomiques & UX

1. **Zéro Rupture Visuelle :** La transition d'une série à l'autre conserve scrupuleusement le design cockpit 100vh sans défilement pour l'oral et le pupitre CBT avec barre de temps pour l'écrit.
2. **Persistance en Base Réelle :** Chaque série et tâche dispose de son identifiant unique PostgreSQL (`cuid`) et de son numéro d'ordre officiel.
3. **Feedback Immédiat :** Les cartes de sélection affichent en temps réel les objectifs de mots, les temps suggérés et les consignes officielles.
