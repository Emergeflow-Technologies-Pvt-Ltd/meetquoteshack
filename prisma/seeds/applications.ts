import prisma from "@/lib/db";
import {
  Prisma,
  LoanType,
  HousingStatus,
  EmploymentStatus,
  ResidencyStatus,
  MaritalStatus,
  LoanStatus,
} from "@prisma/client";

export async function seedFewApplications() {
  console.log("🌱 Seeding few loan applications...");

  const loanee = await prisma.user.findFirst({
    where: { role: "LOANEE" },
  });

  if (!loanee) {
    throw new Error("No LOANEE user found");
  }

  const agent = await prisma.agent.findFirst();

  const applications: Prisma.ApplicationCreateInput[] = [
    {
      user: { connect: { id: loanee.id } },
      loanType: LoanType.INVESTMENT_PROPERTY,
      status: LoanStatus.OPEN,
      hasBankruptcy: false,

      firstName: "Swapnil",
      lastName: "Kale",
      dateOfBirth: new Date("2000-12-08"),
      maritalStatus: MaritalStatus.SINGLE,
      residencyStatus: ResidencyStatus.PERMANENT_RESIDENT,

      personalPhone: "9370885243",
      personalEmail: "swapnilkale2002@gmail.com",

      currentAddress: "Delhi",
      yearsAtCurrentAddress: 9,
      housingStatus: HousingStatus.OWN,
      housingPayment: new Prisma.Decimal(1200),

      employmentStatus: EmploymentStatus.PART_TIME,
      grossIncome: new Prisma.Decimal(70000),
      workplaceName: "JK",
      workplaceAddress: "Delhi NCR",
      workplacePhone: "77777777777",
      workplaceEmail: "swapnilkale2002@gmail.com",
      workplaceDuration: 8,

      loanAmount: new Prisma.Decimal(6000),
      monthlyDebts: new Prisma.Decimal(1200),
      savings: new Prisma.Decimal(60000),
      otherIncome: false,
      childCareBenefit: false,

      creditScore: 900,

      agent: agent ? { connect: { id: agent.id } } : undefined,
      agentCode: agent?.agentCode ?? "AGENT-2025-DEMO",

      hasCoApplicant: false,
    },

    {
      user: { connect: { id: loanee.id } },
      loanType: LoanType.OTHER,
      status: LoanStatus.OPEN,
      hasBankruptcy: false,

      firstName: "Swapnil",
      lastName: "Kale",
      dateOfBirth: new Date("2000-12-05"),
      maritalStatus: MaritalStatus.MARRIED,
      residencyStatus: ResidencyStatus.CITIZEN,

      personalPhone: "9370885243",
      personalEmail: "swapnilkale2002@gmail.com",

      currentAddress: "Mumbai",
      yearsAtCurrentAddress: 5,
      housingStatus: HousingStatus.OWN,
      housingPayment: new Prisma.Decimal(4500),

      employmentStatus: EmploymentStatus.FULL_TIME,
      grossIncome: new Prisma.Decimal(80000),
      workplaceName: "OK",
      workplaceAddress: "Mumbai",
      workplacePhone: "77777777777",
      workplaceEmail: "swapnilkale2002@gmail.com",
      workplaceDuration: 6,

      loanAmount: new Prisma.Decimal(70000),
      monthlyDebts: new Prisma.Decimal(4500),
      savings: new Prisma.Decimal(70000),
      otherIncome: false,
      childCareBenefit: false,

      creditScore: 780,

      hasCoApplicant: false,
    },
  ];

  for (const data of applications) {
    await prisma.application.create({ data });
  }

  console.log("✅ Few applications seeded successfully");
}
