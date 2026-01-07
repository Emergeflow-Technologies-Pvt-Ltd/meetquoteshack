import { PrismaClient } from "@prisma/client";
import { seedUsers } from "./seeds/users";
import { seedFewApplications } from "./seeds/applications"

const prisma = new PrismaClient();

async function main() {
  console.log("🚀 Starting database seed...");

  await seedUsers(); // 👈 users first
  await seedFewApplications();

  console.log("🎉 Database seeded successfully");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
