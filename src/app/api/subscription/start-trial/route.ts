// src/app/api/subscription/start-trial/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { UserRole } from "@prisma/client";

export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, role: true, freeTierEndsAt: true },
    });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.role === UserRole.LENDER) {
      if (user.freeTierEndsAt) {
        return NextResponse.json(
          { success: false, message: "Trial already started" },
          { status: 400 }
        );
      }

      const trialEndsAt = new Date();
      trialEndsAt.setDate(trialEndsAt.getDate() + 60);

      await prisma.user.update({
        where: { id: userId },
        data: {
          freeTierEndsAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        },
      });

      return NextResponse.json(
        { success: true, trialEndsAt: trialEndsAt.toISOString() },
        { status: 200 }
      );
    } else if (user.role === UserRole.LOANEE) {
      if (user.freeTierEndsAt) {
        return NextResponse.json(
          { success: false, message: "Free access already started" },
          { status: 400 }
        );
      }

      const trialEndsAt = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);

      await prisma.user.update({
        where: { id: userId },
        data: {
          freeTierEndsAt: trialEndsAt,
        },
      });

      return NextResponse.json(
        { success: true, trialEndsAt: trialEndsAt.toISOString() },
        { status: 200 }
      );
    }
  } catch (err) {
    console.error("[START_TRIAL_ERROR]", err);
    return NextResponse.json(
      { error: "Failed to start trial" },
      { status: 500 }
    );
  }
}
