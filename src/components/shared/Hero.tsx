"use client";
import React, { FC } from "react";
import Link from "next/link";
import Image from "next/image";
import { FileStack } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "../ui/button";
import Section from "./section";

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
  return (
    <Section id="hero" className="relative overflow-hidden pt-48 w-full">
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
                Simplify Your Finances by
                <span className="inline-block text-primary px-2">
                  Applying for a loan
                </span>
                with quoteshack
              </h1>
            </div>

            <div className="my-5">
              <p className="max-w-2xl md:text-lg opacity-70 text-gray-700 dark:text-gray-300">
                At QuoteShack we help you find loans faster and get the best
                rates by matching with the appropriate lenders based on your
                credit behavior.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Link href="/apply">
                <Button
                  className="bg-violet-600 hover:bg-violet-700 text-white px-8 py-6 text-lg rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 font-semibold"
                  size="lg"
                >
                  Apply for loan
                </Button>
              </Link>
              <Link href="/become-lender">
                <Button
                  variant="outline"
                  className="border-violet-600 text-violet-600 hover:bg-violet-50 px-8 py-6 text-lg rounded-lg transition-all duration-200 font-semibold"
                  size="lg"
                >
                  Become a lender
                </Button>
              </Link>
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
