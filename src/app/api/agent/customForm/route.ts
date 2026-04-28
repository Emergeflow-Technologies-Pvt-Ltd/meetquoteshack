import prisma from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await req.formData()
    const raw = formData.get("data") as string

    if (!raw) {
      return Response.json({ error: "Invalid payload" }, { status: 400 })
    }

    const parsed = JSON.parse(raw)

    const name = parsed.name
    const steps = parsed.steps

    if (!name) {
      return Response.json({ error: "Form name is required" }, { status: 400 })
    }

    // optional logo
    const logoFile = formData.get("logo") as File | null

    // 🔥 find agent
    const agent = await prisma.agent.findUnique({
      where: { userId: session.user.id },
    })

    if (!agent) {
      return Response.json({ error: "Agent not found" }, { status: 404 })
    }

    // 🔥 handle logo upload (TEMP: base64 or skip storage)
    let logoUrl = null

    if (logoFile) {
      // ⚠️ Replace with S3 / Cloudinary later
      const buffer = Buffer.from(await logoFile.arrayBuffer())
      const base64 = buffer.toString("base64")

      logoUrl = `data:${logoFile.type};base64,${base64}`
    }
    const shareId = crypto.randomUUID()

    const baseUrl =
      process.env.APP_BASE_URL ??
      (process.env.NODE_ENV === "production"
        ? "https://meetquoteshack.com/"
        : "http://localhost:3000")
    const fullShareUrl = `${baseUrl}/loanee/loan-application?formId=${shareId}`
    // 🔥 create form
    const form = await prisma.customForm.create({
      data: {
        name,
        shareId,
        shareUrl: fullShareUrl, // ✅ full URL saved
        steps,

        agent: {
          connect: { id: agent.id },
        },

        branding: {
          logo: logoUrl,
        },
      },
    })

    console.log("CREATED FORM:", {
      id: form.id,
      shareId: form.shareId,
      shareUrl: form.shareUrl,
    })

    return Response.json({
      success: true,
      formId: form.id,
      shareUrl: fullShareUrl,
    })
  } catch (error) {
    console.error(error)
    return Response.json({ error: "Something went wrong" }, { status: 500 })
  }
}
