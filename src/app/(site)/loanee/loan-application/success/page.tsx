"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function GeneralApplicationSuccessPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="space-y-6 p-8 text-center">
          <div className="flex justify-center">
            <CheckCircle2 className="h-24 w-24 text-green-500" />
          </div>

          <h1 className="text-3xl font-bold">
            Application Submitted Successfully!
          </h1>

          <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-400">
            Thank you for submitting your general loan application. Our team
            will review your information and contact you within 1-2 business
            days to discuss next steps.
          </p>

          <div className="space-y-4 pt-4">
            <div className="text-gray-600 dark:text-gray-400">
              <p>What happens next?</p>
              <ul className="mx-auto mt-2 max-w-md list-disc space-y-2 text-left">
                <li>Application review by our loan specialists</li>
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
