"use client";
import Link from "next/link";
import Section from "@/components/shared/section";
import faqData from "@/data/faq";
import Faq from "@/components/shared/Faq";
import WhyChoose from "./WhyChoose";

export default function Loanee() {
  return (
    <div className="py-10 xl:py-20">
      <Section>
        <div className="text-center max-w-5xl mx-auto space-y-5 px-4">
          <p className="inline-block font-semibold md:text-lg text-violet-500">
            For Loanee Applicants
          </p>

          <div className="mt-5">
            <h1 className="qs-heading block font-bold opacity-90 text-2xl md:text-3xl lg:text-4xl">
              <span>Quoteshack</span> is a premier platform helping individuals
              secure loans easily and efficiently.
            </h1>
          </div>

          <p className="opacity-70 md:text-lg">
            QUOTESHACK is committed to providing a seamless and transparent loan
            process for individuals. We simplify access to funds with
            competitive rates and flexible terms, ensuring a smooth experience
            from application to approval.
          </p>
        </div>
      </Section>

      <Section fullWidth={true} className="bg-violet-50">
        <WhyChoose />
      </Section>

      <Section>
        <Faq data={faqData.loanees} />
      </Section>

      <Section className="bg-violet-50 py-20" fullWidth={true}>
        <div className="text-center max-w-5xl mx-auto space-y-5">
          <p className="inline-block font-semibold md:text-lg">
            Ready to get started?
          </p>

          <div className="mt-5">
            <h1 className="qs-heading block font-bold opacity-90 text-3xl lg:text-5xl">
              Secure your loan today
            </h1>
          </div>

          <div>
            <Link
              href="/apply"
              className="py-2 px-6 md:px-10 rounded-full bg-violet-500 text-white font-bold hover:bg-violet-600 transition duration-200 ease-in-out"
            >
              Apply Now
            </Link>
          </div>
        </div>
      </Section>
    </div>
  );
}
