# 🧪 Guide de Recette & Procédure de Test — Super4C2

Ce guide vous permet de tester point par point l'ensemble des fonctionnalités et correctifs majeurs de la plateforme **Super4C2** :
1. Résolution de la route `/examens/demo-101-ee/intro` (sans erreur 404).
2. Remplacement des mascottes/toons par des **Mentors Humains Professionnels** (M. Laurent Mercier, Mme Éléonore de Saint-Germain, Marc-Antoine Tremblay).
3. Utilisation de **véritables enregistrements studio ElevenLabs** (au lieu de la voix de synthèse locale du navigateur).
4. Salle d'Expression Orale interactive (`/examens/demo-101-eo/eo`) avec **lecteur vidéo animé de l'examinateur** (boucle d'attente/écoute active vs boucle de parole/mime).
5. Prompts 1:1 Flow / Veo 3.1 disponibles dans `docs/prompts/examiner-veo3-prompts.md`.

---

## 🚀 Prérequis : Démarrage du Serveur

Dans votre terminal :

```bash
cd "d:\SnowDev\Documents\super4c2"
npm run dev
```

Ouvrez votre navigateur sur : **`http://localhost:3000`**

---

## 📋 Scénario 1 : Accès direct au Hub d'Expression Écrite (Résolution 404)

### Objectif
Vérifier que l'URL `http://localhost:3000/examens/demo-101-ee/intro` s'affiche immédiatement sans aucune page 404.

### Étapes :
1. Connectez-vous (ex: `http://localhost:3000/auth/login` ➔ bouton *⚡ Connexion Démo Immédiate*).
2. Rendez-vous directement sur :  
   👉 **`http://localhost:3000/examens/demo-101-ee/intro`**
3. **Résultat attendu :**
   - ✅ **Code HTTP 200 (Aucune page 404)**.
   - Le Hub d'Expression Écrite s'affiche avec son bandeau de mentorat et les 3 grands titres pédagogiques (Présentation, Méthodologie & Exercices Corrigés, Examen Blanc 60 min).

---

## 🏛️ Scénario 2 : Mentors Humains & Voix Studio ElevenLabs

### Objectif
Vérifier que les toons ont été remplacés par des mentors humains prestigieux, et que le bouton d'écoute joue un véritable enregistrement vocal studio ElevenLabs de haute qualité.

### Étapes :
1. Rendez-vous sur votre tableau de bord :  
   👉 **`http://localhost:3000/dashboard`**
2. Observez l'encart d'accueil en tête de page :
   - ✅ L'examinateur **M. Laurent Mercier** (badge *🏛️ Examinateur FEI*) est affiché avec son portrait photographique institutionnel.
3. Cliquez sur **« Écouter M. Laurent Mercier »** :
   - ✅ Un véritable enregistrement audio studio ElevenLabs (`/audio/eo/laurent-step1.mp3`) est lu instantanément.
   - ❌ Zéro voix robotique de navigateur Web Speech API.
   - Le bouton passe en *« Arrêter la voix »* avec icône animée.
4. Cliquez sur **« Changer »** pour ouvrir le modal de sélection :
   - **Étape 1 :** Présentation officielle TCF Canada avec bouton *« Écouter la présentation orale »* (lecture studio).
   - Cliquez sur **« Suivant »** vers l'**Étape 2** :
     - **M. Laurent Mercier** (Lead Examinateur FEI, portrait officiel).
     - **Mme Éléonore de Saint-Germain** (Formatrice & Experte Stylistique C1/C2).
     - **Marc-Antoine Tremblay** (Pédagogue & Immersion Canada, Montréal).
   - Testez le bouton d'écoute sur chaque profil.
   - Choisissez un mentor et confirmez.

---

## 🎥 Scénario 3 : Salle d'Oral Interactive avec Vidéo Animée de l'Examinateur

### Objectif
Vérifier que la salle d'Expression Orale remplace l'image statique par une véritable vidéo animée qui commute en temps réel selon l'état de parole de l'examinateur.

### Étapes :
1. Rendez-vous sur la salle d'Expression Orale :  
   👉 **`http://localhost:3000/examens/demo-101-eo/eo`**
2. **Observation de l'Examinateur M. Laurent (Pod Vidéo en Direct) :**
   - **État 1 — Attente / Écoute Attentive (`examiner_idle.mp4`) :**
     - Lorsque l'examinateur ne parle pas, la vidéo en boucle d'attente s'exécute de façon fluide.
     - L'examinateur maintient le contact visuel avec de légers mouvements naturels (clignements d'yeux, respiration posée).
     - Le badge inférieur indique : *« En attente de votre réponse »* ou *« Microphone actif »*.
   - **État 2 — Parole / Mime Articulatoire (`examiner_speaking.mp4`) :**
     - Cliquez sur **« Réécouter »** la consigne (ou laissez la consigne audio démarrer).
     - Instantanément, la vidéo bascule avec un fondu ultra-fluide sur la boucle de parole : l'examinateur anime ses lèvres et son expression au rythme de l'énoncé.
     - Le badge inférieur pulse en cyan : *« M. Laurent s'exprime... »*.
     - Cliquez sur **« Passer les consignes »** en haut à droite : la vidéo revient immédiatement à l'état d'écoute attentive sans aucune coupure ni écran noir.

---

## 📝 Scénario 4 : Prompts 1:1 Google Flow / Veo 3.1

Pour générer des variantes ou de nouveaux clips vidéo avec Google Flow ou Veo 3.1 :
- Ouvrez le fichier : [examiner-veo3-prompts.md](file:///d:/SnowDev/Documents/super4c2/docs/prompts/examiner-veo3-prompts.md)
- Les prompts respectent la structure en 6 blocs de commandement directorial :
  1. *Shot type & lens*
  2. *Subject & action (physics-grounded)*
  3. *Environment & setting*
  4. *Lighting*
  5. *Camera movement*
  6. *Audio (ambient layers)*

---

## 📊 Matrice des URLs de Test

| Page à Tester | URL | Statut Attendu |
| :--- | :--- | :--- |
| **Hub Expression Écrite** | `/examens/demo-101-ee/intro` | HTTP 200 • Aucun 404 • Hub complet |
| **Session Oral Vidéo** | `/examens/demo-101-eo/eo` | Vidéo animée idle / speaking en temps réel |
| **Calibrage Micro & Consignes** | `/examens/demo-101-eo/intro` | Calibrage audio + check matériel |
| **Tableau de Bord Candidat** | `/dashboard` | Mentor Laurent + audio studio ElevenLabs |
| **Éditeur CBT 60 min** | `/examens/demo-101-ee/ee?mode=exam` | Écran isolé, barre de temps, clavier accents |
