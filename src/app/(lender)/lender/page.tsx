"use client";
import Section from "@/components/shared/section";
import Faq from "@/components/shared/Faq";
import faqData from "@/data/faq";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Head from "next/head";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";


export default function Lenders() {

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const router = useRouter();
  const { data: session } = useSession();

  const handleGetStartedClick = () => {
    const role = session?.user?.role;

    if (role === "LOANEE") {
      router.push("/loan-application");
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
    }
    else if (role === "LENDER") {
      toast({
        title: "Already Logged In",
        description: "You are already logged in as a lender.",
      });
      return;
    }
    else {
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
        <title>Lend Smarter & Grow Your ROI With Our AI Lender Platform | QuoteShack</title>
        <meta name="description" content="Join QuoteShack's lender network and access prequalified, risk-assessed borrowers that match your lending criteria." />
      </Head>
      <Section className="relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute -z-10 w-[500px] h-[500px] rounded-full bg-violet-100/50 blur-3xl top-0 -right-64" />
        <div className="absolute -z-10 w-[400px] h-[400px] rounded-full bg-purple-100/50 blur-3xl -bottom-20 -left-20" />
        
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="text-center max-w-5xl mx-auto space-y-6 px-4"
        >
          <p className="inline-block font-semibold text-sm md:text-base bg-violet-100 text-violet-700 px-4 py-1.5 rounded-full">
            FOR LENDERS
          </p>

          <div className="mt-5">
            <h1 className="qs-heading block font-bold opacity-90 text-2xl md:text-3xl lg:text-4xl bg-gradient-to-r from-violet-700 to-purple-600 bg-clip-text text-transparent">
              Lend Smarter, Not Harder With Our Lender Platform
            </h1>
          </div>

          <p className="opacity-70 md:text-lg lg:text-xl max-w-4xl mx-auto leading-relaxed">
            QuoteShack allows digital lenders to open a smarter, more profitable lending pipeline by
            matching them to pre-qualified borrowers that align with their lending criteria.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-8">
              <button
                onClick={handleGetStartedClick}
                className="w-full sm:w-auto flex items-center justify-center gap-2 py-4 px-10 rounded-full bg-violet-600 text-white font-bold hover:bg-violet-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-violet-200"
              >
                <span className="text-center">
                  Find A Loan Now, It&apos;s Free
                </span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <button
                onClick={handleLoginClick}
                className="flex items-center w-full sm:w-auto justify-center gap-2 py-3 px-8 rounded-full border-2 border-violet-200 text-violet-700 font-medium hover:border-violet-300 hover:bg-violet-50 transition duration-300 ease-in-out"
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
          className="max-w-6xl mx-auto text-center px-4"
        >
          <h2 className="qs-heading text-3xl lg:text-4xl font-bold mb-6 bg-gradient-to-r from-violet-700 to-purple-600 bg-clip-text text-transparent">
            Accelerate Decision-Making & Skyrocket Your ROI
          </h2>
          <p className="text-gray-600 md:text-lg max-w-4xl mx-auto mb-12">
            Are manual reviews, poor-quality leads and complicated systems choking your landing
            pipeline? Our lender platform delivers pre-qualified, borrower-ready applicants, automates the
            heavy lifting, and speeds up decision-making — all while protecting your bottom line. Whether
            you are a financial institution, credit union, fintech lender, auto lender or personal loan
            provider, our lender AI tool was built for you.
          </p>
        </motion.div>
      </Section>

      {/* Benefits Grid */}
      <Section className="py-16 bg-gradient-to-b from-white to-violet-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="bg-white p-8 rounded-xl shadow-sm"
            >
              <h3 className="text-xl font-semibold mb-4 text-violet-700">Plug Into a Borrower-Ready Pipeline</h3>
              <p className="text-gray-600">
                We connect you with qualified applicants who are not only ready to borrow but also fit your
                credit parameters.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-white p-8 rounded-xl shadow-sm"
            >
              <h3 className="text-xl font-semibold mb-4 text-violet-700">Streamline Risk And Decision-Making</h3>
              <p className="text-gray-600">
                Our lender AI tool pre-analyzes risk profiles so you can approve faster without compromising
                due diligence.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              className="bg-white p-8 rounded-xl shadow-sm"
            >
              <h3 className="text-xl font-semibold mb-4 text-violet-700">Maximize Your Lending ROI</h3>
              <p className="text-gray-600">
                Expand your personal, auto, and home loan offerings and scale your lending capacity without
                growing your back office.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
              className="bg-white p-8 rounded-xl shadow-sm"
            >
              <h3 className="text-xl font-semibold mb-4 text-violet-700">Stay Secure & In Control</h3>
              <p className="text-gray-600">
                Whether you&apos;re a digital lender or investor looking for leads, you get to set the lending criteria,
                and we ensure every applicant we deliver matches your specific requirements. With our secure
                lender platform, all data is encrypted end-to-end, giving you full oversight and control while
                protecting sensitive borrower and business information.
              </p>
            </motion.div>
          </div>
        </div>
      </Section>

      {/* Final CTA Section */}
      <Section className="py-16 bg-gradient-to-b from-violet-50 to-white">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto text-center px-4"
        >
          <h2 className="qs-heading text-3xl lg:text-4xl font-bold mb-6 bg-gradient-to-r from-violet-700 to-purple-600 bg-clip-text text-transparent">
            We Make It Easy To Stay Ahead
          </h2>
          <p className="text-gray-600 md:text-lg max-w-4xl mx-auto mb-12">
            Track loan performance, communicate with applicants, and manage every stage from a
            centralized dashboard. Our lender AI platform does the heavy lifting so you can focus on scaling
            your business and maximizing returns.
          </p>
          <Button
              onClick= {handleSignUpClick}
              className="bg-violet-600 hover:bg-violet-700 text-white px-8 py-6 text-lg rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 font-semibold"
              size="lg"
            >
              Sign Up Now
            </Button>
        </motion.div>
      </Section>

      {/* FAQ Section */}
      <Section className="py-16 bg-gradient-to-b from-white to-violet-50">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto"
        >
          <h2 className="qs-heading text-center font-bold opacity-90 text-2xl lg:text-4xl px-4 bg-gradient-to-r from-violet-700 to-purple-600 bg-clip-text text-transparent mb-12">
            Lender commonly asked questions
          </h2>
          <Faq data={faqData.lenders} />
        </motion.div>
      </Section>

      <Section className="mt-20 py-16 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-3xl mx-auto max-w-7xl overflow-hidden relative">
        <div className="absolute top-0 right-0 opacity-10">
          <svg width="400" height="400" viewBox="0 0 200 200">
            <path fill="white" d="M42.7,-76.4C53.2,-67.8,58.8,-52.6,65.5,-38.7C72.2,-24.8,80,-12.4,79.8,-0.1C79.6,12.1,71.3,24.2,62.6,34.9C53.9,45.6,44.8,54.8,33.7,63.1C22.7,71.4,9.8,78.7,-3.9,84.8C-17.5,90.8,-35,95.7,-47.8,89.8C-60.5,83.9,-68.5,67.3,-74.3,51.5C-80.1,35.7,-83.7,20.6,-83.9,5.5C-84.1,-9.6,-80.8,-24.7,-73.3,-37.9C-65.8,-51.1,-54.1,-62.3,-41,-70.8C-27.9,-79.3,-13.9,-85.1,1.2,-87.1C16.3,-89.1,32.3,-85,42.7,-76.4Z" transform="translate(100 100)" />
          </svg>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center max-w-5xl mx-auto space-y-6 px-4 relative z-10"
        >
          <p className="inline-block font-semibold text-violet-200 bg-white/10 px-4 py-1.5 rounded-full backdrop-blur-sm">
            Ready to get started?
          </p>

          <div className="mt-5">
            <h2 className="text-center block font-bold opacity-90 text-2xl lg:text-4xl">
              Let&apos;s plan your finances the right way
            </h2>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row gap-5 justify-center">
            <Button
              onClick= {handleSignUpClick}
              className="px-8 py-6 text-lg rounded-lg bg-white text-violet-700 font-medium hover:shadow-lg hover:shadow-violet-900/20 transition duration-300 ease-in-out"
              size="lg"
            >
              Become a Lender
            </Button>
            <button
              onClick={handleLoginClick}
              className="flex items-center justify-center gap-2 py-3 px-8 rounded-lg border-2 border-white/30 text-white font-medium hover:bg-white/10 transition duration-300 ease-in-out backdrop-blur-sm"
            >
              Login
            </button>
          </div>
        </motion.div>
      </Section>
    </div>
  );
}
