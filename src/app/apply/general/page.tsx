"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Section from "@/components/shared/section";
import { motion } from "framer-motion";

export default function GeneralLoanPage() {
  return (
    <Section className="py-20 mt-20" fullWidth={true}>
      <div className="max-w-screen-xl mx-auto px-4 md:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <h1 className="text-4xl font-semibold mb-4">
            General <span className="text-violet-500">Loan</span> Application
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            We are currently working on making this application process available. If you need assistance or have any questions, please email us at quoteshack4@gmail.com
          </p>
          <Card className="p-8 bg-white dark:bg-black">
            <p className="text-lg mb-6">
              This page will soon feature our general loan application form where you can apply for:
            </p>
            <ul className="text-left list-disc list-inside space-y-2 mb-8">
              <li>Personal loans up to $50,000</li>
              <li>Car loans with competitive rates</li>
              <li>Study loans with flexible terms</li>
              <li>Business financing options</li>
            </ul>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              For immediate assistance, please reach out to quoteshack4@gmail.com
            </p>
            <Button
              variant="outline"
              className="bg-violet-500 text-white hover:bg-violet-600 transition-colors"
              onClick={() => window.history.back()}
            >
              Go Back
            </Button>
          </Card>
        </motion.div>
      </div>
    </Section>
  );
}
