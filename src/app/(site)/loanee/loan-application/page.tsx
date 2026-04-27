"use client"

import { useEffect, useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import axios from "axios"
import { useSession } from "next-auth/react"
import { toast } from "@/hooks/use-toast"
import { useSearchParams } from "next/navigation"

// UI Components
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Form } from "@/components/ui/form"
import Section from "@/components/shared/section"

// Form Components
import { FormHeader } from "@/components/shared/loan-application/form-header"
import { PersonalStep } from "@/components/shared/loan-application/personal-step"
import { ResidenceStep } from "@/components/shared/loan-application/residence-step"
import { EmploymentStep } from "@/components/shared/loan-application/employment-step"
import { GeneralLoanStep } from "@/components/shared/loan-application/general-loan-step"
import TypeofApplication from "@/components/shared/loan-application/TypeofApplication"
import { EligibilityStep } from "@/components/shared/loan-application/eligibility-step"
import { FinancialStep } from "@/components/shared/loan-application/FinancialStep"

// Types and Schemas
import {
  generalLoanFormSchema,
  GeneralLoanFormValues,
} from "@/app/(site)/loanee/loan-application/types"
import { formSteps } from "@/app/(site)/loanee/loan-application/steps"
import { LoanType } from "@prisma/client"
import { CustomFormConfig, CustomFormStep } from "@/types/customForm"

type LoaneePlan = "LOANEE_STAY_SMART" | "LOANEE_BASIC"

function normalizeLoaneePlan(
  plan: string | null | undefined
): LoaneePlan | null {
  if (plan === "LOANEE_STAY_SMART" || plan === "LOANEE_BASIC") {
    return plan
  }
  return null
}

// type FieldConfig = {
//   enabled?: boolean
//   options?: string[] // can refine later to enums like LoanType
// }

// type StepFieldConfig = {
//   [fieldName: string]: FieldConfig
// }

// type CustomFormStep = {
//   id: string
// }

// type CustomFormConfig = {
//   status: "ACTIVE" | "DISABLED"
//   steps: CustomFormStep[]
//   fields?: Record<string, StepFieldConfig>
// }

const stepMapping: Record<string, string> = {
  "step-1": "eligibility",
  "step-2": "type",
  "step-3": "personal",
  "step-4": "residence",
  "step-5": "employment",
  "step-6": "financial",
  "step-7": "loan",
}

