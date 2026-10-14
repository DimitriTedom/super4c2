# 🧪 Guide de Recette & Procédure de Test — Super4C2

Ce guide vous permet de tester point par point l'ensemble des fonctionnalités et correctifs implémentés sur la plateforme **Super4C2** (Lancement 100% Gratuit, Onboarding TCF Canada, Compagnons 3D, Hub d'Expression Écrite, Éditeur CBT et Isolation des Layouts).

---

## 🚀 Prérequis : Démarrage de l'Application

Dans votre terminal PowerShell ou invite de commandes :

```bash
cd "d:\SnowDev\Documents\super4c2"
npm run dev
```

Ouvrez votre navigateur sur : **`http://localhost:3000`**

---

## 📋 Scénario 1 : Épuration des Pages d'Authentification & Redirection `next`

### Objectif
Vérifier que les pages d'authentification sont 100% épurées (zéro header marketing avec liens, zéro footer à 4 colonnes, zéro widget flottant) et que l'utilisateur est redirigé vers sa destination initiale après connexion.

### Étapes à suivre :
1. **Ouvrez une fenêtre de navigation privée** (pour ne pas être connecté).
2. Tentez d'accéder directement à une page protégée, par exemple :  
   👉 **`http://localhost:3000/examens/demo-101-ee/intro`**
3. **Résultat attendu :**
   - Vous êtes automatiquement redirigé vers `http://localhost:3000/auth/login?next=%2Fexamens%2Fdemo-101-ee%2Fintro`.
   - **Vérification visuelle de la page :**
     - ❌ **Aucun `SiteHeader` marketing** (pas de barre avec *"Simulateur"*, *"Méthodologie"*, *"Blog"*, etc.).
     - ❌ **Aucun `SiteFooter` marketing** (pas de 4 colonnes, pas de formulaire newsletter).
     - ❌ **Aucun bouton flottant Communauté VIP** en bas à droite.
     - ❌ **Aucun widget d'assistance IA flottant**.
     - ✅ **En-tête épuré :** Bouton discret `← Retour à l'accueil` + badge *"Plateforme Officielle TCF & TEF Canada"*.
     - ✅ **Pied de page minimal :** Ligne discrète avec *Mentions Légales*, *Confidentialité* et *Conditions d'utilisation*.
4. Cliquez sur le lien **« Créer mon compte gratuitement »** sous le formulaire.
   - **Résultat attendu :** L'URL devient `/auth/register?next=%2Fexamens%2Fdemo-101-ee%2Fintro` (le paramètre `next` est conservé). La page d'inscription a exactement la même coque épurée.
5. Revenez sur **« Se connecter »** et cliquez sur le bouton :  
   👉 **`⚡ Connexion Démo Immédiate (Candidat Test NCLC 7)`**
6. **Résultat attendu :**
   - Vous êtes instantanément connecté avec un compte candidat.
   - Vous êtes directement redirigé vers **`/examens/demo-101-ee/intro`** (votre destination initiale, et non renvoyé arbitrairement ailleurs).

---

## 🐻 Scénario 2 : Onboarding TCF Canada en 2 Étapes & Choix du Compagnon 3D

### Objectif
Vérifier l'organigramme en 2 étapes : (1) Accueil oral du TCF Canada dans son ensemble, (2) Choix du Compagnon de formation avec le nounours Kodiak en vedette.

### Étapes à suivre :
1. Rendez-vous sur votre tableau de bord candidat :  
   👉 **`http://localhost:3000/dashboard`**
2. Dans le premier encart d'accueil du compagnon, cliquez sur le bouton **« Changer »** (ou ouvrez la boîte de dialogue si c'est votre première visite).
3. **Vérification de l'Étape 1 (Présentation TCF Canada) :**
   - Le titre affiche : *« Bienvenue dans votre Préparation TCF Canada »*.
   - Cliquez sur le bouton **« ▶ Écouter la présentation orale »** :
     - Vérifiez que la voix (Web Speech API) démarre et lit le texte d'accueil du TCF Canada.
     - Observez le badge vert pulsant *« Lecture en direct »*.
     - Vous pouvez cliquer sur *« Mettre en pause l'audio »* pour stopper la voix.
   - Examinez la grille des 4 compétences (CO, CE, EE ouverte, EO ouverte) et le badge *« +50 PTS CRS »*.
   - Cliquez sur le bouton **« Suivant : Choisir mon Compagnon de Formation → »**.
