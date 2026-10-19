import { notFound } from "next/navigation";
import { AdminShell } from "@/components/admin/admin-shell";
import { CoQuestionForm } from "@/components/admin/co-question-form";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "Modifier une Question CO — Back-Office | Super4C2",
};

interface EditCoQuestionPageProps {
  params: Promise<{ id: string; questionId: string }>;
}

export default async function EditCoQuestionPage({ params }: EditCoQuestionPageProps) {
  const { id, questionId } = await params;

  const series = await prisma.examSeries.findUnique({
    where: { id },
  });

  if (!series || series.discipline !== "COMPREHENSION_ORALE") {
    notFound();
  }

  const question = await prisma.question.findUnique({
    where: { id: questionId },
  });

  if (!question || question.seriesId !== series.id) {
    notFound();
  }

  return (
    <AdminShell>
      <CoQuestionForm
        seriesId={series.id}
        seriesNumber={series.seriesNumber}
        question={question}
      />
    </AdminShell>
  );
}
