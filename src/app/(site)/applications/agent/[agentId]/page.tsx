import prisma from "@/lib/db";
import { notFound } from "next/navigation";
import AgentDetailsPage from "../../components/AgentDetailsPage";

type PageProps = {
  params: {
    agentId: string;
  };
};

export default async function Page({ params }: PageProps) {
  const { agentId } = await params;


  const agent = await prisma.agent.findUnique({
    where: { id: agentId },
    include: {
      applications: true,
    },
  });

  if (!agent) return notFound();

  const reviews = await prisma.agentReview.findMany({
    where: { agentId: agent.id },
    include: {
      loanee: {
        select: { name: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const application = await prisma.application.findFirst({
    where: { agentId: agent.id },
    select: { id: true },
  });

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
