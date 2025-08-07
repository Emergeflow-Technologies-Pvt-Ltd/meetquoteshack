"use client";

import React from "react";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Section from "@/components/shared/section";
import Image from "next/image";
import Icon from "../../../../components/assets/google-icon.svg";

export default function LoaneeLogin() {
  const handleGoogleSignIn = () => {
    signIn("google", { callbackUrl: "/" });
  };

  return (
    <Section className="mt-24">
      <div className="max-w-md mx-auto">
        <Card className="p-8 shadow-xl rounded-2xl border border-gray-100 bg-white">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-violet-500 to-purple-600 bg-clip-text text-transparent">
              Loanee Login
            </CardTitle>
            <p className="mt-4 text-sm text-gray-500">
              Sign in to continue as a loanee
            </p>
          </CardHeader>

          <CardContent className="mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={handleGoogleSignIn}
              className="w-full flex items-center justify-center gap-3 py-3 text-sm font-medium border-gray-300 hover:bg-gray-100 transition"
            >
              <Image src={Icon} alt="Google icon" width={20} height={20} />
              Continue with Google
            </Button>
          </CardContent>
        </Card>
      </div>
    </Section>
  );
}
