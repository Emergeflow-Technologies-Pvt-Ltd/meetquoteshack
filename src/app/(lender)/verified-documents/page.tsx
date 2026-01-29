import Link from "next/link"
import prisma from "@/lib/db"
import { DocumentType } from "@prisma/client"
import Section from "@/components/shared/section"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FileCheck, AlertCircle } from "lucide-react"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function DocumentVerifiedPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    redirect("/login")
  }

  // Get user with lender and agent info
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { lender: true, agent: true },
  })

  if (!user?.lender && !user?.agent) {
    return (
      <Section className="py-24">
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center p-4 text-center">
              <AlertCircle className="mb-2 h-10 w-10 text-muted-foreground" />
              <p className="text-lg font-medium">Access Denied</p>
              <p className="text-sm text-muted-foreground">
                Only lenders and agents can access this page
              </p>
            </div>
          </CardContent>
        </Card>
      </Section>
    )
  }

  // Fetch applications assigned to this lender or agent that have verification documents
  const applications = await prisma.application.findMany({
    where: {
      OR: [{ lenderId: user.lender?.id }, { agentId: user.agent?.id }],
      documents: {
        some: {
          documentType: DocumentType.VERIFICATION_RECORD,
        },
      },
    },
    include: {
      documents: {
        where: {
          documentType: DocumentType.VERIFICATION_RECORD,
        },
      },
    },
    orderBy: {
      updatedAt: "desc",
    },
  })

  return (
    <Section className="py-12 md:py-24">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Verified Documents</h1>
        <p className="mt-2 text-gray-600">
          Applications with admin verification reports
        </p>
      </div>

      {applications.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <FileCheck className="mb-4 h-16 w-16 text-gray-400" />
              <p className="text-lg font-medium text-gray-900">
                No Verified Documents
              </p>
              <p className="mt-2 text-sm text-gray-500">
                Applications with verification documents will appear here
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <Card
              key={app.id}
              className="border-gray-200 transition-shadow hover:shadow-lg"
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between gap-6">
                  {/* Left side - Details */}
                  <div className="flex-1 space-y-3">
                    {/* Row 1: ID */}
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">ID:</span>
                      <Badge
                        variant="secondary"
                        className="bg-violet-100 text-violet-700"
                      >
                        {app.id}
                      </Badge>
                    </div>

                    {/* Row 2: Name */}
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">Name:</span>
                      <span className="font-semibold text-gray-900">
                        {app.firstName} {app.lastName}
                      </span>
                    </div>

                    {/* Row 3: Email */}
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">Email:</span>
                      <span className="text-sm text-gray-700">
                        {app.personalEmail}
                      </span>
                    </div>

                    {/* Row 4: Current Address and Annual Income */}
                    <div className="flex items-center gap-8">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">
                          Current Address:
                        </span>
                        <span className="text-sm text-gray-700">
                          {app.currentAddress}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">
                          Annual Income:
                        </span>
                        <span className="font-medium text-gray-900">
                          ${app.grossIncome.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right side - Button */}
                  <div className="flex-shrink-0">
                    <Link href={`/verified-documents/${app.id}`}>
                      <Button className="bg-violet-600 hover:bg-violet-700">
                        View Details
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </Section>
  )
}
