import Section from "@/components/shared/section";
import LenderPlans from "@/components/lender/LenderPlans";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import { UserRole } from "@prisma/client";
import { redirect } from "next/navigation";

export default async function LenderPlansPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/api/auth/signin");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });

  if (!user || user.role !== UserRole.LENDER) {
    redirect("/");
  }

  return (
    <Section className="py-20">
      <h1 className="text-3xl font-bold text-center mb-10">
        Choose a subscription plan
      </h1>
      <LenderPlans />
    </Section>
  );
}
