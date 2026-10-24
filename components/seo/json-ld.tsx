import React from "react";

export function JsonLd() {
  const organizationData = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: "Super4C2",
    alternateName: "Super4C2 - Simulateur TCF Canada 100% Gratuit",
    url: "https://super4c2.com",
    logo: "https://super4c2.com/brand/Le%20Logo%20Primaire.png",
    image: "https://super4c2.com/brand/cbt-platform-preview.jpg",
    description:
      "Plateforme 100% gratuite de préparation aux examens TCF Canada, TEF Canada et IELTS pour l'immigration canadienne (Entrée Express). Simulateur CBT officiel, examinateur vocal IA et double correction conforme au barème FEI.",
    sameAs: [
      "https://chat.whatsapp.com/super4c2_nclc7",
      "https://t.me/super4c2",
    ],
    address: {
      "@type": "PostalAddress",
      addressCountry: "CA",
    },
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      name: "Accès Gratuit au Simulateur TCF Canada",
      category: "FreeAccess",
      availability: "https://schema.org/InStock",
      description: "Entraînement complet sans carte bancaire, accessible immédiatement.",
    },
  };

  const webApplicationData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Super4C2 - Simulateur CBT TCF Canada Gratuit",
    url: "https://super4c2.com",
    applicationCategory: "EducationalApplication",
    operatingSystem: "All (Web, Mobile, Desktop)",
    browserRequirements: "Requires modern web browser with WebAudio support",
    isAccessibleForFree: true,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      name: "Accès 100% Gratuit — Sans Carte Bancaire",
      availability: "https://schema.org/InStock",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      bestRating: "5",
      ratingCount: "1420",
    },
    featureList: [
      "Simulateur CBT d'examen officiel conforme France Éducation International",
      "Chronomètre officiel et décompte de mots en temps réel",
      "Double correction IA selon la grille officielle FEI sur 20",
      "Examinateur vocal interactif pour les 3 tâches d'Expression Orale",
      "Calculateur de points Entrée Express et conversion NCLC vers CRS",
      "Banque de sujets réels d'examen mondiaux 2026 mise à jour chaque semaine",
    ],
  };

  const courseData = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: "Préparation Complète TCF Canada Gratuit (Objectif NCLC 7+ / C1-C2)",
    description:
      "Programme d'entraînement intensif au TCF Canada : 4 épreuves chronométrées, correction IA instantanée, banque de modèles C1/C2 et veille hebdomadaire des sujets d'examen.",
    provider: {
      "@type": "Organization",
      name: "Super4C2",
      url: "https://super4c2.com",
    },
    educationalCredentialAwarded: "Attestation Provisoire Simulée NCLC 7 / NCLC 10 (TCF Canada)",
    isAccessibleForFree: true,
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: "online",
      inLanguage: ["fr"],
    },
  };

  const faqData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Le simulateur Super4C2 pour le TCF Canada est-il gratuit ?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Oui, la plateforme Super4C2 est accessible 100% gratuitement sans aucune carte bancaire requise. Vous pouvez vous entraîner aux épreuves d'Expression Écrite et d'Expression Orale dans les conditions de l'examen officiel et recevoir une double correction IA instantanée.",
        },
      },
      {
        "@type": "Question",
        name: "Qu'est-ce que le palier NCLC 7 au TCF Canada ?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Le NCLC 7 (Niveau de Compétence Linguistique Canadien 7) est le palier clé exigé par Immigration, Réfugiés et Citoyenneté Canada (IRCC). Il correspond au niveau B2 avancé (score supérieur ou égal à 10/20 en Expression Écrite et Orale, et plus de 453 points en Compréhension). Il permet d'obtenir le bonus maximal de 50 points en Entrée Express.",
        },
      },
      {
        "@type": "Question",
        name: "Combien de points supplémentaires le français rapporte-t-il en Entrée Express ?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Valider un niveau NCLC 7 dans les 4 épreuves du TCF Canada octroie jusqu'à 50 points bonus directs au classement global CRS pour l'immigration canadienne, ce qui fait souvent la différence décisive pour être extrait lors des rondes d'invitation francophones.",
        },
      },
      {
        "@type": "Question",
        name: "Comment recevoir les sujets réels d'examen du TCF Canada chaque semaine ?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Super4C2 anime une communauté WhatsApp officielle où sont partagés chaque semaine les nouveaux sujets réels d'Expression Écrite et Orale tombés dans les centres d'examen du monde entier avec des propositions de corrigés rédigés au niveau C1/C2.",
        },
      },
    ],
  };

  const webSiteData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Super4C2",
    url: "https://super4c2.com",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://super4c2.com/blog?q={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webApplicationData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(courseData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteData) }}
      />
    </>
  );
}
