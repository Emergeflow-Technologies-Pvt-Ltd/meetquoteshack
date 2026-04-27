import prisma from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { UserRole } from "@prisma/client"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    // 🔐 AUTH CHECK
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    // 🔐 ROLE CHECK (IMPORTANT)
    if (session.user.role !== UserRole.ADMIN) {
      return Response.json({ error: "Forbidden" }, { status: 403 })
    }

    // 🔥 GET ALL FORMS (NO vendor filter)
    const forms = await prisma.customForm.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        status: true,
        shareUrl: true,
        createdAt: true,
        branding: true,

        // ✅ optional (recommended for admin)
        lender: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
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
