import { prisma } from "../lib/prisma";

const MASTER_ARTICLES = [
  {
    title: "Tâche 1 Expression Écrite TCF : Formules de Politesse et Modèles 60-120 Mots",
    slug: "tache-1-expression-ecrite-tcf-canada-formules-politesse-modeles",
    category: "Expression Écrite",
    targetKeyword: "TCF Canada Expression Écrite Tâche 1",
    excerpt:
      "Comment réussir la Tâche 1 du TCF Canada en moins de 15 minutes ? Modèles types 60-120 mots, formules d'ouverture et erreurs de décompte à éviter absolument.",
    readingMinutes: 6,
    authorName: "Dimitri • Équipe Pédagogique Super4C2",
    authorRole: "Expert NCLC & Ancien Correcteur FEI",
    coverImage: "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1200&q=80",
    youtubeUrl: "https://www.youtube.com/watch?v=1xGfN_lTj6I",
    tags: ["Expression Écrite", "Tâche 1", "TCF Canada", "NCLC 7", "Formules de Politesse", "Modèles Corrigés"],
    featured: true,
    isPublished: true,
    ctaType: "CBT_EXAM",
    ctaLabel: "S'entraîner sur la Tâche 1 dans le Simulateur CBT",
    ctaUrl: "/examens",
    content: `## Pourquoi la Tâche 1 est-elle Déterminante pour votre Note Finale ?

La Tâche 1 d'Expression Écrite du TCF Canada est la première impression que vous donnez au correcteur humain de France Éducation International (FEI). 

Bien que notée sur un barème plus court que la Tâche 3, **une faute de registre ou un non-respect du volume de mots vous pénalise immédiatement de plusieurs points**.

> **Contrainte officielle FEI :**  
> • Volume obligatoire : Entre 60 et 120 mots  
> • Temps conseillé : 12 à 15 minutes  
> • Registre attendu : Courriel amical, invitation, remerciement ou demande d'information

---

## 1. La Règle d'Or du Décompte des Mots selon FEI

Beaucoup de candidats sont pénalisés sans le savoir à cause d'une mauvaise méthode de comptage :
- Un mot est défini par **tout caractère séparé par un espace ou une apostrophe**.
- *« C'est-à-dire »* compte pour **4 mots**.
- *« J'ai »* compte pour **2 mots**.
- Si votre texte fait **59 mots**, vous subissez une pénalité forfaitaire.
- Si votre texte dépasse **120 mots**, les phrases au-delà ne sont tout simplement pas lues par le correcteur !

> **Conseil de l'examinateur FEI :** Visez exactement entre **80 et 100 mots**. C'est la zone de sécurité idéale où vous développez suffisamment vos idées sans risquer le débordement.

---

## 2. La Boîte à Outils des Formules d'Ouverture et de Clôture

Selon que le destinataire est un ami proche ou une connaissance, le registre doit être irréprochable.

### A. Situation Amicale (Invitation, Nouvelles, Remerciement)
- **Formule d'amorce :** *« Cher Thomas, »* ou *« Chère Sarah, »* (suivi d'une virgule et saut de ligne).
- **Phrase d'accroche :** *« J'espère que tu vas bien depuis notre dernière rencontre à Montréal. »*
- **Formule de conclusion :** *« Dis-moi rapidement si tu es disponible ! »* ou *« J'ai hâte d'avoir de tes nouvelles. »*
- **Signature :** *« Amitiés, »* ou *« Bises, »* suivi de votre prénom.

### B. Situation Semi-Formelle (Collègue, Voisin, Club de sport)
- **Formule d'amorce :** *« Bonjour Monsieur Dupont, »* ou *« Chers collègues, »*.
- **Phrase d'accroche :** *« Je me permets de vous contacter afin de faire le point sur notre projet. »*
- **Formule de conclusion :** *« N'hésitez pas à me contacter si vous avez la moindre question. »*
- **Signature :** *« Bien cordialement, »* ou *« Sincères salutations, »*.

---

## 3. Modèle Corrigé Niveau C1/C2 (88 Mots)

**Sujet authentique session FEI :** *Vous invitez un ami à passer le week-end dans votre nouvelle maison à la campagne. Précisez la date, les activités prévues et comment s'y rendre.*

> *Cher Julien,*  
> *J'espère que tout se passe pour le mieux pour toi. Comme tu le sais, je viens enfin d'emménager dans ma nouvelle maison en Estrie !*  
> *Je t'invite chaleureusement à venir passer le week-end du 15 novembre avec nous. Au programme : randonnée au mont Orford samedi matin, suivie d'un barbecue convivial au coin du feu.*  
> *Pour venir, le plus simple est de prendre le bus depuis la gare centrale de Montréal jusqu'à Magog, où je viendrai te récupérer en voiture.*  
> *Confirme-moi ta venue avant mercredi !*  
> *Amitiés,*  
> *Dimitri*

> **Bilan de conformité :**  
> Décompte précis : 88 mots (conforme 60-120).  
> Respect des 3 consignes : Date (15 novembre) ✓ Activités (randonnée, barbecue) ✓ Itinéraire (bus + Magog) ✓  
> Registre amical parfait sans familiarité excessive ✓

---

## 4. Les 3 Erreurs Fatales qui Font Chuter sous le NCLC 7

1. **Oublier l'un des trois éléments de la consigne :** Même rédigé sans faute d'orthographe, un texte incomplet perd d'office la moitié des points d'adéquation.
2. **Utiliser le vouvoiement avec un ami d'enfance :** Une rupture de registre amical vers le formel est immédiatement sanctionnée.
3. **Négliger la ponctuation :** Dans les critères FEI, l'absence de majuscules ou de points pénalise la cohérence textuelle.
`,
  },
  {
    title: "Expression Orale TCF : La Liste des 10 Questions Types à Poser en Tâche 2",
    slug: "expression-orale-tcf-canada-10-questions-types-tache-2",
    category: "Expression Orale",
    targetKeyword: "Expression Orale TCF Canada Tâche 2",
    excerpt:
      "La Tâche 2 d'Expression Orale (jeu de rôle de 3 min 30) déstabilise souvent les candidats. Découvrez les 10 questions types pour obtenir 14/20 ou plus.",
    readingMinutes: 5,
    authorName: "Dimitri • Équipe Pédagogique Super4C2",
    authorRole: "Expert NCLC & Ancien Correcteur FEI",
    coverImage: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=1200&q=80",
    youtubeUrl: "https://www.youtube.com/watch?v=1xGfN_lTj6I",
    tags: ["Expression Orale", "Tâche 2", "Jeu de Rôle", "Questions Ouvertes", "NCLC 7", "Laurent Mercier"],
    featured: false,
    isPublished: true,
    ctaType: "COMMUNITY",
    ctaLabel: "Rejoindre le Groupe d'Entraide WhatsApp & Podcasts",
    ctaUrl: "/communaute",
    content: `## Le Principe Clé de la Tâche 2 : Vous Êtes le Maître du Jeu

En Tâche 2 de l'Expression Orale du TCF Canada (entretien avec l'examinateur ou le simulateur vocal interactif de Super4C2), la consigne officielle est invariable :
- **Durée :** 3 minutes 30 secondes d'interaction continue.
- **Rôle du candidat :** Vous découvrez une annonce (cours de cuisine, colocation, voyage, bénévolat) et vous devez **poser une série de questions pertinentes pour obtenir des renseignements**.
- **Rôle de l'examinateur :** Il se contente de vous répondre. Il n'a pas le droit de vous relancer activement si vous vous taisez !

> **Piège éliminatoire :** Si vous posez 3 questions et que vous attendez en silence, l'épreuve tourne court et vous n'atteignez pas le quota d'échanges requis pour le NCLC 7.

---

## 1. La Règle des Questions Variées (Pas seulement "Combien ça coûte ?")

Les examinateurs de France Éducation International évaluent votre capacité à **varier les structures syntaxiques** :
- Ne commencez pas 5 questions d'affilée par *« Est-ce que... »*.
- Utilisez l'inversion sujet-verbe (*« Pourriez-vous me préciser... »*).
- Utilisez des interrogations indirectes (*« J'aimerais savoir si... »*).
- Posez des questions ouvertes (*« En quoi consiste exactement... ? »*).

---

## 2. La Liste des 10 Questions Maîtresses Prêtes à l'Emploi

Adaptez ces 10 formules à n'importe quel sujet de Tâche 2 (logement, emploi, formation, loisir) :

1. **Sur l'accessibilité et les conditions d'inscription :**  
   *« Pourriez-vous m'éclairer sur les conditions préalables requises pour s'inscrire à ce programme ? »*
2. **Sur les modalités financières et facilités de paiement :**  
   *« Dans quelle mesure proposez-vous des facilités de règlement en plusieurs mensualités sans frais ? »*
3. **Sur le calendrier et la flexibilité horaire :**  
   *« Les séances ont-elles lieu exclusivement en soirée, ou existe-t-il des créneaux en matinée pour les personnes en activité ? »*
4. **Sur le matériel nécessaire :**  
   *« Faut-il se procurer des équipements spécifiques au préalable, ou tout le matériel est-il fourni sur place ? »*
5. **Sur le niveau requis :**  
   *« Cette activité est-elle adaptée aux personnes débutantes, ou requiert-elle une expérience antérieure ? »*
6. **Sur les annulations et imprévus :**  
   *« Quelle est votre politique de report ou de remboursement en cas d'empêchement professionnel ? »*
7. **Sur les effectifs par groupe :**  
   *« Combien de participants accueillez-vous en moyenne par session afin de garantir un suivi personnalisé ? »*
8. **Sur les certifications délivrées :**  
   *« Cette formation donne-t-elle lieu à la délivrance d'une attestation reconnue par les employeurs canadiens ? »*
9. **Sur la localisation et l'accès :**  
   *« Votre établissement est-il facilement accessible via le réseau de transports en commun de la ville ? »*
10. **Sur les avis et retours d'expérience :**  
    *« Auriez-vous des retours d'anciens apprenants ou des exemples concrets de projets menés à bien ? »*

---

## 3. Comment Réagir aux Réponses Courtes de l'Examinateur

Parfois, l'examinateur teste votre répartie en vous répondant par un simple *« Oui »* ou *« Non, ce n'est pas possible »*.

Ne paniquez pas ! Rebondissez immédiatement en utilisant les connecteurs d'interaction :
- *« D'accord, je comprends parfaitement. Dans ce cas, proposez-vous une solution alternative pour... ? »*
- *« C'est bien noté. Et qu'en est-il de... ? »*
- *« C'est très clair. Permettez-moi alors d'aborder un autre point tout aussi important : ... »*

En adoptant cette posture proactive, vous démontrez une aisance de niveau **C1/C2**, assurant d'office votre palier NCLC 7+.
`,
  },
  {
    title: "NCLC 7 vs NCLC 5 : Comment le Français Donne +50 Points Directs en Entrée Express",
    slug: "nclc-7-vs-nclc-5-pourquoi-francais-donne-50-points-bonus-entree-express",
    category: "Entrée Express & CRS",
    targetKeyword: "NCLC 7 Entrée Express 50 points bonus CRS",
    excerpt:
      "Pourquoi un score de NCLC 5 ou 6 ne vous qualifie pas aux tirages ciblés francophones ? Démonstration chiffrée de l'effet multiplicateur du seuil NCLC 7.",
    readingMinutes: 7,
    authorName: "Dimitri • Équipe Pédagogique Super4C2",
    authorRole: "Expert NCLC & Ancien Correcteur FEI",
    coverImage: "https://images.unsplash.com/photo-1517935703635-27c94660ab4f?auto=format&fit=crop&w=1200&q=80",
    youtubeUrl: "https://www.youtube.com/watch?v=1xGfN_lTj6I",
    tags: ["Entrée Express", "NCLC 7", "Points CRS", "Tirages Francophones", "Immigration Canada", "Calculateur CRS"],
    featured: false,
    isPublished: true,
    ctaType: "CRS_CALCULATOR",
    ctaLabel: "Calculer mon Score CRS Personnalisé (+50 Points)",
    ctaUrl: "/nclc-calculator",
    content: `## L'Illusion du Niveau Intermédiaire dans l'Immigration Canadienne

De nombreux candidats investissent des mois de révisions et des centaines de dollars pour passer le TCF Canada, obtiennent un résultat de **NCLC 5 ou NCLC 6**, et sont surpris de constater que leur score dans le bassin Entrée Express ne décolle pas.

Pourquoi ? Parce que dans l'algorithme du Système de Classement Global (CRS) d'Immigration, Réfugiés et Citoyenneté Canada (IRCC), **le palier NCLC 7 fonctionne comme un interrupteur binaire : tout ou rien**.

---

## 1. Comparatif Chiffré : Le Cas Réel d'un Candidat de 29 Ans

Prenons un candidat type : 29 ans, titulaire d'un Master, 3 ans d'expérience professionnelle qualifiée hors Canada, et un bon niveau d'anglais (CLB 7 à l'IELTS).

| Critère de Sélection | Candidat avec Français NCLC 5 | Même Candidat avec Français NCLC 7+ |
| :--- | :--- | :--- |
| Capital humain (Âge + Études + Expérience) | 330 points | 330 points |
| Compétences linguistiques en Anglais (CLB 7) | 68 points | 68 points |
| Compétences linguistiques en Français de base | 24 points | 68 points (+44 pts) |
| Facteurs de transférabilité des compétences | 25 points | 50 points (+25 pts) |
| **Bonus Francophone Additionnel IRCC** | **0 point (Seuil non atteint)** | **+50 points (Seuil NCLC 7 validé)** |
| **Score Total CRS Final** | **447 points (Non sélectionné)** | **566 points (Invitation Immédiate)** |

> **Résultat de la simulation :**  
> • À NCLC 5 : 447 points ➔ Vous restez bloqué dans le bassin sans invitation.  
> • À NCLC 7 : 566 points ➔ Vous êtes sélectionné dès le tirage suivant, avec une marge de 100 points au-dessus du seuil !

---

## 2. Les Tirages Ciblés Francophones : La Voie Royale 2026

Depuis la réforme des catégories ciblées par IRCC, la maîtrise du français est la priorité numéro un du gouvernement fédéral canadien :
- Dans les tirages « Tous programmes », le seuil de coupure tourne souvent autour de **500 à 530 points**.
- Dans les tirages spécifiques **« Compétences linguistiques en français »**, les seuils récents se sont effondrés entre **390 et 435 points** !

Cela signifie qu'un candidat avec un profil modeste en âge ou en diplôme, mais ayant validé son NCLC 7 au TCF Canada, **est quasi certain d'obtenir sa résidence permanente en quelques mois**.

---

## 3. La Règle Fatidique des 4 Épreuves Simultanées

Pour débloquer ce bonus salvateur de 50 points, IRCC impose une condition absolue :
- **Compréhension Écrite :** minimum 453 / 699
- **Compréhension Orale :** minimum 458 / 699
- **Expression Écrite :** minimum 10 / 20
- **Expression Orale :** minimum 10 / 20

Si vous obtenez 16/20 en Expression Orale, 15/20 en Expression Écrite, 520 en Compréhension Orale, mais **440 en Compréhension Écrite (NCLC 6 au lieu de 7)**, vous perdez la totalité des 50 points bonus !

> **Notre Recommandation :** Ne tentez pas l'examen officiel à l'aveugle. Utilisez le simulateur CBT de Super4C2 pour vérifier que vos 4 notes dépassent confortablement les seuils FEI avant de payer vos frais d'inscription au centre d'examen.
`,
  },
];

