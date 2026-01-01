import { Card, CardHeader, CardContent } from "@/components/ui/card";
import Section from "@/components/shared/section";
import { CircleDollarSign, Car, Clock, Home, Building2 } from "lucide-react";

const loanTypes = [
  {
    title: "Personal Loans",
    description:
      "Get the funds you need to cover unexpected expenses or big moments with a personal loan.",
    icon: <CircleDollarSign className="h-8 w-8" />,
  },
  {
    title: "Car Loan Refinance",
    description:
      "Lower your payments, adjust your term, or lock in a better rate on your current loan.",
    icon: <Car className="h-8 w-8" />,
  },
  {
    title: "Short-Term Relief Loans",
    description:
      "Bridge financial gaps fast with short-term options for financial emergencies.",
    icon: <Clock className="h-8 w-8" />,
  },
  {
    title: "Home Equity Line Of Credit",
    description:
      "Tap into your home's equity for renovations, major purchases or debt consolidation.",
    icon: <Home className="h-8 w-8" />,
  },
  {
    title: "Mortgage Loan",
    description:
      "Get the funds you need to buy your dream home at great interest rates.",
    icon: <Building2 className="h-8 w-8" />,
  },
];

export default function LoanTypes() {
  return (
    <Section className="bg-gradient-to-b from-white to-violet-50">
      <div className="mb-16 text-center">
        <p className="mb-2 font-semibold text-violet-600">Loan Options</p>
        <h2 className="qs-heading mb-4 text-3xl font-bold text-violet-600 lg:text-4xl">
          Find The Right Loan For Your Needs
        </h2>
        <p className="mx-auto max-w-2xl text-gray-600">
          Choose from our range of flexible loan options designed to meet your
          specific financial requirements.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {loanTypes.map((loan, index) => (
          <Card
            key={index}
            className="group overflow-hidden border border-gray-100 bg-white transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-2xl"
          >
            <CardHeader className="space-y-1 pb-4">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-violet-100 text-violet-600 transition-colors duration-300 group-hover:bg-violet-600 group-hover:text-white">
                {loan.icon}
              </div>
              <h3 className="text-xl font-semibold transition-colors duration-300 group-hover:text-violet-600">
                {loan.title}
              </h3>
            </CardHeader>
            <CardContent>
              <p className="leading-relaxed text-gray-600">
                {loan.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </Section>
  );
}
