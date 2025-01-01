"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { BadgeCheck } from "lucide-react";
import { motion } from "framer-motion";
import Section from "@/components/shared/section";

interface LoanPlan {
  action: string;
  buttonText: string;
  features: string[];
  description: string;
}

interface LoanPlanCardProps extends LoanPlan {
  index: number;
}

const LoanPlanCard: React.FC<LoanPlanCardProps> = ({ action, buttonText, features, description, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: index * 0.2 }}
    whileHover={{ scale: 1.02 }}
  >
    <Link href={action}>
      <Card className="relative flex-1 flex items-stretch flex-col p-8 bg-white dark:bg-black hover:border-primary-500 transition-all duration-300">
        <div className="mb-4">
          <h3 className="text-2xl font-bold">{buttonText}</h3>
          <p className="text-gray-500 dark:text-gray-400">{description}</p>
        </div>
        <ul className="py-8 space-y-4">
          {features.map((feature, idx) => (
            <li key={idx} className="flex items-center gap-5 text-lg group">
              <BadgeCheck className="text-primary-500 group-hover:scale-110 transition-transform" />
              <span className="group-hover:text-primary-500 transition-colors">{feature}</span>
            </li>
          ))}
        </ul>
        <div>
          <Button
            color="primary"
            className="bg-violet-500 font-bold text-lg hover:bg-violet-600 transition-colors"
          >
            Apply for {buttonText}
          </Button>
        </div>
      </Card>
    </Link>
  </motion.div>
);

export default function ApplyPage() {
  const plans: LoanPlan[] = [
    {
      action: "/apply/general",
      buttonText: "General Loan",
      description: "Perfect for personal expenses, education, vehicles, or business needs with flexible terms and competitive rates.",
      features: [
        "Quick personal loans up to $50,000",
        "Competitive car loan rates",
        "Flexible study loan options",
        "Tailored business financing",
        "Fast approval process",
      ],
    },
    {
      action: "/apply/mortgage",
      buttonText: "Mortgage",
      description: "Find your dream home with our comprehensive mortgage solutions and expert guidance.",
      features: [
        "Low-interest home mortgages",
        "Efficient refinancing options",
        "Pre-approval in 24 hours",
        "Personalized lender matching",
        "Market-leading rates",
      ],
    },
  ];

  return (
    <Section className="py-20 mt-20 bg-violet-50 dark:bg-violet-900" fullWidth={true}>
      <div className="max-w-screen-xl mx-auto px-4 md:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h3 className="text-4xl font-semibold mb-4">
            What type of <span className="text-violet-500">loan</span> are you looking for?
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Choose from our range of flexible loan options tailored to meet your specific needs
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8 justify-center mb-10">
          {plans.map((plan, idx) => (
            <LoanPlanCard key={idx} {...plan} index={idx} />
          ))}
        </div>
      </div>
    </Section>
  );
}
