# Spécification Technique — Compagnon de Formation 3D & Hub Méthodologique d'Expression Écrite

## 1. Objectifs & Cas d'Usage
1. **Personnalisation & Dédramatisation :** Permettre au candidat de choisir son compagnon de formation parmi 3 archétypes (Kodiak, Aura, Barnabé). Ce choix est mémorisé (`localStorage` clé `super4c2:user_companion` + profil Supabase).
2. **Sas d'Accueil & Présentation Vocale Non-Intrusive :**
   - Message d'introduction oral et textuel présentant les enjeux du TCF Canada et de l'Expression Écrite.
   - Respect strict du confort utilisateur : bouton "Passer l'introduction", bouton Mute/Unmute, sous-titres synchronisés sous forme de bulles de dialogue interactives.
3. **Hub Pédagogique à 3 Paliers d'Expression Écrite :**
   - **Palier 1 : Présentation & Décryptage FEI :** Barème 20/20, 4 critères (Adéquation, Cohérence, Lexique, Morphosyntaxe), pièges éliminatoires (décompte mots, registres).
   - **Palier 2 : Méthodologie & Ateliers Guidés Tâche par Tâche :**
     - Tâche 1 (Message/Courriel - 15 min, 60–120 mots) : Amorces, salutations, exercice guidé.
     - Tâche 2 (Récit d'expérience - 20 min, 120–150 mots) : Articulateurs temporels, sentiments, exercice guidé.
     - Tâche 3 (Débat d'opinion - 25 min, 120–180 mots) : Thèse/Antithèse/Synthèse, concession, exercice guidé.
     - Correction IA instantanée et Magic Rewrite C1/C2 pour chaque exercice.
   - **Palier 3 : Examen Blanc Officiel (60 min) :** Lancement direct du simulateur CBT avec barre de temps supérieure, clavier virtuel complet et soumission automatique.

---

## 2. Architecture & Modèle de Données

### 2.1. Type `Companion` (`lib/companions/types.ts`)
```typescript
export type CompanionId = "kodiak" | "aura" | "barnabe";

export interface Companion {
  id: CompanionId;
  name: string;
  species: string;
  role: string;
  tagline: string;
  avatarUrl: string;
  greetingAudioUrl?: string;
  speechText: string;
  personality: "warm" | "analytical" | "pragmatic";
  voiceName: string;
}
```

### 2.2. Stockage & Persistance
- Clé locale : `super4c2:user_companion` (`CompanionId`).
- Si non défini au premier abord, le modal/sas propose les 3 compagnons.
- Si déjà défini, le hub s'ouvre directement avec le compagnon sélectionné, tout en permettant d'en changer via un bouton *"Changer de compagnon"*.

### 2.3. Hub Méthodologique (`components/exam/writing-methodology-hub.tsx`)
- Sélecteur d'onglets / modules :
  - `tab = "decryptage"` : Règles FEI, critères de notation, pièges fréquents.
  - `tab = "tache-1"` : Guide méthodologique Tâche 1 + boîte d'entraînement 15 min.
  - `tab = "tache-2"` : Guide méthodologique Tâche 2 + boîte d'entraînement 20 min.
  - `tab = "tache-3"` : Guide méthodologique Tâche 3 + boîte d'entraînement 25 min.
  - `tab = "examen-blanc"` : Carte de lancement de l'Examen Blanc 60 min.

---

## 3. Gestion Audio & Accessibilité
- Lecteur HTML5 audio avec gestionnaire d'erreur `onError` et repli fluide vers l'API `SpeechSynthesis` Web Speech si l'audio distant n'est pas encore généré ou bloqué.
- Pas d'autoplay forcé sonore : démarrage discret avec animation visuelle de bulle et icône de son clignotante invitant à écouter la voix.
