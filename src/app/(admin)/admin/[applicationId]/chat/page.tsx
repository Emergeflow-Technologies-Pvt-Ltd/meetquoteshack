import { Messages } from "@/components/shared/Messages";
import prisma from "@/lib/db";

export default async function ChatPage({
  params,
}: {
  params: Promise<{ applicationId: string }>;
}) {
  const { applicationId } = await params;
  const messages = await prisma.message.findMany({
    where: {
      applicationId: applicationId,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  return (
    <div className="container mx-auto p-4">
      <Messages messages={messages} applicationId={applicationId} />
    </div>
  );
}