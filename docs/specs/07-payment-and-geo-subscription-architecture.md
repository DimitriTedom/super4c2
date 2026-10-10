# Document de Spécification Technique — Architecture Paiement SasPay & Tarification Géolocalisée (Super4C2)

**Version :** 1.1  
**Statut :** Validé / En cours d'implémentation  
**Auteur :** Antigravity AI & Dimitri (@dimitri-snowdev)  
**Date :** Octobre 2026  
**Fichiers Liés :**  
- Client SasPay : [`lib/billing/saspay.ts`](file:///d:/SnowDev/Documents/super4c2/lib/billing/saspay.ts)
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
- **Afrique Centrale & Ouest (Zone Franc CFA) :** `FCFA` (XAF / XOF) avec paiement direct via **SasPay** (MTN MoMo, Orange Money, Wave, Moov).
- **France & Union Européenne :** `EUR (€)` avec paiement CB / Apple Pay / Google Pay via **Stripe**.
- **Canada :** `CAD ($ CAD)` avec paiement CB / Interac / Apple Pay via **Stripe**.
- **Reste du Monde (USA, Maghreb, International) :** `USD ($ USD)` via **Stripe**.

Un sélecteur discret et élégant permet toujours au candidat d'ajuster sa monnaie manuellement en cas de voyage ou de carte étrangère.

---

## 2. Pourquoi un Abonnement Annuel (Pass 1 An / 365 Jours) ?

### 2.1 Pourquoi les concurrents limitaient aux forfaits courts ?
Le TCF/TEF est un examen événementiel : les candidats réservent souvent une date dans un délai de 2 à 4 semaines, poussant les concurrents à ne concevoir que des « Pass Sprint » courts (7j à 30j).

### 2.2 Pourquoi l'Abonnement Annuel est Stratégique pour Super4C2 :
1. **La Réalité de l'Immigration Canadienne (6 à 12 mois)** :
   Passer d'un niveau intermédiaire (B1/B2) au palier souverain NCLC 7 / C1 exige entre 4 et 9 mois de consolidation linguistique continue.
2. **L'Assurance Repassage** :
   Au TCF Canada, échouer de 3 points sur une seule épreuve (ex. 450 en CE au lieu de 453) impose de **repasser l'intégralité des 4 épreuves** après 30 jours. La majorité des candidats passent le test 2 à 3 fois dans l'année. Le Pass Annuel leur garantit un accès continu sans repayer.
3. **Préparation Bi-Langue TCF + IELTS** :
   Pour maximiser les points Entrée Express (+50 pts français +24 pts anglais), les candidats préparent successivement ou en parallèle le TCF/TEF et l'IELTS.
4. **Trésorerie & Valeur Client (LTV SaaS)** :
   Le Pass Annuel génère un paiement comptant immédiat de **60 000 FCFA / 89,99 € / 129 $ CAD**, ce qui représente une économie de 60% pour le candidat (revient à 5 000 FCFA/mois) tout en finançant la croissance du SaaS.

---

## 3. Grille Tarifaire & Droits d'Accès (Entitlements)

| Formule | Durée | FCFA (Afrique) | EUR (Europe) | CAD (Canada) | USD (Monde) | Droits & Simulateurs Inclus |
| :--- | :---: | :---: | :---: | :---: | :---: | :--- |
| **Pass Sprint** | 7 jours | **5 000 FCFA** | 7,99 € | 12 $ CAD | 9 $ USD | 5 examens CBT complets, 3 écrits corrigés, 2 oraux IA, carnet d'erreurs |
| **Pass Intensif** | 15 jours | **10 000 FCFA** | 15,99 € | 23 $ CAD | 17 $ USD | 15 examens CBT complets, 10 écrits corrigés, 6 oraux IA, carnet d'erreurs |
| **Pass Succès NCLC 7 ⭐** *(Recommandé)* | 30 jours | **15 000 FCFA** | 22,99 € | 34 $ CAD | 25 $ USD | **CBT Illimité**, 3 Examens Blancs Complets 4 épreuves, 25 écrits Magic Rewrite C1/C2, 15 oraux IA vocaux, simulateur CRS +50 pts |
| **Pass VIP Garantie NCLC 7+** | 60 jours | **25 000 FCFA** | 38,99 € | 58 $ CAD | 42 $ USD | **Accès TOTAL & ILLIMITÉ 60j**, tous examens blancs, corrections illimitées, garantie prolongation gratuite si NCLC 7 non atteint |
| **Pass Immigrant 1 An 🔥** *(Sérénité Totale)* | 365 jours | **60 000 FCFA** *(5 000 F/m)* | 89,99 € *(7,50 €/m)* | 129 $ CAD *(10,75 $/m)* | 95 $ USD *(7,90 $/m)* | **Accès TOTAL 365 JOURS** à tous les tests (TCF + TEF + IELTS), repassages illimités, carnet d'erreurs permanent, support VIP direct |

---

## 4. Intégration SasPay (`https://saspay.me`)

SasPay est notre passerelle de paiement souveraine pour l'Afrique, supportant les pages de paiement hébergées (checkout sessions) et le paiement direct USSD push (softpay).

### 4.1 Caractéristiques de l'API SasPay :
- **Base URL :** `https://api.saspay.me/api/v1`
- **Authentification :** `Authorization: Bearer sk_test_...` (dev) / `sk_live_...` (production).
- **Format des montants :** Chaîne décimale (`"15000.00"`, `"60000.00"`), jamais de float.
- **Idempotence obligatoire :** Envoi d'un UUID unique dans l'en-tête `Idempotency-Key` pour éviter les débits multiples lors des retries réseau.
- **Sécurité Webhooks :** Vérification HMAC SHA256 avec les en-têtes `X-Webhook-Signature` et `X-Webhook-Timestamp` (rejet si > 300 secondes).

### 4.2 Flux de Paiement Hosted Checkout :
```typescript
// Exemple d'initialisation via lib/billing/saspay.ts
const session = await createSasPayCheckoutSession({
  amount: 60000,
  currency: "XAF",
  description: "Super4C2 — Pass Immigrant 1 An (365 Jours)",
  customerEmail: user.email,
  customerName: user.name,
  returnUrl: "https://super4c2.com/checkout/success",
});
// Redirection du candidat vers session.data.checkout_url
```

---

## 5. Schéma de Base de Données Prisma

```prisma
// ============================================
// ABONNEMENTS CANDIDATS & PAIEMENTS
// ============================================

enum SubscriptionTier {
  SPRINT_7D
  INTENSIF_15D
  SUCCES_30D
  VIP_60D
  ANNUEL_365D
}

enum SubscriptionStatus {
  ACTIVE
  EXPIRED
  CANCELLED
  PENDING_PAYMENT
}

enum PaymentGateway {
  SASPAY
  STRIPE
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
  paymentMethod        String?        // "orange_money", "mtn_momo", "wave", "card"
  rawPayload           Json?
  createdAt            DateTime       @default(now())

  subscription Subscription @relation(fields: [subscriptionId], references: [id], onDelete: Cascade)
  user         User         @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("payment_transactions")
  @@index([userId, createdAt])
}
```

---

## 6. Webhook Sécurisé & Idempotence

1. **Vérification de Signature Cryptographique :**  
   - SasPay : `verifySasPayWebhookSignature(rawBody, signature, timestamp)`
   - Stripe : `stripe.webhooks.constructEvent(body, signature, webhookSecret)`
2. **Idempotence :**  
   - La clé unique `@unique gatewayTxId` empêche formellement tout double-crédit d'abonnement.
3. **Activation Automatique :**  
   - Dès réception du statut `SUCCESS` :
     - La `Subscription` passe à `status: ACTIVE`.
     - `expiresAt` est calculé (`startsAt + durationDays`).
     - Une `Notification` in-app de type `BILLING` est créée pour le candidat.

---

## 7. Plan d'Exécution par Étapes

- [x] **Étape 1 : Moteur de tarification géolocalisée (`lib/pricing/geo-pricing.ts`) avec Pass Annuel 1 An**
- [x] **Étape 2 : Client API SasPay officiel (`lib/billing/saspay.ts`)**
- [x] **Étape 3 : Composant UI Premium 21st.dev avec switchers de durée & badges SasPay (`components/pricing/geo-pricing-section.tsx`)**
- [ ] **Étape 4 : Migration Prisma & Tables `Subscription` + `PaymentTransaction`**
- [ ] **Étape 5 : Endpoints API `/api/billing/create-checkout-session` & Webhook `/api/billing/webhook/saspay`**
- [ ] **Étape 6 : Paywall Gate dans la roadmap des examens (`exam-roadmap-board.tsx`)**

*Ce document fait office de référence pérenne pour toutes les sessions ultérieures.*
