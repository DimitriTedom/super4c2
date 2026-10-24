# Brand & Design Canvas — CMS Blog & SEO Studio (`/admin/blog`)

## 1. Vision & Direction Visuelle
- **Nom du Module :** Super4C2 Studio de Rédaction & Moteur SEO
- **Emplacement :** `/admin/blog`, `/admin/blog/ajouter`, `/admin/blog/[id]`
- **Cible Utilisateur :** Dimitri & Équipe Pédagogique Super4C2
- **Objectif UX :** Rédiger, illustrer avec YouTube/images, analyser le SEO en direct et publier un article complet en 5 minutes sans toucher à une ligne de code, tout en surpassant Objectif Canada sur Google.

## 2. Codes Graphiques & Tokens de Design
- **Ambiance :** EdTech / Fintech Haute Fidélité, inspirée des meilleurs CMS modernes (Ghost, Substack Pro, Raycast).
- **Mode Sombre / Mode Clair :** 100% harmonisé avec les variables sémantiques Tailwind (`bg-card`, `bg-muted`, `border-border`, `text-foreground`, `text-muted-foreground`). Zéro fond sombre codé en dur en mode clair.
- **Accents de Marque :**
  - Primaire Écarlate Super4C2 : `#E51A31` / `text-brand-crimson` (indicateurs d'autorité, focus, boutons d'action clés).
  - Or / Ambre NCLC 7+ : `text-amber-500` / `bg-amber-500/10` (badges *À la une*).
  - Émeraude Succès : `text-emerald-500` / `bg-emerald-500/10` (statut *Publié*, score SEO > 80%).
  - Bleu Impérial : `#0B132B` (titres et cartouches d'autorité).

## 3. Composants Clés de l'Interface

### A. Tableau de Bord `/admin/blog`
1. **KPI Cards Exécutives (4 indicateurs clés) :**
   - *Total Articles* (volume de contenu rédigé).
   - *Articles Publiés* (actifs et indexables sur Google).
   - *Brouillons en Cours* (en cours d'élaboration).
   - *Vues Cumulées* (lectures totales par les candidats).
2. **Barre d'Outils & Filtres en 1 Clic :**
   - Recherche en direct par titre, extrait ou mot-clé.
   - Onglets de statut : *Tous*, *Publiés*, *Brouillons*, *À la une*.
   - Filtre par catégorie thématique.
3. **Tableau Interactif & Batch Actions :**
   - Cases à cocher par ligne + case maîtresse d'en-tête.
   - Barre flottante animée `AdminBatchActionBar` avec :
     - Nombre d'articles sélectionnés.
     - Bouton *Publier en masse*.
     - Bouton *Dépublier en masse*.
     - Bouton *Export CSV Groupé* (UTF-8 BOM compatible Excel).
     - Bouton *Supprimer en lot* avec modale de confirmation.
   - Lignes de tableau enrichies : vignette 16:9, titre cliquable, mot-clé ciblé avec badge, catégorie, statut de publication (toggle en 1 clic), bouton vedette *À la une* (toggle en 1 clic), compteur de vues et menu d'actions (Modifier, Voir en direct sur le site, Supprimer).

### B. Studio de Rédaction Haute Fidélité (`BlogForm`)
1. **Assistant d'Optimisation SEO en Temps Réel :**
   - Champ *Mot-clé Principal* (Focus Keyword).
   - Analyseur de densité instantané :
     - Présence dans le Titre H1 (Recommandé).
     - Présence dans le Slug URL (Recommandé).
     - Présence dans l'Extrait / Meta Description (Recommandé).
     - Présence dans le Premier Paragraphe (Recommandé).
     - Jauge de santé SEO globale (0 à 100%).
2. **Intégrateur Média & YouTube 1-Clic :**
   - Saisie de lien YouTube (`https://youtu.be/...` ou `https://www.youtube.com/watch?v=...`).
   - Extraction automatique de l'ID vidéo avec lecteur 16:9 responsive.
   - Bouton 1-clic : *« Définir la miniature YouTube comme couverture HD »*.
   - Bouton 1-clic : *« Insérer la vidéo dans le texte Markdown »*.
   - 6 Presets d'images de couverture haute résolution certifiées (Canada, CBT, Studio Oral, Expression Écrite, FEI, Attestation NCLC 7).
3. **Simulateur de SERP Google (Desktop & Mobile) :**
   - Rendu visuel fidèle de l'affichage dans les résultats de recherche Google :
     - URL verte fil d'ariane : `super4c2.com › blog › [slug]`
     - Titre bleu cliquable (avec compteur 50-60 car. max).
     - Extrait gris méta description (avec compteur 140-160 car. max).
4. **Modèles Didactiques Prêts à l'Emploi :**
   - Modèle 1 : *Guide Méthodologique TCF (Conseils FEI & Pièges)*.
   - Modèle 2 : *Expression Écrite (Plan Tâche 1, 2 ou 3 avec barème)*.
   - Modèle 3 : *Expression Orale (Stratégie Entretien & Jeu de rôle)*.
   - Modèle 4 : *Entrée Express & Bonus CRS +50 pts*.
5. **Configurateur de Call-To-Action (CTA) Contextuel :**
   - Sélecteur d'objectif de conversion candidat :
     - *Simuler mes +50 points CRS* (`/nclc-calculator`)
     - *Démarrer une Simulation CBT d'Examen* (`/examens`)
     - *Consulter les Sujets Récents d'Examen* (`/sujets-recents`)
     - *Rejoindre la Communauté WhatsApp VIP* (`/communaute`)
     - *Tester mon Niveau Gratuitement* (`/test-gratuit`)
   - Libellé du bouton personnalisé.
6. **Panneau Latéral d'Aperçu Tri-Mode :**
   - *Mode Carte Blog* (aperçu du rendu dans la grille `/blog`).
   - *Mode Google SERP* (aperçu dans les résultats de recherche).
   - *Mode Article & Médias* (aperçu complet du header d'article, de la vidéo et du CTA).
