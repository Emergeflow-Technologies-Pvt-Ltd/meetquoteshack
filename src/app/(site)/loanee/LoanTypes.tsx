import { Card, CardHeader, CardContent } from "@/components/ui/card";
import Section from "@/components/shared/section";
import { CircleDollarSign, Car, Clock, Home, Building2 } from "lucide-react";

const loanTypes = [
  {
    title: "Personal Loans",
    description: "Get the funds you need to cover unexpected expenses or big moments with a personal loan.",
    icon: <CircleDollarSign className="w-8 h-8" />
  },
  {
    title: "Car Loan Refinance",
    description: "Lower your payments, adjust your term, or lock in a better rate on your current loan.",
    icon: <Car className="w-8 h-8" />
  },
  {
    title: "Short-Term Relief Loans",
    description: "Bridge financial gaps fast with short-term options for financial emergencies.",
    icon: <Clock className="w-8 h-8" />
  },
  {
    title: "Home Equity Line Of Credit",
    description: "Tap into your home's equity for renovations, major purchases or debt consolidation.",
    icon: <Home className="w-8 h-8" />
  },
  {
    title: "Mortgage Loan",
    description: "Get the funds you need to buy your dream home at great interest rates.",
    icon: <Building2 className="w-8 h-8" />
  },
];

export default function LoanTypes() {
  return (
    <Section className="bg-gradient-to-b from-white to-violet-50">
      <div className="text-center mb-16">
        <p className="text-violet-600 font-semibold mb-2">Loan Options</p>
        <h2 className="qs-heading text-3xl lg:text-4xl font-bold mb-4">Find The Right Loan For Your Needs</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">Choose from our range of flexible loan options designed to meet your specific financial requirements.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loanTypes.map((loan, index) => (
          <Card 
            key={index} 
            className="group bg-white hover:shadow-2xl transition-all duration-300 ease-in-out hover:-translate-y-1 border border-gray-100 overflow-hidden"
          >
            <CardHeader className="space-y-1 pb-4">
              <div className="w-12 h-12 rounded-lg bg-violet-100 text-violet-600 flex items-center justify-center mb-4 group-hover:bg-violet-600 group-hover:text-white transition-colors duration-300">
                {loan.icon}
              </div>
              <h3 className="text-xl font-semibold group-hover:text-violet-600 transition-colors duration-300">{loan.title}</h3>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 leading-relaxed">{loan.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </Section>
  );
}