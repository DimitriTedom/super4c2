import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { FaqSection } from "@/components/faq-section";

export const metadata: Metadata = {
  title: "Foire Aux Questions (FAQ) — TCF & TEF Canada | Super4C2",
  description:
    "Toutes les réponses à vos questions sur le TCF Canada, le TEF, le seuil NCLC 7, la simulation CBT et les 50 points bonus d'Entrée Express.",
};

export const revalidate = 3600; // 1 heure

export default async function FaqPage() {
  let faqs: { id: string; question: string; answer: string; category: string }[] = [];
  try {
    faqs = await prisma.faq.findMany({
      where: { isActive: true },
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
      select: { id: true, question: true, answer: true, category: true },
    });
  } catch (err) {
    console.error("Failed to load FAQs:", err);
  }

  return (
    <div className="min-h-screen bg-background">
      <FaqSection initialFaqs={faqs} />
    </div>
  );
}
