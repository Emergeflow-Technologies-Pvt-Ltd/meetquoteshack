import Link from "next/link";

export default function Borrowers() {
  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="text-left">
              <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                For Borrowers
              </h2>
              <h3 className="text-2xl md:text-3xl font-semibold mb-6 text-gray-800">
                Unlock The Best Loan Options, Fast
              </h3>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Whether you&apos;re looking to refinance your car loan, cover a short-term need, or secure a
                mortgage, QuoteShack matches you with the lenders and loan companies most likely to approve
                your application without impacting your credit score. Need a guaranteed loan approval with no
                credit check or loans with horrible credit? We&apos;ll find the best loan options for you.
              </p>
              <div className="space-y-4 mb-8">
                <div className="flex items-center">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-green-600 text-lg">✓</span>
                  </div>
                  <span className="text-gray-700">Find the right quick loan for your needs</span>
                </div>
                <div className="flex items-center">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-green-600 text-lg">✓</span>
                  </div>
                  <span className="text-gray-700">Simplify your application process</span>
                </div>
                <div className="flex items-center">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-green-600 text-lg">✓</span>
                  </div>
                  <span className="text-gray-700">Pre-qualify without hurting your credit</span>
                </div>
              </div>
              <Link
                href="/learn-more"
                className="inline-flex items-center px-8 py-4 rounded-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Learn More
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            <div className="hidden md:block">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-2xl opacity-20 blur-xl"></div>
                <div className="relative bg-white p-8 rounded-2xl shadow-xl">
                  <div className="space-y-6">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                    <div className="h-4 bg-gray-200 rounded w-4/5"></div>
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