"use client";

import { Calculator, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function BorrowCalculator() {
  return (
    <section className="relative overflow-hidden py-24">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50"></div>
      <div className="absolute inset-0">
        <div className="animate-blob absolute left-10 top-20 h-72 w-72 rounded-full bg-blue-200 opacity-70 mix-blend-multiply blur-xl filter"></div>
        <div className="animate-blob animation-delay-2000 absolute right-10 top-10 h-72 w-72 rounded-full bg-purple-200 opacity-70 mix-blend-multiply blur-xl filter"></div>
        <div className="animate-blob animation-delay-4000 absolute -bottom-8 left-20 h-72 w-72 rounded-full bg-pink-200 opacity-70 mix-blend-multiply blur-xl filter"></div>
      </div>
      <div className="container relative mx-auto px-4">
        <div className="mx-auto max-w-4xl">
          <Card className="relative rounded-3xl bg-white/90 p-12 shadow-2xl backdrop-blur-lg">
            <div className="absolute -right-6 -top-6 h-24 w-24 rotate-12 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600"></div>
            <div className="absolute -bottom-6 -left-6 h-24 w-24 -rotate-12 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600"></div>
            <div className="relative">
              <div className="mb-8 flex flex-col items-center justify-between gap-8 md:flex-row">
                <div className="flex-1 text-left">
                  <Badge variant="secondary" className="mb-6">
                    <Calculator className="mr-2 h-4 w-4" />
                    Loan Calculator
                  </Badge>
                  <h2 className="mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-4xl font-bold text-transparent md:text-5xl">
                    Calculate Your Loan
                  </h2>
                  <p className="text-xl leading-relaxed text-gray-600">
                    Get instant estimates for your loan payments, interest
                    rates, and total costs. Make informed decisions about your
                    borrowing options.
                  </p>
                </div>
                <div className="flex h-32 w-32 flex-shrink-0 transform items-center justify-center rounded-2xl bg-gradient-to-br from-blue-100 to-purple-100 shadow-lg transition-transform duration-300 hover:scale-105">
                  <Calculator className="h-16 w-16 text-blue-600" />
                </div>
              </div>
              <div className="mb-8 grid gap-6 md:grid-cols-3">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Loan Amount</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold text-blue-600">
                      $5K - $50K
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Interest Rates</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold text-purple-600">
                      5.99% APR
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Terms</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold text-pink-600">
                      1-5 Years
                    </p>
                  </CardContent>
                </Card>
              </div>
              <Button disabled className="w-full md:w-auto">
                Calculate Your Rate (Coming Soon)
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </Card>
        </div>
      </div>
      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </section>
  );
}
