"use client";
import Section from "@/components/shared/section";
import HowBenefit from "./HowBenefit";
import Faq from "@/components/shared/Faq";
import faqData from "@/data/faq";
import Link from "next/link";

export default function Lenders() {
  return (
    <div className="py-10 xl:py-20">
      <Section>
        <div className="text-center max-w-5xl mx-auto space-y-5 px-4">
          <p className="inline-block font-semibold md:text-lg text-violet-500">
            For Lender Applicants
          </p>

          <div className="mt-5">
            <h1 className="qs-heading block font-bold opacity-90 text-2xl md:text-3xl lg:text-4xl">
              <span>Quoteshack</span> is a groundbreaking loan platform designed
              to help businesses secure funding swiftly.
            </h1>
          </div>

          <p className="opacity-70 md:text-lg">
            QUOTESHACK is an innovative B2B fintech startup committed to
            transforming how businesses access capital and manage loans. As
            trailblazers in a vast market, we are assembling a team of creative
            and experienced individuals to tackle the challenges faced by
            businesses and lenders globally.
          </p>
        </div>
      </Section>
      <HowBenefit />

      <Section>
        <h1 className="qs-heading text-center block font-bold opacity-90 text-2xl lg:text-5xl px-4">
          Lender commonly asked questions
        </h1>
        <Faq data={faqData.lenders} />
      </Section>

      <Section className="mt-20 py-10 bg-violet-200 text-dark">
        <div className="text-center max-w-5xl mx-auto space-y-5 px-4">
          <p className="inline-block font-semibold md:text-lg">
              Ready to get started?
            </p>

          <div className="mt-5">
            <h1 className="text-center block font-bold opacity-90 text-2xl lg:text-5xl">
              Let&apos;s plan your finances the right way
            </h1>
          </div>

            <div>
              <Link
                href="/become-lender"
                className="py-2 px-6 rounded-full bg-violet-500 text-white font-bold hover:bg-violet-600 transition duration-200 ease-in-out"
              >
                Become a Lender
              </Link>
            </div>
          </div>
      </Section>
    </div>
  );
}
