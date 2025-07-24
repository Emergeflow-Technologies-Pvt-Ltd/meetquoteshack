"use client";
import React, { FC } from "react";
import Link from "next/link";
import Image from "next/image";
import { FileStack } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "../ui/button";
import Section from "./section";
import { useSession } from "next-auth/react";
import { useToast } from "@/hooks/use-toast";

interface ImageProps {
  src: string;
  index?: number;
}

const images = [
  {
    src: "https://i.imgur.com/fbpDNIq.jpg",
  },
  {
    src: "https://i.imgur.com/PHE8Foy.jpg",
  },
  {
    src: "https://i.imgur.com/inGiH1d.jpg",
  },
];

const HeroImage: FC<ImageProps> = ({ src, index = 0 }) => (
  <motion.div
    initial={{
      opacity: 0,
      y: index * 50,
    }}
    whileInView={{ opacity: 1, y: 0, transition: { duration: 1, delay: 0.3 } }}
    whileTap={{ scale: 0.9 }}
    whileHover={{ scale: 1.05 }}
    viewport={{ once: true }}
  >
    <Image
      src={src}
      alt="hero"
      width={500}
      height={500}
      layout="responsive"
      className={`w-full md:max-w-[600px] h-auto rounded-xl opacity-90 ${
        index === 0 ? "" : index === 1 ? "mt-10" : "mt-20"
      }`}
    />
  </motion.div>
);

export default function Hero() {
  const { data: session } = useSession();
  const { toast } = useToast();

  const handleBecomeLenderClick = () => {
    const role = session?.user?.role;

    if (!session) {
      // Not logged in: allow navigation
      window.location.href = "/lender/register";
    } else if (role === "LOANEE") {
      toast({
        title: "Switch Account",
        description:
          "Please logout of your Loanee account before becoming a lender.",
        variant: "destructive",
      });
    } else if (role === "LENDER") {
      toast({
        title: "Already Logged In",
        description: "You are already logged in as a lender.",
      });
    } else {
      // If another role or unknown: proceed
      window.location.href = "/lender/register";
    }
  };

  return (
    <Section id="hero" className="relative overflow-hidden pt-48 mb-32 w-full">
      <div className="container mx-auto">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-10 px-4 lg:px-0">
          <div className="max-w-3xl text-center lg:text-start">
            <div className="flex items-center gap-1 justify-center md:justify-start">
              <FileStack size={20} />
              <p className="inline-block font-semibold md:text-lg">
                Simplify your loan application
              </p>
            </div>

            <div className="mt-5">
              <h1 className="qs-heading block font-bold opacity-90 text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-black dark:text-white">
                The World&apos;s Smartest Quick
                <span className="inline-block text-primary px-2">
                  Loan Matching
                </span>
                Platform
              </h1>
            </div>

            <div className="my-5">
              <p className="max-w-2xl md:text-lg opacity-70 text-gray-700 dark:text-gray-300">
                QuoteShack matches borrowers with the best quick loan types,
                lenders and rates based on their financial behaviour.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Link href="/loan-application">
                <Button
                  className="bg-violet-600 hover:bg-violet-700 text-white px-8 py-6 text-lg rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 font-semibold"
                  size="lg"
                >
                  Find A Loan
                </Button>
              </Link>

              <Button
                variant="outline"
                className="border-violet-600 text-violet-600 hover:bg-violet-50 px-8 py-6 text-lg rounded-lg transition-all duration-200 font-semibold"
                size="lg"
                onClick={handleBecomeLenderClick}
              >
                Become a lender
              </Button>
            </div>

            <div className="mt-10 flex items-center gap-6 justify-center md:justify-start">
              <div className="flex -space-x-2">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-200 to-blue-200 border-2 border-white"
                  />
                ))}
              </div>
              <div className="text-sm">
                <p className="font-semibold text-gray-900">
                  Trusted by 500+ users
                </p>
                <div className="flex items-center gap-1 text-yellow-500">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                  <span className="ml-1 text-gray-700">4.8/5</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-5">
            {images.map((image, index) => (
              <HeroImage key={index} {...image} index={index} />
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}
