# 📋 Spécification Technique : 07 - Générateur IA de Série Complète CE (39 Questions)

## 1. Contexte & Objectif
Pour alimenter Super4C2 en contenu authentique de niveau officiel sans épuiser l'équipe pédagogique ou l'administrateur, cette fonctionnalité fournit un **générateur par lot (bulk generator)** capable de concevoir, calibrer et insérer dans la base PostgreSQL une série d'examen complète de **39 questions de Compréhension Écrite** conforme aux normes FEI (France Éducation International).

Le moteur exploite **DeepSeek-V3** (via `DEEPSEEK_API_KEY`) ou **OpenAI GPT-4o** pour générer les questions avec une cohérence pédagogique totale et un coût dérisoire (~0.05 $ par série complète de 39 questions).

---

## 2. Structure Réglementaire des 39 Questions CE (TCF Canada)

La génération doit impérativement respecter la répartition officielle suivante :

| Palier | Questions | Niveau CECRL | NCLC Visé | Types de Documents Sources | Format & Contenu |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Palier 1** | Q1 à Q6 | **A1** | NCLC 3 | Affiches, petits prospectus, horaires de train/magasin, messages personnels très simples | 20 à 40 mots, vocabulaire quotidien immédiat |
| **Palier 2** | Q7 à Q12 | **A2** | NCLC 4-5 | Notes de service, avis d'immeuble, courtes petites annonces, consignes simples | 40 à 80 mots, situations concrètes et familières |
| **Palier 3** | Q13 à Q18 | **B1** | NCLC 6 | Courriels d'entreprise, extraits de blogs pratiques, articles de presse informative simple | 80 à 150 mots, repérage d'informations factuelles et d'opinions simples |
| **Palier 4** | Q19 à Q28 | **B2** (Seuil CRS) | NCLC 7-8 | Articles de société, enjeux du monde du travail, environnement, économie, nouvelles technologies | 150 à 250 mots, argumentation structurée, distinction fait / opinion |
| **Palier 5** | Q29 à Q35 | **C1** | NCLC 9 | Essais sociologiques, critiques culturelles, analyses approfondies, articles universitaires | 250 à 400 mots, sens implicite, ironie, nuances lexicales, registre soutenu |
| **Palier 6** | Q36 à Q39 | **C2** | NCLC 10+ | Textes épistémologiques, réflexions philosophiques, analyses rhétoriques complexes | 350 à 500 mots, subtilités de langue, abstractions, style soutenu |

Chaque question produite doit inclure :
- `documentTitle` : Titre du document ou type de support.
- `documentText` : Le texte intégral du document source avec mise en forme propre (sauts de ligne, puces éventuelles).
- `prompt` : L'énoncé exact de la question (ex: "Quelle est la visée principale de l'auteur ?").
- `optionA`, `optionB`, `optionC`, `optionD` : 4 options équilibrées en longueur et syntaxe.
- `correctOption` : Une seule lettre parmi "A", "B", "C", "D".
- `explanation` : Explication pédagogique claire prouvant pourquoi la bonne réponse est exacte.
- `trapAnalysis` : Décodage explicite des 3 pièges / distracteurs et pourquoi ils sont erronés.

---

## 3. Architecture & Découpage en Lots (Batching)

### Problématique des timeouts LLM
Générer 39 questions riches en une seule requête API dépasserait le temps limite des requêtes HTTP (Vercel 15-60s timeout, ou buffers mémoire volumineux).

### Solution architecturale : Génération par Lots (Tiers)
L'API effectue la génération en **3 tranches indépendantes** :
1. **Lot 1 : Paliers A1 & A2 (Questions 1 à 12)** — 12 questions.
2. **Lot 2 : Paliers B1 & B2 (Questions 13 à 28)** — 16 questions (incluant le seuil stratégique B2 / NCLC 7).
3. **Lot 3 : Paliers C1 & C2 (Questions 29 à 39)** — 11 questions de haute complexité lexicale.

L'interface administrateur peut déclencher la génération soit tranche par tranche, soit automatiquement en séquence via un composant de dialogue interactif avec barre de progression.

---

## 4. Spécification des Endpoints d'API

### `POST /api/admin/generate-bulk-series`
Déclenche la génération d'un lot de questions pour une série.

#### Payload Request :
```json
{
  "seriesId": "string (optional - if omitted, creates a new series)",
  "seriesNumber": 102,
  "seriesTitle": "TCF Canada — Compréhension Écrite, Série 102 (Officielle)",
  "theme": "standard" | "canada_work" | "ecology" | "culture",
  "batch": "tier_1_a1_a2" | "tier_2_b1_b2" | "tier_3_c1_c2" | "all"
}
```

#### Response Success (HTTP 200) :
```json
{
  "success": true,
  "seriesId": "cuid...",
  "seriesNumber": 102,
  "batch": "tier_1_a1_a2",
  "createdCount": 12,
  "totalInSeries": 12,
  "questions": [
    {
      "questionNumber": 1,
      "cefrLevel": "A1",
      "nclcTargetLevel": 3,
      "documentTitle": "Offre spéciale de rentrée",
      "prompt": "Que propose cette annonce ?",
      "correctOption": "B"
    }
  ]
}
```

---

## 5. User Stories & Workflow Administrateur

1. **Création en 1 clic :** L'admin clique sur `[🤖 Générer Série 39Q avec IA]` sur la page des séries.
2. **Choix du numéro & de l'angle :** L'assistant suggère automatiquement le prochain numéro disponible (ex: Série 102).
3. **Suivi visuel interactif :** Une barre de progression anime les 3 paliers successifs.
4. **Validation immédiate :** Dès la fin du lot 3 (39/39 questions insérées), le modal affiche le bilan avec un bouton direct vers le simulateur CBT (`/examens/demo-102-ce/ce`) et le gestionnaire de questions.
