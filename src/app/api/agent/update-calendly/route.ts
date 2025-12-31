import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { calendlyUrl } = await req.json();

    if (!calendlyUrl || typeof calendlyUrl !== "string") {
      return new NextResponse("Invalid Calendly URL", { status: 400 });
    }

    await prisma.agent.update({
      where: { userId: session.user.id },
      data: { calendlyUrl },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return new NextResponse("Server error", { status: 500 });
  }
}
