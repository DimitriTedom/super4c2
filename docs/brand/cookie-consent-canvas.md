# Brand & Design Canvas — Cookie Consent & Legal Experience Super4C2

## 1. Philosophie Visuelle & Identité de Marque
- **Tonalité :** Institutionnelle, rassurante, transparente et premium (Fintech / EdTech internationale).
- **Objectif :** Répondre aux plus hauts standards de conformité (RGPD européen, ePrivacy, Loi 25 du Québec, directives canadiennes PIPEDA) sans jamais dégrader l'expérience d'entraînement CBT ni créer de "dark patterns".
- **Couleurs & Tokens :**
  - Fond : `bg-background/95 backdrop-blur-xl border border-border/80 shadow-2xl`
  - Accentuation : `text-brand-crimson` (`#E51A31`) et `text-primary`
  - Pastilles d'état : Vert émeraude pour les cookies strictement essentiels, Ambre/Cyan pour les préférences de révision SRS et statistiques de latence IA.

## 2. Anatomie de la Bannière Flottante (`CookieConsentBanner`)
- **Positionnement :** Barre flottante ancrée en bas de l'écran (`fixed bottom-4 inset-x-4 max-w-4xl mx-auto z-50 rounded-2xl`), responsive sur mobile et desktop.
- **Micro-animations :** Entrée fluide avec Framer Motion (`initial: opacity 0, y 20` ➔ `animate: opacity 1, y 0`).
- **Composants d'Action :**
  1. **Bouton Primaire ("Tout accepter") :** Bouton plein Crimson avec reflet shimmer, active l'ensemble des catégories.
  2. **Bouton Secondaire ("Continuer sans accepter" / "Refuser non-essentiels") :** Bouton outline sobre, active uniquement les essentiels.
  3. **Bouton Tertiaire ("Personnaliser mes choix") :** Ouvre un tiroir dépliable présentant les 3 catégories de traceurs avec interrupteurs interactifs.

## 3. Catégorisation des Traceurs Super4C2
1. **Traceurs Strictement Nécessaires (Obligatoires) :**
   - Jetons de session d'authentification Supabase (`sb-*-auth-token`).
   - Maintien du chronomètre de l'examen officiel CBT et sauvegarde locale des réponses en cours.
   - Choix de consentement utilisateur (`super4c2_cookie_consent_v1`).
2. **Traceurs Fonctionnels & Répétition Espacée (Optionnels) :**
   - Sauvegarde des erreurs d'examen dans le Carnet d'Erreurs SRS (`super4c2:srs_cards`).
   - Mémorisation du volume et de la vitesse de lecture audio du lecteur de Compréhension Orale (`0.8x / 1.0x / 1.2x`).
   - Mémorisation du thème d'affichage (Clair / Sombre).
3. **Traceurs de Mesure & Optimisation IA (Optionnels) :**
   - Télémétrie de latence anonymisée pour les générations de feedbacks IA FEI (DeepSeek) et de synthèse vocale (ElevenLabs).
   - Aucune régie publicitaire, aucun partage avec des tiers.

## 4. Réouverture & Accessibilité Permanente
- Présence d'un déclencheur "Gestion des Cookies" dans le `SiteFooter` et sur la page `/cookies`.
- Événement personnalisé `window.dispatchEvent(new CustomEvent('super4c2:open_cookie_preferences'))` permettant de modifier son choix à tout instant.
