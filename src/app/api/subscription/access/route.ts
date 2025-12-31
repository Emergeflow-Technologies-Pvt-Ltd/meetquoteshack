// src/app/api/subscription/access/route.ts
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getAccessStatus } from "@/lib/subscription-access";
import { NextResponse } from "next/server";
import { UserRole } from "@prisma/client";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({}, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      role: true,
      createdAt: true,
      freeTierEndsAt: true,
    },
  });

  if (!user) {
    return NextResponse.json({}, { status: 404 });
  }

  const access = await getAccessStatus(
    user.id,
    user.role,
    user.createdAt,
    user.freeTierEndsAt
  );

  // ✅ FINAL RULE (FREE TIER + SMART)
  const canAccessPrequalification =
    user.role === UserRole.LOANEE &&
    (access.freeTierActive ||
      access.subscription?.plan === "LOANEE_STAY_SMART");

  return NextResponse.json({
    ...access,
    canAccessPrequalification,
  });
}
