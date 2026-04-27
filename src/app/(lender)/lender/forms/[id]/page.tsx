"use client"

import Section from "@/components/shared/section"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Check, ChevronDown, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"

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
  shareUrl?: string
  branding?: { logo?: string | null } | null
  applications?: Application[]
  steps: Step[]
}

export default function FormDetailsPage() {
  const { id } = useParams()
  const [form, setForm] = useState<CustomForm | null>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const [openSteps, setOpenSteps] = useState<string[]>([])
  const [toggling, setToggling] = useState(false)
  const [showModal, setShowModal] = useState(false)

  // useEffect(() => {
  //   setOrigin(window.location.origin)
  // }, [])

  const shareLink = form?.shareUrl ? `${form.shareUrl}` : ""

  useEffect(() => {
    const fetchForm = async () => {
      try {
        const res = await fetch(`/api/lender/customForm/${id}`)
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

  const handleCopy = async () => {
    if (!shareLink || !navigator?.clipboard) return

    await navigator.clipboard.writeText(shareLink)

    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-300 border-t-violet-600" />
          <p className="text-sm text-slate-500">Loading form...</p>
        </div>
      </div>
    )
  }
  if (!form) return <p className="p-6">Form not found</p>

  const formatLabel = (key: string) =>
    key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())

  // const getFieldType = (key: string) => {
  //   if (key.toLowerCase().includes("date")) return "date"
  //   if (key.toLowerCase().includes("email")) return "email"
  //   if (key.toLowerCase().includes("phone")) return "phone"
  //   if (key.toLowerCase().includes("amount")) return "number"
  //   if (key === "loanType") return "select"
  //   if (key === "isAdult" || key === "hasBankruptcy") return "switch"
  //   return "text"
  // }

  const formatLoanStatus = (status?: string) => {
    if (!status) return "-"

    if (status === "CUSTOM_APPLICATION") return "Custom"

    return status.replaceAll("_", " ")
  }

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

  const toggleDisableEnable = async () => {
    if (!form?.id || toggling) return

    try {
      setToggling(true)

      const res = await fetch(
        `/api/lender/customForm/toggleformstatus/${form.id}`,
        { method: "PATCH" }
      )

      const data = await res.json()

      if (data.success) {
        setForm((prev) =>
          prev
            ? {
                ...prev,
                status: data.status,
              }
            : prev
        )
      }
    } catch (err) {
      console.error("Toggle error:", err)
    } finally {
      setToggling(false)
    }
  }

  return (
    <Section className="flex flex-col gap-6 py-12">
      <div className="flex flex-col gap-6">
        <div className="flex h-[58px] items-start justify-between py-3">
          <h1 className="text-[28px] font-bold leading-normal text-violet-600">
            Custom Form Details
          </h1>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-4">
            {/* LEFT SIDE */}
            <div className="flex items-center gap-4">
              <div className="relative h-10 w-10 overflow-hidden rounded-full bg-slate-200">
                {form.branding?.logo ? (
                  <Image
                    src={form.branding.logo}
                    alt="logo"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xs text-slate-400">
                    N/A
                  </div>
                )}
              </div>

              <div className="h-[40px] w-[1px] bg-slate-200" />

              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <p className="text-[16px] font-semibold text-slate-900">
                    {form.name}
                  </p>

                  <span
                    className={`rounded-md px-2 py-[2px] text-[11px] font-medium ${
                      form.status === "ACTIVE"
                        ? "bg-green-100 text-green-700"
                        : "bg-[#FFF7D7] text-[#E1A325]"
                    }`}
                  >
                    {form.status === "ACTIVE" ? "Active" : "Disabled"}
                  </span>
                </div>

                <p className="text-[12px] text-slate-400">
                  Updated {new Date(form.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* RIGHT SIDE BUTTON */}
            <button
              onClick={() => setShowModal(true)}
              disabled={toggling}
              className={`rounded-md border px-4 py-1 text-[12px] font-medium transition ${
                form.status === "ACTIVE"
                  ? "border-violet-500 text-violet-600 hover:bg-violet-50"
                  : "border-green-500 text-green-600 hover:bg-green-50"
              } ${toggling ? "cursor-not-allowed opacity-50" : ""}`}
            >
              {toggling
                ? "Updating..."
                : form.status === "ACTIVE"
                  ? "Disable"
                  : "Enable"}
            </button>
          </div>
        </div>
      </div>

      {/* SHARE LINK */}
      <div className="rounded bg-[#F9F9F9] p-6">
        <p className="mb-1 text-sm text-[#514E53]">Public share link</p>

        <div className="flex gap-2">
          <input
            value={shareLink}
            readOnly
            className="flex-1 rounded px-2 py-1 text-sm"
          />

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleCopy}
            className={`flex h-[32px] items-center gap-1.5 px-3 text-[12px] transition-all duration-200 ${
              copied
                ? "scale-95 border-green-200 bg-green-100 text-green-700 hover:bg-green-100"
                : "bg-white text-[#030712] hover:bg-slate-50"
            }`}
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5" />
                Copied
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                Copy
              </>
            )}
          </Button>
        </div>
      </div>

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

        {/* RESPONSES TAB */}
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

                                <div className="text-[12px] font-medium text-slate-600">
                                  {formatLabel(key)}
                                  {field.required && (
                                    <span className="ml-1 text-[10px] text-red-500">
                                      *
                                    </span>
                                  )}
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
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="rounded-xl sm:max-w-[420px]">
          <DialogHeader>
            <DialogTitle className="text-center text-lg font-semibold">
              {form.status === "ACTIVE"
                ? "Disable Custom Form?"
                : "Enable Custom Form?"}
            </DialogTitle>

            <DialogDescription className="text-center text-sm text-gray-500">
              Are you sure you want to{" "}
              {form.status === "ACTIVE" ? "disable" : "enable"} this custom
              form?
              <br />
              Once it&apos;s done, you won&apos;t be able to undo immediately.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="flex flex-col gap-2 sm:flex-row sm:justify-center">
            <Button
              variant="outline"
              onClick={() => setShowModal(false)}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>

            <Button
              onClick={async () => {
                await toggleDisableEnable()
                setShowModal(false)
              }}
              disabled={toggling}
              className={`w-full sm:w-auto ${
                form.status === "ACTIVE"
                  ? "bg-violet-600 hover:bg-violet-700"
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {toggling
                ? "Updating..."
                : form.status === "ACTIVE"
                  ? "Disable"
                  : "Enable"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Section>
  )
}
