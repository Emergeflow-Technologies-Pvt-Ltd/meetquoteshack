import Link from "next/link";
import { ArrowRight, CheckCircle2, Clock, Shield } from "lucide-react";

export default function Borrowers() {
  const benefits = [
    {
      icon: Clock,
      title: "Quick Application",
      description: "Complete your application in under 5 minutes",
    },
    {
      icon: Shield,
      title: "No Credit Impact",
      description: "Check your rate without affecting your credit score",
    },
    {
      icon: CheckCircle2,
      title: "Instant Decision",
      description: "Get pre-approved offers in real-time",
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="text-left space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-700">
                <span className="text-sm font-medium">For Borrowers</span>
              </div>

              <div>
                <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Get Your Loan Faster Than Ever
                </h2>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Skip the paperwork and long wait times. Get matched with the
                  perfect loan option in minutes, with competitive rates and
                  flexible terms tailored to your needs.
                </p>
              </div>

              <div className="grid gap-6">
                {benefits.map((benefit, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-4 p-4 rounded-xl bg-white/80 backdrop-blur shadow-sm"
                  >
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                        <benefit.icon className="w-6 h-6 text-blue-600" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {benefit.title}
                      </h3>
                      <p className="text-gray-600">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-6">
                <Link
                  href="/loan-application"
                  className="inline-flex items-center px-8 py-4 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl group"
                >
                  Apply Now
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/loanee"
                  className="text-blue-600 font-semibold hover:text-blue-700 transition-colors"
                >
                  Learn More →
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-400/20 to-indigo-400/20 rounded-3xl blur-xl"></div>
              <div className="relative bg-white p-8 rounded-2xl shadow-xl">
                <div className="space-y-8">
                  <div className="flex items-center justify-between pb-6 border-b">
                    <div>
                      <p className="text-lg font-semibold text-gray-900">
                        Loan Amount
                      </p>
                      <p className="text-3xl font-bold text-blue-600">
                        $25,000
                      </p>
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-gray-900">
                        Monthly Payment
                      </p>
                      <p className="text-3xl font-bold text-blue-600">$520</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Interest Rate</span>
                      <span className="font-semibold text-gray-900">
                        5.99% APR
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Term Length</span>
                      <span className="font-semibold text-gray-900">
                        60 months
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Total Interest</span>
                      <span className="font-semibold text-gray-900">
                        $6,200
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
