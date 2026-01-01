// src/app/api/subscription/check/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import { getAccessStatus } from "@/lib/subscription-access";
import { UserRole } from "@prisma/client";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, role: true, createdAt: true, freeTierEndsAt: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const role = user.role as UserRole;

    const access = await getAccessStatus(
      user.id,
      role,
      user.createdAt,
      user.freeTierEndsAt ?? null
    );

    return NextResponse.json(
      { hasAccess: !!access.hasAccess, access },
      { status: 200 }
    );
  } catch (err) {
    console.error("[SUBSCRIPTION_CHECK_ERROR]", err);
    return NextResponse.json(
      { error: "Failed to check subscription" },
      { status: 500 }
    );
  }
}
