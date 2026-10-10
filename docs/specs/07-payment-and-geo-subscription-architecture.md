# Document de Spécification Technique — Architecture Paiement & Tarification Géolocalisée (Super4C2)

**Version :** 1.0  
**Statut :** Validé / En cours d'implémentation  
**Auteur :** Antigravity AI & Dimitri (@dimitri-snowdev)  
**Date :** Octobre 2026  
**Fichiers Liés :**  
- UI Frontend : [`components/pricing/geo-pricing-section.tsx`](file:///d:/SnowDev/Documents/super4c2/components/pricing/geo-pricing-section.tsx)
- Moteur Géolocalisé : [`lib/pricing/geo-pricing.ts`](file:///d:/SnowDev/Documents/super4c2/lib/pricing/geo-pricing.ts)
- Page Tarifs : [`app/tarifs/page.tsx`](file:///d:/SnowDev/Documents/super4c2/app/tarifs/page.tsx)
- Modèles Prisma : [`prisma/schema.prisma`](file:///d:/SnowDev/Documents/super4c2/prisma/schema.prisma)

---

## 1. Philosophie & Différenciation Marché

### 1.1 Problème Résolu (Anti-Pattern "Objectif Canada")
Sur les plateformes concurrentes (ex. Objectif Canada), les prix sont affichés sous une multitude de monnaies encombrantes sur la même carte (`17 500 FCFA / 27 € / 35 $ USD / 45 $ CAD`), surchargeant l'interface et créant un manque de professionnalisme.

### 1.2 Notre Approche : Détection Géolocalisée Intelligente
Super4C2 détecte automatiquement d'où se connecte le candidat (IP Vercel / Cloudflare Header ou fuseau horaire du navigateur) et **n'affiche qu'une seule monnaie native** :
- **Afrique Centrale & Ouest (Zone Franc CFA) :** `FCFA` (XAF / XOF) avec paiement direct **Mobile Money** (MTN MoMo, Orange Money, Wave).
- **France & Union Européenne :** `EUR (€)` avec paiement CB / Apple Pay / Google Pay.
- **Canada :** `CAD ($ CAD)` avec paiement CB / Interac / Apple Pay.
- **Reste du Monde (USA, Maghreb, International) :** `USD ($ USD)`.

Un sélecteur discret et élégant permet toujours au candidat d'ajuster sa monnaie manuellement en cas de voyage ou de carte étrangère.

---

## 2. Grille Tarifaire & Droits d'Accès (Entitlements)

Les formules sont conçues pour maximiser la conversion tout en restant ultra-compétitives par rapport aux 300 $ CAD d'un échec au test officiel.

| Formule | Durée | FCFA (Afrique) | EUR (Europe) | CAD (Canada) | USD (Monde) | Droits & Simulateurs Inclus |
| :--- | :---: | :---: | :---: | :---: | :---: | :--- |
| **Pass Sprint** | 7 jours | **5 000 FCFA** | 7,99 € | 12 $ CAD | 9 $ USD | 5 examens CBT complets, 3 écrits corrigés, 2 oraux IA, carnet d'erreurs |
| **Pass Intensif** | 15 jours | **10 000 FCFA** | 15,99 € | 23 $ CAD | 17 $ USD | 15 examens CBT complets, 10 écrits corrigés, 6 oraux IA, carnet d'erreurs |
| **Pass Succès NCLC 7 ⭐** *(Recommandé)* | 30 jours | **15 000 FCFA** | 22,99 € | 34 $ CAD | 25 $ USD | **CBT Illimité**, 3 Examens Blancs Complets 4 épreuves, 25 écrits Magic Rewrite C1/C2, 15 oraux IA vocaux, simulateur CRS +50 pts |
| **Pass VIP Garantie NCLC 7+** | 60 jours | **25 000 FCFA** | 38,99 € | 58 $ CAD | 42 $ USD | **Accès TOTAL & ILLIMITÉ 60j**, tous examens blancs, corrections illimitées, garantie prolongation gratuite si NCLC 7 non atteint |

---

## 3. Architecture Technique des Passerelles de Paiement

### 3.1 Dual-Gateway Routing
Le système achemine automatiquement la transaction vers la passerelle optimale selon la devise choisie :
1. **Passerelle Afrique (Mobile Money) : `CinetPay` / `NotchPay`**
   - Moyens : MTN Mobile Money (Cameroun, Côte d'Ivoire, Bénin), Orange Money (Cameroun, CI, Sénégal), Wave (Sénégal, CI), Moov.
   - Flow : Initialisation serveur ➔ Redirection guichet sécurisé Mobile Money (avec push USSD sur téléphone du candidat) ➔ Callback webhook synchrone.
2. **Passerelle Internationale : `Stripe Checkout`**
   - Moyens : Cartes bancaires (Visa, Mastercard), Apple Pay, Google Pay.
   - Flow : Session Stripe Checkout hébergée ➔ Webhook `checkout.session.completed` avec vérification de signature.

---

## 4. Schéma de Base de Données Prisma

```prisma
// ============================================
// ABONNEMENTS CANDIDATS & PAIEMENTS
// ============================================

enum SubscriptionTier {
  SPRINT_7D
  INTENSIF_15D
  SUCCES_30D
  VIP_60D
}

enum SubscriptionStatus {
  ACTIVE
  EXPIRED
  CANCELLED
  PENDING_PAYMENT
}

enum PaymentGateway {
  STRIPE
  CINETPAY
  NOTCHPAY
  MANUAL_TRANSFER
}

model Subscription {
  id                   String             @id @default(cuid())
  userId               String             @db.Uuid
  tier                 SubscriptionTier
  status               SubscriptionStatus @default(PENDING_PAYMENT)
  currency             String             // "XAF", "EUR", "CAD", "USD"
  amountPaid           Decimal            @db.Decimal(10, 2)
  startsAt             DateTime           @default(now())
  expiresAt            DateTime
  gateway              PaymentGateway
  gatewayReference     String?            @unique
  metadata             Json?
  createdAt            DateTime           @default(now())
  updatedAt            DateTime           @updatedAt

  user         User                 @relation(fields: [userId], references: [id], onDelete: Cascade)
  transactions PaymentTransaction[]

  @@map("subscriptions")
  @@index([userId, status, expiresAt])
}

model PaymentTransaction {
  id                   String         @id @default(cuid())
  subscriptionId       String
  userId               String         @db.Uuid
  gateway              PaymentGateway
  gatewayTxId          String         @unique
  amount               Decimal        @db.Decimal(10, 2)
  currency             String
  status               String         // "SUCCESS", "PENDING", "FAILED"
  paymentMethod        String?        // "orange_money", "mtn_momo", "card", "apple_pay"
  rawPayload           Json?
  createdAt            DateTime       @default(now())

  subscription Subscription @relation(fields: [subscriptionId], references: [id], onDelete: Cascade)
  user         User         @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("payment_transactions")
  @@index([userId, createdAt])
}
```

---

## 5. Webhook Sécurisé & Idempotence

1. **Vérification de Signature Cryptographique :**  
   - Stripe : `stripe.webhooks.constructEvent(body, signature, webhookSecret)`.  
   - CinetPay : Vérification du HMAC SHA256 avec la clé secrète marchande.
2. **Idempotence :**  
   - La clé unique `@unique gatewayTxId` empêche formellement tout double-crédit d'abonnement lors des relances webhook réseau.
3. **Activation Automatique :**  
   - Dès réception du statut `SUCCESS` :
     - La `Subscription` passe à `status: ACTIVE`.
     - `expiresAt` est calculé (`startsAt + durationDays`).
     - Une `Notification` in-app de type `BILLING` est créée pour le candidat : *"Félicitations ! Votre Pass 30 Jours Succès NCLC 7 est actif."*

---

## 6. Contrôle d'Accès & Mode Démo (Paywall Logic)

- **Mode Démo & Aperçu Gratuit :**  
  Les séries étiquetées `isFreePreview: true` (ex : `demo-101-ce`, simulateur CRS, diagnostic gratuit) restent accessibles sans abonnement pour permettre le test immédiat de l'interface et maximiser l'effet "WOW".
- **Séries Officielles & Examen Blanc :**  
  Les séries complètes exigent une `Subscription` avec `status: ACTIVE` et `expiresAt > now()`.  
  Si un utilisateur non abonné clique sur une série bloquée, une modale de conversion élégante s'ouvre avec la formule conseillée et le prix dans sa monnaie locale.
- **Bypass Développeur / QA :**  
  En environnement de développement (`NODE_ENV === "development"`), une variable `NEXT_PUBLIC_BYPASS_PAYWALL=true` permet de tester sans bloquer les développeurs.

---

## 7. Plan d'Exécution par Étapes

- [x] **Étape 1 : Moteur de tarification géolocalisée (`lib/pricing/geo-pricing.ts`)**
- [x] **Étape 2 : Composant UI Premium 21st.dev (`components/pricing/geo-pricing-section.tsx`) & Page Tarifs (`app/tarifs/page.tsx`)**
- [ ] **Étape 3 : Migration Prisma & Tables `Subscription` + `PaymentTransaction`**
- [ ] **Étape 4 : Endpoints API `/api/billing/create-session` & Webhooks `/api/billing/webhook`**
- [ ] **Étape 5 : Paywall Gate dans la roadmap des examens (`exam-roadmap-board.tsx`)**

*Ce document fait office de référence pérenne pour toutes les sessions ultérieures.*
