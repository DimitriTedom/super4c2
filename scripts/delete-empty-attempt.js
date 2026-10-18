const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const result = await prisma.userAttempt.deleteMany({
    where: {
      rawScore: 0,
      discipline: "EXPRESSION_ECRITE",
    },
  });
  console.log("SUCCESS_DELETED:", result.count);
  await prisma.$disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
