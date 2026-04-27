import { NextResponse } from "next/server"
import prisma from "@/lib/db"
import { sendPasswordResetEmail } from "@/lib/mail.controller"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const email = body?.email?.toLowerCase().trim()

    if (!email) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      )
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return NextResponse.json(
        { message: "Invalid email format" },
        { status: 400 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (user) {
      await sendPasswordResetEmail(user)
    }

    // 🔒 Always generic response
    return NextResponse.json({
      success: !!user, // 👈 internal flag
      message: "If this email exists, a reset link has been sent.",
    })
  } catch (error) {
    console.error(error)

    return NextResponse.json(
      { message: "Server error. Please try again." },
      { status: 500 }
    )
  }
}
