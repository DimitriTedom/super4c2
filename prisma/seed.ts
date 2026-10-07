import { PrismaClient } from "@prisma/client";
import { FULL_SERIES_CE_101 } from "../lib/exam/series-ce-101";
import { MOCK_WRITTEN_SERIES_101 } from "../lib/exam/mock-written-series";
import { BLOG_POSTS } from "../lib/blog/mock-posts";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Début du seed de la base de données Super4C2...");

  // 1. Seed Séries Compréhension Écrite (CE)
  console.log("📖 Seeding Série 101 Compréhension Écrite (39 questions authentiques)...");
  const ceSeries = await prisma.examSeries.upsert({
    where: {
      examType_discipline_seriesNumber: {
        examType: "TCF_CANADA",
        discipline: "COMPREHENSION_ECRITE",
        seriesNumber: 101,
      },
    },
    update: {
      title: "TCF Canada — Compréhension Écrite, Série 101 (Officiel)",
      durationSeconds: 3600,
      isPublished: true,
      isFreeDemo: false,
    },
    create: {
      seriesNumber: 101,
      title: "TCF Canada — Compréhension Écrite, Série 101 (Officiel)",
      examType: "TCF_CANADA",
      discipline: "COMPREHENSION_ECRITE",
      durationSeconds: 3600,
      isPublished: true,
      isFreeDemo: false,
    },
  });

  // Questions 1 à 39
  for (const q of FULL_SERIES_CE_101.questions) {
    let cefrLevel = "A1";
    if (q.questionNumber <= 6) cefrLevel = "A1";
    else if (q.questionNumber <= 12) cefrLevel = "A2";
    else if (q.questionNumber <= 18) cefrLevel = "B1";
    else if (q.questionNumber <= 28) cefrLevel = "B2";
    else if (q.questionNumber <= 35) cefrLevel = "C1";
    else cefrLevel = "C2";

    await prisma.question.upsert({
      where: {
        seriesId_questionNumber: {
          seriesId: ceSeries.id,
          questionNumber: q.questionNumber,
        },
      },
      update: {
        discipline: "COMPREHENSION_ECRITE",
        nclcTargetLevel: q.nclcTargetLevel ?? 7,
        cefrLevel,
        documentTitle: (q as Record<string, any>).documentTitle ?? null,
        documentText: q.documentText,
        prompt: q.prompt,
        optionA: q.options.A,
        optionB: q.options.B,
        optionC: q.options.C,
        optionD: q.options.D,
        correctOption: q.correctOption,
        explanation: q.explanation,
        trapAnalysis: q.trapAnalysis,
      },
      create: {
        seriesId: ceSeries.id,
        discipline: "COMPREHENSION_ECRITE",
        questionNumber: q.questionNumber,
        nclcTargetLevel: q.nclcTargetLevel ?? 7,
        cefrLevel,
        documentTitle: (q as Record<string, any>).documentTitle ?? null,
        documentText: q.documentText,
        prompt: q.prompt,
        optionA: q.options.A,
        optionB: q.options.B,
        optionC: q.options.C,
        optionD: q.options.D,
        correctOption: q.correctOption,
        explanation: q.explanation,
        trapAnalysis: q.trapAnalysis,
      },
    });
  }
  console.log("✅ 39 questions de Compréhension Écrite insérées avec succès.");

  // 2. Seed Série Expression Écrite (EE)
  console.log("✍️ Seeding Série 101 Expression Écrite (3 tâches FEI)...");
  const eeSeries = await prisma.writtenSeries.upsert({
    where: { seriesNumber: 101 },
    update: {
      title: MOCK_WRITTEN_SERIES_101.title,
      durationSeconds: MOCK_WRITTEN_SERIES_101.durationSeconds,
      isPublished: true,
      isFreeDemo: false,
    },
    create: {
      seriesNumber: 101,
      title: MOCK_WRITTEN_SERIES_101.title,
      examType: "TCF_CANADA",
      durationSeconds: MOCK_WRITTEN_SERIES_101.durationSeconds,
      isPublished: true,
      isFreeDemo: false,
    },
  });

  for (const t of MOCK_WRITTEN_SERIES_101.tasks) {
    await prisma.writtenTask.upsert({
      where: {
        seriesId_taskNumber: {
          seriesId: eeSeries.id,
          taskNumber: t.taskNumber,
        },
      },
      update: {
        title: t.title,
        minWords: t.minWords,
        maxWords: t.maxWords,
        suggestedDurationMinutes: t.suggestedDurationMinutes,
        topic: t.topic,
        context: t.context,
      },
      create: {
        seriesId: eeSeries.id,
        taskNumber: t.taskNumber,
        title: t.title,
        minWords: t.minWords,
        maxWords: t.maxWords,
        suggestedDurationMinutes: t.suggestedDurationMinutes,
        topic: t.topic,
        context: t.context,
      },
    });
  }
  console.log("✅ 3 tâches d'Expression Écrite insérées avec succès.");

  // 3. Seed Articles de Blog
  console.log("📰 Seeding Articles de Blog SEO...");
  for (const post of BLOG_POSTS) {
    await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: {
        title: post.title,
        excerpt: post.excerpt,
        content: post.content.trim(),
        readingMinutes: post.readTimeMinutes,
        category: post.categoryLabel,
        tags: post.tags,
        featured: post.featured,
        authorName: post.author.name,
        authorRole: post.author.role,
        isPublished: true,
      },
      create: {
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt,
        content: post.content.trim(),
        readingMinutes: post.readTimeMinutes,
        category: post.categoryLabel,
        tags: post.tags,
        featured: post.featured,
        authorName: post.author.name,
        authorRole: post.author.role,
        isPublished: true,
      },
    });
  }
  console.log(`✅ ${BLOG_POSTS.length} articles de blog insérés avec succès.`);

  // 4. Seed FAQs Candidats
  console.log("❓ Seeding Questions Fréquentes (FAQs)...");
  const faqs = [
    {
      question: "Qu'est-ce que le palier NCLC 7 et pourquoi est-il capital ?",
      answer:
        "Le NCLC 7 (Niveau de Compétence Linguistique Canadien 7) équivaut au niveau B2 supérieur. Pour l'immigration permanente fédérale (Entrée Express), valider le NCLC 7 dans les 4 épreuves du TCF Canada déclenche automatiquement jusqu'à +50 points bonus de transférabilité des compétences, ce qui fait bondir votre score CRS et garantit une invitation à présenter une demande (IPD).",
      category: "NCLC & CRS",
      order: 1,
    },
    {
      question: "L'interface Super4C2 est-elle identique à celle du vrai jour J ?",
      answer:
        "Oui, à 100%. Notre simulateur CBT reproduit l'écran scindé officiel de France Éducation International (FEI) : le document source à gauche avec zoom typographique, et la question avec les 4 propositions A/B/C/D à droite. Le chronomètre officiel, les raccourcis clavier et la grille de navigation 39 pastilles sont rigoureusement fidèles.",
      category: "Examen CBT",
      order: 2,
    },
    {
      question: "Comment fonctionne l'évaluation IA de l'Expression Écrite ?",
      answer:
        "Contrairement aux autres plateformes qui vous font attendre 24 à 48 heures, notre moteur d'évaluation IA analyse votre production en quelques secondes selon la grille officielle FEI (Adéquation, Cohérence, Lexique, Morphosyntaxe). Vous recevez une note sur 20, le détail de vos points d'amélioration et une réécriture modèle intégrale Magic Rewrite niveau C1/C2.",
      category: "Expression Écrite",
      order: 3,
    },
    {
      question: "Quelle est la durée de validité des résultats du TCF Canada ?",
      answer:
        "L'attestation officielle délivrée par France Éducation International est valable 2 ans à compter de la date de passation de l'épreuve pour tous les programmes d'immigration gérés par IRCC.",
      category: "Général",
      order: 4,
    },
    {
      question: "Peut-on repasser seulement une compétence si on rate le NCLC 7 ?",
      answer:
        "Non. Pour le TCF Canada, vous devez obligatoirement passer les 4 épreuves lors de la même session. Si vous manquez le NCLC 7 sur une seule compétence (par exemple 450 en CE au lieu de 453), vous devez repasser l'intégralité du test après un délai réglementaire de 30 jours.",
      category: "Stratégie",
      order: 5,
    },
  ];

  for (const faq of faqs) {
    const existing = await prisma.faq.findFirst({ where: { question: faq.question } });
    if (existing) {
      await prisma.faq.update({
        where: { id: existing.id },
        data: { answer: faq.answer, category: faq.category, order: faq.order, isActive: true },
      });
    } else {
      await prisma.faq.create({
        data: { question: faq.question, answer: faq.answer, category: faq.category, order: faq.order, isActive: true },
      });
    }
  }
  console.log(`✅ ${faqs.length} FAQs insérées avec succès.`);

  // 5. Seed Témoignages Candidats
  console.log("🌟 Seeding Témoignages Candidats...");
  const testimonials = [
    {
      candidateName: "Amine K.",
      country: "Maroc",
      targetScore: "NCLC 7",
      achievedNclc: "NCLC 8 (520 pts CE)",
      crsPointsGained: 50,
      quote:
        "J'avais raté la Compréhension Écrite à 2 points près l'an passé sur Objectif Canada parce que je n'étais pas habitué au double écran sans scroll infini. Grâce au simulateur Super4C2, j'ai fait 15 séries en conditions réelles et j'ai décroché NCLC 8 !",
      rating: 5,
      isFeatured: true,
      order: 1,
    },
    {
      candidateName: "Sarah M.",
      country: "Cameroun",
      targetScore: "NCLC 7",
      achievedNclc: "NCLC 7 (478 pts CE / 14/20 EE)",
      crsPointsGained: 50,
      quote:
        "Le Magic Rewrite sur l'Expression Écrite est une merveille absolue. Voir en 10 secondes la version C1/C2 de mon propre texte m'a permis d'apprendre les vrais connecteurs logiques exigés par les correcteurs FEI.",
      rating: 5,
      isFeatured: true,
      order: 2,
    },
    {
      candidateName: "Jean-Marc T.",
      country: "Côte d'Ivoire",
      targetScore: "NCLC 7",
      achievedNclc: "NCLC 8 (505 pts CE)",
      crsPointsGained: 50,
      quote:
        "Les +50 points bonus m'ont permis d'atteindre 512 points CRS. J'ai reçu mon invitation pour la résidence permanente le mois dernier !",
      rating: 5,
      isFeatured: true,
      order: 3,
    },
  ];

  for (const t of testimonials) {
    const existing = await prisma.testimonial.findFirst({ where: { candidateName: t.candidateName } });
    if (existing) {
      await prisma.testimonial.update({
        where: { id: existing.id },
        data: t,
      });
    } else {
      await prisma.testimonial.create({ data: t });
    }
  }
  console.log(`✅ ${testimonials.length} témoignages insérés avec succès.`);

  console.log("🎉 Seed terminé avec succès !");
}

main()
  .catch((e) => {
    console.error("❌ Erreur pendant le seed :", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
