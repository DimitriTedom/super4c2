import React from "react";

export function JsonLd() {
  const organizationData = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: "Super4C2",
    alternateName: "Super4C2 - Simulateur TCF Canada, TEF Canada & IELTS",
    url: "https://super4c2.com",
    logo: "https://super4c2.com/brand/Le%20Logo%20Primaire.png",
    image: "https://super4c2.com/brand/cbt-platform-preview.jpg",
    description:
      "Plateforme de préparation aux examens TCF Canada, TEF Canada et Cambridge IELTS General Training pour l'immigration canadienne (Entrée Express).",
    sameAs: [
      "https://t.me/super4c2",
      "https://chat.whatsapp.com/super4c2-vip",
    ],
    address: {
      "@type": "PostalAddress",
      addressCountry: "CA",
    },
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "XAF",
      lowPrice: "4500",
      highPrice: "60000",
      offerCount: "5",
    },
  };

  const courseData = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: "Préparation Complète TCF Canada & IELTS General Training (Objectif C2 / CLB 9)",
    description:
      "Entraînement intensif au TCF Canada avec simulateur CBT conforme, 4 épreuves chronométrées, correction IA instantanée et examinateur vocal IA.",
    provider: {
      "@type": "Organization",
      name: "Super4C2",
      url: "https://super4c2.com",
    },
    educationalCredentialAwarded: "Attestation Provisoire Simulée NCLC 7 / NCLC 10 (TCF) et CLB 9 (IELTS)",
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: "online",
      inLanguage: ["fr", "en"],
    },
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
        urlTemplate: "https://super4c2.com/examens?q={search_term_string}",
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(courseData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteData) }}
      />
    </>
  );
}
