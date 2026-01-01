"use client";
import React from "react";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import Section from "@/components/shared/section";
import Image from "next/image";
import Icon from "../../../../components/assets/google-icon.svg";

export default function LenderLogin() {
  return (
    <Section className="mt-20">
      <div className="mx-auto max-w-md">
        <Card className="p-6">
          <CardHeader className="mb-8">
            <CardTitle className="bg-gradient-to-r from-violet-500 to-purple-600 bg-clip-text text-center text-3xl font-bold text-transparent">
              Loanee Login
            </CardTitle>
          </CardHeader>
          <Button
            type="button"
            variant="outline"
            className="flex h-12 w-full items-center justify-center gap-2 border-gray-300"
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
