# 🏢 Spécification Technique & Architecture : Multi-Tenant & Écosystème des Dashboards

**Version :** 1.0 — Octobre 2026  
**Statut :** Spécifié  
**Module :** Plateforme B2B, Multi-Tenant & Rôles Hiérarchiques

---

## 1. Vision & Modèle Économique B2B Multi-Tenant

Super4C2 n'est pas seulement un SaaS B2C pour candidats individuels : c'est l'infrastructure d'entraînement linguistique de référence pour :
1. **Les Écoles de Langues & Centres Prépa :** Alliances Françaises, Instituts Français, écoles privées au Maghreb, en Afrique subsaharienne et au Moyen-Orient.
2. **Les Cabinets d'Avocats & Consultants en Immigration Réglementés (CRIC) :** Qui souhaitent fournir une préparation clé en main à leurs clients pour garantir l'obtention des +50 points Entrée Express.
3. **Les Universités & Collèges Canadiens :** Qui préparent les candidats internationaux aux exigences linguistiques post-diplôme.

---

## 2. Modèle de Données Multi-Tenant

### Entités Clés & Schéma Relationnel
```sql
-- 1. Tenants (Organisations B2B)
CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL, -- ex: 'alliance-dakar'
    domain VARCHAR(255),               -- ex: 'prepa.alliance-dakar.org'
    logo_url TEXT,
    primary_color VARCHAR(20) DEFAULT '#E51A31',
    seats_allocated INT DEFAULT 50,
    seats_used INT DEFAULT 0,
    plan_tier VARCHAR(50) DEFAULT 'INSTITUTION_PRO',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Membres & Rôles
CREATE TYPE user_role AS ENUM (
    'SUPER_ADMIN',      -- Gestionnaire mondial Super4C2
    'ORG_ADMIN',        -- Directeur de centre / école
    'TUTOR_TEACHER',    -- Formateur ou correcteur
    'STUDENT_CANDIDATE' -- Étudiant / candidat
);

-- 3. Liaisons Utilisateur - Tenant
CREATE TABLE organization_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    role user_role DEFAULT 'STUDENT_CANDIDATE',
    cohort_group VARCHAR(100), -- ex: 'Session Novembre 2026 - Soir'
    target_exam VARCHAR(50) DEFAULT 'TCF_CANADA',
    target_nclc INT DEFAULT 7,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(org_id, user_id)
);
```

---

## 3. Matrice des Dashboards par Rôle

### A. Dashboard Super Admin (`/admin`)
* **Utilisateurs cibles :** Équipe dirigeante Super4C2 (Dimitri & administrateurs).
* **Indicateurs clés (KPIs) :**
  - MRR, ARR, Churn, LTV candidat.
  - Consommation des tokens IA (OpenAI / Claude / Voice Agent).
  - Taux global de réussite au NCLC 7 sur la plateforme.
  - Surveillance de la santé des banques de questions et des simulateurs.
  - Gestion des organisations B2B et attribution des licences.

### B. Dashboard Organisation / Institution (`/org/[slug]`)
* **Utilisateurs cibles :** Directeurs pédagogiques d'écoles, consultants en immigration.
* **Fonctionnalités :**
  - Suivi de la cohorte d'étudiants (taux d'assiduité, moyenne NCLC par compétence).
  - Gestion des invitations par lien magique ou import CSV.
  - Alertes prédictives : *"3 étudiants risquent d'échouer au NCLC 7 en Compréhension Écrite"*.
  - Exportation en 1 clic de rapports d'avancement certifiés pour les dossiers d'immigration.

### C. Dashboard Tuteur / Formateur (`/tuteur`)
* **Utilisateurs cibles :** Professeurs de FLE préparant les étudiants.
* **Fonctionnalités :**
  - File d'attente des copies d'Expression Écrite à relire ou annoter.
  - Historique des oraux blancs simulés avec la transcription et les remarques de l'examinateur IA.
  - Assignation de devoirs ou de séries ciblées (ex: *"Série 101 - Focus Niveau B2"*).

### D. Dashboard Candidat Étudiant (`/dashboard`)
* **Utilisateurs cibles :** Candidat individuel ou étudiant inscrit via une organisation.
* **Fonctionnalités :**
  - Radar des 4 compétences linguistiques (CE, CO, EE, EO).
  - Jauge d'atteinte du NCLC 7 et bonus Entrée Express (+50 points CRS).
  - Accès direct au simulateur CBT, au carnet d'erreurs SRS et à la date de son examen.
