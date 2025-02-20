import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { BecomeLenderProps } from "@/lib/schema";
import { hash } from "bcrypt";

export async function POST(request: NextRequest) {
  const body: BecomeLenderProps = await request.json();

  try {
    const existingUser = await prisma.user.findUnique({
      where: {
        email: body.email,
      },
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
        role: "LENDER",
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
    return new NextResponse(JSON.stringify(error), { status: 500 });
  }
}
