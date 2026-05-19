// import { NextResponse } from "next/server"
// import prisma from "@/lib/db"
// import { sendPasswordResetEmail } from "@/lib/mail.controller"

// export async function POST(req: Request) {
//   try {
//     const body = await req.json()

//     const email = body?.email?.toLowerCase().trim()

//     if (!email) {
//       return NextResponse.json(
//         { message: "Email is required" },
//         { status: 400 }
//       )
//     }

//     if (!/^\S+@\S+\.\S+$/.test(email)) {
//       return NextResponse.json(
//         { message: "Invalid email format" },
//         { status: 400 }
//       )
//     }

//     // 1️⃣ Find direct user
//     let user = await prisma.user.findUnique({
//       where: { email },
//     })

//     // 2️⃣ If not found, check agent table
//     if (!user) {
//       const agent = await prisma.agent.findFirst({
//         where: {
//           email,
//         },
//         include: {
//           user: true,
//         },
//       })

//       user = agent?.user || null
//     }

//     // 3️⃣ Send reset email if linked user exists
//     if (user) {
//       await sendPasswordResetEmail(user)
//     }

//     // Generic response
//     return NextResponse.json({
//       message: "If this email exists, a reset link has been sent.",
//     })
//   } catch (error) {
//     console.error(error)

//     return NextResponse.json(
//       { message: "Server error. Please try again." },
//       { status: 500 }
//     )
//   }
// }

import { NextResponse } from "next/server"
import prisma from "@/lib/db"
import { sendPasswordResetEmail } from "@/lib/mail.controller"

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const email = body?.email?.toLowerCase().trim()

    let user = await prisma.user.findFirst({
      where: {
        email: {
          equals: email,
          mode: "insensitive",
        },
      },
    })

    if (!user) {
      const agent = await prisma.agent.findFirst({
        where: { email },
        include: {
          user: true,
        },
      })

      user = agent?.user || null
    }

    if (user) {
      await sendPasswordResetEmail(user)
      console.log("EMAIL SENT")
    } else {
      console.log("NO USER FOUND")
    }

    return NextResponse.json({
      message: "If this email exists, a reset link has been sent.",
    })
  } catch (error) {
    console.error("FORGOT PASSWORD ERROR:", error)

    return NextResponse.json(
      { message: "Server error. Please try again." },
      { status: 500 }
    )
  }
}
