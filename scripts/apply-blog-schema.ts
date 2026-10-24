import { prisma } from "../lib/prisma";

async function main() {
  console.log("Checking blog_posts columns...");
  await prisma.$executeRawUnsafe(`
    ALTER TABLE public.blog_posts 
    ADD COLUMN IF NOT EXISTS "youtubeUrl" TEXT,
    ADD COLUMN IF NOT EXISTS "targetKeyword" TEXT,
    ADD COLUMN IF NOT EXISTS "ctaType" TEXT DEFAULT 'CRS_CALCULATOR',
    ADD COLUMN IF NOT EXISTS "ctaLabel" TEXT,
    ADD COLUMN IF NOT EXISTS "ctaUrl" TEXT;
  `);
  console.log("✅ DDL executed successfully on public.blog_posts!");
  const count = await prisma.blogPost.count();
  console.log("Total articles in database:", count);
}

main()
  .catch((err) => {
    console.error("❌ DDL error:", err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
