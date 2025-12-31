"use client";

import { useEffect, useState } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useSession } from "next-auth/react";
import { toast } from "@/hooks/use-toast";

// UI Components
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import Section from "@/components/shared/section";

// Form Components
import { FormHeader } from "@/components/shared/loan-application/form-header";
import { PersonalStep } from "@/components/shared/loan-application/personal-step";
import { ResidenceStep } from "@/components/shared/loan-application/residence-step";
import { EmploymentStep } from "@/components/shared/loan-application/employment-step";
import { GeneralLoanStep } from "@/components/shared/loan-application/general-loan-step";
import TypeofApplication from "@/components/shared/loan-application/TypeofApplication";
import { EligibilityStep } from "@/components/shared/loan-application/eligibility-step";
import { FinancialStep } from "@/components/shared/loan-application/FinancialStep";

// Types and Schemas
import {
  generalLoanFormSchema,
  GeneralLoanFormValues,
} from "@/app/(site)/loan-application/types";
import { formSteps } from "@/app/(site)/loan-application/steps";
import { LoanType } from "@prisma/client";

type LoaneePlan = "LOANEE_STAY_SMART" | "LOANEE_BASIC";

function normalizeLoaneePlan(
  plan: string | null | undefined
): LoaneePlan | null {
  if (plan === "LOANEE_STAY_SMART" || plan === "LOANEE_BASIC") {
    return plan;
  }
  return null;
}


export default function GeneralLoanForm() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: session } = useSession();

  const [access, setAccess] = useState<{
  subscription?: { plan?: string | null };
  freeTierActive?: boolean;
} | null>(null);

const subscriptionPlan = normalizeLoaneePlan(
  access?.subscription?.plan
);
  const freeTierActive = access?.freeTierActive ?? false;

  useEffect(() => {
  const fetchAccess = async () => {
    if (!session?.user) return;

    try {
      const res = await axios.get("/api/subscription/access");
      setAccess(res.data);
    } catch (err) {
      console.error("Failed to fetch access info", err);
      setAccess(null);
    }
  };

  fetchAccess();
}, [session]);


  // Redirect if not authenticated
  useEffect(() => {
    if (!session?.user) {
      console.log(" No session - redirecting to login");
      router.push("/loanee/login");
    }
  }, [session, router]);

  const loanTypesForPropertyDetails: LoanType[] = [
    "FIRST_TIME_HOME",
    "INVESTMENT_PROPERTY",
    "MORTGAGE_REFINANCE",
    "HELOC",
    "HOME_REPAIR",
  ];

  const loanTypesForDownPayment: LoanType[] = [
    "FIRST_TIME_HOME",
    "INVESTMENT_PROPERTY",
    "CAR",
  ];

const form = useForm<GeneralLoanFormValues>({
  resolver: zodResolver(generalLoanFormSchema),
  defaultValues: {
    loanType: undefined,
    childCareBenefit: undefined,
    estimatedPropertyValue: undefined,
    hasCoApplicant: undefined,
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
    mortgage : undefined,
    condoFees : undefined,
    propertyTaxMonthly: undefined,
    homeInsurance: undefined,
    monthlyCarLoanPayment : undefined,
    monthlyCreditCardMinimums : undefined,
    monthlyOtherLoanPayments : undefined,
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
});

  const watchLoanType = form.watch("loanType");
  const watchEstimatedPropertyValue = form.watch("estimatedPropertyValue");
  const watchDownPayment = form.watch("downPayment");
  const watchVehicleType = form.watch("vehicleType");
  const watchTradeIn = form.watch("tradeInCurrentVehicle");

  const disableNextStep1 = (() => {
    if (!watchLoanType) return true;

    if (loanTypesForPropertyDetails.includes(watchLoanType)) {
      if (
        !watchEstimatedPropertyValue ||
        Number(watchEstimatedPropertyValue) <= 0
      ) {
        return true;
      }
    }

    if (
      watchLoanType === "FIRST_TIME_HOME" ||
      watchLoanType === "INVESTMENT_PROPERTY"
    ) {
      const houseType = form.getValues("houseType");
      if (!houseType || houseType.trim().length === 0) {
        return true;
      }
    }

    if (loanTypesForDownPayment.includes(watchLoanType)) {
      if (!watchDownPayment || Number(watchDownPayment) <= 0) {
        return true;
      }
    }

    if (watchLoanType === "CAR") {
      if (!watchVehicleType || watchVehicleType.trim().length === 0)
        return true;
      if (watchTradeIn === undefined) return true;
    }

    return false; // All validations passed
  })();

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
      5: ["monthlyDebtsExist", "monthlyDebts", "savings", "otherIncome", "otherIncomeAmount", "creditScore", "childCareBenefit"],
      // step 6: Final loan details
      6: ["loanAmount", "hasCoApplicant"],
    };

    try {
      let fields: (keyof GeneralLoanFormValues)[] = [];

      if (currentStep === 1) {
        const loanType = form.getValues("loanType");
        fields = ["loanType"];

        if (!loanType) {
          form.setError("loanType", {
            type: "manual",
            message: "Loan type is required",
          });
          toast({
            title: "Validation Error",
            description: "Please select a loan type",
            variant: "destructive",
          });
        }

        if (loanTypesForPropertyDetails.includes(loanType)) {
          fields.push("estimatedPropertyValue");
          const value = form.getValues("estimatedPropertyValue");
          if (!value || Number(value) <= 0) {
            form.setError("estimatedPropertyValue", {
              type: "manual",
              message: "Estimated property value is required",
            });
          }
        }

        if (
          loanType === "FIRST_TIME_HOME" ||
          loanType === "INVESTMENT_PROPERTY"
        ) {
          fields.push("houseType");
          const value = form.getValues("houseType");
          if (!value || value.trim().length === 0) {
            form.setError("houseType", {
              type: "manual",
              message: "Property type is required",
            });
          }
        }

        if (loanTypesForDownPayment.includes(loanType)) {
          fields.push("downPayment");
          const value = form.getValues("downPayment");
          if (!value || (Array.isArray(value) && value.length === 0)) {
            form.setError("downPayment", {
              type: "manual",
              message: "Down payment is required",
            });
          }
        }

        if (loanType === "CAR") {
          fields.push("vehicleType", "tradeInCurrentVehicle");
          const vehicleType = form.getValues("vehicleType");
          if (!vehicleType || vehicleType.trim().length === 0) {
            form.setError("vehicleType", {
              type: "manual",
              message: "Vehicle type is required",
            });
          }

          const tradeIn = form.getValues("tradeInCurrentVehicle");
          if (tradeIn === undefined) {
            form.setError("tradeInCurrentVehicle", {
              type: "manual",
              message: "Please specify if trading in vehicle",
            });
          }
        }

        const isValid = await form.trigger(fields, { shouldFocus: true });

        if (!isValid) {
          console.log("Form errors:", form.formState.errors);
          toast({
            title: "Validation Error",
            description: "Please complete all required fields correctly",
            variant: "destructive",
          });
          return false;
        }
      } else {
        fields = baseFieldsToValidate[currentStep] || [];
        const isValid = await form.trigger(fields, { shouldFocus: true });

        if (!isValid) {
          toast({
            title: "Validation Error",
            description: "Please complete all required fields correctly",
            variant: "destructive",
          });
          return false;
        }
      }

      if (currentStep < formSteps.length - 1) {
        setCurrentStep((prev) => prev + 1);
        return true;
      }

      return false;
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "An error occurred during validation",
        variant: "destructive",
      });
      return false;
    }
  }

  function onPrevious() {
    setCurrentStep(currentStep - 1);
  }

