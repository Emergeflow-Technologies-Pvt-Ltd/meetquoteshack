import Link from "next/link";
import { BarChart2, ShieldCheck, Users } from "lucide-react";

export default function Lenders() {
  const benefits = [
    {
      icon: Users,
      title: "Quality Borrowers",
      description:
        "Access pre-screened borrowers with verified income and employment",
    },
    {
      icon: ShieldCheck,
      title: "Reduced Risk",
      description: "Advanced fraud detection and risk assessment tools",
    },
    {
      icon: BarChart2,
      title: "Higher ROI",
      description: "Optimize your lending portfolio with data-driven matches",
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-bl from-purple-50 to-pink-50">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative order-2 md:order-1">
              <div className="absolute -inset-4 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-3xl blur-xl"></div>
              <div className="relative bg-white p-8 rounded-2xl shadow-xl">
                <div className="space-y-8">
                  <div className="flex items-center justify-between pb-6 border-b">
                    <div>
                      <p className="text-lg font-semibold text-gray-900">
                        Active Borrowers
                      </p>
                      <p className="text-3xl font-bold text-purple-600">
                        10,000+
                      </p>
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-gray-900">
                        Avg. Loan Size
                      </p>
                      <p className="text-3xl font-bold text-purple-600">$35K</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Approval Rate</span>
                      <span className="font-semibold text-gray-900">85%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Avg. Credit Score</span>
                      <span className="font-semibold text-gray-900">720+</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Default Rate</span>
                      <span className="font-semibold text-gray-900">
                        &lt; 2%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-left space-y-8 order-1 md:order-2">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 text-purple-700">
                <span className="text-sm font-medium">For Lenders</span>
              </div>

              <div>
                <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Grow Your Lending Business
                </h2>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Access a steady stream of qualified borrowers and maximize
                  your returns with our intelligent matching platform and
                  comprehensive risk assessment tools.
                </p>
              </div>

              <div className="grid gap-6">
                {benefits.map((benefit, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-4 p-4 rounded-xl bg-white/80 backdrop-blur shadow-sm"
                  >
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
                        <benefit.icon className="w-6 h-6 text-purple-600" />
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
                  href="/lender"
                  className="text-purple-600 font-semibold hover:text-purple-700 transition-colors"
                >
                  Learn More →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
