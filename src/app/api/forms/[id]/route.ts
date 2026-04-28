import prisma from "@/lib/db"

type Step = {
  id: string
  title: string
  fields?: Record<string, FieldConfig>
}

type FieldConfig = {
  enabled?: boolean
  options?: string[]
}

type FieldsMap = Record<string, Record<string, FieldConfig>>

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const form = await prisma.customForm.findUnique({
      where: { shareId: id },
      include: {
        agent: true, // ✅ REQUIRED
      },
    })

    if (!form) {
      return Response.json({ error: "Form not found" }, { status: 404 })
    }

    const rawSteps = form.steps

    if (!Array.isArray(rawSteps)) {
      return Response.json({ error: "Invalid form structure" }, { status: 500 })
    }

    const steps = rawSteps as Step[]

    return Response.json({
      id,
      status: form.status,
      steps,
      fields: steps.reduce<FieldsMap>((acc, step) => {
        acc[step.id] = step.fields || {}
        return acc
      }, {}),

      // ✅ ADD THIS
      agentCode: form.agent?.agentCode || null,
    })
  } catch (error) {
    console.error(error)
    return Response.json({ error: "Server error" }, { status: 500 })
  }
}
