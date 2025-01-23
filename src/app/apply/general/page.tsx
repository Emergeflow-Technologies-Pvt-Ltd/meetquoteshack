"use client";

import { useState } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import axios from "axios";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { formSteps } from "./steps";
import { generalLoanFormSchema, type GeneralLoanFormValues } from "./types";
import { toast } from "@/hooks/use-toast";
import Section from "@/components/shared/section";

import { FormHeader } from "@/components/shared/loan-application/form-header";
import { EligibilityStep } from "@/components/shared/loan-application/eligibility-step";
import { PersonalStep } from "@/components/shared/loan-application/personal-step";
import { ResidenceStep } from "@/components/shared/loan-application/residence-step";
import { EducationStep } from "@/components/shared/loan-application/education-step";
import { EmploymentStep } from "@/components/shared/loan-application/employment-step";
import { GeneralLoanStep } from "@/components/shared/loan-application/general-loan-step";
import { MortgageLoanFormValues } from "../mortgage/types";

export default function GeneralLoanForm() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);

  const form = useForm<GeneralLoanFormValues>({
    resolver: zodResolver(generalLoanFormSchema),
    defaultValues: {
      isAdult: false,
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
      generalEducationLevel: undefined,
      generalFieldOfStudy: "",
      employmentStatus: undefined,
      grossIncome: undefined,
      workplaceName: "",
      workplaceAddress: "",
      workplacePhone: "",
      workplaceEmail: "",
      loanAmount: undefined,
    },
    mode: "all",
  });

  async function onNext() {
    const fieldsToValidate: Record<number, (keyof GeneralLoanFormValues)[]> = {
      0: ["isAdult", "hasBankruptcy"],
      1: [
        "firstName",
        "lastName",
        "dateOfBirth",
        "maritalStatus",
        "personalPhone",
        "personalEmail",
      ],
      2: [
        "currentAddress",
        "yearsAtCurrentAddress",
        "housingStatus",
        "housingPayment",
        "residencyStatus",
      ],
      3: ["generalEducationLevel", "generalFieldOfStudy"],
      4: [
        "employmentStatus",
        "grossIncome",
        "workplaceName",
        "workplaceAddress",
        "workplacePhone",
        "workplaceEmail",
      ],
      5: ["loanAmount"],
    };

    const isValid = await form.trigger(fieldsToValidate[currentStep] ?? []);

    if (isValid && currentStep < formSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  }

  function onPrevious() {
    setCurrentStep(currentStep - 1);
  }

  function onSubmit(data: GeneralLoanFormValues) {
    if (currentStep < formSteps.length - 1) {
      onNext();
    } else {
      const payload = {
        ...data,
        yearsAtCurrentAddress: Number(data.yearsAtCurrentAddress),
        housingPayment: Number(data.housingPayment),
        grossIncome: Number(data.grossIncome),
        loanAmount: Number(data.loanAmount),
      };

      axios
        .post("/api/apply/general", payload)
        .then(() => {
          router.push("/apply/general/success");
        })
        .catch((error) => {
          toast({
            title: "Error",
            description: error.response?.data?.error || "Something went wrong",
            variant: "destructive",
          });
        });
    }
  }

  return (
    <Section className="py-24">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            General Loan Application
          </CardTitle>
          <FormHeader currentStep={currentStep} steps={formSteps} />
        </CardHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 p-6"
          >
            {currentStep === 0 && (
              <EligibilityStep
                form={
                  form as UseFormReturn<
                    GeneralLoanFormValues | MortgageLoanFormValues
                  >
                }
              />
            )}
            {currentStep === 1 && (
              <PersonalStep
                form={
                  form as UseFormReturn<
                    GeneralLoanFormValues | MortgageLoanFormValues
                  >
                }
              />
            )}
            {currentStep === 2 && (
              <ResidenceStep
                form={
                  form as UseFormReturn<
                    GeneralLoanFormValues | MortgageLoanFormValues
                  >
                }
              />
            )}
            {currentStep === 3 && (
              <EducationStep
                form={form as UseFormReturn<GeneralLoanFormValues>}
              />
            )}
            {currentStep === 4 && (
              <EmploymentStep
                form={
                  form as UseFormReturn<
                    GeneralLoanFormValues | MortgageLoanFormValues
                  >
                }
              />
            )}
            {currentStep === 5 && (
              <GeneralLoanStep
                form={form as UseFormReturn<GeneralLoanFormValues>}
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
              {currentStep < formSteps.length - 1 ? (
                <Button type="button" onClick={onNext}>
                  Next
                </Button>
              ) : (
                <Button type="submit">Submit</Button>
              )}
            </div>
          </form>
        </Form>
      </Card>
    </Section>
  );
}
