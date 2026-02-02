import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import Section from "@/components/shared/section"
import AgentChatPage from "@/components/agent/AgentChatPage"

export default async function AgentChatPageRoute() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect("/agent/login")
  }

  if (session.user.role !== "AGENT") {
    redirect("/")
  }

  return (
    <Section className="mx-auto max-w-7xl px-4 py-8">
      <AgentChatPage currentUserId={session.user.id} />
    </Section>
  )
}