export default function GeneralLoanForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const formId = searchParams.get("formId")
  const [currentStep, setCurrentStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { data: session, status } = useSession()
  const [customFormConfig, setCustomFormConfig] =
    useState<CustomFormConfig | null>(null)
  const [loadingFormConfig, setLoadingFormConfig] = useState(false)

  const [access, setAccess] = useState<{
    subscription?: { plan?: string | null }
    freeTierActive?: boolean
  } | null>(null)

  const subscriptionPlan = normalizeLoaneePlan(access?.subscription?.plan)
  const freeTierActive = access?.freeTierActive ?? false

  // Redirect if not authenticated or not a LOANEE - wait for session to load
  useEffect(() => {
    // Wait for session status to be determined
    if (status === "loading") {
      console.log("Session loading...")
      return
    }

    const role = session?.user?.role

    // Check if user is authenticated AND has LOANEE role
    if (status === "unauthenticated" || !session?.user) {
      console.log("No session - redirecting to login")
      const currentUrl = window.location.pathname + window.location.search

      router.push(`/loanee/login?redirect=${encodeURIComponent(currentUrl)}`)
      return
    }

    // Check if user has LOANEE role
    if (role !== "LOANEE") {
      const currentUrl = window.location.pathname + window.location.search

      router.push(`/loanee/login?redirect=${encodeURIComponent(currentUrl)}`)
      return
    }
  }, [session, status, router])

  useEffect(() => {
    const fetchAccess = async () => {
      if (status !== "authenticated" || !session?.user) return

      try {
        const res = await axios.get("/api/subscription/access")
        setAccess(res.data)
      } catch (err) {
        console.error("Failed to fetch access info", err)
        setAccess(null)
      }
    }

    fetchAccess()
  }, [session, status])

  useEffect(() => {
    if (!formId) return

    const fetchForm = async () => {
      try {
        setLoadingFormConfig(true)
        const res = await axios.get<CustomFormConfig>(`/api/forms/${formId}`)
        const data = res.data
        setCustomFormConfig(data)

        // 🔥 IMPORTANT: check status
        if (data.status === "DISABLED") {
          toast({
            title: "Form Disabled",
            description: "This form is no longer accepting responses",
            variant: "destructive",
          })
        }
      } catch (err) {
        console.error("Invalid form link", err)
        toast({
          title: "Invalid Link",
          description: "This form does not exist or is expired",
          variant: "destructive",
        })
      } finally {
        setLoadingFormConfig(false)
      }
    }

    fetchForm()
  }, [formId])

  const activeSteps = useMemo(() => {
    if (!customFormConfig) return formSteps

    const mappedIds = customFormConfig.steps.map(
      (s: CustomFormStep) => stepMapping[s.id]
    )
    return formSteps.filter((step) => mappedIds.includes(step.id))
  }, [customFormConfig])

  useEffect(() => {
    setCurrentStep((prev) => (prev >= activeSteps.length ? 0 : prev))
  }, [activeSteps])

  const loanTypesForPropertyDetails: LoanType[] = [
    "FIRST_TIME_HOME",
    "INVESTMENT_PROPERTY",
    "MORTGAGE_REFINANCE",
    "HELOC",
    "HOME_REPAIR",
  ]

  const loanTypesForDownPayment: LoanType[] = [
    "FIRST_TIME_HOME",
    "INVESTMENT_PROPERTY",
    "CAR",
  ]

  const form = useForm<GeneralLoanFormValues>({
    resolver: zodResolver(generalLoanFormSchema),
    defaultValues: {
      loanType: undefined,
      childCareBenefit: undefined,
      estimatedPropertyValue: undefined,
      hasCoApplicant: false,
      monthlyDebts: undefined,
      monthlyDebtsExist: undefined,
      otherIncome: undefined,
      otherIncomeAmount: undefined,
      savings: undefined,
      sin: undefined,
      isAdult: false,
      downPayment: undefined,
      vehicleType: undefined,
      houseType: undefined,
      tradeInCurrentVehicle: undefined,
      hasBankruptcy: false,
      firstName: "",
      lastName: "",
      personalEmail: "",
      personalPhone: "",
      dateOfBirth: undefined,
      maritalStatus: undefined,
      currentAddress: "",
      yearsAtCurrentAddress: undefined,
      housingStatus: undefined,
      housingPayment: undefined,
      residencyStatus: undefined,
      mortgage: undefined,
      condoFees: undefined,
      propertyTaxMonthly: undefined,
      homeInsurance: undefined,
      monthlyCarLoanPayment: undefined,
      monthlyCreditCardMinimums: undefined,
      monthlyOtherLoanPayments: undefined,
      heatingCosts: undefined,
      generalEducationLevel: undefined,
      generalFieldOfStudy: "",
      employmentStatus: undefined,
      grossIncome: undefined,
      workplaceName: "",
      workplaceAddress: "",
      workplacePhone: "",
      workplaceEmail: "",
      loanAmount: undefined,
      creditScore: undefined,
      agentCode: "",
    },
    mode: "onSubmit",
    reValidateMode: "onChange",
  })

  const watchLoanType = form.watch("loanType")
  const watchEstimatedPropertyValue = form.watch("estimatedPropertyValue")
  const watchDownPayment = form.watch("downPayment")
  const watchVehicleType = form.watch("vehicleType")
  const watchTradeIn = form.watch("tradeInCurrentVehicle")

  const disableNextStep1 = (() => {
    if (!watchLoanType) return true

    if (loanTypesForPropertyDetails.includes(watchLoanType)) {
      if (
        !watchEstimatedPropertyValue ||
        Number(watchEstimatedPropertyValue) <= 0
      ) {
        return true
      }
    }

    if (
      watchLoanType === "FIRST_TIME_HOME" ||
      watchLoanType === "INVESTMENT_PROPERTY"
    ) {
      const houseType = form.getValues("houseType")
      if (!houseType || houseType.trim().length === 0) {
        return true
      }
    }

    if (loanTypesForDownPayment.includes(watchLoanType)) {
      if (!watchDownPayment || Number(watchDownPayment) <= 0) {
        return true
      }
    }

    if (watchLoanType === "CAR") {
      if (!watchVehicleType || watchVehicleType.trim().length === 0) return true
      if (watchTradeIn === undefined) return true
    }

    return false // All validations passed
  })()

  async function onNext() {
    const baseFieldsToValidate: Record<
      number,
      (keyof GeneralLoanFormValues)[]
    > = {
      // step 0: Eligibility step
      0: ["isAdult", "hasBankruptcy", "agentCode"],
      // step 2: Personal details
      2: [
        "firstName",
        "lastName",
        "dateOfBirth",
        "maritalStatus",
        "personalPhone",
        "personalEmail",
        "sin",
      ],
      // step 3: Residence details
      3: [
        "currentAddress",
        "yearsAtCurrentAddress",
        "housingStatus",
        "housingPayment",
        "residencyStatus",
      ],
      // step 4: Employment details
      4: [
        "employmentStatus",
        "grossIncome",
        "workplaceName",
        "workplaceAddress",
        "workplacePhone",
        "workplaceEmail",
      ],
      // step 5: Financial details
      5: [
        "monthlyDebtsExist",
        "monthlyDebts",
        "savings",
        "otherIncome",
        "otherIncomeAmount",
        "creditScore",
        "childCareBenefit",
      ],
      // step 6: Final loan details
      6: ["loanAmount", "hasCoApplicant"],
    }

    try {
      let fields: (keyof GeneralLoanFormValues)[] = []

      if (currentStep === 1) {
        const loanType = form.getValues("loanType")
        fields = ["loanType"]

        if (!loanType) {
          form.setError("loanType", {
            type: "manual",
            message: "Loan type is required",
          })
          toast({
            title: "Validation Error",
            description: "Please select a loan type",
            variant: "destructive",
          })
        }

        if (loanTypesForPropertyDetails.includes(loanType)) {
          fields.push("estimatedPropertyValue")
          const value = form.getValues("estimatedPropertyValue")
          if (!value || Number(value) <= 0) {
            form.setError("estimatedPropertyValue", {
              type: "manual",
              message: "Estimated property value is required",
            })
          }
        }

        if (
          loanType === "FIRST_TIME_HOME" ||
          loanType === "INVESTMENT_PROPERTY"
        ) {
          fields.push("houseType")
          const value = form.getValues("houseType")
          if (!value || value.trim().length === 0) {
            form.setError("houseType", {
              type: "manual",
              message: "Property type is required",
            })
          }
        }

        if (loanTypesForDownPayment.includes(loanType)) {
          fields.push("downPayment")
          const value = form.getValues("downPayment")
          if (!value || (Array.isArray(value) && value.length === 0)) {
            form.setError("downPayment", {
              type: "manual",
              message: "Down payment is required",
            })
          }
        }

        if (loanType === "CAR") {
          fields.push("vehicleType", "tradeInCurrentVehicle")
          const vehicleType = form.getValues("vehicleType")
          if (!vehicleType || vehicleType.trim().length === 0) {
            form.setError("vehicleType", {
              type: "manual",
              message: "Vehicle type is required",
            })
          }

          const tradeIn = form.getValues("tradeInCurrentVehicle")
          if (tradeIn === undefined) {
            form.setError("tradeInCurrentVehicle", {
              type: "manual",
              message: "Please specify if trading in vehicle",
            })
          }
        }

        const isValid = await form.trigger(fields, { shouldFocus: true })

        if (!isValid) {
          console.log("Form errors:", form.formState.errors)
          toast({
            title: "Validation Error",
            description: "Please complete all required fields correctly",
            variant: "destructive",
          })
          return false
        }
      } else {
        fields = baseFieldsToValidate[currentStep] || []
        const isValid = await form.trigger(fields, { shouldFocus: true })

        if (!isValid) {
          toast({
            title: "Validation Error",
            description: "Please complete all required fields correctly",
            variant: "destructive",
          })
          return false
        }
      }

      if (currentStep < activeSteps.length - 1) {
        setCurrentStep((prev) => prev + 1)
        return true
      }

      return false
    } catch (error) {
      console.error(error)
      toast({
        title: "Error",
        description: "An error occurred during validation",
        variant: "destructive",
      })
      return false
    }
  }

  function onPrevious() {
    setCurrentStep(currentStep - 1)
  }

  const handleFinalSubmit = form.handleSubmit(onSubmit, (errors) => {
    console.log("Validation errors on final submit:", errors)
    toast({
      title: "Validation Error",
      description: "Please fix the highlighted fields before submitting.",
      variant: "destructive",
    })
  })

  async function onSubmit(data: GeneralLoanFormValues) {
    try {
      setIsSubmitting(true)

      const payload = {
        ...data,
        formId: formId ?? null,

        yearsAtCurrentAddress: Number(data.yearsAtCurrentAddress),
        housingPayment: Number(data.housingPayment),
        grossIncome: Number(data.grossIncome),
        loanAmount: Number(data.loanAmount),
      }

      const response = await axios.post("/api/apply/general", payload)
      console.log("API response:", response.data)

      router.push("/loanee/loan-application/success")
    } catch (error: unknown) {
      let description = "Failed to submit form"

      if (
        typeof error === "object" &&
        error !== null &&
        "response" in error &&
        typeof (error as { response?: { data?: { error?: string } } }).response
          ?.data?.error === "string"
      ) {
        description = (error as { response: { data: { error: string } } })
          .response.data.error
      }

      toast({
        title: "Submission Error",
        description,
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Show loading state while session is being determined
  if (status === "loading") {
    return (
      <Section className="py-24">
        <Card className="mx-auto w-full max-w-4xl">
          <CardHeader>
            <CardTitle className="text-center text-2xl font-bold">
              Loading...
            </CardTitle>
          </CardHeader>
          <div className="flex items-center justify-center p-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-violet-600 border-t-transparent"></div>
          </div>
        </Card>
      </Section>
    )
  }

  // Don't render form if not authenticated or not a LOANEE
  if (
    status === "unauthenticated" ||
    !session?.user ||
    session.user.role !== "LOANEE"
  ) {
    return null
  }
  const stepId = activeSteps[currentStep]?.id

  if (formId && loadingFormConfig) {
    return (
      <Section className="py-24">
        <Card className="mx-auto w-full max-w-4xl">
          <CardHeader>
            <CardTitle className="text-center text-2xl font-bold">
              Loading Form...
            </CardTitle>
          </CardHeader>
        </Card>
      </Section>
    )
  }

  if (!activeSteps.length || currentStep >= activeSteps.length) {
    return null
  }
  if (customFormConfig?.status === "DISABLED") {
    return (
      <Section className="py-24">
        <Card className="mx-auto w-full max-w-2xl text-center">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-red-600">
              🚫 Form Disabled
            </CardTitle>
          </CardHeader>

          <div className="px-6 pb-8 text-sm text-gray-600">
            This form is no longer accepting responses.
          </div>
        </Card>
      </Section>
    )
  }

  return (
    <Section className="py-24">
      <Card className="mx-auto w-full max-w-4xl">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">
            Loan Application
          </CardTitle>
          <FormHeader currentStep={currentStep} steps={activeSteps} />
        </CardHeader>

        <Form {...form}>
          <form
            onSubmit={(e) => {
              e.preventDefault()
            }}
            className="space-y-8 p-6"
          >
            {stepId === "eligibility" && (
              <EligibilityStep
                form={form}
                config={customFormConfig}
                stepId={stepId}
              />
            )}
            {stepId === "type" && (
              <TypeofApplication
                form={form}
                config={customFormConfig}
                stepId={stepId}
              />
            )}
            {stepId === "personal" && (
              <PersonalStep
                form={form}
                config={customFormConfig}
                stepId={stepId}
              />
            )}
            {stepId === "residence" && (
              <ResidenceStep
                form={form}
                config={customFormConfig}
                stepId={stepId}
              />
            )}
            {stepId === "employment" && (
              <EmploymentStep
                form={form}
                config={customFormConfig}
                stepId={stepId}
              />
            )}
            {stepId === "financial" && (
              <FinancialStep
                form={form}
                config={customFormConfig}
                stepId={stepId}
              />
            )}
            {stepId === "loan" && (
              <GeneralLoanStep
                form={form}
                subscriptionPlan={subscriptionPlan}
                freeTierActive={freeTierActive}
              />
            )}
            <div className="flex justify-between pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onPrevious}
                disabled={currentStep === 0}
              >
                Previous
              </Button>
              {currentStep < activeSteps.length - 1 ? (
                <Button
                  type="button"
                  onClick={() => {
                    console.log("Next button clicked")
                    onNext().catch(console.error)
                  }}
                  disabled={currentStep === 1 && disableNextStep1}
                >
                  Next
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={() => handleFinalSubmit()}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Submit"}
                </Button>
              )}
            </div>
          </form>
        </Form>
      </Card>
    </Section>
  )
}