4. **Vérification de l'Étape 2 (Choix du Compagnon 3D) :**
   - 3 cartes 3D s'affichent :
     - **Kodiak** (Grizzly canadien / petit nounours 3D avec écharpe rouge, mis en vedette avec le badge *« ⭐ Coach Recommandé »*).
     - **Aura** (IA holographique aux reflets cyan).
     - **Barnabé** (Castor bâtisseur canadien avec lunettes).
   - Cliquez sur **« Écouter Kodiak »** (ou Aura / Barnabé) : vérifiez que sa réplique d'encouragement est lue.
   - Sélectionnez **Kodiak** (une pastille avec coche rouge/crimson valide la sélection).
   - Cliquez sur **« Choisir Kodiak & Continuer »**.
5. **Résultat attendu :**
   - La boîte se ferme.
   - L'avatar de Kodiak apparaît sur votre tableau de bord et dans l'en-tête de l'épreuve.
   - Le choix est sauvegardé dans le navigateur (`localStorage: super4c2:user_companion`).

---

## ✍️ Scénario 3 : Hub d'Expression Écrite en 3 Grands Titres

### Objectif
Vérifier que la page d'Expression Écrite accueille le candidat par la voix de son compagnon et organise l'apprentissage selon les 3 grands titres : Présentation ➔ Méthodologie & Exercices Corrigés ➔ Examen Blanc.

### Étapes à suivre :
1. Rendez-vous sur la page du Hub d'Expression Écrite :  
   👉 **`http://localhost:3000/examens/demo-101-ee/intro`**
2. **Vérification du bandeau d'accueil du Compagnon :**
   - L'avatar 3D de Kodiak apparaît en haut avec son badge *« 🇨🇦 Coach Boréal »*.
   - Cliquez sur **« ▶ Écouter Kodiak présenter la page »** :
     - Kodiak lit le texte annonçant la visite guidée : *« Bonjour ! Bienvenue dans l'espace d'Expression Écrite du TCF Canada... Voici ce que tu vas trouver sur cette page : 1. une présentation de l'épreuve et du barème FEI, 2. la méthodologie de chacune des tâches accompagnée d'exercices d'application corrects, et 3. la session d'examen blanc sur 60 min. »*
     - L'avatar s'illumine avec un halo vert pendant qu'il parle.
3. **Grand Titre 1 — Présentation de l'Épreuve :**
   - Cliquez sur l'onglet **« Étape 1 : Présentation de l'Épreuve »**.
   - Vérifiez l'affichage :
     - Les 3 tâches en résumé (Tâche 1: 60-120 mots, Tâche 2: 120-150 mots, Tâche 3: 120-180 mots).
     - La grille officielle des 4 critères FEI sur 20 points (Adéquation 5 pts, Cohérence 5 pts, Lexique 5 pts, Morphosyntaxe 5 pts).
     - Les 3 pièges éliminatoires (sous-volume de mots, texte en bloc unique, parti pris immédiat).
   - Cliquez sur le bouton en bas : **« Passer au Grand Titre 2 : Méthodologie & Exercices Corrigés → »**.
4. **Grand Titre 2 — Méthodologie & Exercices d'Application Corrigés :**
   - Vous arrivez sur l'onglet **« Étape 2 »**.
   - **Tâche 1 (Courriel • 15 min) :**
     - Examinez la méthode en 3 blocs (Salutation & motif, description, invitation).
     - Examinez l'encadré **Exercice d'Application Officiel** :
       - **Sujet Type :** Emménagement à Montréal et invitation d'un ami.
       - **Corrigé Modèle C1/C2 rédigé :** 94 mots complets et élégants.
       - **Décryptage 20/20 :** Explication des 4 critères (Adéquation 5/5, Cohérence 5/5, Lexique 5/5, Grammaire 5/5).
   - Cliquez sur **« Méthodologie Tâche 2 (Récit) »** :
     - Même structure : méthode citoyenne + Sujet bénévole de parc + Corrigé modèle 138 mots + Décryptage 20/20.
   - Cliquez sur **« Méthodologie Tâche 3 (Débat) »** :
     - Même structure : règle des 2 thèses opposées + Sujet véhicules polluants + Corrigé modèle 162 mots avec concessions + Décryptage 20/20.
