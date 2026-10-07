import { notFound } from "next/navigation";
import { AdminShell } from "@/components/admin/admin-shell";
import { WrittenTaskForm } from "@/components/admin/written-task-form";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "Modifier une Tâche EE — Back-Office | Super4C2",
};

interface EditWrittenTaskPageProps {
  params: Promise<{ id: string; taskId: string }>;
}

export default async function EditWrittenTaskPage({ params }: EditWrittenTaskPageProps) {
  const { id, taskId } = await params;

  const series = await prisma.writtenSeries.findUnique({
    where: { id },
  });

  if (!series) {
    notFound();
  }

  const task = await prisma.writtenTask.findUnique({
    where: { id: taskId },
  });

  if (!task || task.seriesId !== id) {
    notFound();
  }

  return (
    <AdminShell>
      <WrittenTaskForm
        seriesId={series.id}
        seriesNumber={series.seriesNumber}
        task={task}
      />
    </AdminShell>
  );
}
