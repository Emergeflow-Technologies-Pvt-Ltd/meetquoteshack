"use client";
import Link from "next/link";
import Section from "@/components/shared/section";
import faqData from "@/data/faq";
import Faq from "@/components/shared/Faq";
import LoanTypes from "./LoanTypes";
import { Clock, DollarSign, Shield, ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function Loanee() {
  return (
    <div className="py-10 xl:py-20">
      <Section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-50 via-white to-violet-50 opacity-50" />
        <div className="relative">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-5xl mx-auto space-y-6 px-4"
          >
            <span className="inline-flex items-center gap-2 text-violet-600 font-semibold bg-violet-50 px-4 py-2 rounded-full text-sm mb-4">
              <Sparkles className="w-4 h-4" />
              Fast Loan Solutions
            </span>
            <h1 className="qs-heading font-bold text-3xl md:text-4xl lg:text-5xl xl:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-violet-700 to-violet-900">
              Find The Best Fast Loan Options In Minutes
            </h1>

            <p className="text-gray-600 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
              QuoteShack, you get instant matches to top-rated lenders based on your financial behaviour —
              no guesswork, hard credit pulls or hidden costs.
            </p>

            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-8">
              <Link
                href="/apply"
                className="w-full sm:w-auto py-4 px-10 rounded-full bg-violet-600 text-white font-bold hover:bg-violet-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-violet-200 flex items-center gap-2"
              >
                <span>Find A Loan Now, It&apos;s Free</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </Section>

      <Section className="bg-gradient-to-b from-violet-50 to-white py-20" fullWidth={true}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {[
              {
                title: "Pre-Qualify In Minutes",
                description: "Answer a few quick questions, and we&apos;ll show you which online loans providers are ready to work with you, maximizing your chances of approval.",
                icon: <Clock className="w-8 h-8" />
              },
              {
                title: "Get Clear, Upfront Offers",
                description: "See your potential rates, terms, monthly payments and more, allowing you to make sound financial decisions.",
                icon: <DollarSign className="w-8 h-8" />
              },
              {
                title: "No Impact On Your Credit Score",
                description: "We only use soft checks for fast loan pre-approval matching so you can explore your options without affecting your credit score.",
                icon: <Shield className="w-8 h-8" />
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative group bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-violet-500 to-violet-600 rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative flex flex-col items-center text-center space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-violet-100 text-violet-600 flex items-center justify-center group-hover:bg-violet-600 group-hover:text-white transition-colors duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      <Section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div className="inline-flex items-center gap-2 text-violet-600 font-semibold bg-violet-50 px-4 py-2 rounded-full text-sm">
                <Sparkles className="w-4 h-4" />
                Calculate Your Loan
              </div>
              <h2 className="qs-heading text-3xl lg:text-4xl font-bold">
                Discover How Much Can You Borrow
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed">
                Calculate your borrowing power, interest rates, monthly payments and more with our pre-
                approval process.
              </p>
              <div>
                <Link
                  href="/apply"
                  className="inline-flex items-center py-4 px-8 rounded-full bg-violet-600 text-white font-bold hover:bg-violet-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-violet-200 group"
                >
                  <span>Calculate Loan or Pre-Approval</span>
                  <ArrowRight className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
              </div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div className="inline-flex items-center gap-2 text-violet-600 font-semibold bg-violet-50 px-4 py-2 rounded-full text-sm">
                <Sparkles className="w-4 h-4" />
                Smart Application
              </div>
              <h2 className="qs-heading text-3xl lg:text-4xl font-bold">
                Submit One Application, Reach Multiple Lenders
              </h2>
              <div className="space-y-4 text-gray-600 text-lg leading-relaxed">
                <p>
                  Save time and avoid duplicate applications, all while maximizing your chances of getting
                  approved. Our smart AI-powered loan pre-approval and matching platform takes your details,
                  analyzes your needs, and connects you with the lenders most likely to approve your loan.
                </p>
                <p>
                  The best part? We make it easy to stay on top of everything by allowing you to chat with
                  lenders, upload documents and finalize your application from a single dashboard.
                </p>
              </div>
              <div>
                <Link
                  href="/apply"
                  className="inline-flex items-center py-4 px-8 rounded-full bg-violet-600 text-white font-bold hover:bg-violet-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-violet-200 group"
                >
                  <span>Apply Now</span>
                  <ArrowRight className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </Section>

      <LoanTypes />

      <Section>
        <Faq data={faqData.loanees} />
      </Section>

      <Section className="bg-gradient-to-br from-violet-600 to-violet-800 py-20" fullWidth={true}>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-5xl mx-auto space-y-8 px-4"
        >
          <h2 className="qs-heading text-4xl lg:text-5xl font-bold text-white">
            Ready To Get A Fast Loan?
          </h2>

          <div>
            <Link
              href="/apply"
              className="inline-flex items-center py-4 px-10 rounded-full bg-white text-violet-600 font-bold hover:bg-violet-50 transform hover:scale-105 transition-all duration-300 shadow-lg group"
            >
              <span>Get Matched For Free!</span>
              <ArrowRight className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </div>
        </motion.div>
      </Section>
    </div>
  );
}
