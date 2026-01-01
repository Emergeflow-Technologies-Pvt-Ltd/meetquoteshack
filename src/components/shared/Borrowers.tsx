"use client";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Clock, Shield } from "lucide-react";
import { useSession } from "next-auth/react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

export default function Borrowers() {
  const { data: session } = useSession();
  const { toast } = useToast();
  const router = useRouter();

  const handleApplyNowClick = () => {
    const role = session?.user?.role;

    if (!session) {
      // Not logged in: send to loanee login first
      router.push("/loanee/login");
      return;
    }

    if (role === "LOANEE") {
      // Logged in loanee: go to loan application
      router.push("/loan-application");
      return;
    }

    if (role === "LENDER") {
      // Lender trying to apply as a loanee
      toast({
        title: "Switch Account",
        description:
          "Please logout of your Lender account before applying as a loanee.",
        variant: "destructive",
      });
      return;
    }

    // Other roles: deny access
    toast({
      title: "Access Denied",
      description: "You are not allowed to access the loan application.",
      variant: "destructive",
    });
  };

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
    <section className="bg-gradient-to-br from-blue-50 to-indigo-50 py-20">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-6xl">
          <div className="grid items-center gap-12 md:grid-cols-2">
            <div className="space-y-8 text-left">
              <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-2 text-blue-700">
                <span className="text-sm font-medium">For Borrowers</span>
              </div>

              <div>
                <h2 className="mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-4xl font-bold text-transparent md:text-5xl">
                  Get Your Loan Faster Than Ever
                </h2>
                <p className="text-xl leading-relaxed text-gray-600">
                  Skip the paperwork and long wait times. Get matched with the
                  perfect loan option in minutes, with competitive rates and
                  flexible terms tailored to your needs.
                </p>
              </div>

              <div className="grid gap-6">
                {benefits.map((benefit, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-4 rounded-xl bg-white/80 p-4 shadow-sm backdrop-blur"
                  >
                    <div className="flex-shrink-0">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                        <benefit.icon className="h-6 w-6 text-blue-600" />
                      </div>
                    </div>
                    <div>
                      <h3 className="mb-1 text-lg font-semibold text-gray-900">
                        {benefit.title}
                      </h3>
                      <p className="text-gray-600">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-6">
                <button
                  onClick={handleApplyNowClick}
                  className="group inline-flex items-center rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-4 font-semibold text-white shadow-lg transition-all duration-300 hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl"
                >
                  Apply Now
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </button>
                <Link
                  href="/loanee"
                  className="font-semibold text-blue-600 transition-colors hover:text-blue-700"
                >
                  Learn More →
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-blue-400/20 to-indigo-400/20 blur-xl"></div>
              <div className="relative rounded-2xl bg-white p-8 shadow-xl">
                <div className="space-y-8">
                  <div className="flex items-center justify-between border-b pb-6">
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
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Interest Rate</span>
                      <span className="font-semibold text-gray-900">
                        5.99% APR
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Term Length</span>
                      <span className="font-semibold text-gray-900">
                        60 months
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
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
