import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { BecomeLenderProps } from "@/lib/schema";
import { hash } from "bcrypt";
import { UserRole } from "@prisma/client";

const LENDER_FREE_TIER_DAYS = 60;

export async function POST(request: NextRequest) {
  const body: BecomeLenderProps = await request.json();

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email: body.email },
    });

    if (existingUser) {
      return new NextResponse("User already exists.", { status: 400 });
    }

    const hashedPassword = await hash(body.password, 10);

    // ✅ CREATE USER WITH FREE TIER
    const user = await prisma.user.create({
      data: {
        name: body.name,
        email: body.email,
        password: hashedPassword,
        role: UserRole.LENDER,

        // 🔑 CRITICAL FIX
        freeTierEndsAt: new Date(
          Date.now() + LENDER_FREE_TIER_DAYS * 24 * 60 * 60 * 1000
        ),
        hasSeenFreeTrialModal: false,
      },
    });

    await prisma.lender.create({
      data: {
        userId: user.id,
        business: body.business,
        name: body.name,
        phone: body.phone,
        investment: body.investment,
        email: body.email,
        province: body.province,
      },
    });

    return new NextResponse(
      "We have received your request. Quoteshack admin will reach out to you soon."
    );
  } catch (error) {
    console.error(error);
    return new NextResponse("Something went wrong", { status: 500 });
  }
}
