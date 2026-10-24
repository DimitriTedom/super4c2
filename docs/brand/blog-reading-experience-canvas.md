# Brand & Design Canvas — Expérience de Lecture Publique Premium (`/blog/[slug]`)

## 1. Vision & Direction Visuelle
- **Nom du Module :** Super4C2 Studio de Lecture & Rétention Candidat
- **Emplacement :** `/blog/[slug]`, `/blog`
- **Objectif Expérientiel :** Offrir une expérience de lecture comparable aux publications de référence (Stripe Press, Substack Pro, The Verge), maintenant le candidat plus de 4 minutes sur la page (*Dwell Time*) pour propulser l'article dans le Top 3 Google.

## 2. Codes Graphiques & Ergonomie Éditoriale
- **Typographie :**
  - Titres : `Bricolage Grotesque` ultra-gras, interlignage serré (`leading-[1.15]`), taille adaptative `text-3xl sm:text-5xl`.
  - Corps de texte : `DM Sans` / sans-serif haute lisibilité, taille `text-base sm:text-lg`, interlignage aéré `leading-relaxed` (1.75), espacement de paragraphes généreux.
  - Éléments de code / scores / seuils : police monospace `font-mono`.
- **Hiérarchie Visuelle à 3 Pôles :**
  1. *Colonne Principale (680px - 740px) :* Le sanctuaire de lecture, centré, sans distraction.
  2. *Sidebar Droite / Flottante (Desktop) :* Sommaire interactif automatique (Table of Contents) avec suivi d'ancre actif et barre de progression.
  3. *Zone de Conversion Bas de Page :* Encart d'appel à l'action haute fidélité avec fond dégradé subtil et `ShimmerButton` rouge écarlate.

## 3. Composants Clés de la Lecture Publique

### A. Indicateur de Défilement (Reading Progress Bar)
- Barre ultra-fine de 2.5px fixée sous la navbar, animée dynamiquement au scroll (`scaleX(progress)`).
- Dégradé écarlate Super4C2 (`#E51A31` vers or `#F59E0B`).

### B. Sommaire Interactif Dynamique (Table of Contents)
- Détection automatique de tous les titres `##` (H2) et `###` (H3) du Markdown.
- Génération d'ID d'ancrage sémantique `slugify(headingText)`.
- Liens cliquables avec défilement fluide `scrollIntoView({ behavior: 'smooth' })`.
- Détection active de la section visible via `IntersectionObserver` avec surbrillance rouge écarlate de la puce active.
- Masquage intelligent sur mobile avec tiroir repliable (accordéon) en tête de contenu.

### C. Intégrateur Vidéo YouTube 16:9 Responsive
- Player vidéo YouTube intégré dans un container 16:9 à bords arrondis (`rounded-2xl`) avec ombre portée douce.
- Badge d'autorité *« Vidéo Explicative Officielle »*.
- Déclenchement sans décalage de mise en page (*Zero Cumulative Layout Shift*).

### D. Encart d'Autorité E-E-A-T Google
- Gravatar / Initiales stylisées de Dimitri & de l'Équipe Pédagogique Super4C2.
- Titre : *Expert NCLC & Ancien Correcteur FEI*.
- Mention : *« Article rédigé et vérifié selon les normes officielles du TCF Canada (France Éducation International / IRCC) »*.
- Badges de partage social en 1-clic : WhatsApp (message pré-rempli avec lien), LinkedIn, Twitter/X, et bouton Copier le lien.

### E. Blocs Callout Didactiques Encaissés
- **Conseil Pédagogique FEI :** Fond émeraude doux `bg-emerald-500/10`, bordure gauche `border-emerald-500`, icône ampoule `Lightbulb`.
- **Piège à Éviter :** Fond ambre doux `bg-amber-500/10`, bordure gauche `border-amber-500`, icône avertissement `AlertTriangle`.
- **Formule C1/C2 Recommandée :** Fond bleu impérial `bg-sky-500/10`, bordure gauche `border-sky-500`, icône gemme `Sparkles`.
