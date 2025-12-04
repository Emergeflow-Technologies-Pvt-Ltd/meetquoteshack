"use client";

import Section from "@/components/shared/section";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Head from "next/head";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

export default function Agents() {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };
  
  const router = useRouter();
  const { data: session } = useSession();

  const handleLoginClick = () => {
    const role = session?.user?.role;

    if (role === "AGENT") {
      toast({
        title: "Already Logged In",
        description: "You're already logged in as a lender.",
      });
    } else if (role === "LOANEE") {
      toast({
        title: "Access Denied",
        description:
          "You're logged in as a loanee. Please log out to login as a agent.",
        variant: "destructive",
      });
    } else if (role === "LENDER") {
      toast({
        title: "Access Denied",
        description:
          "You're logged in as a lender. Please log out to login as agent.",
        variant: "destructive",
      });
     } else {
      router.push("/agent/login");
    }
  };

  const handleSignUpClick = () => {
    const role = session?.user?.role;
    if (!role) {
      router.push("/agent/register");
      return;
    }
    else if (role === "AGENT") {
      toast({
        title: "Already Logged In",
        description: "You are already logged in as a lender.",
      });
      return;
    }
    else {
      toast({
        title: "Access Denied",
        description: "You are not allowed to access the agent registration.",
        variant: "destructive",
      });
      return;
    }
  };

  return (
    <div className="py-10 xl:py-20">
      <Head>
        <title>Bring Borrowers Onboard — Become an Agent on QuoteShack</title>
        <meta name="description" content="Join QuoteShack as an agent and refer potential borrowers. Track invites, earn rewards, and help borrowers get access to the right loans." />
      </Head>

      <Section className="relative overflow-hidden">
        <div className="absolute -z-10 w-[500px] h-[500px] rounded-full bg-violet-100/50 blur-3xl top-0 -right-64" />
        <div className="absolute -z-10 w-[400px] h-[400px] rounded-full bg-purple-100/50 blur-3xl -bottom-20 -left-20" />

        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="text-center max-w-5xl mx-auto space-y-6 px-4"
        >
          <p className="inline-block font-semibold text-sm md:text-base bg-violet-100 text-violet-700 px-4 py-1.5 rounded-full">
            FOR AGENTS
          </p>

          <div className="mt-5">
            <h1 className="qs-heading block font-bold opacity-90 text-2xl md:text-3xl lg:text-4xl bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
              Bring Borrowers, Earn Rewards — Grow With QuoteShack
            </h1>
          </div>

          <p className="opacity-70 md:text-lg lg:text-xl max-w-4xl mx-auto leading-relaxed">
            As an agent, you can refer potential borrowers to QuoteShack, track their progress, and earn rewards for successful referrals. We make it simple to onboard loanees and follow their application journey.
          </p>

          <div className="pt-6 flex flex-col sm:flex-row gap-5 justify-center">
            <Button
              onClick= {handleSignUpClick}
              className="bg-violet-600 hover:bg-violet-700 text-white px-8 py-6 text-lg rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 font-semibold"
              size="lg"
            >
              Become an Agent
            </Button>
            <button
              onClick={handleLoginClick}
              className="flex items-center justify-center gap-2 py-3 px-8 rounded-lg border-2 border-violet-200 text-violet-700 font-medium hover:border-violet-300 hover:bg-violet-50 transition duration-300 ease-in-out"
            >
              Login
            </button>
          </div>
        </motion.div>
      </Section>

      {/* Value Prop */}
      <Section className="py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto text-center px-4"
        >
          <h2 className="qs-heading text-3xl lg:text-4xl font-bold mb-6 bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
            Help People Access Loans — And Get Rewarded
          </h2>
          <p className="text-gray-600 md:text-lg max-w-4xl mx-auto mb-12">
            Agents play a key role in helping local borrowers get access to loans. You refer, we support — together we move faster, help more people, and share the rewards.
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
              <h3 className="text-xl font-semibold mb-4 text-violet-700">Refer Easily, Track Progress</h3>
              <p className="text-gray-600">Invite potential loanees quickly and monitor their application status from your agent dashboard.</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-white p-8 rounded-xl shadow-sm"
            >
              <h3 className="text-xl font-semibold mb-4 text-violet-700">Earn Referral Rewards</h3>
              <p className="text-gray-600">Get rewarded for successful referrals — transparent, timely payouts based on our policies.</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              className="bg-white p-8 rounded-xl shadow-sm"
            >
              <h3 className="text-xl font-semibold mb-4 text-violet-700">Simplified Onboarding</h3>
              <p className="text-gray-600">Our forms and guidance reduce friction — onboard loanees with minimal effort and higher conversion.</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
              className="bg-white p-8 rounded-xl shadow-sm"
            >
              <h3 className="text-xl font-semibold mb-4 text-violet-700">Stay Compliant & Secure</h3>
              <p className="text-gray-600">We handle KYC and document collection securely so you can focus on connecting borrowers to the right products.</p>
            </motion.div>
          </div>
        </div>
      </Section>

      {/* CTA */}
      <Section className="py-16 bg-gradient-to-b from-violet-50 to-white">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto text-center px-4"
        >
          <h2 className="qs-heading text-3xl lg:text-4xl font-bold mb-6 bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
            Ready to start referring borrowers?
          </h2>
          <p className="text-gray-600 md:text-lg max-w-4xl mx-auto mb-12">
            Sign up as an agent, invite loanees, and watch their loan journey — all from your dashboard.
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

      {/* FAQ */}
      <Section className="py-16 bg-gradient-to-b from-white to-violet-50">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto"
        >
          <h2 className="qs-heading text-center font-bold opacity-90 text-2xl lg:text-4xl px-4 bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent mb-12">
            Agent commonly asked questions
          </h2>
          {/* <Faq data={faqData.agents} /> */}
        </motion.div>
      </Section>

      <Section className="mt-20 py-16 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-3xl mx-auto max-w-7xl overflow-hidden relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center max-w-5xl mx-auto space-y-6 px-4 relative z-10"
        >
          <p className="inline-block font-semibold text-violet-200 bg-white/10 px-4 py-1.5 rounded-full backdrop-blur-sm">
            Start referring today
          </p>

          <div className="mt-5">
            <h2 className="text-center block font-bold opacity-90 text-2xl lg:text-4xl">
              Bring borrowers. Earn rewards. Make impact.
            </h2>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row gap-5 justify-center">
            <Button
  onClick={handleSignUpClick}
  className="flex items-center justify-center gap-2 py-3 px-8 rounded-lg border-2 border-violet-200 text-violet-700 font-medium bg-white hover:bg-white hover:text-violet-700"
  size="lg"
>
  Sign Up Now
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />

</Button>

            <Button
  onClick={handleLoginClick}
  className="bg-white hover:bg-white hover:text-violet-700 flex items-center justify-center gap-2 py-3 px-8 rounded-lg border-2 border-violet-200 text-violet-700 font-medium"
  size="lg"
>
  Login
</Button>

          </div>
        </motion.div>
      </Section>
    </div>
  );
}
