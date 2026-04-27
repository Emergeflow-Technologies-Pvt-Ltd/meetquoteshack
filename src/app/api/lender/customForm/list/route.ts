import prisma from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    // 🔥 find lender
    const lender = await prisma.lender.findUnique({
      where: { userId: session.user.id },
    })

    if (!lender) {
      return Response.json({ error: "Lender not found" }, { status: 404 })
    }

    // 🔥 get forms
    const forms = await prisma.customForm.findMany({
      where: { vendorId: lender.id },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        status: true,
        shareUrl: true,
        createdAt: true,
        branding: true,
      },
    })

    return Response.json({
      success: true,
      forms,
      stats: {
        total: forms.length,
        active: forms.filter((f) => f.status === "ACTIVE").length,
        disabled: forms.filter((f) => f.status === "DISABLED").length,
      },
    })
  } catch (error) {
    console.error(error)
    return Response.json({ error: "Something went wrong" }, { status: 500 })
  }
}
