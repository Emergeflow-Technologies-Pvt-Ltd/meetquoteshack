import { PrismaClient, UserRole } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

export async function seedAdmin() {
  console.log("🌱 Seeding admin...")

  const adminEmail = "admin@quoteshack.com"
  const adminPassword = await bcrypt.hash("admin@quoteshack", 10)

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      name: "Admin",
      email: adminEmail,
      password: adminPassword,
      role: UserRole.ADMIN,
    },
  })

  console.log("✅ Admin created")
}
