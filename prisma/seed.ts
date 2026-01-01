import { PrismaClient } from "@prisma/client";
import { seedUsers } from "./seeds/users";

const prisma = new PrismaClient();

async function main() {
  console.log("🚀 Starting database seed...");

  await seedUsers(); // 👈 users first

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
