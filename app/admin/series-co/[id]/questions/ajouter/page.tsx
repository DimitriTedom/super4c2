import { notFound } from "next/navigation";
import { AdminShell } from "@/components/admin/admin-shell";
import { CoQuestionForm } from "@/components/admin/co-question-form";
import { prisma } from "@/lib/prisma";
import { toInteger } from "@/lib/admin-crud-utils";

export const metadata = {
  title: "Ajouter une Question CO — Back-Office | Super4C2",
};

interface AddCoQuestionPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ num?: string }>;
}

export default async function AddCoQuestionPage({
  params,
  searchParams,
}: AddCoQuestionPageProps) {
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

  if (!series || series.discipline !== "COMPREHENSION_ORALE") {
    notFound();
  }

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
      <CoQuestionForm
        seriesId={series.id}
        seriesNumber={series.seriesNumber}
        defaultNumber={suggestedNumber}
      />
    </AdminShell>
  );
}
