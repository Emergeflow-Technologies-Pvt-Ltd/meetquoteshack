import prisma from "@/lib/db"
import { notFound } from "next/navigation"
import Section from "@/components/shared/section"
import AgentDetailsPage from "@/app/(site)/applications/components/AgentDetailsPage"
import SelectAdvisorButton from "@/components/agent/SelectAdvisorButton"
import AdvisorChat from "@/components/profile/AdvisorChat"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { AdvisorMessage, UserRole } from "@prisma/client"

interface PageProps {
  params: Promise<{ agentId: string }>
}

export default async function AgentPublicProfilePage({
  params,
}: PageProps) {
  const { agentId } = await params

  const session = await getServerSession(authOptions)
  const currentUserId = session?.user?.id

  let currentUser = null
  let isChatMode = false

  if (currentUserId) {
    currentUser = await prisma.user.findUnique({
      where: { id: currentUserId },
      select: { advisorId: true, role: true },
    })
  }

  const agent = await prisma.agent.findUnique({
    where: { id: agentId },
    include: {
      user: true,
      applications: true,
    },
  })

  if (!agent) {
    notFound()
  }

  // If the agent is the user's selected advisor, show chat
  if (currentUser?.advisorId === agent.id) {
    isChatMode = true
  }

  const agentData = {
    ...agent,
    applicationsCount: agent.applications.length,
  }

  const agentReviews = await prisma.agentReview.findMany({
    where: { agentId: agent.id },
    include: {
      loanee: { select: { name: true } },
      application: { select: { loanType: true } },
    },
    orderBy: { createdAt: "desc" },
  })

  let messages: (AdvisorMessage & { sender: { role: UserRole } })[] = []

  if (isChatMode && currentUserId) {
    // Ensure agent has a user account linked for chat
    if (agent.userId) {
      messages = await prisma.advisorMessage.findMany({
        where: {
          OR: [
            { senderId: currentUserId, receiverId: agent.userId },
            { senderId: agent.userId, receiverId: currentUserId },
          ],
        },
        orderBy: { createdAt: "asc" },
        include: {
          sender: { select: { role: true } },
        },
      })
    }
  }

  return (
    <Section className="mx-auto max-w-7xl px-4 py-8">
      <div className={`flex h-full flex-col gap-6 lg:flex-row`}>
        <div
          className={`flex-1 space-y-8 transition-all duration-300 ${isChatMode ? "lg:w-[70%]" : "w-full"}`}
        >
          <AgentDetailsPage
            agent={agentData}
            reviews={agentReviews.map((r) => ({
              ...r,
              createdAt: r.createdAt as Date,
              applicationId: "", // Not relevant for public profile context
            }))}
            action={
              <SelectAdvisorButton
                agentId={agent.id}
                className="w-full md:w-auto"
                currentAdvisorId={currentUser?.advisorId}
              />
            }
          />
        </div>

        {isChatMode && currentUserId && agent.userId && (
          <div className="lg:w-[30%] lg:min-w-[350px]">
            <div className="sticky top-24 h-[calc(100vh-120px)]">
              <AdvisorChat
                messages={messages}
                counterpartId={agent.userId}
                currentUserId={currentUserId}
              />
            </div>
          </div>
        )}
      </div>
    </Section>
  )
}
