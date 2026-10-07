import { notFound } from "next/navigation";
import { AdminShell } from "@/components/admin/admin-shell";
import { QuestionForm } from "@/components/admin/question-form";
import { prisma } from "@/lib/prisma";
import { toInteger } from "@/lib/admin-crud-utils";

export const metadata = {
  title: "Ajouter une Question CE — Back-Office | Super4C2",
};

interface AddQuestionPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ num?: string }>;
}

export default async function AddQuestionPage({ params, searchParams }: AddQuestionPageProps) {
  const { id } = await params;
  const { num } = await searchParams;

  const series = await prisma.examSeries.findUnique({
    where: { id },
    include: {
      questions: {
        select: { questionNumber: true },
      },
    },
  });

  if (!series || series.discipline !== "COMPREHENSION_ECRITE") {
    notFound();
  }

  // Determine suggested number: if num query param provided, use it; else find first missing 1..39 number
  const existingNumbers = new Set(series.questions.map((q) => q.questionNumber));
  let suggestedNumber = num ? toInteger(num, 1, 1) : 1;

  if (!num) {
    for (let i = 1; i <= 39; i++) {
      if (!existingNumbers.has(i)) {
        suggestedNumber = i;
        break;
      }
    }
  }

  return (
    <AdminShell>
      <QuestionForm
        seriesId={series.id}
        seriesNumber={series.seriesNumber}
        defaultNumber={suggestedNumber}
      />
    </AdminShell>
  );
}
