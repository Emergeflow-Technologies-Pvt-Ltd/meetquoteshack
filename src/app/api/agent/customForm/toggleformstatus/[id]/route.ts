import prisma from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params

    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const form = await prisma.customForm.findUnique({
      where: { id },
      include: {
        agent: true,
        lender: true, // ✅ include lender
      },
    })

    if (!form) {
      return Response.json({ error: "Form not found" }, { status: 404 })
    }

    // ✅ Ownership check (agent OR lender)
    const isAgentOwner = form.agent?.userId === session.user.id
    const isLenderOwner = form.lender?.userId === session.user.id

    if (!isAgentOwner && !isLenderOwner) {
      return Response.json({ error: "Forbidden" }, { status: 403 })
    }

    const updated = await prisma.customForm.update({
      where: { id },
      data: {
        status: form.status === "ACTIVE" ? "DISABLED" : "ACTIVE",
      },
    })

    return Response.json({ success: true, status: updated.status })
  } catch (err) {
    console.error(err)
    return Response.json({ error: "Something went wrong" }, { status: 500 })
  }
}
