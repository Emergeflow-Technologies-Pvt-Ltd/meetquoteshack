"use client";
import React, { FC, ElementType } from "react";
import { CheckCheck, Lock, TrendingDown } from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Section from "@/components/shared/section";

interface CardProps {
  Icon: ElementType;
  title: string;
  description: string;
  index?: number;
}

const InfoCard: FC<CardProps> = ({ Icon, title, description, index = 0 }) => (
  <motion.div
    initial={{
      opacity: 0,
      x: index % 2 === 0 ? 10 : -50,
      scale: index % 2 === 0 ? 1 : 1.07,
    }}
    whileInView={{
      opacity: 1,
      x: 0,
      transition: { duration: 0.8, delay: 0.2 },
    }}
    whileTap={{ scale: 0.95 }}
    whileHover={{ scale: 1.1 }}
    viewport={{ once: true }}
  >
    <Card className="flex flex-col items-center p-8 space-y-4 text-center h-full cursor-pointer shadow-md transition-transform transform hover:scale-105">
      <CardHeader className="bg-primary text-white rounded-full ">
        <Icon className="w-8 h-8" />
      </CardHeader>
      <CardContent>
        <h1 className="qs-heading text-xl md:text-2xl font-semibold dark:text-gray-300 capitalize">
          {title}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">{description}</p>
      </CardContent>
    </Card>
  </motion.div>
);


export default function ChooseUs() {
  const cards: CardProps[] = [
    {
      Icon: CheckCheck,
      title: "Easy Loan Approvals",
      description:
        "Our streamlined process ensures quick and hassle-free loan approvals, making it easier for you to get the funds you need without unnecessary delays. Apply with confidence and receive your decision in record time.",
    },
    {
      Icon: TrendingDown,
      title: "Low Interest Rate",
      description:
        "We offer some of the most competitive interest rates in the market. Our commitment to affordability means you can achieve your financial goals without the burden of high interest costs, keeping your repayments manageable.",
    },
    {
      Icon: Lock,
      title: "100% Safe and Secure",
      description:
        "Your security is our top priority. We use advanced encryption and secure protocols to protect your personal and financial information, ensuring a completely safe and secure loan experience. Trust us to keep your data confidential and secure at all times.",
    },
  ];

  return (
    <Section
      className="bg-white dark:bg-black mt-40 md:py-20"
      header="Reasons to Choose Us"
    >
      <div className="grid grid-cols-1 gap-10 mt-8 xl:mt-12 xl:gap-16 md:grid-cols-2 xl:grid-cols-3 items-stretch">
        {cards.map((card, index) => (
          <InfoCard key={index} {...card} index={index} />
        ))}
      </div>
    </Section>
  );
}
