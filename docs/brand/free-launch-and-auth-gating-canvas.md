# Brand & Design Canvas — Accès Gratuit Lancement, Verrouillage Auth & UX Dashboard

**Date :** 12 Octobre 2026  
**Auteur :** Antigravity Agent & Dimitri (@dimitri-snowdev)  
**Projet :** Super4C2 (Préparation TCF Canada C2 / +50 CRS)

---

## 1. Philosophie & Tonalité Visuelle

### Contexte Stratégique
Pour la phase de lancement de Super4C2 :
1. **L'application est 100% gratuite** : Aucun obstacle financier ou friction de paiement. L'objectif est d'accueillir les candidats, de générer de l'engagement massif et des retours d'expérience.
2. **Focus Disciplines phares : Expression Écrite (EE) & Expression Orale (EO)** : Les deux épreuves productives où 78% des candidats échouent au TCF Canada et où l'IA Super4C2 apporte une valeur instantanée irremplaçable (correction FEI, Magic Rewrite C1/C2, simulateur visio M. Laurent).
3. **Compréhension Écrite (CE) & Compréhension Orale (CO) en statut "Bientôt disponible"** : Mise en valeur élégante (badge Cadenas doré / Calibrage FEI en cours), rassurante et professionnelle, évitant toute impression de bug ou de lien brisé.
4. **Verrouillage du Système (Auth Gating)** : Les simulateurs et outils sont réservés aux candidats connectés. L'inscription gratuite est la seule contrepartie requise.
5. **Tableau de Bord Candidat (`/dashboard`) comme Tour de Contrôle** : Accueillant, clair, centré sur le compagnon 3D et les actions immédiates.

---

## 2. Palette Visuelle & Badges

| Élément | Couleur / Gradient | Rôle UI |
|---|---|---|
| **Bannière Lancement Gratuit** | Dégradé `from-amber-500/20 via-emerald-500/20 to-brand-crimson/20` avec bordure dorée `border-amber-500/40` | Notification de réassurance : 100% Gratuit pour le lancement |
| **Badge "Disponible" (EE / EO)** | `bg-emerald-500/10 text-emerald-600 border-emerald-500/30` | Indique l'immédiate disponibilité des épreuves phares |
| **Badge "Bientôt disponible" (CE / CO)** | `bg-amber-500/10 text-amber-600 border-amber-500/30` avec icône `Lock` | Indique le calibrage officiel FEI en cours sans frustration |
| **Bouton Primaire Navigation** | Rouge Érable `#E51A31` / Hover `#B31224` | CTA principal d'action |
| **Carte Compagnon 3D** | Fond glassmorphism `bg-card/80 backdrop-blur-md` | Présence chaleureuse de Kodiak, Aura ou Barnabé sur le dashboard |

---

## 3. Typographie & Composants Clés

- **Titres** : *Bricolage Grotesque*, font-extrabold, tracking-tight.
- **Corps de texte & Télémétrie** : *DM Sans* & *Space Mono* pour les métriques et chronos.
- **Cartes de Compétences Dashboard** :
  - Format 2x2 ou 2 colonnes avec mise en exergue des deux compétences actives (EE et EO) en cartes héroïques grand format avec CTA *"S'entraîner maintenant"*.
  - Les deux compétences en cours de calibrage (CE et CO) présentées avec un filtre doux et un message *"Calibrage des banques officielles FEI en cours"*.

---

## 4. Règle d'Ergonomie de Redirection (No Dead Ends)
- Toute tentative d'accès à une page protégée redirige vers `/auth/login?next=...` ou `/auth/register?next=...`.
- Toute tentative d'accès à `/tarifs` ou `/checkout` redirige vers `/dashboard` avec notification de gratuité.
- Tout clic sur CE ou CO informe poliment le candidat avec modalité de notification plutôt que de provoquer une erreur 404.
