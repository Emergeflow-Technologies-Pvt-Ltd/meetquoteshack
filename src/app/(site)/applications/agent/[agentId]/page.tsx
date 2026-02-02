import prisma from "@/lib/db";
import { notFound } from "next/navigation";
import AgentDetailsPage from "../../components/AgentDetailsPage";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function Page({
  params,
}: {
  params: Promise<{ agentId: string }>;
}) {
  const { agentId } = await params;
  const session = await getServerSession(authOptions);

  const agent = await prisma.agent.findUnique({
    where: { id: agentId },
    include: { applications: true },
  });

  if (!agent) return notFound();

  const reviews = await prisma.agentReview.findMany({
    where: { agentId: agent.id },
    include: { loanee: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
  });

  // ✅ Only get application if user is logged in and owns it
  let application = null;
  if (session?.user?.id) {
    application = await prisma.application.findFirst({
      where: {
        agentId: agent.id,
        userId: session.user.id, // ✅ Filter by current user
      },
      select: { id: true },
    });
  }

  return (
    <AgentDetailsPage
      agent={{
        id: agent.id,
        name: agent.name,
        email: agent.email,
        phone: agent.phone,
        applicationsCount: agent.applications.length,
        calendlyUrl: agent.calendlyUrl,
      }}
      reviews={reviews}
      applicationId={application?.id ?? null}
    />
  );
}
