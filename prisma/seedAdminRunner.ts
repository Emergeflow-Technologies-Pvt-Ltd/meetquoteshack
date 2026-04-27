import { PrismaClient } from "@prisma/client"
import { seedAdmin } from "./seeds/seedAdmin"

const prisma = new PrismaClient()

async function main() {
  console.log("🚀 Seeding admin only...")

  await seedAdmin()

  console.log("✅ Admin seeded successfully")
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
