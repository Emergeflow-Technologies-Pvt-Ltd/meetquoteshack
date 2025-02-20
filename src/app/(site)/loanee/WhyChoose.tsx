"use client";
import Section from "@/components/shared/section";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import Image from "next/image";
import React from "react";

const benefits = [
  {
    imgSrc: "https://cdn-icons-png.freepik.com/256/17001/17001578.png",
    title: "Easy and Quick Application",
    description:
      "Our application is very simple and can competed within few minutes.",
  },
  {
    imgSrc: "https://cdn-icons-png.freepik.com/256/12473/12473067.png",
    title: "Get the best rates",
    description: "Our system helps you to find the best loan rate based on your financial behavior.",
  },
  {
    imgSrc: "https://cdn-icons-png.freepik.com/256/17045/17045915.png",
    title: "Track your application status",
    description: "We help you track every stage of loan processing from application till approval.",
  },
];

const WhyChoose = () => {
  return (
    <div className="py-10">
      <Section>
        <section className="max-w-4xl mx-auto text-center space-y-6">
          <h1 className="qs-heading text-2xl lg:text-3xl font-bold">
            Why Choose Quoteshack for Your Online Personal Loan?
          </h1>
          <p className="px-10 opacity-80">
            You&apos;re more than your credit score—Our model looks at factors
            such as your education and employment to help you get a rate you
            deserve.
          </p>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10 px-5">
          {benefits.map((benefit, index) => (
            <Card
              key={index}
              className="bg-white shadow-xl hover:shadow-2xl rounded-2xl p-10 cursor-pointer transition duration-400 transform hover:scale-105"
            >
              <CardHeader className="p-5 bg-primary-50 hover:bg-primary-100 rounded-full w-fit mx-auto">
                <Image
                  src={benefit.imgSrc}
                  width={100}
                  height={100}
                  alt={benefit.title}
                  className="h-10 w-10"
                />
              </CardHeader>
              <CardContent className="text-center">
                <h2 className="text-xl font-semibold mb-2">{benefit.title}</h2>
                <p className="opacity-70">{benefit.description}</p>
              </CardContent>
            </Card>
          ))}
        </section>
      </Section>
    </div>
  );
};

export default WhyChoose;