const handleFinalSubmit = form.handleSubmit(
  onSubmit,
  (errors) => {
    console.log("Validation errors on final submit:", errors);
    toast({
      title: "Validation Error",
      description: "Please fix the highlighted fields before submitting.",
      variant: "destructive",
    });
  }
);



async function onSubmit(data: GeneralLoanFormValues) {
  try {
    setIsSubmitting(true);

    const payload = {
      ...data,
      yearsAtCurrentAddress: Number(data.yearsAtCurrentAddress),
      housingPayment: Number(data.housingPayment),
      grossIncome: Number(data.grossIncome),
      loanAmount: Number(data.loanAmount),
    };

    const response = await axios.post("/api/apply/general", payload);
    console.log("API response:", response.data);

    router.push("/loan-application/success");
  } catch (error: unknown) {
    let description = "Failed to submit form";

    if (
      typeof error === "object" &&
      error !== null &&
      "response" in error &&
      typeof (error as { response?: { data?: { error?: string } } }).response
        ?.data?.error === "string"
    ) {
      description = (error as { response: { data: { error: string } } })
        .response.data.error;
    }

    toast({
      title: "Submission Error",
      description,
      variant: "destructive",
    });
  } finally {
    setIsSubmitting(false);
  }
}

  return (
    <Section className="py-24">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Loan Application
          </CardTitle>
          <FormHeader currentStep={currentStep} steps={formSteps} />
        </CardHeader>

        <Form {...form}>
          <form
    onSubmit={(e) => {
      e.preventDefault();
    }}
    className="space-y-8 p-6"
  >
            {currentStep === 0 && (
              <EligibilityStep
                form={form as UseFormReturn<GeneralLoanFormValues>}
              />
            )}
            {currentStep === 1 && (
              <TypeofApplication
                form={form as UseFormReturn<GeneralLoanFormValues>}
              />
            )}
            {currentStep === 2 && (
              <PersonalStep
                form={form as UseFormReturn<GeneralLoanFormValues>}
              />
            )}
            {currentStep === 3 && (
              <ResidenceStep
                form={form as UseFormReturn<GeneralLoanFormValues>}
              />
            )}
            {currentStep === 4 && (
              <EmploymentStep
                form={form as UseFormReturn<GeneralLoanFormValues>}
              />
            )}
            
            {currentStep === 5 && (
              <FinancialStep
                form={form as UseFormReturn<GeneralLoanFormValues>}
              />
            )}
            
{currentStep === 6 && (
  <GeneralLoanStep
    form={form as UseFormReturn<GeneralLoanFormValues>}
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
              {currentStep < formSteps.length - 1 ? (
                <Button
                  type="button"
                  onClick={() => {
                    console.log("Next button clicked");
                    onNext().catch(console.error);
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
  );
}
