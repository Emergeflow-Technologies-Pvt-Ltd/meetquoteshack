"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function MortgageSuccessPage() {
  return (
    <div className="container max-w-4xl mx-auto py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="p-8 text-center space-y-6">
          <div className="flex justify-center">
            <CheckCircle2 className="h-24 w-24 text-green-500" />
          </div>

          <h1 className="text-3xl font-bold">Application Submitted Successfully!</h1>
          
          <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
            Thank you for submitting your mortgage application. Our team will review your information
            and contact you within 1-2 business days to discuss next steps.
          </p>

          <div className="space-y-4 pt-4">
            <div className="text-gray-600 dark:text-gray-400">
              <p>What happens next?</p>
              <ul className="list-disc text-left max-w-md mx-auto mt-2 space-y-2">
                <li>Application review by our mortgage specialists</li>
                <li>Initial assessment of your eligibility</li>
                <li>Contact you to gather any additional required documents</li>
                <li>Schedule a consultation to discuss your options</li>
              </ul>
            </div>
          </div>

          <div className="pt-6">
            <Link href="/">
              <Button className="bg-violet-500 hover:bg-violet-600">
                Return to Home
              </Button>
            </Link>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
