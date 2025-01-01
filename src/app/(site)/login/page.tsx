"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import Section from "@/components/shared/section";
import Image from "next/image";
import Link from "next/link";

export default function Login() {
  const handleLogin = async () => {
    await signIn("google", { callbackUrl: "/apply" });
  };

  return (
    <Section>
      <section className="flex flex-col items-center md:flex-row gap-10 my-10 md:my-20 max-w-5xl mx-2 p-4 rounded-lg shadow-lg bg-violet-200 mx-auto">
        <div className="w-full md:w-1/2">
          <Image
            src="https://img.freepik.com/free-vector/hand-drawn-flat-design-ssl-illustration_23-2149277638.jpg?ga=GA1.1.1497262398.1720856532&semt=ais_user"
            alt="hero"
            width={600}
            height={600}
            layout="responsive"
            className="w-full h-auto rounded-xl"
          />
        </div>

        <div className="w-full md:w-1/2 space-y-5 text-center md:text-start">
          <h1 className="text-4xl font-bold">Welcome!</h1>
          <p className="text-lg font-bold">
            To view this page, you must be logged in.
          </p>

          <Button
            onClick={handleLogin}
            variant="default"
            className="font-bold w-full text-lg bg-violet-500 hover:bg-violet-600 text-white py-2 px-4 rounded-lg shadow-lg"
          >
            Login
          </Button>
          <p className="text-xs font-bold">
            By logging in, you agree to our Terms of Service and{" "}
            <Link
              href={"/privacy"}
              className="underline underline-offset-2 text-violet-500 hover:text-violet-600"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </section>
    </Section>
  );
}