5. Cliquez sur le bouton : **« Passer au Grand Titre 3 : L'Examen Blanc 60 min → »**.
6. **Grand Titre 3 — Session Examen Blanc (60 min) :**
   - Vous visualisez le récapitulatif des conditions réelles (chronomètre continu 60 min, barre du temps, clavier d'accents FEI, sauvegarde continue).

---

## ⏱️ Scénario 4 : Salle d'Examen CBT & Outils Candidat (Barre de Temps & Clavier FEI)

### Objectif
Vérifier l'environnement d'examen officiel CBT : isolation totale, décompte de temps, clavier d'accents majuscules/minuscules et soumission.

### Étapes à suivre :
1. Lancez un entraînement sur la Tâche 1 ou l'Examen Blanc :  
   👉 **`http://localhost:3000/examens/demo-101-ee/ee?mode=training&task=1`**
2. **Vérification de l'isolation de la salle d'examen :**
   - ❌ **Aucun header marketing**.
   - ❌ **Aucun footer marketing**.
   - ❌ **Aucun bouton flottant de communauté**.
   - ❌ **Aucune bannière de consentement des cookies** ne vient recouvrir l'écran.
   - ✅ L'écran est dédié à 100% à l'épreuve.
3. **Vérification de la Barre du Temps Supérieure :**
   - En haut de l'éditeur, observez la jauge horizontale de temps.
   - Le temps restant s'écoule en temps réel (ex. `14:58`).
   - La couleur est émeraude/bleue (> 25% du temps restant), passera à l'ambre (<= 25%), puis au rouge vif pulsant dans les dernières minutes.
4. **Vérification du Clavier Virtuel d'Accents FEI :**
   - Cliquez dans la zone de texte pour placer le curseur.
   - Sous la zone de texte, observez la rangée de touches accentuées : `é, è, ê, ë, à, â, ç, ô, î, ï, ù, û, œ, æ, «, »`.
   - Cliquez sur `é` : le caractère est inséré exactement au curseur sans perdre le focus.
   - Cliquez sur le bouton bascule **`[ a / A ]` (Maj)** :
     - Les touches se transforment instantanément en majuscules : `É, È, Ê, Ë, À, Â, Ç, Ô, Î, Ï, Ù, Û, Œ, Æ`.
     - Cliquez sur `É` : une majuscule accentuée est insérée en tête de paragraphe.
5. **Vérification de la Soumission & Correction IA :**
   - Rédigez ou collez quelques phrases dans l'éditeur.
   - Cliquez sur le bouton **« Terminer et Soumettre mon Travail »**.
   - Confirmez la soumission dans la boîte de dialogue.
   - **Résultat attendu :** L'évaluation IA analyse votre copie selon la grille FEI et affiche votre note sur 20, vos points par critère, et les suggestions d'optimisation *Magic Rewrite*.

---

## 🔒 Scénario 5 : Lancement 100% Gratuit & Masquage des Tarifs

### Objectif
Vérifier que le modèle payant est complètement masqué et que la plateforme est en accès gratuit.

### Étapes à suivre :
1. Dans la barre d'adresse du navigateur, tapez :  
   👉 **`http://localhost:3000/tarifs`**
2. **Résultat attendu :**
   - Vous êtes automatiquement redirigé vers **`/dashboard`** (redirection serveur HTTP 307).
3. Tapez :  
   👉 **`http://localhost:3000/checkout`**
4. **Résultat attendu :**
   - Redirection automatique vers **`/dashboard`**.
5. Observez la barre de navigation du site et le footer :
   - L'ancien lien *"Tarifs"* est remplacé par le badge pulsant **« Accès 100% Gratuit — Pass Lancement Offert »**.
6. Rendez-vous sur la Compréhension Écrite ou Orale :  
   👉 **`http://localhost:3000/examens/demo-101-ce/ce`**
7. **Résultat attendu :**
   - Un écran officiel clair informe que le module est en cours de calibrage avec France Éducation International.
   - Deux boutons vous proposent d'accéder directement aux modules ouverts : **« S'entraîner en Expression Écrite »** ou **« S'entraîner en Expression Orale »**.

---

## 📊 Matrice Récapitulative des URLs de Test

| Fonctionnalité à Tester | URL Directe | Résultat Clé Attendu |
| :--- | :--- | :--- |
| **Page Connexion Épurée** | `/auth/login` | Pas de header/footer marketing, coque centrée |
| **Page Inscription Épurée** | `/auth/register` | Formulaire clair, préservation de `?next=...` |
| **Tableau de Bord Candidat** | `/dashboard` | Accueil par Kodiak, cartes EE & EO gratuites |
| **Hub Expression Écrite** | `/examens/demo-101-ee/intro` | Visite guidée vocale, 3 grands titres, exercices corrigés |
| **Entraînement Tâche 1** | `/examens/demo-101-ee/ee?mode=training&task=1` | Barre du temps 15 min, clavier accents `[ a / A ]` |
| **Examen Blanc 60 min** | `/examens/demo-101-ee/ee?mode=exam` | Écran isolé 60:00 sans footer/cookies, autosave |
| **Salle d'Oral IA Live** | `/examens/demo-101-ce/eo/intro` | Pré-test micro & examinateur vocal M. Laurent |
| **Redirection Tarifs Masqués** | `/tarifs` | Redirection 307 instantanée vers `/dashboard` |
| **Statut CE en Calibrage** | `/examens/demo-101-ce/ce` | Modale explicative FEI avec redirection vers EE & EO |
