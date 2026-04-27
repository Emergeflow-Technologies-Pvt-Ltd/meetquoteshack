"use client"

import { useMemo, useRef, useState } from "react"
import Section from "@/components/shared/section"
import { Checkbox } from "@/components/ui/checkbox"
import Image from "next/image"
import { Check, ChevronDown } from "lucide-react"
import { LoanType } from "@prisma/client"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { fieldTypeMap } from "@/lib/fieldTypes"
import {
  formSteps,
  loanTypeOptions,
} from "@/app/(site)/loanee/loan-application/formSteps"
import { FieldConfig } from "@/types/customForm"

export default function LenderCustomFormsCreatePage() {
  const router = useRouter()
  const allStepIds = useMemo(() => formSteps.map((step) => step.id), [])
  const allSubStepIds = useMemo(
    () => formSteps.flatMap((step) => step.subSteps.map((sub) => sub.key)),
    []
  )
  const requiredSubSteps = useMemo(() => {
    return formSteps.flatMap((step) =>
      step.subSteps.filter((sub) => sub.required).map((sub) => sub.key)
    )
  }, [])
  const [selectedLoanTypes, setSelectedLoanTypes] = useState<LoanType[]>([])

  const [selectedSubSteps, setSelectedSubSteps] =
    useState<string[]>(requiredSubSteps)
  // const [selectedSteps, setSelectedSteps] = useState<string[]>([])
  const [openSteps, setOpenSteps] = useState<string[]>([])
  const [showSuccess, setShowSuccess] = useState(false)
  const [formName, setFormName] = useState("")
  const [shareLink, setShareLink] = useState("")
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [copied, setCopied] = useState(false)
  const isFormValid = formName.trim() !== "" && logoFile !== null

  const isSubStepSelected = (id: string) => selectedSubSteps.includes(id)
  const isStepOpen = (id: string) => openSteps.includes(id)

  // const toggleStep = (id: string) => {
  //   const step = formSteps.find((s) => s.id === id)

  //   const hasRequired = step?.subSteps.some((s) => s.required)
  //   if (hasRequired) return // ❌ block uncheck

  //   setSelectedSteps((prev) =>
  //     prev.includes(id) ? prev.filter((stepId) => stepId !== id) : [...prev, id]
  //   )
  // }

  const toggleSubStep = (id: string, isRequired: boolean) => {
    if (isRequired) return // ❌ block uncheck

    setSelectedSubSteps((prev) =>
      prev.includes(id) ? prev.filter((subId) => subId !== id) : [...prev, id]
    )
  }

  const toggleLoanType = (type: LoanType) => {
    setSelectedLoanTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    )
  }
  // useEffect(() => {
  //   const requiredSteps = formSteps
  //     .filter((step) => step.subSteps.some((s) => s.required))
  //     .map((s) => s.id)

  //   setSelectedSteps(requiredSteps)
  // }, [])

  const toggleOpen = (id: string) => {
    setOpenSteps((prev) =>
      prev.includes(id) ? prev.filter((stepId) => stepId !== id) : [...prev, id]
    )
  }

  const handleSelectAll = () => {
    // setSelectedSteps(allStepIds)
    setSelectedSubSteps([...new Set([...allSubStepIds, ...requiredSubSteps])])
    setOpenSteps(allStepIds)
    setSelectedLoanTypes(loanTypeOptions)
  }

  const handleClearAll = () => {
    // setSelectedSteps([])
    setSelectedSubSteps(requiredSubSteps) // keep mandatory
    setOpenSteps([])
    setSelectedLoanTypes([])

    // reset form data
    setFormName("")
    setLogoFile(null)
    setLogoPreview(null)

    // reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleCreate = async () => {
    const structuredSteps = formSteps
      .map((step) => {
        const fields: Record<string, FieldConfig> = {}

        step.subSteps.forEach((sub) => {
          const isSelected = selectedSubSteps.includes(sub.key)
          const isLoanType = sub.key === "loanType"

          if (isSelected || isLoanType) {
            // ❗ skip empty loanType
            if (isLoanType && selectedLoanTypes.length === 0) return

            fields[sub.key] = {
              enabled: true,
              required: sub.required,
              ...(isLoanType && { options: selectedLoanTypes }),
            }
          }
        })

        // ❗ skip step if no fields
        if (Object.keys(fields).length === 0) return null

        return {
          id: step.id,
          title: step.title,
          fields,
        }
      })
      .filter(Boolean)

    // ✅ SAFETY CHECK
    if (structuredSteps.length === 0) {
      alert("Please select at least one field")
      return
    }

    const payload = {
      name: formName,
      steps: structuredSteps,
    }

    const formData = new FormData()
    formData.append("data", JSON.stringify(payload))

    if (logoFile) {
      formData.append("logo", logoFile)
    }

    const res = await fetch("/api/lender/customForm", {
      method: "POST",
      body: formData,
    })

    const data = await res.json()

    if (data.success) {
      const link = data.shareUrl.startsWith("http")
        ? data.shareUrl
        : `${window.location.origin}/forms/${data.shareUrl}`
      setShareLink(link)
      setShowSuccess(true)
    }
  }
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // ✅ Validate type
    const allowedTypes = ["image/png", "image/jpeg", "image/jpg"]
    if (!allowedTypes.includes(file.type)) {
      alert("Only PNG, JPG, JPEG allowed")
      return
    }

    // ✅ Save file
    setLogoFile(file)

    // ✅ Preview
    const previewUrl = URL.createObjectURL(file)
    setLogoPreview(previewUrl)
  }

  const handleCopy = async () => {
    if (!shareLink || !navigator?.clipboard) return

    await navigator.clipboard.writeText(shareLink)

    setCopied(true)

    // reset after 2 seconds
    setTimeout(() => {
      setCopied(false)
    }, 2000)
  }

  const truncateLink = (url: string, maxLength = 40) => {
    if (!url) return ""

    if (url.length <= maxLength) return url

    return url.slice(0, maxLength) + "..."
  }
  return (
    <Section className="flex flex-col gap-6 py-12">
      <div className="relative flex w-full flex-col items-start px-[17px] pb-[0.567px] pt-[14.167px]">
        <div className="flex w-full flex-col items-start justify-between gap-3 sm:h-[45.333px] sm:flex-row sm:items-start sm:gap-6">
          <div className="flex flex-col gap-1">
            <p className="text-[17px] font-semibold leading-[25.5px] text-slate-900">
              Create Custom Form
            </p>
            <p className="whitespace-nowrap text-[11.333px] leading-[17px] text-slate-500">
              Create a form tailored to your requirements, select steps, fields
              and share it with applicants
            </p>
          </div>

          <div className="flex items-center gap-3 sm:self-center">
            <button
              type="button"
              onClick={handleSelectAll}
              className="h-[26px] rounded-[4.283px] border border-slate-200 bg-white px-3 py-[5px] text-[9.993px] font-medium text-slate-950 shadow-[0px_0px_0px_0px_rgba(0,0,0,0),0px_0px_0px_0px_rgba(0,0,0,0),0px_0.714px_1.428px_0px_rgba(0,0,0,0.05)]"
            >
              Select All
            </button>
            <button
              type="button"
              onClick={handleClearAll}
              className="h-[26px] rounded-[4.283px] border border-slate-200 bg-white px-3 py-[5px] text-[9.993px] font-medium text-slate-950 shadow-[0px_0px_0px_0px_rgba(0,0,0,0),0px_0px_0px_0px_rgba(0,0,0,0),0px_0.714px_1.428px_0px_rgba(0,0,0,0.05)]"
            >
              Clear All
            </button>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-6 rounded-[6px] border border-slate-200 bg-white p-[20px] pl-[40px] pr-[40px]">
        <div className="flex flex-col items-center gap-1">
          <div
            onClick={() => fileInputRef.current?.click()}
            className={`flex h-[60px] w-[60px] cursor-pointer items-center justify-center overflow-hidden rounded-[25px] ${
              !logoFile ? "border border-red-300 bg-red-50" : "bg-slate-200"
            }`}
          >
            {logoPreview ? (
              <Image
                src={logoPreview}
                alt="logo"
                width={40}
                height={40}
                className="h-full w-full object-cover"
              />
            ) : (
              <Image src="/plus.svg" alt="plus" width={30} height={30} />
            )}
          </div>
          {!logoFile && (
            <p className="text-[11px] text-red-500">Logo is required</p>
          )}
        </div>

        <input
          type="file"
          accept="image/png, image/jpeg, image/jpg"
          ref={fileInputRef}
          onChange={handleLogoUpload}
          className="hidden"
        />
        <div className="h-[60px] w-px bg-slate-300" />

        <div className="flex flex-1 flex-col gap-[6px]">
          <label className="text-[13px] font-normal text-slate-900">
            Form Name<span className="text-red-600">*</span>
          </label>
          <input
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
            type="text"
            placeholder="Enter form name"
            className="h-[52px] w-full rounded-[6px] border border-slate-200 bg-white px-3 text-[13px] text-slate-800 focus:border-violet-500 focus:outline-none"
          />
        </div>
      </div>
      <div className="rounded-[6px] border-[1px] border-slate-200 bg-white p-5">
        <div className="flex flex-col gap-[10px]">
          <div className="flex flex-col gap-[14.167px] overflow-hidden rounded-[6px] bg-white p-5">
            {formSteps.map((step) => (
              <div
                key={step.id}
                className="overflow-hidden rounded-lg border border-slate-200 bg-white"
              >
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => toggleOpen(step.id)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault()
                      toggleOpen(step.id)
                    }
                  }}
                  className={
                    step.variant === "compact"
                      ? "flex h-[78px] items-center justify-between border-b border-slate-200 bg-white p-[12.567px]"
                      : "flex h-[78px] items-center justify-between border-b border-slate-200 bg-white p-[14px]"
                  }
                >
                  <div className="flex items-center gap-[14px]">
                    {/* <Checkbox
                      checked={isStepSelected(step.id)}
                      onCheckedChange={() => toggleStep(step.id)}
                      onClick={(event) => event.stopPropagation()}
                      className="flex h-6 w-6 items-center justify-center rounded-[4px] data-[state=checked]:bg-violet-600 data-[state=checked]:text-white"
                    >
                      <Check className="h-4 w-4 text-white" />
                    </Checkbox> */}
                    <div className="flex w-[300px] flex-col gap-[3px] text-left">
                      <p className="text-[14px] font-semibold leading-normal text-[#514e53]">
                        {step.title}
                      </p>
                      <p className="text-[12px] leading-normal text-[#6B6870]">
                        {step.description}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation()
                      toggleOpen(step.id)
                    }}
                  >
                    <ChevronDown
                      className={`h-4 w-4 text-slate-500 transition-transform duration-200 ${
                        isStepOpen(step.id) ? "rotate-180" : "rotate-0"
                      }`}
                    />
                  </button>
                </div>
                {isStepOpen(step.id) && (
                  <div className="ml-20 grid gap-2">
                    {step.subSteps.map((subStep) => {
                      const subId = subStep.key

                      // SPECIAL CASE: loanType
                      if (subStep.key === "loanType" && "options" in subStep) {
                        return (
                          <div
                            key={subId}
                            className="ml-4 mt-2 grid grid-cols-2 gap-2"
                          >
                            <div className="col-span-2 flex w-full flex-col">
                              <span className="text-[14px] font-medium text-[#514e53]">
                                Select the types of loans you want to offer.
                                Below options will be shown to applicants when
                                they fill out the loan application form.
                              </span>

                              <span className="text-[12px] font-medium text-[#6B6870]">
                                Type:{" "}
                                {fieldTypeMap[subId] ?? `Missing (${subId})`}
                              </span>
                            </div>
                            {subStep.options.map((option: LoanType) => (
                              <div
                                key={option}
                                onClick={() => toggleLoanType(option)}
                                className="flex cursor-pointer items-center gap-2 px-3 py-2 hover:bg-slate-50"
                              >
                                <Checkbox
                                  checked={selectedLoanTypes.includes(option)}
                                  onCheckedChange={() => toggleLoanType(option)}
                                  onClick={(e) => e.stopPropagation()}
                                  className="flex h-5 w-5 items-center justify-center rounded-[4px] border border-slate-300 data-[state=checked]:border-violet-600 data-[state=checked]:bg-violet-600 data-[state=checked]:text-white"
                                />
                                <span className="text-[12px] font-medium text-[#514e53]">
                                  {option
                                    .toLowerCase()
                                    .replaceAll("_", " ")
                                    .replace(/^\w/, (c) => c.toUpperCase())}
                                </span>
                              </div>
                            ))}
                          </div>
                        )
                      }

                      // DEFAULT UI (existing)
                      return (
                        <div
                          key={subId}
                          role="button"
                          tabIndex={0}
                          onClick={() => toggleSubStep(subId, subStep.required)}
                          className="flex items-center gap-3 rounded-[6px] bg-white px-4 py-3"
                        >
                          <Checkbox
                            checked={isSubStepSelected(subId)}
                            disabled={subStep.required}
                            className="flex h-5 w-5 items-center justify-center rounded-[4px] border border-slate-300 data-[state=checked]:border-violet-600 data-[state=checked]:bg-violet-600 data-[state=checked]:text-white"
                          >
                            <Check className="h-3 w-3 text-white" />
                          </Checkbox>
                          <div className="flex flex-col">
                            <span className="text-[12px] font-medium text-[#514e53]">
                              {subStep.label}
                            </span>

                            <span className="text-[11px] font-medium text-[#6B6870]">
                              Type:{" "}
                              {fieldTypeMap[subId] ?? `Missing (${subId})`}
                            </span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex items-start justify-between px-[17px] pb-[0.567px] pt-[14.167px]">
            <Button
              type="button"
              onClick={handleCreate}
              disabled={!isFormValid}
              className={`ml-auto h-[32px] w-[80.167px] rounded-[3.556px] px-[14.222px] py-[7.111px] text-[12.444px] font-medium leading-[17.778px] transition-all duration-200 ${
                isFormValid
                  ? "bg-[#7C3AED] text-white hover:bg-[#6D28D9] active:scale-95"
                  : "cursor-not-allowed bg-violet-600/50 text-white"
              } `}
            >
              Create
            </Button>
          </div>
        </div>
      </div>
      {showSuccess && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
          onClick={() => setShowSuccess(false)} // 👈 close on backdrop click
        >
          <div
            className="w-full max-w-[400px] rounded-[6px]"
            onClick={(e) => e.stopPropagation()} // 👈 prevent closing when clicking inside
          >
            <div className="w-full max-w-[400px] rounded-[6px] bg-white px-4 pb-4 pt-12 shadow-[0px_8px_12.4px_0px_rgba(153,146,127,0.46)]">
              <div className="flex flex-col items-center gap-10">
                <div className="flex flex-col items-center gap-6">
                  <div className="flex flex-col items-center gap-2">
                    {/* <div className="relative h-[92px] w-[94px]"> */}
                    <Image
                      src="/paysuccess.svg"
                      alt="Success"
                      width={94}
                      height={94}
                      priority
                    />
                  </div>

                  <div className="flex flex-col items-center gap-2 text-center">
                    <p className="text-[20px] font-medium leading-[1.2] text-[#464542]">
                      Form Created Successfully
                    </p>
                    <p className="text-[16px] leading-[1.3] text-[#5f5d5a]">
                      Your custom form is ready. You can now share it with
                      applicants via link.
                    </p>
                  </div>

                  <div className="w-full rounded-[4px] bg-[#f9f9f9] p-3">
                    <div className="flex flex-col gap-[3px]">
                      <p className="text-[14px] font-medium text-[#514e53]">
                        Public share link
                      </p>
                      <div className="flex gap-[3px]">
                        <div className="flex flex-1 items-center rounded-[4px] bg-white p-[6px]">
                          <p className="text-[12px] text-[#5f6368]">
                            {truncateLink(shareLink, 45)}
                          </p>
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={handleCopy}
                          className={`h-[28px] px-3 text-[12px] transition-all duration-200 ${
                            copied
                              ? "border-green-200 bg-green-100 text-green-700 hover:bg-green-100"
                              : "bg-white text-[#030712] hover:bg-slate-50"
                          }`}
                        >
                          {copied ? "Copied" : "Copy"}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setShowSuccess(false)
                    router.push("/lender/forms")
                  }}
                  className="w-full rounded-[4px] bg-violet-600 px-6 py-2 text-[16px] font-bold leading-[1.5] text-[#faf7f0]"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Section>
  )
}
