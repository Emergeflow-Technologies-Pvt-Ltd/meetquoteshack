import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ unlocked: false }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const applicationId = searchParams.get("applicationId");

  if (!applicationId) {
    return NextResponse.json({ unlocked: false }, { status: 400 });
  }

  const agent = await prisma.agent.findUnique({
    where: { userId: session.user.id },
  });

  if (!agent) {
    return NextResponse.json({ unlocked: false });
  }

  const unlock = await prisma.agentApplicationUnlock.findFirst({
    where: {
      applicationId,
      agentId: agent.id,
    },
  });

  return NextResponse.json({ unlocked: Boolean(unlock) });
}
