import Section from "@/components/shared/section";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Image from "next/image";
import React from "react";

const benefits = [
  {
    title: "Attract New Borrowers",
    description: [
      "Engage households with strong borrower profiles.",
      "Build lasting relationships for sustained growth.",
    ],
    image:
      "https://img.freepik.com/free-vector/international-non-resident-taxes-abstract-concept-illustration_335657-3676.jpg",
  },
  {
    title: "Enhance Your Lending Portfolio",
    description: [
      "Expand your consumer lending portfolio efficiently.",
      "Include options for personal and auto loans.",
      "Achieve strong returns with manageable risk.",
    ],
    image:
      "https://img.freepik.com/free-vector/hand-drawn-illustrated-business-strategy-concept_23-2149139704.jpg",
  },
  {
    title: "Lend to Reliable Borrowers with Confidence",
    description: [
      "Assess and manage risk effectively.",
      "Boost approvals while adhering to your risk guidelines.",
      "Keep full oversight of your lending criteria.",
    ],
    image:
      "https://img.freepik.com/free-vector/flat-design-frugality-illustration_23-2150204790.jpg",
  },
  {
    title: "Provide a Seamless Digital Experience",
    description: [
      "Allow borrowers to access loans anytime, anywhere.",
      "Process applications in minutes, not days.",
      "Streamline approvals with reduced fraud risk.",
    ],
    image:
      "https://img.freepik.com/free-vector/flat-hand-drawn-people-analyzing-growth-charts_23-2148872151.jpg",
  },
];

export default function HowBenefit() {
  return (
    <Section className="bg-violet-50 py-16 mt-20" fullWidth={true}>
      <div className="px-4 lg:px-0">
        <h1 className="text-center text-3xl font-bold">How You Benefit</h1>
        <div className="mt-10 pb-5 mx-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit) => (
            <Card
              key={benefit.title}
              className="shadow-xl hover:shadow-2xl p-5 rounded-2xl cursor-pointer transition duration-400 transform hover:scale-105"
            >
              <CardHeader>
                <Image
                  src={benefit.image}
                  alt={benefit.title}
                  width={500}
                  height={500}
                  className="w-full rounded-lg"
                />
              </CardHeader>

              <CardContent className="text-center">
                <h3 className="font-bold text-lg">{benefit.title}</h3>
                <ul className="list-none pl-2 opacity-70">
                  {benefit.description.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Section>
  );
}
