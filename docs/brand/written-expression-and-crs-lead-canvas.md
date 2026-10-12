# Brand & Design Canvas — Expression Écrite : Barre du Temps, Clavier Virtuel FEI, Mode Entraînement Tâche par Tâche & Capture Lead Calculateur CRS

## 1. Contexte & Enjeux
- **Problème Identifié :**
  1. L'Expression Écrite (EE) ne disposait que d'un chronomètre textuel sans retour visuel dynamique de l'écoulement du temps (barre du temps).
  2. Le clavier de caractères spéciaux ne proposait que des minuscules accentuées sans majuscules (`É`, `À`, `Ç`, `Œ`), pénalisant les candidats sur claviers QWERTY lors des débuts de phrases et titres, à la différence d'Objectif Canada.
  3. L'évaluation était globale (3 tâches en 60 min). Les candidats n'avaient pas de mode "Entraînement Tâche par Tâche" avec temps dédié pour travailler spécifiquement la Tâche 1 (15 min), la Tâche 2 (20 min) ou la Tâche 3 (25 min).
  4. L'abandon ou la fin de temps ne gérait pas de manière transparente la soumission du travail partiel avec retour explicite à expiration.
  5. Le Calculateur CRS n'avait pas de mécanisme de conversion par capture d'email pour l'envoi du bilan d'admissibilité complet.
  6. Le copywriting du site contenait des blocs de texte trop denses alors que les visiteurs ont besoin d'un message percutant et ultra-concis expliquant pourquoi le 4C2 se perd à cause de l'Expression Écrite.

## 2. Direction Visuelle & Composants UI

### 2.1. Barre du Temps Visuelle Haute Fidélité (EE CBT)
- **Position :** Directement sous le header officiel de l'épreuve écrite, s'étendant sur toute la largeur (100%).
- **Jauge Dynamique :**
  - Hauteur fine mais nette (`h-1.5` ou `h-2`), fond sombre neutre (`bg-muted/60`).
  - Dégradé progressif aux couleurs de la marque :
    - Vert Émeraude / Bleu Royal (`from-emerald-500 to-blue-600`) lorsque le temps restant est confortable (> 25%).
    - Ambre chaleureux (`from-amber-500 to-orange-500`) lorsque le temps restant passe sous 25% (ou 15 min en mode 60 min, ou 5 min en mode tâche).
    - Rouge Érable Pulsant (`from-red-600 to-brand-crimson animate-pulse`) lors des 5 dernières minutes (ou 2 dernières minutes).
- **Indicateur Chiffré Flottant / Info-Bulle :**
  - Affiche à la fois le pourcentage de temps écoulé et le temps restant précis (`MM:SS`).

### 2.2. Clavier Virtuel Officiel Conforme Objectif Canada & France Éducation International
- **Architecture à Deux Paliers (Minuscules / Majuscules) :**
  - Commutateur interactif `[ a / A ]` (Bouton Majuscule / Caps Lock) permettant de basculer instantanément la palette :
    - **Palette Minuscules :** `é`, `è`, `ê`, `ë`, `à`, `â`, `ç`, `ô`, `î`, `ï`, `ù`, `û`, `œ`, `æ`
    - **Palette Majuscules :** `É`, `È`, `Ê`, `Ë`, `À`, `Â`, `Ç`, `Ô`, `Î`, `Ï`, `Ù`, `Û`, `Œ`, `Æ`
    - **Symboles & Ponctuation Officielle :** `«`, `»`, `’`, `€`, `–`, `…`
  - Boutons carrés arrondis (`h-7 w-7 sm:h-8 sm:w-8`), typographie monospace/sans nette, effet de frappe physique (`active:scale-95`).
  - Insertion au point d'insertion exact (`cursor position`) avec conservation du focus sans réinitialiser le texte.

### 2.3. Sélecteur de Mode : Examen Complet vs Entraînement Tâche par Tâche
- **Deux Modes Opératoires :**
  1. **Mode Examen Blanc Officiel :** 60 minutes globales pour les 3 tâches réunies (conditions réelles d'examen CBT).
  2. **Mode Entraînement Tâche par Tâche :**
     - Choix libre de la tâche à travailler :
       - Tâche 1 : 15 minutes (60 à 120 mots)
       - Tâche 2 : 20 minutes (120 à 150 mots)
       - Tâche 3 : 25 minutes (120 à 180 mots)
     - Bouton Pause / Reprise du chronomètre en mode entraînement.
     - Évaluation immédiate de la tâche travaillée sans obliger à renseigner les autres tâches !

### 2.4. Soumission Manuelle & Automatique Anti-Stress
- Soumission manuelle à tout instant : la modale détaille les tâches rédigées vs non rédigées et valide sans blocage.
- Soumission automatique à expiration (`remaining <= 0`) : interruption de la saisie, toast de réassurance et déclenchement immédiat de l'IA d'évaluation.

### 2.5. Capture Lead & Rapport par Email (Calculateur CRS)
- Encart glassmorphic d'impact sous la note CRS :
  - Titre : *"Recevoir mon Bilan d'Admissibilité Officiel & Plan d'Action NCLC 7"*
  - Promesse : Rapport personnalisé PDF/Email avec analyse des points par épreuve et conseils pour débloquer les +50 points.
  - Champ de saisie Email avec validation regex et envoi direct via `subscribePublicNewsletterAction`.

### 2.6. Copywriting Ultra-Concis (Règle PAS & Julian Shapiro)
- Bloc accrocheur sur la page d'accueil :
  - **Le Constat Choc :** Pourquoi la majorité échoue à obtenir 4C2 au TCF Canada ? **À cause de l'Expression Écrite.**
  - **L'Explication :** En CE/CO, c'est un QCM. En Expression Écrite, un mauvais connecteur ou un décompte hors norme élimine vos +50 points CRS.
  - **La Solution :** Super4C2 vous donne les structures exactes qui passent l'évaluation FEI.
