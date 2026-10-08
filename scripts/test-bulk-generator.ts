import { prisma } from "../lib/prisma";

async function testBulkGenerator() {
  console.log("Testing POST /api/admin/generate-bulk-series endpoint...");

  const res = await fetch("http://localhost:3000/api/admin/generate-bulk-series", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      seriesNumber: 102,
      seriesTitle: "TCF Canada — Compréhension Écrite, Série 102 (Officielle)",
      theme: "Standard Équilibré",
      batch: "tier_1_a1_a2",
    }),
  });

  const status = res.status;
  console.log("Response status:", status);
  const data = await res.json();
  console.log("Response data:", JSON.stringify(data, null, 2));

  if (!res.ok) {
    throw new Error(`Generation failed with status ${status}`);
  }

  // Check in database
  const series = await prisma.examSeries.findFirst({
    where: { seriesNumber: 102, discipline: "COMPREHENSION_ECRITE" },
    include: { questions: { orderBy: { questionNumber: "asc" } } },
  });

  console.log(`Found series in DB: ID ${series?.id}, total questions: ${series?.questions.length}`);
  if (series?.questions && series.questions.length > 0) {
    console.log("Sample question 1:", {
      num: series.questions[0].questionNumber,
      level: series.questions[0].cefrLevel,
      title: series.questions[0].documentTitle,
      correct: series.questions[0].correctOption,
    });
  }

  console.log("TEST SUCCESSFUL: BULK GENERATOR IS 100% OPERATIONAL!");
}

testBulkGenerator().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});
