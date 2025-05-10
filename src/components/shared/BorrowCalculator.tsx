"use client";

import { Calculator, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function BorrowCalculator() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50"></div>
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-10 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>
      <div className="container mx-auto px-4 relative">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-white/90 backdrop-blur-lg rounded-3xl p-12 shadow-2xl relative">
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl rotate-12"></div>
            <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl -rotate-12"></div>
            <div className="relative">
              <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-8">
                <div className="text-left flex-1">
                  <Badge variant="secondary" className="mb-6">
                    <Calculator className="w-4 h-4 mr-2" />
                    Loan Calculator
                  </Badge>
                  <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Calculate Your Loan
                  </h2>
                  <p className="text-xl text-gray-600 leading-relaxed">
                    Get instant estimates for your loan payments, interest rates, and total costs. 
                    Make informed decisions about your borrowing options.
                  </p>
                </div>
                <div className="flex-shrink-0 w-32 h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform duration-300">
                  <Calculator className="w-16 h-16 text-blue-600" />
                </div>
              </div>
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Loan Amount</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold text-blue-600">$5K - $50K</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Interest Rates</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold text-purple-600">5.99% APR</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Terms</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold text-pink-600">1-5 Years</p>
                  </CardContent>
                </Card>
              </div>
              <Button disabled className="w-full md:w-auto">
                Calculate Your Rate (Coming Soon)
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </Card>
        </div>
      </div>
      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
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