import { Messages } from "@/components/shared/Messages";
import prisma from "@/lib/db";

export default async function ApplicationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const messages = await prisma.message.findMany({
    where: { applicationId: id },
    orderBy: { createdAt: "asc" },
  });

  return (
    <div className="container mx-auto p-4">
      <Messages messages={messages} applicationId={id} />
    </div>
  );
} 