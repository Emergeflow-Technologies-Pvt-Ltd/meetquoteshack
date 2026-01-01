import { PrismaClient, UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function seedUsers() {
  console.log("🌱 Seeding users...");

  const defaultPassword = await bcrypt.hash("password123", 10);

  /* ----------------------------- LENDERS ----------------------------- */

  const lenders = [
    {
      name: "Lender One",
      email: "lender1@gmail.com",
      business: "Alpha Investments",
      phone: "111-111-1111",
      investment: "100000",
      province: "Ontario",
    },
    {
      name: "Lender Two",
      email: "lender2@gmail.com",
      business: "Beta Capital",
      phone: "222-222-2222",
      investment: "150000",
      province: "British Columbia",
    },
    {
      name: "Lender Three",
      email: "lender3@gmail.com",
      business: "Gamma Holdings",
      phone: "333-333-3333",
      investment: "200000",
      province: "Alberta",
    },
    {
      name: "Lender Four",
      email: "lender4@gmail.com",
      business: "Delta Ventures",
      phone: "444-444-4444",
      investment: "250000",
      province: "Quebec",
    },
  ];

  for (const lender of lenders) {
    await prisma.user.upsert({
      where: { email: lender.email },
      update: {},
      create: {
        name: lender.name,
        email: lender.email,
        password: defaultPassword,
        role: UserRole.LENDER,
        lender: {
          create: {
            name: lender.name,
            business: lender.business,
            phone: lender.phone,
            investment: lender.investment,
            email: lender.email,
            province: lender.province,
            approved: true,
          },
        },
      },
    });
  }

  /* ----------------------------- AGENTS ----------------------------- */

  const agents = [
    {
      name: "Agent One",
      email: "agent1@gmail.com",
      phone: "555-111-1111",
      business: "Agent Corp A",
      agentCode: "AGENT001",
      calendlyUrl: "https://calendly.com/agent1",
    },
    {
      name: "Agent Two",
      email: "agent2@gmail.com",
      phone: "555-222-2222",
      business: "Agent Corp B",
      agentCode: "AGENT002",
      calendlyUrl: "https://calendly.com/agent2",
    },
    {
      name: "Agent Three",
      email: "agent3@gmail.com",
      phone: "555-333-3333",
      business: "Agent Corp C",
      agentCode: "AGENT003",
      calendlyUrl: "https://calendly.com/agent3",
    },
    {
      name: "Agent Four",
      email: "agent4@gmail.com",
      phone: "555-444-4444",
      business: "Agent Corp D",
      agentCode: "AGENT004",
      calendlyUrl: "https://calendly.com/agent4",
    },
  ];

  for (const agent of agents) {
    await prisma.user.upsert({
      where: { email: agent.email },
      update: {},
      create: {
        name: agent.name,
        email: agent.email,
        password: defaultPassword,
        role: UserRole.AGENT,
        agent: {
          create: {
            name: agent.name,
            phone: agent.phone,
            email: agent.email,
            business: agent.business,
            agentCode: agent.agentCode,
            calendlyUrl: agent.calendlyUrl,
          },
        },
      },
    });
  }

  /* ----------------------------- ADMIN ----------------------------- */

  const adminPassword = await bcrypt.hash("admin@quoteshack", 10);

  await prisma.user.upsert({
    where: { email: "admin@quoteshack.com" },
    update: {},
    create: {
      name: "Admin",
      email: "admin@quoteshack.com",
      password: adminPassword,
      role: UserRole.ADMIN,
    },
  });

  console.log("✅ Users, Lenders & Agents seeded successfully");
}
