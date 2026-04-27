import { NextResponse } from "next/server"
import prisma from "@/lib/db"
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"

type ResetTokenPayload = {
  id: string
  purpose: "password_reset"
  iat?: number
  exp?: number
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { token, password } = body

    // ❌ Missing fields
    if (!token || !password) {
      return NextResponse.json(
        { message: "Token and password are required" },
        { status: 400 }
      )
    }

    // ❌ Weak password
    if (password.length < 6) {
      return NextResponse.json(
        { message: "Password must be at least 6 characters" },
        { status: 400 }
      )
    }

    let decoded: ResetTokenPayload

    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!) as ResetTokenPayload
    } catch {
      return NextResponse.json(
        { message: "Invalid or expired token" },
        { status: 400 }
      )
    }

    // ❌ Invalid token purpose
    if (decoded.purpose !== "password_reset") {
      return NextResponse.json({ message: "Invalid token" }, { status: 400 })
    }

    const userId = decoded.id

    const user = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    // ✅ Hash password (FIXES YOUR 401 ISSUE)
    const hashedPassword = await bcrypt.hash(password, 10)

    await prisma.user.update({
      where: { id: userId },
      data: {
        password: hashedPassword,
      },
    })

    return NextResponse.json({
      message: "Password reset successful",
    })
  } catch (error) {
    console.error("Reset password error:", error)

    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    )
  }
}
