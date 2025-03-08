"use client";
import Section from "@/components/shared/section";
import HowBenefit from "./HowBenefit";
import Faq from "@/components/shared/Faq";
import faqData from "@/data/faq";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function Lenders() {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <div className="py-10 xl:py-20">
      {/* Hero Section */}
      <Section className="relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute -z-10 w-[500px] h-[500px] rounded-full bg-violet-100/50 blur-3xl top-0 -right-64" />
        <div className="absolute -z-10 w-[400px] h-[400px] rounded-full bg-purple-100/50 blur-3xl -bottom-20 -left-20" />
        
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="text-center max-w-5xl mx-auto space-y-6 px-4"
        >
          <p className="inline-block font-semibold text-sm md:text-base bg-violet-100 text-violet-700 px-4 py-1.5 rounded-full">
            For Lender Applicants
          </p>

          <div className="mt-5">
            <h1 className="qs-heading block font-bold opacity-90 text-2xl md:text-3xl lg:text-4xl bg-gradient-to-r from-violet-700 to-purple-600 bg-clip-text text-transparent">
              <span>Quoteshack</span> is a groundbreaking loan platform designed
              to help lenders or investors secure an efficient lending system
              using Artificial intelligence, Machine learning &amp; Blockchain.
            </h1>
          </div>

          <p className="opacity-70 md:text-lg lg:text-xl max-w-4xl mx-auto leading-relaxed">
            QUOTESHACK is an innovative B2B fintech startup committed to
            transforming the traditional lending system. Bringing Artificial
            intelligence, Machine learning, and Blockchain to tackle the
            challenges, then minimize credit risk, and processing within
            minutes. Lenders can use it to generate leads, create loan
            applications, collect documents and analyze loan risks.
          </p>

          <div className="pt-6 flex flex-col sm:flex-row gap-5 justify-center">
            <Link
              href="/lender/register"
              className="group flex items-center justify-center gap-2 py-3 px-8 rounded-lg bg-gradient-to-r from-violet-600 to-purple-600 text-white font-medium hover:shadow-lg hover:shadow-violet-200 transition duration-300 ease-in-out"
            >
              Become a Lender
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/lender/login"
              className="flex items-center justify-center gap-2 py-3 px-8 rounded-lg border-2 border-violet-200 text-violet-700 font-medium hover:border-violet-300 hover:bg-violet-50 transition duration-300 ease-in-out"
            >
              Login
            </Link>
          </div>
        </motion.div>
      </Section>

      {/* Benefits Section */}
      <HowBenefit />

      {/* FAQ Section */}
      <Section className="py-16 bg-gradient-to-b from-white to-violet-50">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto"
        >
          <h2 className="qs-heading text-center font-bold opacity-90 text-2xl lg:text-4xl px-4 bg-gradient-to-r from-violet-700 to-purple-600 bg-clip-text text-transparent mb-12">
            Lender commonly asked questions
          </h2>
          <Faq data={faqData.lenders} />
        </motion.div>
      </Section>

      <Section className="mt-20 py-16 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-3xl mx-auto max-w-7xl overflow-hidden relative">
        <div className="absolute top-0 right-0 opacity-10">
          <svg width="400" height="400" viewBox="0 0 200 200">
            <path fill="white" d="M42.7,-76.4C53.2,-67.8,58.8,-52.6,65.5,-38.7C72.2,-24.8,80,-12.4,79.8,-0.1C79.6,12.1,71.3,24.2,62.6,34.9C53.9,45.6,44.8,54.8,33.7,63.1C22.7,71.4,9.8,78.7,-3.9,84.8C-17.5,90.8,-35,95.7,-47.8,89.8C-60.5,83.9,-68.5,67.3,-74.3,51.5C-80.1,35.7,-83.7,20.6,-83.9,5.5C-84.1,-9.6,-80.8,-24.7,-73.3,-37.9C-65.8,-51.1,-54.1,-62.3,-41,-70.8C-27.9,-79.3,-13.9,-85.1,1.2,-87.1C16.3,-89.1,32.3,-85,42.7,-76.4Z" transform="translate(100 100)" />
          </svg>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center max-w-5xl mx-auto space-y-6 px-4 relative z-10"
        >
          <p className="inline-block font-semibold text-violet-200 bg-white/10 px-4 py-1.5 rounded-full backdrop-blur-sm">
            Ready to get started?
          </p>

          <div className="mt-5">
            <h2 className="text-center block font-bold opacity-90 text-2xl lg:text-4xl">
              Let&apos;s plan your finances the right way
            </h2>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row gap-5 justify-center">
            <Link
              href="/lender/register"
              className="group flex items-center justify-center gap-2 py-3 px-8 rounded-lg bg-white text-violet-700 font-medium hover:shadow-lg hover:shadow-violet-900/20 transition duration-300 ease-in-out"
            >
              Become a Lender
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/lender/login"
              className="flex items-center justify-center gap-2 py-3 px-8 rounded-lg border-2 border-white/30 text-white font-medium hover:bg-white/10 transition duration-300 ease-in-out backdrop-blur-sm"
            >
              Login
            </Link>
          </div>
        </motion.div>
      </Section>
    </div>
  );
}
