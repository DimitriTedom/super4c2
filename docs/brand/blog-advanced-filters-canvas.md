# Brand & Design Canvas : Filtres Avancés & Tri Intelligent du Blog

## 1. Vision & Objectif Ergonomique
- **Rôle Produit :** Permettre aux candidats d'accéder instantanément au guide précis dont ils ont besoin pour leur séance de révision, sans se perdre dans une liste générique.
- **Tonalité de Marque :**
  - **Efficacité & Précision Suisse :** Interface épurée, compacte, orientée résultat (standards Stripe Docs / Linear / Notion).
  - **Adaptée au Stress du Candidat :** Filtres immédiats selon son épreuve critique du moment (ex: *« J'ai mon oral dans 48h, montrez-moi uniquement l'Expression Orale »* ou *« J'ai 5 minutes dans les transports, donnez-moi un quick tip »*).

---

## 2. Système Visuel & Tokens Graphiques

### 2.1. Barre de Contrôle Unifiée (`BlogFilterBar`)
- **Disposition :**
  - Sur Desktop : Disposition horizontale fluide à deux niveaux :
    - Niveau 1 : Onglets par compétence clé (Pills en boutons arrondis avec icônes distinctives).
    - Niveau 2 : Barre d'outils secondaire compacte regroupant la recherche plein-texte, le sélecteur de format/durée, le menu déroulant de tri et le compteur de résultats.
  - Sur Mobile : Bouton rétractable *« Filtres & Tri (X actifs) »* déployant un tiroir fluide pour ne pas encombrer l'écran.

### 2.2. Taxonomie des Compétences & Puces Graphiques
1. **Toutes les Compétences (`ALL`)** : Icône `Layers`
2. **Expression Écrite (`EE`)** : Icône `PenTool` (Teinte carmin `#E51A31`)
3. **Expression Orale (`EO`)** : Icône `Mic` (Teinte ambre/violette)
4. **Entrée Express & CRS (`CRS`)** : Icône `Compass` (Teinte bleu royal)
5. **Compréhension (`COMPREHENSION`)** : Icône `Headphones` / `BookOpen`
6. **IELTS General (`IELTS`)** : Icône `Languages`
7. **Mes Favoris (`FAVORITES`)** : Icône `Bookmark` avec compteur dynamique

### 2.3. Sélecteur de Format & Temps de Lecture (`ReadTimeFilter`)
- Pastilles compactes :
  - *Tous formats*
  - ⚡ *Fiches Express (< 5 min)*
  - 📖 *Guides Stratégiques (5–9 min)*
  - 🏛️ *Grands Piliers (10+ min)*

### 2.4. Menu Déroulant de Tri (`SortSelector`)
- Options :
  - *Plus récents d'abord* (Défaut)
  - *Recommandés / À la une*
  - *Temps de lecture : le plus court*
  - *Temps de lecture : le plus complet*

---

## 3. Micro-Interactions & Retours Visuels
- **Badge de Résultat Dynamique :** Affichage en temps réel du nombre d'articles correspondants (ex. *« 6 guides trouvés »*).
- **Pastille de Réinitialisation 1-Clic :** Si des filtres non par défaut sont actifs, affichage d'un badge cliquable *« Réinitialiser les filtres ✕ »*.
- **Transition Fluide :** Changement d'affichage des cartes sans sautillement visuel.
