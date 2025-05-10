import Link from "next/link";

export default function Lenders() {
  return (
    <section className="py-20 bg-gradient-to-bl from-purple-50 to-pink-50">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="hidden md:block">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-purple-400 to-pink-400 rounded-2xl opacity-20 blur-xl"></div>
                <div className="relative bg-white p-8 rounded-2xl shadow-xl">
                  <div className="flex flex-col gap-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                        <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                      </div>
                      <div className="h-4 bg-gray-200 rounded flex-1"></div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center">
                        <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="h-4 bg-gray-200 rounded flex-1"></div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                        <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="h-4 bg-gray-200 rounded flex-1"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-left md:order-last">
              <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                For Lenders
              </h2>
              <h3 className="text-2xl md:text-3xl font-semibold mb-6 text-gray-800">
                More Leads. More Closes. Less Fraud
              </h3>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Still making borrowers go through hoops to access your loan services? QuoteShack delivers
                verified, risk-scored and ready-to-go loan applications, allowing you to approve loans faster and
                close more deals.
              </p>
              <div className="space-y-4 mb-8">
                <div className="flex items-center">
                  <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-purple-600 text-lg">✓</span>
                  </div>
                  <span className="text-gray-700">Get Pre-Qualified Leads</span>
                </div>
                <div className="flex items-center">
                  <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-purple-600 text-lg">✓</span>
                  </div>
                  <span className="text-gray-700">Cut Processing Times</span>
                </div>
                <div className="flex items-center">
                  <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-purple-600 text-lg">✓</span>
                  </div>
                  <span className="text-gray-700">Maximize Your Bottom Line</span>
                </div>
              </div>
              <Link
                href="/for-lenders"
                className="inline-flex items-center px-8 py-4 rounded-lg font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Learn More
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 