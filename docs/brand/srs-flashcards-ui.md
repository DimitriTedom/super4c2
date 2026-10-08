# 🎨 Brand & Design Canvas : Carnet d'Erreurs SRS & Flashcards SM-2 (Super4C2)

## 1. Intention & Philosophie Pédagogique
Le Carnet d'Erreurs à Répétition Espacée (SRS) est l'arme secrète des candidats visant le palier **NCLC 7+ (+50 points CRS Entrée Express)**.
Contrairement au bachotage passif, le SRS transforme chaque mauvaise réponse en ancrage mémoriel durable grâce à l'algorithme scientifique **SuperMemo SM-2**.

### Objectif Émotionnel & UX
- Réduire l'anxiété du candidat en lui prouvant scientifiquement qu'aucune erreur n'est vaine : chaque erreur ratée est transformée en opportunité de score.
- Donner une impression de cockpit de maîtrise cognitive (Fintech / EdTech d'élite, fond Imperial Navy, accents Maple Crimson et C2 Emerald).
- Fluidité tactile et clavier digne d'Anki moderne, avec des animations 3D soignées.

---

## 2. Direction Visuelle & Composants

### A. Statistiques & Deck Quotidien (`SrsDeckOverview`)
- **Compteur Dues Aujourd'hui :** Chiffre en gros caractères `font-display tabular-nums`, lueur Maple Crimson pulsée invitant à réviser.
- **Répartition Mémorielle :**
  - 🔴 *À revoir (Intervalle 1j)* : Badge rouge alerte.
  - 🟠 *En consolidation (3-6j)* : Badge ambre vif.
  - 🟢 *Ancré durablement (15j+)* : Badge vert émeraude FEI.
- **Bouton Master CTA :** `[⚡ Lancer la Session Quotidienne (X cartes)]` avec gradient Maple Crimson -> Dark Crimson.

### B. Lecteur de Flashcards Interactif 3D (`SrsFlashcardPlayer`)
- **Recto (Question & Piège rencontré) :**
  - Badge de discipline (`CE · Q19`, `CO · Q2`, etc.) et type de piège.
  - Énoncé de la question et extrait du document source.
  - Votre réponse erronée mise en valeur avec mise en garde rouge.
  - Gros bouton central interactif : `[ Afficher la Réponse & Règle Anti-Piège ]` (raccourci `Espace`).
- **Verso (Décodage & Ancrage) :**
  - Animation de bascule / dépliement fluide (`framer-motion`).
  - La bonne réponse officielle en vert émeraude.
  - Explication de la règle grammaticale / logique.
  - **Astuce chirurgicale anti-piège** (comment déjouer le piège au vrai test).
- **Barre d'Évaluation SM-2 (4 Boutons de retour) :**
  1. `[1] À revoir` (Rouge `#EF4444`) — Intervalle remis à 1 jour.
  2. `[2] Difficile` (Orange `#F59E0B`) — Intervalle court.
  3. `[3] Bon` (Vert `#10B981`) — Progression normale calculée.
  4. `[4] Facile` (Cyan `#00B4D8`) — Intervalle accéléré.
  - Raccourcis clavier physiques `1`, `2`, `3`, `4` pour une cadence rapide sans souris.

### C. Répertoire des Cartes & Recherche (`SrsCardsDirectory`)
- Recherche instantanée par mot-clé, règle ou type de piège.
- Filtres rapides : *Toutes*, *Dues aujourd'hui*, *CE*, *CO*, *EE*, *EO*.
- Possibilité de réinitialiser une carte ou de l'archiver manuellement.
