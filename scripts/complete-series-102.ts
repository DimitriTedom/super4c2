import { prisma } from "../lib/prisma";

async function completeSeries102() {
  const series = await prisma.examSeries.findFirst({
    where: { seriesNumber: 102, discipline: "COMPREHENSION_ECRITE" },
  });

  if (!series) throw new Error("Series 102 not found");

  console.log("Generating Lot 2 (Q13-28)...");
  const res2 = await fetch("http://localhost:3000/api/admin/generate-bulk-series", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      seriesId: series.id,
      batch: "tier_2_b1_b2",
      theme: "Standard Équilibré",
    }),
  });
  console.log("Lot 2 status:", res2.status);

  console.log("Generating Lot 3 (Q29-39)...");
  const res3 = await fetch("http://localhost:3000/api/admin/generate-bulk-series", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      seriesId: series.id,
      batch: "tier_3_c1_c2",
      theme: "Standard Équilibré",
    }),
  });
  console.log("Lot 3 status:", res3.status);

  const updated = await prisma.examSeries.findUnique({
    where: { id: series.id },
    include: { questions: { orderBy: { questionNumber: "asc" } } },
  });

  console.log(`Series 102 now has ${updated?.questions.length} / 39 questions in PostgreSQL!`);
}

completeSeries102().catch(console.error);
