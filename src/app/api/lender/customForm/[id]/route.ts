import prisma from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

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

    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const lender = await prisma.lender.findUnique({
      where: { userId: session.user.id },
    })

    if (!lender) {
      return Response.json({ error: "Lender not found" }, { status: 404 })
    }

    const form = await prisma.customForm.findFirst({
      where: {
        id,
        vendorId: lender.id,
      },
      include: {
        applications: {
          orderBy: { createdAt: "desc" },
        },
      },
    })

    if (!form) {
      return Response.json({ error: "Form not found" }, { status: 404 })
    }

    const formattedForm = {
      ...form,
      logo: (form.branding as Branding | null)?.logo ?? null,
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
