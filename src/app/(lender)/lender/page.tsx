"use client";
import Section from "@/components/shared/section";
import Faq from "@/components/shared/Faq";
import faqData from "@/data/faq";
import { motion } from "framer-motion";
import { ArrowRight, Check, Crown, Zap } from "lucide-react";
import Head from "next/head";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Lenders() {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const router = useRouter();
  const { data: session } = useSession();

  const handleGetStartedClick = () => {
    const role = session?.user?.role;
    if (!role) {
      router.push("/loanee/login");
      return;
    }
    if (role === "LOANEE") {
      router.push("/loanee/loan-application");
    } else if (role === "LENDER") {
      toast({
        title: "Access Denied",
        description:
          "You're logged in as a lender. Please log out to login as a loanee.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Access Denied",
        description: "You are not allowed to access the loan application.",
        variant: "destructive",
      });
    }
  };

  const handleSignUpClick = () => {
    const role = session?.user?.role;
    if (!session) {
      router.push("/lender/register");
      return;
    } else if (role === "LENDER") {
      toast({
        title: "Already Logged In",
        description: "You are already logged in as a lender.",
      });
      return;
    } else {
      toast({
        title: "Access Denied",
        description: "You are not allowed to access the lender registration.",
        variant: "destructive",
      });
      return;
    }
  };

  const handleLoginClick = () => {
    const role = session?.user?.role;
    if (!role) {
      router.push("/lender/login");
      return;
    }
    if (role === "LENDER") {
      toast({
        title: "Already Logged In",
        description: "You're already logged in as a lender.",
      });
    } else if (role === "LOANEE") {
      toast({
        title: "Access Denied",
        description:
          "You're logged in as a loanee. Please log out to login as a lender.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Access Denied",
        description: "You are not allowed to access the lender login.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="py-10 xl:py-20">
      <Head>
        <title>
          Lend Smarter & Grow Your ROI With Our AI Lender Platform | QuoteShack
        </title>
        <meta
          name="description"
          content="Join QuoteShack's lender network and access prequalified, risk-assessed borrowers that match your lending criteria."
        />
      </Head>
      <Section className="relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute -right-64 top-0 -z-10 h-[500px] w-[500px] rounded-full bg-violet-100/50 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 -z-10 h-[400px] w-[400px] rounded-full bg-purple-100/50 blur-3xl" />

        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="mx-auto max-w-5xl space-y-6 px-4 text-center"
        >
          <p className="inline-block rounded-full bg-violet-100 px-4 py-1.5 text-sm font-semibold text-violet-700 md:text-base">
            FOR LENDERS
          </p>

          <div className="mt-5">
            <h1 className="qs-heading block bg-gradient-to-r from-violet-700 to-purple-600 bg-clip-text text-2xl font-bold text-transparent opacity-90 md:text-3xl lg:text-4xl">
              Lend Smarter, Not Harder With Our Lender Platform
            </h1>
          </div>

          <p className="mx-auto max-w-4xl leading-relaxed opacity-70 md:text-lg lg:text-xl">
            QuoteShack allows digital lenders to open a smarter, more profitable
            lending pipeline by matching them to pre-qualified borrowers that
            align with their lending criteria.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 pt-8 sm:flex-row">
            <button
              onClick={handleGetStartedClick}
              className="flex w-full transform items-center justify-center gap-2 rounded-full bg-violet-600 px-10 py-4 font-bold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:bg-violet-700 hover:shadow-violet-200 sm:w-auto"
            >
              <span className="text-center">
                Find A Loan Now, It&apos;s Free
              </span>
              <ArrowRight className="h-5 w-5" />
            </button>

            <button
              onClick={handleLoginClick}
              className="flex w-full items-center justify-center gap-2 rounded-full border-2 border-violet-200 px-8 py-3 font-medium text-violet-700 transition duration-300 ease-in-out hover:border-violet-300 hover:bg-violet-50 sm:w-auto"
            >
              Login
            </button>
          </div>
          {/* <div className="pt-6 flex flex-col sm:flex-row gap-5 justify-center">
            <Button
            onClick={() => router.push("/lender/register")}
              className="group flex items-center justify-center gap-2 py-3 px-8 rounded-lg bg-gradient-to-r from-violet-600 to-purple-600 text-white font-medium hover:shadow-lg hover:shadow-violet-200 transition duration-300 ease-in-out"
            >
              Get Started, It&apos;s Free
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            <button
              onClick={handleLoginClick}
              className="flex items-center justify-center gap-2 py-3 px-8 rounded-lg border-2 border-violet-200 text-violet-700 font-medium hover:border-violet-300 hover:bg-violet-50 transition duration-300 ease-in-out"
            >
              Login
            </button>
          </div> */}
        </motion.div>
      </Section>
      {/* Main Value Proposition */}
      <Section className="py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mx-auto max-w-6xl px-4 text-center"
        >
          <h2 className="qs-heading mb-6 bg-gradient-to-r from-violet-700 to-purple-600 bg-clip-text text-3xl font-bold text-transparent lg:text-4xl">
            Accelerate Decision-Making & Skyrocket Your ROI
          </h2>
          <p className="mx-auto mb-12 max-w-4xl text-gray-600 md:text-lg">
            Are manual reviews, poor-quality leads and complicated systems
            choking your landing pipeline? Our lender platform delivers
            pre-qualified, borrower-ready applicants, automates the heavy
            lifting, and speeds up decision-making — all while protecting your
            bottom line. Whether you are a financial institution, credit union,
            fintech lender, auto lender or personal loan provider, our lender AI
            tool was built for you.
          </p>
        </motion.div>
      </Section>
      {/* Benefits Grid */}
      <Section className="bg-gradient-to-b from-white to-violet-50 py-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid gap-8 md:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="rounded-xl bg-white p-8 shadow-sm"
            >
              <h3 className="mb-4 text-xl font-semibold text-violet-700">
                Plug Into a Borrower-Ready Pipeline
              </h3>
              <p className="text-gray-600">
                We connect you with qualified applicants who are not only ready
                to borrow but also fit your credit parameters.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="rounded-xl bg-white p-8 shadow-sm"
            >
              <h3 className="mb-4 text-xl font-semibold text-violet-700">
                Streamline Risk And Decision-Making
              </h3>
              <p className="text-gray-600">
                Our lender AI tool pre-analyzes risk profiles so you can approve
                faster without compromising due diligence.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              className="rounded-xl bg-white p-8 shadow-sm"
            >
              <h3 className="mb-4 text-xl font-semibold text-violet-700">
                Maximize Your Lending ROI
              </h3>
              <p className="text-gray-600">
                Expand your personal, auto, and home loan offerings and scale
                your lending capacity without growing your back office.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
              className="rounded-xl bg-white p-8 shadow-sm"
            >
              <h3 className="mb-4 text-xl font-semibold text-violet-700">
                Stay Secure & In Control
              </h3>
              <p className="text-gray-600">
                Whether you&apos;re a digital lender or investor looking for
                leads, you get to set the lending criteria, and we ensure every
                applicant we deliver matches your specific requirements. With
                our secure lender platform, all data is encrypted end-to-end,
                giving you full oversight and control while protecting sensitive
                borrower and business information.
              </p>
            </motion.div>
          </div>
        </div>
      </Section>
      {/* Final CTA Section */}
      <Section className="bg-gradient-to-b from-violet-50 to-white py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mx-auto max-w-6xl px-4 text-center"
        >
          <h2 className="qs-heading mb-6 bg-gradient-to-r from-violet-700 to-purple-600 bg-clip-text text-3xl font-bold text-transparent lg:text-4xl">
            We Make It Easy To Stay Ahead
          </h2>
          <p className="mx-auto mb-12 max-w-4xl text-gray-600 md:text-lg">
            Track loan performance, communicate with applicants, and manage
            every stage from a centralized dashboard. Our lender AI platform
            does the heavy lifting so you can focus on scaling your business and
            maximizing returns.
          </p>
          <Button
            onClick={handleSignUpClick}
            className="rounded-lg bg-violet-600 px-8 py-6 text-lg font-semibold text-white shadow-lg transition-all duration-200 hover:bg-violet-700 hover:shadow-xl"
            size="lg"
          >
            Sign Up Now
          </Button>
        </motion.div>
      </Section>{" "}
      <Section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-50 via-white to-violet-50 opacity-50" />
        <div className="relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-5xl space-y-6 px-4 text-center"
          >
            <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-violet-50 px-4 py-2 text-sm font-semibold text-violet-600"></span>
            <h1 className="qs-heading bg-gradient-to-r from-violet-700 to-violet-900 bg-clip-text text-2xl font-bold text-transparent md:text-3xl lg:text-2xl xl:text-4xl">
              Simple, Transparent Pricing
            </h1>

            <p className="md:text-md mx-auto max-w-3xl text-lg leading-relaxed text-gray-600">
              Choose the access model that fits your role on QuoteShack
            </p>
            <>
              <div className="mx-auto flex max-w-3xl justify-center">
                <div className="grid w-full justify-center gap-8 md:grid-cols-2">
                  {/* BASIC PLAN */}
                  <Card className="relative flex min-h-[500px] w-[368px] flex-col justify-between rounded-[8.44px] border border-[#E5E7EB] bg-white">
                    <CardHeader className="px-5 pb-4 pt-5">
                      <div className="mb-2 flex items-center gap-3">
                        <div className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-[#D1FAE5] text-[#10B981]">
                          <Zap className="h-5 w-5" />
                        </div>
                      </div>

                      <div className="text-left">
                        <CardTitle className="text-[18px] font-semibold text-[#111827]">
                          Basic
                        </CardTitle>
                        <CardDescription className="mb-5 mt-1 text-[14px] text-[#6B7280]">
                          Perfect for getting started
                        </CardDescription>
                      </div>

                      <div className="mb-6">
                        <span className="text-[38px] font-bold text-[#22C55E]">
                          $25
                        </span>
                        <span className="ml-1 text-gray-500">/month</span>
                      </div>
                    </CardHeader>

                    <CardContent className="flex flex-1 flex-col justify-between px-4 pb-10 pt-4">
                      <ul className="space-y-2 text-sm text-[#111827]">
                        <li className="flex gap-3">
                          <Check className="h-4 w-4 text-[#10B981]" /> Access to
                          lending pool
                        </li>
                        <li className="flex gap-3">
                          <Check className="h-4 w-4 text-[#10B981]" /> Collect
                          borrower documents
                        </li>
                        <li className="flex gap-3">
                          <Check className="h-4 w-4 text-[#10B981]" /> Chat with
                          borrowers
                        </li>
                      </ul>
                    </CardContent>
                  </Card>

                  {/* STANDARD PLAN */}
                  <Card className="relative flex min-h-[500px] w-[368px] flex-col justify-between border-2 border-violet-400 bg-white">
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <span className="rounded-full bg-violet-600 px-4 py-1 text-xs font-medium text-white">
                        Most Popular
                      </span>
                    </div>

                    <CardHeader className="px-5 pb-4 pt-5">
                      <div className="mb-2 flex items-center gap-3">
                        <div className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-violet-100 text-violet-600">
                          <Crown className="h-5 w-5" />
                        </div>
                      </div>

                      <CardTitle className="text-[18px] font-semibold text-gray-900">
                        Standard
                      </CardTitle>
                      <CardDescription className="mb-5 text-sm text-gray-500">
                        Most popular for growing lenders
                      </CardDescription>

                      <div className="mt-4">
                        <span className="text-[38px] font-bold text-violet-600">
                          $49
                        </span>
                        <span className="ml-1 text-gray-500">/month</span>
                      </div>
                    </CardHeader>

                    <CardContent className="flex flex-1 flex-col justify-between px-4 pb-10 pt-4">
                      <ul className="space-y-2 text-sm text-[#111827]">
                        <li className="flex gap-3">
                          <Check className="h-4 w-4 text-violet-500" /> Access
                          to lending pool
                        </li>
                        <li className="flex gap-3">
                          <Check className="h-4 w-4 text-violet-500" /> Collect
                          borrower documents
                        </li>
                        <li className="flex gap-3">
                          <Check className="h-4 w-4 text-violet-500" /> Chat
                          with borrowers
                        </li>
                        <li className="flex gap-3">
                          <Check className="h-4 w-4 text-violet-500" /> Risk
                          assessment reports
                        </li>
                        <li className="flex gap-3">
                          <Check className="h-4 w-4 text-violet-500" />{" "}
                          Analytics reports
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </>
            {/* Pricing Help CTA */}
            <div className="mt-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
              >
                {/* soft background */}
                <div className="absolute inset-0 bg-gradient-to-br from-violet-50 via-white to-violet-50 opacity-60" />

                <div className="relative space-y-4 px-6 py-10 text-center md:px-12 md:py-14">
                  <div className="flex items-center justify-center gap-2 text-lg font-semibold text-gray-900 md:text-xl">
                    <span className="text-violet-600">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="icon icon-tabler icons-tabler-outline icon-tabler-trending-up"
                      >
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M3 17l6 -6l4 4l8 -8" />
                        <path d="M14 7l7 0l0 7" />
                      </svg>
                    </span>
                    Have questions about pricing?
                  </div>

                  <p className="mx-auto max-w-2xl text-gray-600">
                    Our team is here to help you choose the right plan for your
                    needs.
                  </p>

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        // you can replace this with router.push or modal trigger
                        window.dispatchEvent(
                          new CustomEvent("open-loanee-modal")
                        );
                      }}
                      className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-6 py-3 font-semibold text-gray-900 transition hover:bg-gray-50"
                    >
                      Contact Sales
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </Section>
      {/* FAQ Section */}
      <Section className="bg-gradient-to-b from-white to-violet-50 py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mx-auto max-w-6xl"
        >
          <h2 className="qs-heading mb-12 bg-gradient-to-r from-violet-700 to-purple-600 bg-clip-text px-4 text-center text-2xl font-bold text-transparent opacity-90 lg:text-4xl">
            Lender commonly asked questions
          </h2>
          <Faq data={faqData.lenders} />
        </motion.div>
      </Section>
      <Section className="relative mx-auto mt-20 max-w-7xl overflow-hidden rounded-3xl bg-gradient-to-r from-violet-600 to-purple-600 py-16 text-white">
        <div className="absolute right-0 top-0 opacity-10">
          <svg width="400" height="400" viewBox="0 0 200 200">
            <path
              fill="white"
              d="M42.7,-76.4C53.2,-67.8,58.8,-52.6,65.5,-38.7C72.2,-24.8,80,-12.4,79.8,-0.1C79.6,12.1,71.3,24.2,62.6,34.9C53.9,45.6,44.8,54.8,33.7,63.1C22.7,71.4,9.8,78.7,-3.9,84.8C-17.5,90.8,-35,95.7,-47.8,89.8C-60.5,83.9,-68.5,67.3,-74.3,51.5C-80.1,35.7,-83.7,20.6,-83.9,5.5C-84.1,-9.6,-80.8,-24.7,-73.3,-37.9C-65.8,-51.1,-54.1,-62.3,-41,-70.8C-27.9,-79.3,-13.9,-85.1,1.2,-87.1C16.3,-89.1,32.3,-85,42.7,-76.4Z"
              transform="translate(100 100)"
            />
          </svg>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="relative z-10 mx-auto max-w-5xl space-y-6 px-4 text-center"
        >
          <p className="inline-block rounded-full bg-white/10 px-4 py-1.5 font-semibold text-violet-200 backdrop-blur-sm">
            Ready to get started?
          </p>

          <div className="mt-5">
            <h2 className="block text-center text-2xl font-bold opacity-90 lg:text-4xl">
              Let&apos;s plan your finances the right way
            </h2>
          </div>

          <div className="flex flex-col justify-center gap-5 pt-8 sm:flex-row">
            <Button
              onClick={handleSignUpClick}
              className="rounded-lg bg-white px-8 py-6 text-lg font-medium text-violet-700 transition duration-300 ease-in-out hover:text-white hover:shadow-lg"
              size="lg"
            >
              Become a Lender
            </Button>
            <button
              onClick={handleLoginClick}
              className="flex items-center justify-center gap-2 rounded-lg border-2 border-white/30 px-8 py-3 font-medium text-white backdrop-blur-sm transition duration-300 ease-in-out hover:bg-white/10"
            >
              Login
            </button>
          </div>
        </motion.div>
      </Section>
    </div>
  );
}
