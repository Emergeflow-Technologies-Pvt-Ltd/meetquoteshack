import prisma from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { UserRole } from "@prisma/client"

type Branding = {
  logo?: string | null
}

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params

    const session = await getServerSession(authOptions)

    if (!session?.user?.id || session.user.role !== UserRole.ADMIN) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const form = await prisma.customForm.findFirst({
      where: { id },
      include: {
        applications: {
          orderBy: { createdAt: "desc" },
        },
        lender: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    })

    if (!form) {
      return Response.json({ error: "Form not found" }, { status: 404 })
    }

    const branding = form.branding as Branding | null

    const formattedForm = {
      ...form,
      logo: branding?.logo || null,
    }

    return Response.json({
      success: true,
      form: formattedForm,
    })
  } catch (error) {
    console.error(error)
    return Response.json({ error: "Something went wrong" }, { status: 500 })
  }
}
