import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { BecomeLenderProps } from "@/lib/schema";

export async function POST(request: NextRequest) {
  const body: BecomeLenderProps = await request.json();
  const session = await getServerSession(authOptions);
  if (!session || !session.user || !session.user.email) {
    throw new Error("User not authenticated");
  }
  try {
    await prisma.lender.create({
      data: {
        ...body,
      },
    });
    return new NextResponse(
      "We have received your request. Quoteshack admin will reach out to you soon."
    );
  } catch (error) {
    return new NextResponse(JSON.stringify(error), { status: 500 });
  }
}
