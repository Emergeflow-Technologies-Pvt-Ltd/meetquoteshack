// app/api/agent/register/route.ts
import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { BecomeAgentProps } from "@/lib/schema";
import { hash } from "bcrypt";

export async function POST(request: NextRequest) {
  try {
    const body: BecomeAgentProps = await request.json();

    if (!body.email || !body.password || !body.name || !body.phone) {
      return new NextResponse("Missing required fields.", { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: body.email },
    });

    if (existingUser) {
      return new NextResponse("User already exists.", { status: 400 });
    }

    const hashedPassword = await hash(body.password, 10);

    const user = await prisma.user.create({
      data: {
        name: body.name,
        email: body.email,
        password: hashedPassword,
        role: "AGENT",
      },
    });

    await prisma.agent.create({
      data: {
        userId: user.id,
        name: body.name,
        phone: body.phone,
        email: body.email,
      },
    });

    return new NextResponse(
      "Agent registration received. Quoteshack admin will reach out to you soon.",
      { status: 201 }
    );
  } catch (error) {
    console.error("Agent register error:", error);
    return new NextResponse(JSON.stringify({ error: "Internal server error" }), { status: 500 });
  }
}
