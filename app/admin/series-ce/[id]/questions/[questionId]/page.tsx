import { notFound } from "next/navigation";
import { AdminShell } from "@/components/admin/admin-shell";
import { QuestionForm } from "@/components/admin/question-form";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "Modifier une Question CE — Back-Office | Super4C2",
};

interface EditQuestionPageProps {
  params: Promise<{ id: string; questionId: string }>;
}

export default async function EditQuestionPage({ params }: EditQuestionPageProps) {
  const { id, questionId } = await params;

  const series = await prisma.examSeries.findUnique({
    where: { id },
  });

  if (!series || series.discipline !== "COMPREHENSION_ECRITE") {
    notFound();
  }

  const question = await prisma.question.findUnique({
    where: { id: questionId },
  });

  if (!question || question.seriesId !== id) {
    notFound();
  }

  return (
    <AdminShell>
      <QuestionForm
        seriesId={series.id}
        seriesNumber={series.seriesNumber}
        question={question}
      />
    </AdminShell>
  );
}
