"use client";
import React from "react";
import Section from "@/components/shared/section";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";

export const CreateAccount = () => {
  return (
    <Section className="bg-gradient-to-br from-violet-50 via-violet-100 to-violet-200 py-20 rounded-lg">
      <div className="container mx-auto px-4 lg:px-0 max-w-screen-lg">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12 lg:gap-20">
          <div className="space-y-8 text-center md:text-start max-w-2xl">
            <h1 className="qs-heading text-4xl lg:text-6xl font-extrabold text-gray-900 leading-tight">
              Become a Lender Today
            </h1>
            <p className="text-lg lg:text-xl text-gray-700 leading-relaxed">
              Join our network of trusted lenders and start earning through secure lending. 
              Our platform makes it simple to connect with verified borrowers and manage your 
              investments efficiently.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <Button
              onClick={() => signIn("google")}
              className="bg-violet-600 hover:bg-violet-700 text-white px-8 py-6 text-lg rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 font-semibold"
              size="lg"
            >
              Start Lending
            </Button>
            <Button
              variant="outline"
              className="border-violet-600 text-violet-600 hover:bg-violet-50 px-8 py-6 text-lg rounded-lg transition-all duration-200 font-semibold"
              size="lg"
            >
              View Opportunities
            </Button>
          </div>
        </div>
      </div>
    </Section>
  );
};
