import { Check } from "lucide-react";

interface FormHeaderProps {
  currentStep: number;
  steps: readonly {
    id: string;
    title: string;
    description: string;
  }[];
}

export function FormHeader({ currentStep, steps }: FormHeaderProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-center space-x-4">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full border-2 ${
                index <= currentStep
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-muted"
              }`}
            >
              {index < currentStep ? (
                <Check className="h-4 w-4" />
              ) : (
                <span>{index + 1}</span>
              )}
            </div>
            {index < steps.length - 1 && (
              <div
                className={`h-0.5 w-12 ${
                  index < currentStep ? "bg-primary" : "bg-muted"
                }`}
              />
            )}
          </div>
        ))}
      </div>
      <div className="text-center">
        <h2 className="text-lg font-semibold">{steps[currentStep].title}</h2>
        <p className="text-sm text-muted-foreground">
          {steps[currentStep].description}
        </p>
      </div>
    </div>
  );
}
