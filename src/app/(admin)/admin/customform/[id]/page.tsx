"use client"

import Section from "@/components/shared/section"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Check, ChevronDown } from "lucide-react"
import Link from "next/link"
import { fieldTypeMap } from "@/lib/fieldTypes"

type Application = {
  id: string
  firstName: string
  lastName: string
  createdAt: string
  status?: string
  loanAmount?: number
  loanType?: string
  employmentStatus?: string
  grossIncome?: number
  housingStatus?: string
  monthlyDebts?: number
  savings?: number
  personalPhone?: string
}

type Field = {
  required?: boolean
  options?: string[]
}

type Step = {
  id: string
  title: string
  fields: Record<string, Field>
}

type CustomForm = {
  id: string
  name: string
  status: string
  createdAt: string
  branding?: {
    logo?: string | null
  } | null
  lender?: {
    name?: string
  } | null
  applications?: Application[]
  steps: Step[]
}

export default function AdminCustomFormDetailsPage() {
  const { id } = useParams()

  const [form, setForm] = useState<CustomForm | null>(null)
  const [loading, setLoading] = useState(true)
  const [openSteps, setOpenSteps] = useState<string[]>([])

  // const shareLink = form?.shareUrl || ""

  useEffect(() => {
    const fetchForm = async () => {
      try {
        const res = await fetch(`/api/admin/customform/${id}`)
        const data = await res.json()

        if (data.success) {
          setForm(data.form)
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    if (id) fetchForm()
  }, [id])

  const toggleStep = (id: string) => {
    setOpenSteps((prev) =>
      prev.includes(id) ? prev.filter((stepId) => stepId !== id) : [...prev, id]
    )
  }

  const formatLabel = (key: string) =>
    key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())

  const getStatusStyles = (status?: string) => {
    switch (status) {
      case "APPROVED":
        return "bg-green-100 text-green-700"
      case "REJECTED":
        return "bg-red-100 text-red-700"
      case "CUSTOM_APPLICATION":
        return "bg-purple-100 text-purple-700"
      default:
        return "bg-blue-100 text-blue-700"
    }
  }

  const formatLoanStatus = (status?: string) => {
    if (!status) return "-"

    if (status === "CUSTOM_APPLICATION") return "Custom"

    return status.replaceAll("_", " ")
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-slate-500">Loading form...</p>
      </div>
    )
  }

  if (!form) return <p className="p-6">Form not found</p>

  return (
    <Section className="flex flex-col gap-6 py-12">
      <div className="flex flex-col gap-6">
        <div className="flex h-[58px] items-start justify-between py-3">
          <h1 className="text-[28px] font-bold leading-normal text-violet-600">
            Custom Forms
          </h1>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-4">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 overflow-hidden rounded-full bg-slate-200">
                {form.branding?.logo ? (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={form.branding.logo}
                      alt="logo"
                      className="h-full w-full object-cover"
                    />
                  </>
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xs text-slate-400">
                    N/A
                  </div>
                )}
              </div>
              <div className="h-[40px] w-[1px] bg-slate-200" />

              <div className="flex flex-col">
                <p className="text-[16px] font-semibold text-slate-900">
                  {form.name}
                </p>
                <p className="text-[13px] text-slate-500">
                  Updated {new Date(form.createdAt).toLocaleDateString()}
                </p>
                <p className="text-xs text-slate-400">
                  Created by {form.lender?.name || "Unknown"}
                </p>
              </div>
            </div>

            <span
              className={`rounded-md px-3 py-1 text-[12px] font-medium ${
                form.status === "ACTIVE"
                  ? "bg-[#DCFCE7] text-[#166534]"
                  : "bg-[#FFF7D7] text-[#E1A325]"
              }`}
            >
              {form.status}
            </span>
          </div>
        </div>
      </div>

      {/* TABS */}
      <Tabs defaultValue="responses" className="w-full">
        {/* TAB HEADERS */}
        <TabsList className="h-auto w-full justify-start gap-6 rounded-none border-b bg-transparent p-0">
          <TabsTrigger
            value="responses"
            className="rounded-none border-b-2 border-transparent px-6 pb-2 text-sm font-medium text-slate-500 data-[state=active]:border-violet-600 data-[state=active]:text-violet-600"
          >
            Responses
          </TabsTrigger>

          <TabsTrigger
            value="preview"
            className="rounded-none border-b-2 border-transparent px-6 pb-2 text-sm font-medium text-slate-500 data-[state=active]:border-violet-600 data-[state=active]:text-violet-600"
          >
            Form Preview
          </TabsTrigger>
        </TabsList>

        {/* RESPONSES */}
        <TabsContent value="responses" className="mt-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {form.applications?.length === 0 ? (
              <p className="text-sm text-gray-500">No responses yet</p>
            ) : (
              form.applications?.map((app: Application) => {
                return (
                  <Link
                    key={app.id}
                    href={`/lender/dashboard/${app.id}`}
                    className="block"
                  >
                    <div className="cursor-pointer rounded-xl border border-gray-200 bg-white transition-shadow hover:shadow-lg">
                      {/* HEADER */}
                      <div className="space-y-1 p-4 pb-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-lg font-semibold text-gray-800">
                              {app.firstName} {app.lastName}
                            </p>

                            <p className="text-sm text-gray-500">
                              Submitted on{" "}
                              {new Date(app.createdAt).toLocaleDateString()}
                            </p>
                          </div>

                          <span
                            className={`rounded-md px-2 py-1 text-xs font-medium ${getStatusStyles(app.status)}`}
                          >
                            {formatLoanStatus(app.status)}
                          </span>
                        </div>
                      </div>

                      {/* BODY */}
                      <div className="space-y-3 px-4 pb-4 text-sm text-gray-700">
                        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                          <div>
                            <span className="text-gray-500">Loan Amount</span>
                            <p className="font-medium">
                              ${Number(app.loanAmount || 0).toLocaleString()}
                            </p>
                          </div>

                          <div>
                            <span className="text-gray-500">Loan Type</span>
                            <p className="font-medium">
                              {app.loanType?.replaceAll("_", " ")}
                            </p>
                          </div>

                          <div>
                            <span className="text-gray-500">Employment</span>
                            <p className="font-medium">
                              {app.employmentStatus?.replaceAll("_", " ") ||
                                "-"}
                            </p>
                          </div>

                          <div>
                            <span className="text-gray-500">Gross Income</span>
                            <p className="font-medium">
                              ${Number(app.grossIncome || 0).toLocaleString()}
                            </p>
                          </div>

                          <div>
                            <span className="text-gray-500">Housing</span>
                            <p className="font-medium">
                              {app.housingStatus?.replaceAll("_", " ")}
                            </p>
                          </div>

                          <div>
                            <span className="text-gray-500">Monthly Debts</span>
                            <p className="font-medium">
                              ${Number(app.monthlyDebts || 0).toLocaleString()}
                            </p>
                          </div>

                          <div>
                            <span className="text-gray-500">Savings</span>
                            <p className="font-medium">
                              ${Number(app.savings || 0).toLocaleString()}
                            </p>
                          </div>

                          <div>
                            <span className="text-gray-500">Phone no.</span>
                            <p className="font-medium">
                              {app.personalPhone || "-"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                )
              })
            )}
          </div>
        </TabsContent>

        {/* FORM PREVIEW TAB */}
        <TabsContent value="preview" className="mt-4">
          <div className="rounded-[6.899px] border-[0.92px] border-slate-200 bg-white p-5">
            <div className="flex flex-col gap-[10px]">
              <div className="flex flex-col gap-[14.167px] overflow-hidden rounded-[6px] bg-white p-5">
                {form.steps.map((step: Step) => (
                  <div
                    key={step.id}
                    className="overflow-hidden rounded-lg border border-slate-200 bg-[#F5F5F5]"
                  >
                    {/* STEP HEADER */}
                    <div
                      onClick={() => toggleStep(step.id)}
                      className="flex h-[78px] cursor-pointer items-center justify-between border-b border-slate-200 bg-[#F5F5F5] p-[13px]"
                    >
                      <div className="flex items-center gap-[14px]">
                        {/* Always checked */}
                        <div className="flex h-6 w-6 items-center justify-center rounded-[2.833px] bg-[#AB7BFF] text-[#8E94A1]">
                          <Check className="h-4 w-4 text-white" />
                        </div>

                        <div className="flex w-[300px] flex-col gap-[3px] text-left">
                          <p className="text-[14px] font-semibold text-[#514e53]">
                            {step.title}
                          </p>
                          <p className="text-[12px] text-[#8e94a1]">
                            Basic eligibility requirements
                          </p>
                        </div>
                      </div>
                      {/* Always open arrow */}
                      <ChevronDown
                        className={`h-4 w-4 text-slate-500 transition-transform duration-200 ${
                          openSteps.includes(step.id)
                            ? "rotate-180"
                            : "rotate-0"
                        }`}
                      />
                    </div>

                    {/* STEP CONTENT (ALWAYS OPEN) */}
                    {openSteps.includes(step.id) && (
                      <div className="ml-10 grid gap-2">
                        {Object.entries(step.fields).map(
                          ([key, field]: [string, Field]) => {
                            // 🔥 LOAN TYPE
                            if (key === "loanType" && field.options) {
                              return (
                                <div
                                  key={key}
                                  className="ml-4 mt-2 grid grid-cols-2 gap-2"
                                >
                                  {field.options.map((option: string) => (
                                    <div
                                      key={option}
                                      className="flex items-center gap-2 rounded border px-3 py-2"
                                    >
                                      <div className="flex h-5 w-5 items-center justify-center rounded bg-[#AB7BFF] text-xs text-white">
                                        ✓
                                      </div>

                                      <span className="text-sm">
                                        {option.replaceAll("_", " ")}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              )
                            }

                            // DEFAULT FIELD
                            return (
                              <div
                                key={key}
                                className="flex items-center gap-3 rounded-[6px] bg-[#F5F5F5] px-4 py-3"
                              >
                                <div className="flex h-5 w-5 items-center justify-center rounded bg-[#AB7BFF] text-xs text-white">
                                  ✓
                                </div>

                                <div className="flex flex-col">
                                  <span className="text-[12px] font-medium text-slate-600">
                                    {formatLabel(key)}
                                    {field.required && (
                                      <span className="ml-1 text-[10px] text-red-500">
                                        *
                                      </span>
                                    )}
                                  </span>

                                  <span className="text-[11px] text-[#8e94a1]">
                                    Type:{" "}
                                    {fieldTypeMap[key] ?? `Missing (${key})`}
                                  </span>
                                </div>
                              </div>
                            )
                          }
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </Section>
  )
}
