# Spécification Technique 17 : Catalogue Multi-Séries EE & EO en Base de Données PostgreSQL

**Date :** 15 Octobre 2026  
**Auteur :** Antigravity Agent & Dimitri (@dimitri-snowdev)  
**Projet :** Super4C2  
**Statut :** Approuvé & En cours d'implémentation  

---

## 1. Contexte & Objectif

La plateforme Super4C2 repose sur une exigence d'intégrité absolue : **zéro données statiques (mock) au profit d'une base de données PostgreSQL 17 unifiée (`super4c2-db`)**.

Jusqu'alors, seules les données de la Série 101 étaient codées en dur pour l'Expression Écrite et l'Expression Orale.  
Cette spécification vise à :
1. Intégrer les modèles `OralSeries` et `OralTask` dans `prisma/schema.prisma` en miroir de `WrittenSeries` et `WrittenTask`.
2. Déployer les schémas dans la base de données PostgreSQL Docker locale (`localhost:5434`).
3. Créer le script d'alimentation et insérer les **Séries 101, 102, 103, 104 et 105** complètes pour l'**Expression Écrite (15 tâches FEI)** et l'**Expression Orale (15 tâches avec scénarios pour M. Laurent)**.
4. Remplacer les appels aux mocks statiques par des services de données réels interrogeant Prisma (`written-service.ts` et `oral-service.ts`).
5. Connecter les routes d'examen (`/examens/[seriesId]/ee`, `/examens/[seriesId]/ee/intro`, `/examens/[seriesId]/eo`, `/examens/[seriesId]/eo/intro`, et `/examens/[seriesId]`) pour afficher et évaluer les séries dynamiques.

---

## 2. Modèle de Données Prisma

### 2.1. Expression Écrite (Rappel des modèles existants)
```prisma
model WrittenSeries {
  id              String        @id @default(cuid())
  seriesNumber    Int           @unique
  title           String
  examType        ExamType      @default(TCF_CANADA)
  durationSeconds Int           @default(3600) // 60 minutes
  isPublished     Boolean       @default(true)
  isFreeDemo      Boolean       @default(false)
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt

  tasks           WrittenTask[]

  @@map("written_series")
}

model WrittenTask {
  id                       String        @id @default(cuid())
  seriesId                 String
  series                   WrittenSeries @relation(fields: [seriesId], references: [id], onDelete: Cascade)
  taskNumber               Int           // 1, 2, 3
  title                    String        
  minWords                 Int           
  maxWords                 Int           
  suggestedDurationMinutes Int           @default(15)
  topic                    String        @db.Text
  context                  String?       @db.Text
  criteriaNote             String?       @db.Text
  sampleModelC2            String?       @db.Text 

  createdAt                DateTime      @default(now())
  updatedAt                DateTime      @updatedAt

  @@unique([seriesId, taskNumber])
  @@index([seriesId, taskNumber])
  @@map("written_tasks")
}
```

### 2.2. Expression Orale (Nouveaux modèles à ajouter)
```prisma
model OralSeries {
  id              String      @id @default(cuid())
  seriesNumber    Int         @unique
  title           String
  examType        ExamType    @default(TCF_CANADA)
  durationSeconds Int         @default(720) // ~12 minutes
  isPublished     Boolean     @default(true)
  isFreeDemo      Boolean     @default(false)
  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @updatedAt

  tasks           OralTask[]

  @@map("oral_series")
}

model OralTask {
  id               String      @id @default(cuid())
  seriesId         String
  series           OralSeries  @relation(fields: [seriesId], references: [id], onDelete: Cascade)
  taskNumber       Int         // 1, 2, 3
  type             String      // "task1_presentation", "task2_roleplay", "task3_opinion"
  title            String      // Ex: "Tâche 1 : Entretien dirigé sans préparation"
  durationSeconds  Int         // 120, 210, 270
  examinerPrompt   String      @db.Text
  roleplayScenario Json?       // Détails du jeu de rôle

  createdAt        DateTime    @default(now())
  updatedAt        DateTime    @updatedAt

  @@unique([seriesId, taskNumber])
  @@index([seriesId, taskNumber])
  @@map("oral_tasks")
}
```

---

## 3. Architecture des Services Data

Deux modules de service sont implémentés dans `lib/exam/` :
- `lib/exam/written-service.ts` :
  - `getWrittenSeries(seriesIdOrNumber: string | number)` : recherche par CUID, par `seriesNumber`, ou par alias (`demo-101-ee`, `serie-102-ee`, `102`).
  - `getAllWrittenSeries()` : liste de toutes les séries publiées avec leurs tâches ordonnées.
- `lib/exam/oral-service.ts` :
  - `getOralSeries(seriesIdOrNumber: string | number)` : recherche par CUID, par `seriesNumber`, ou par alias (`demo-101-eo`, `serie-102-eo`, `102`).
  - `getAllOralSeries()` : liste de toutes les séries orales publiées avec leurs tâches ordonnées.

---

## 4. Stratégie de Résolution d'Alias

Pour garantir une rétrocompatibilité intégrale avec les liens de l'`ExamRoadmapBoard` et les URLs favorites :
- Les identifiants textuels comme `demo-101-ee`, `serie-102-ee`, `103`, `serie-104` sont résolus dynamiquement en extrayant le numéro de série (`101`, `102`, `103`, `104`, `105`) et en requêtant Prisma.
- En cas de base temporairement indisponible, un mécanisme de secours élégant prévient tout plantage de page.
