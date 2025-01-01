"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { formSteps } from "./steps";
import { FormHeader } from "@/components/shared/loan-application/form-header";
import { EligibilityStep } from "@/components/shared/loan-application/eligibility-step";
import { PersonalStep } from "@/components/shared/loan-application/personal-step";
import { ResidenceStep } from "@/components/shared/loan-application/residence-step";
import { EmploymentStep } from "@/components/shared/loan-application/employment-step";
import { LoanStep } from "@/components/shared/loan-application/loan-step";
import { loanFormSchema, type LoanFormValues } from "./types";
import Section from "@/components/shared/section";
import axios from "axios";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

export default function LoanForm() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);

  const form = useForm<LoanFormValues>({
    resolver: zodResolver(loanFormSchema),
    defaultValues: {
      isAdult: false,
      hasBankruptcy: false,
      firstName: "",
      lastName: "",
      currentAddress: "",
      residencyDuration: undefined,
      housingStatus: undefined,
      housingPayment: undefined,
      canadianStatus: undefined,
      employmentStatus: undefined,
      grossIncome: undefined,
      workplaceName: "",
      workplacePhone: "",
      workplaceEmail: "",
      loanAmount: undefined,
      loanPurpose: undefined,
      mortgageType: undefined,
      housingType: undefined,
      downPayment: undefined,
    },
    mode: "onChange",
  });

  async function onNext() {
    const fieldsToValidate: Record<number, (keyof LoanFormValues)[]> = {
      0: ["isAdult", "hasBankruptcy"],
      1: ["firstName", "lastName", "currentAddress", "residencyDuration"],
      2: ["housingStatus", "housingPayment", "canadianStatus"],
      3: [
        "employmentStatus",
        "grossIncome",
        "workplaceName",
        "workplacePhone",
        "workplaceEmail",
      ],
      4: [
        "loanAmount",
        "loanPurpose",
        "mortgageType",
        "housingType",
        "downPayment",
      ],
    };

    const isValid = await form.trigger(fieldsToValidate[currentStep] ?? []);

    if (isValid) {
      setCurrentStep(currentStep + 1);
    }
  }

  function onPrevious() {
    setCurrentStep(currentStep - 1);
  }

  function onSubmit(data: LoanFormValues) {
    if (currentStep < formSteps.length - 1) {
      onNext();
    } else {
      axios
        .post("/api/apply/mortgage", data)
        .then(() => {
          router.push("/apply/mortgage/success");
        })
        .catch((error) => {
          toast({
            title: "Error",
            description: error.response.data.error,
          });
        });
    }
  }

  return (
    <Section className="py-24">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Mortgage Loan Application
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <FormHeader currentStep={currentStep} steps={formSteps} />

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {currentStep === 0 && <EligibilityStep form={form} />}
              {currentStep === 1 && <PersonalStep form={form} />}
              {currentStep === 2 && <ResidenceStep form={form} />}
              {currentStep === 3 && <EmploymentStep form={form} />}
              {currentStep === 4 && <LoanStep form={form} />}

              <div className="flex justify-between">
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
        </CardContent>
      </Card>
    </Section>
  );
}
