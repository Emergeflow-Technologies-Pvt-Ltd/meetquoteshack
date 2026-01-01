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
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
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
    } else if (role === "AGENT") {
      toast({
        title: "Already Logged In",
        description: "You are already logged in as a lender.",
      });
      return;
    } else {
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
        <meta
          name="description"
          content="Join QuoteShack as an agent and refer potential borrowers. Track invites, earn rewards, and help borrowers get access to the right loans."
        />
      </Head>

      <Section className="relative overflow-hidden">
        <div className="absolute -right-64 top-0 -z-10 h-[500px] w-[500px] rounded-full bg-violet-100/50 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 -z-10 h-[400px] w-[400px] rounded-full bg-purple-100/50 blur-3xl" />

        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="mx-auto max-w-5xl space-y-6 px-4 text-center"
        >
          <p className="inline-block rounded-full bg-violet-100 px-4 py-1.5 text-sm font-semibold text-violet-700 md:text-base">
            FOR AGENTS
          </p>

          <div className="mt-5">
            <h1 className="qs-heading block bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-2xl font-bold text-transparent opacity-90 md:text-3xl lg:text-4xl">
              Bring Borrowers, Earn Rewards — Grow With QuoteShack
            </h1>
          </div>

          <p className="mx-auto max-w-4xl leading-relaxed opacity-70 md:text-lg lg:text-xl">
            As an agent, you can refer potential borrowers to QuoteShack, track
            their progress, and earn rewards for successful referrals. We make
            it simple to onboard loanees and follow their application journey.
          </p>

          <div className="flex flex-col justify-center gap-5 pt-6 sm:flex-row">
            <Button
              onClick={handleSignUpClick}
              className="rounded-lg bg-violet-600 px-8 py-6 text-lg font-semibold text-white shadow-lg transition-all duration-200 hover:bg-violet-700 hover:shadow-xl"
              size="lg"
            >
              Become an Agent
            </Button>
            <button
              onClick={handleLoginClick}
              className="flex items-center justify-center gap-2 rounded-lg border-2 border-violet-200 px-8 py-3 font-medium text-violet-700 transition duration-300 ease-in-out hover:border-violet-300 hover:bg-violet-50"
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
          className="mx-auto max-w-6xl px-4 text-center"
        >
          <h2 className="qs-heading mb-6 bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-3xl font-bold text-transparent lg:text-4xl">
            Help People Access Loans — And Get Rewarded
          </h2>
          <p className="mx-auto mb-12 max-w-4xl text-gray-600 md:text-lg">
            Agents play a key role in helping local borrowers get access to
            loans. You refer, we support — together we move faster, help more
            people, and share the rewards.
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
                Refer Easily, Track Progress
              </h3>
              <p className="text-gray-600">
                Invite potential loanees quickly and monitor their application
                status from your agent dashboard.
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
                Earn Referral Rewards
              </h3>
              <p className="text-gray-600">
                Get rewarded for successful referrals — transparent, timely
                payouts based on our policies.
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
                Simplified Onboarding
              </h3>
              <p className="text-gray-600">
                Our forms and guidance reduce friction — onboard loanees with
                minimal effort and higher conversion.
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
                Stay Compliant & Secure
              </h3>
              <p className="text-gray-600">
                We handle KYC and document collection securely so you can focus
                on connecting borrowers to the right products.
              </p>
            </motion.div>
          </div>
        </div>
      </Section>

      {/* CTA */}
      <Section className="bg-gradient-to-b from-violet-50 to-white py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mx-auto max-w-6xl px-4 text-center"
        >
          <h2 className="qs-heading mb-6 bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-3xl font-bold text-transparent lg:text-4xl">
            Ready to start referring borrowers?
          </h2>
          <p className="mx-auto mb-12 max-w-4xl text-gray-600 md:text-lg">
            Sign up as an agent, invite loanees, and watch their loan journey —
            all from your dashboard.
          </p>

          <Button
            onClick={handleSignUpClick}
            className="rounded-lg bg-violet-600 px-8 py-6 text-lg font-semibold text-white shadow-lg transition-all duration-200 hover:bg-violet-700 hover:shadow-xl"
            size="lg"
          >
            Sign Up Now
          </Button>
        </motion.div>
      </Section>

      {/* FAQ */}
      <Section className="bg-gradient-to-b from-white to-violet-50 py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mx-auto max-w-6xl"
        >
          <h2 className="qs-heading mb-12 bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text px-4 text-center text-2xl font-bold text-transparent opacity-90 lg:text-4xl">
            Agent commonly asked questions
          </h2>
          {/* <Faq data={faqData.agents} /> */}
        </motion.div>
      </Section>

      <Section className="relative mx-auto mt-20 max-w-7xl overflow-hidden rounded-3xl bg-gradient-to-r from-violet-600 to-purple-600 py-16 text-white">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="relative z-10 mx-auto max-w-5xl space-y-6 px-4 text-center"
        >
          <p className="inline-block rounded-full bg-white/10 px-4 py-1.5 font-semibold text-violet-200 backdrop-blur-sm">
            Start referring today
          </p>

          <div className="mt-5">
            <h2 className="block text-center text-2xl font-bold opacity-90 lg:text-4xl">
              Bring borrowers. Earn rewards. Make impact.
            </h2>
          </div>

          <div className="flex flex-col justify-center gap-5 pt-8 sm:flex-row">
            <Button
              onClick={handleSignUpClick}
              className="flex items-center justify-center gap-2 rounded-lg border-2 border-violet-200 bg-white px-8 py-3 font-medium text-violet-700 hover:bg-white hover:text-violet-700"
              size="lg"
            >
              Sign Up Now
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>

            <Button
              onClick={handleLoginClick}
              className="flex items-center justify-center gap-2 rounded-lg border-2 border-violet-200 bg-white px-8 py-3 font-medium text-violet-700 hover:bg-white hover:text-violet-700"
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
