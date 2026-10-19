import { notFound } from "next/navigation";
import { AdminShell } from "@/components/admin/admin-shell";
import { OralTaskForm } from "@/components/admin/oral-task-form";
import { prisma } from "@/lib/prisma";
import { toInteger } from "@/lib/admin-crud-utils";

export const metadata = {
  title: "Configurer une Tâche EO — Back-Office | Super4C2",
};

interface AddOralTaskPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ num?: string }>;
}

export default async function AddOralTaskPage({
  params,
  searchParams,
}: AddOralTaskPageProps) {
  const { id } = await params;
  const { num } = await searchParams;

  const series = await prisma.oralSeries.findUnique({
    where: { id },
    include: {
      tasks: {
        select: { taskNumber: true },
      },
    },
  });

  if (!series) {
    notFound();
  }

  // Determine suggested task number:
  const existingNumbers = new Set(series.tasks.map((t) => t.taskNumber));
  let suggested = num ? toInteger(num, 1, 1) : 1;

  if (!num) {
    for (let i = 1; i <= 3; i++) {
      if (!existingNumbers.has(i)) {
        suggested = i;
        break;
      }
    }
  }

  return (
    <AdminShell>
      <OralTaskForm
        seriesId={series.id}
        seriesNumber={series.seriesNumber}
        defaultTaskNumber={suggested}
      />
    </AdminShell>
  );
}
