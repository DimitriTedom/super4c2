import { notFound } from "next/navigation";
import { AdminShell } from "@/components/admin/admin-shell";
import { WrittenTaskForm } from "@/components/admin/written-task-form";
import { prisma } from "@/lib/prisma";
import { toInteger } from "@/lib/admin-crud-utils";

export const metadata = {
  title: "Configurer une Tâche EE — Back-Office | Super4C2",
};

interface AddWrittenTaskPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ num?: string }>;
}

export default async function AddWrittenTaskPage({
  params,
  searchParams,
}: AddWrittenTaskPageProps) {
  const { id } = await params;
  const { num } = await searchParams;

  const series = await prisma.writtenSeries.findUnique({
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
      <WrittenTaskForm
        seriesId={series.id}
        seriesNumber={series.seriesNumber}
        defaultTaskNumber={suggested}
      />
    </AdminShell>
  );
}