async function main() {
  console.log("Synchronisation des articles piliers (Clusters Stratégiques) dans PostgreSQL...");

  for (const article of MASTER_ARTICLES) {
    const upserted = await prisma.blogPost.upsert({
      where: { slug: article.slug },
      update: {
        title: article.title,
        excerpt: article.excerpt,
        content: article.content,
        category: article.category,
        targetKeyword: article.targetKeyword,
        readingMinutes: article.readingMinutes,
        authorName: article.authorName,
        authorRole: article.authorRole,
        coverImage: article.coverImage,
        youtubeUrl: article.youtubeUrl,
        tags: article.tags,
        featured: article.featured,
        isPublished: article.isPublished,
        ctaType: article.ctaType,
        ctaLabel: article.ctaLabel,
        ctaUrl: article.ctaUrl,
      },
      create: {
        title: article.title,
        slug: article.slug,
        excerpt: article.excerpt,
        content: article.content,
        category: article.category,
        targetKeyword: article.targetKeyword,
        readingMinutes: article.readingMinutes,
        authorName: article.authorName,
        authorRole: article.authorRole,
        coverImage: article.coverImage,
        youtubeUrl: article.youtubeUrl,
        tags: article.tags,
        featured: article.featured,
        isPublished: article.isPublished,
        ctaType: article.ctaType,
        ctaLabel: article.ctaLabel,
        ctaUrl: article.ctaUrl,
      },
    });

    console.log(`✅ Article synchronisé : [${upserted.category}] ${upserted.title.slice(0, 50)}... (/blog/${upserted.slug})`);
  }

  const total = await prisma.blogPost.count();
  console.log(`\n🎉 Synchronisation réussie ! Total d'articles actifs en base : ${total}`);
}

main()
  .catch((err) => {
    console.error("❌ Erreur de synchronisation :", err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
