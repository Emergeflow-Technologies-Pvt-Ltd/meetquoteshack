"use client";
import React from "react";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import Section from "@/components/shared/section";
import Image from "next/image";
import Icon from "../../../../components/assets/google-icon.svg";

export default function LoaneeLogin() {
  return (
    <Section className="mt-20">
      <div className="max-w-md mx-auto">
        <Card className="p-6">
          <CardHeader className="mb-8">
            <CardTitle className="text-center text-3xl font-bold bg-gradient-to-r from-violet-500 to-purple-600 bg-clip-text text-transparent">
              Loanee Login
            </CardTitle>
          </CardHeader>
          <Button
            type="button"
            variant="outline"
            className="w-full flex items-center justify-center gap-2 border-gray-300 h-12"
            onClick={() => signIn("google", { callbackUrl: "/" })}
          >
            <Image src={Icon} alt="googleIcon" width={20} height={20} />
            Continue with Google
          </Button>
        </Card>
      </div>
    </Section>
  );
}
