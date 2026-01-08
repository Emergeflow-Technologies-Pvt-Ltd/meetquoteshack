"use client"

import { useState } from "react"
import { User, Car, CreditCard, Home } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import Section from "@/components/shared/section"
import LoanCalculatorForm from "@/components/shared/loan-calculator/LoanCalculatorForm"

const loanTypes = [
  {
    id: "PERSONAL_LOAN",
    title: "Personal Loan",
    icon: User,
  },
  {
    id: "CAR_LOAN",
    title: "Car Loan",
    icon: Car,
  },
  {
    id: "LINE_OF_CREDIT",
    title: "Line of Credit",
    icon: CreditCard,
  },
  {
    id: "MORTGAGE",
    title: "Mortgage",
    icon: Home,
  },
]

const steps = [
  {
    id: "loan-type",
    title: "Calculator Type",
    description: "Select the type of loan you want to calculate",
  },
  {
    id: "details",
    title: "Loan Details",
    description: "Enter your loan details",
  },
] as const

const FORM_ID = "loan-calculator-form"

export default function LoanCalculatorPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [selectedLoanType, setSelectedLoanType] = useState<string | null>(null)

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  return (
    <Section className="py-24">
      <Card className="mx-auto w-full max-w-4xl">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">
            Loan Calculator
          </CardTitle>
        </CardHeader>

        <CardContent className="p-6">
          {currentStep === 0 && (
            <div className="space-y-6">
              <h3 className="text-center text-lg font-semibold md:text-left">
                Choose a Calculator Type <span className="text-red-500">*</span>
              </h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {loanTypes.map((type) => {
                  const Icon = type.icon
                  const isSelected = selectedLoanType === type.id
                  return (
                    <div
                      key={type.id}
                      onClick={() => setSelectedLoanType(type.id)}
                      className={`cursor-pointer rounded-xl border-2 p-6 transition-all duration-200 hover:border-violet-600 hover:shadow-lg ${
                        isSelected
                          ? "border-violet-600 bg-violet-50 ring-2 ring-violet-200"
                          : "border-gray-200 bg-white"
                      }`}
                    >
                      <div className="flex flex-col items-center gap-4 text-center">
                        <div
                          className={`rounded-full p-3 transition-colors ${
                            isSelected
                              ? "bg-violet-600 text-white"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          <Icon className="h-6 w-6" />
                        </div>
                        <span
                          className={`font-semibold ${
                            isSelected ? "text-violet-900" : "text-gray-900"
                          }`}
                        >
                          {type.title}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {currentStep === 1 && (
            <div className="py-6">
              <LoanCalculatorForm
                key={selectedLoanType}
                loanType={selectedLoanType!}
                formId={FORM_ID}
              />
            </div>
          )}

          <div className="mt-8 flex justify-between border-t pt-4">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0}
            >
              Previous
            </Button>
            {currentStep < steps.length - 1 ? (
              <Button onClick={handleNext} disabled={!selectedLoanType}>
                Next
              </Button>
            ) : (
              <Button type="submit" form={FORM_ID}>
                Calculate
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </Section>
  )
}
