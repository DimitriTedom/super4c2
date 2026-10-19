import { notFound } from "next/navigation";
import { AdminShell } from "@/components/admin/admin-shell";
import { OralTaskForm } from "@/components/admin/oral-task-form";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "Modifier une Tâche EO — Back-Office | Super4C2",
};

interface EditOralTaskPageProps {
  params: Promise<{ id: string; taskId: string }>;
}

export default async function EditOralTaskPage({ params }: EditOralTaskPageProps) {
  const { id, taskId } = await params;

  const series = await prisma.oralSeries.findUnique({
    where: { id },
  });

  if (!series) {
    notFound();
  }

  const task = await prisma.oralTask.findUnique({
    where: { id: taskId },
  });

  if (!task || task.seriesId !== series.id) {
    notFound();
  }

  return (
    <AdminShell>
      <OralTaskForm
        seriesId={series.id}
        seriesNumber={series.seriesNumber}
        task={{
          id: task.id,
          seriesId: task.seriesId,
          taskNumber: task.taskNumber,
          type: task.type,
          title: task.title,
          durationSeconds: task.durationSeconds,
          examinerPrompt: task.examinerPrompt,
          roleplayScenario: (task.roleplayScenario as {
            situation?: string;
            candidateRole?: string;
            examinerRole?: string;
            instructions?: string;
          } | null) ?? null,
        }}
      />
    </AdminShell>
  );
}
