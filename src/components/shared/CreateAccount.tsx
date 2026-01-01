"use client";
import React from "react";
import Section from "@/components/shared/section";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "@/hooks/use-toast";

export const CreateAccount = () => {
  const { data: session } = useSession();
  const router = useRouter();

  const handleStartLendingClick = () => {
    const role = session?.user?.role;
    if (!session) {
      // Not logged in: send to lender login first
      router.push("/lender/register");
      return;
    }
    if (role === "LENDER") {
      // Logged in lender: go to lender dashboard
      router.push("/lender/dashboard");
      return;
    }
    if (role === "LOANEE") {
      // Loanee trying to access lender features
      toast({
        title: "Switch Account",
        description:
          "Please logout of your Loanee account before becoming a lender.",
        variant: "destructive",
      });
      return;
    }
    // Other roles: deny access
    toast({
      title: "Access Denied",
      description: "You are not allowed to access the lender dashboard.",
      variant: "destructive",
    });
  };

  return (
    <Section className="rounded-lg bg-gradient-to-br from-violet-50 via-violet-100 to-violet-200 py-20">
      <div className="container mx-auto max-w-screen-lg px-4 lg:px-0">
        <div className="flex flex-col items-center justify-between gap-12 md:flex-row lg:gap-20">
          <div className="max-w-2xl space-y-8 text-center md:text-start">
            <h1 className="qs-heading text-4xl font-extrabold leading-tight text-gray-900 lg:text-6xl">
              Become a Lender Today
            </h1>
            <p className="text-lg leading-relaxed text-gray-700 lg:text-xl">
              Join our network of trusted lenders and start earning through
              secure lending. Our platform makes it simple to connect with
              verified borrowers and manage your investments efficiently.
            </p>
          </div>
          <div className="flex flex-col justify-center gap-4 sm:flex-row md:justify-start">
            <Button
              className="rounded-lg bg-violet-600 px-8 py-6 text-lg font-semibold text-white shadow-lg transition-all duration-200 hover:bg-violet-700 hover:shadow-xl"
              size="lg"
              onClick={handleStartLendingClick}
            >
              Start Lending
            </Button>
            <Button
              variant="outline"
              className="rounded-lg border-violet-600 px-8 py-6 text-lg font-semibold text-violet-600 transition-all duration-200 hover:bg-violet-50"
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
