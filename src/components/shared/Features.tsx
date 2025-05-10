"use client";
import React, { FC, ElementType } from "react";
import { Zap, Network, FileText, LayoutDashboard, Bell, HeadphonesIcon } from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
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
      y: 20,
    }}
    whileInView={{
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, delay: index * 0.1 },
    }}
    whileHover={{ y: -5 }}
    viewport={{ once: true }}
  >
    <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 p-6 transition-all duration-300 hover:shadow-xl dark:shadow-none">
      <div className="absolute inset-0 bg-gradient-to-r from-violet-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="relative flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-violet-600 text-white shadow-lg shadow-violet-500/25">
            <Icon className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
            {title}
          </h3>
        </div>
        
        <CardContent className="p-0">
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            {description}
          </p>
        </CardContent>
      </div>
    </Card>
  </motion.div>
);

export default function ChooseUs() {
  const cards: CardProps[] = [
    {
      Icon: Zap,
      title: "Super-Fast Processing",
      description:
        "Our powerful AI engine eliminates the bottlenecks in application processes, allowing for quicker decision-making for loan companies and faster approvals for borrowers.",
    },
    {
      Icon: Network,
      title: "A Network That Works For You",
      description:
        "We've built a massive, growing network of lenders across the United States and Canada to give you access to a wider range of quick loan options for your needs.",
    },
    {
      Icon: FileText,
      title: "Frictionless Application Experience",
      description:
        "No more confusing paperwork or hard credit pulls that hurt your score. At QuoteShack, we keep our application process straightforward.",
    },
    {
      Icon: LayoutDashboard,
      title: "Everything In One Place",
      description:
        "QuoteShack eliminates the need to bounce between platforms by allowing you to apply, track approvals, manage applications and communicate in one place.",
    },
    {
      Icon: Bell,
      title: "Stay Updated, Every Second",
      description:
        "Our real-time updates keep you in the loop with instant notifications on your application status and next steps so you never miss out on what matters.",
    },
    {
      Icon: HeadphonesIcon,
      title: "World-Class Customer Support",
      description:
        "Our dedicated, highly responsive support team is always available around the clock to provide you with the support you need when you need it.",
    },
  ];

  return (
    <Section
      className="bg-gradient-to-b from-white to-gray-50 dark:from-black dark:to-gray-950 py-24"
      header="Why Choose QuoteShack"
      subHeader="Experience the future of loan applications with our innovative platform"
    >
      <div className="grid grid-cols-1 gap-6 mt-16 md:grid-cols-2 lg:grid-cols-3">
        {cards.map((card, index) => (
          <InfoCard key={index} {...card} index={index} />
        ))}
      </div>
    </Section>
  );
}
