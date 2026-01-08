//src\app\(site)\loan-application\steps.ts
export const formSteps = [
  {
    id: "eligibility",
    title: "Eligibility Check",
    description: "Basic eligibility requirements",
  },
  {
    id: "type",
    title: " Application Type",
    description: "What type of loan are you applying for?",
  },
  {
    id: "personal",
    title: "Personal and Educational Details",
    description: "Your personal and educational details",
  },
  {
    id: "residence",
    title: "Residential Information",
    description: "Your current resudential details",
  },

  {
    id: "employment",
    title: "Employment and Income",
    description: "Your employment status and income details",
  },
  {
    id: "",
    title: "Financial Details",
    description: "YBanking and financial information",
  },
  {
    id: "loan",
    title: "review & Submit",
    description: "Review and submit your application",
  },
] as const;
