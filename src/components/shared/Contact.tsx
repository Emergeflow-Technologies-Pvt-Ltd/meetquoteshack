"use client";
import React from "react";
import Section from "@/components/shared/section";
import { Mail, MapPin, PhoneOutgoing } from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

const ContactCard = ({
  Icon,
  title,
  content,
  email,
}: {
  Icon: React.ComponentType<unknown>;
  title: string;
  content: string;
  email: string;
}) => (
  <motion.div
    initial={{
      opacity: 0,
      x: 10,
    }}
    whileInView={{
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.7,
        delay: 0.4,
      },
    }}
    whileTap={{ scale: 0.9 }}
    whileHover={{ scale: 1.02 }}
    viewport={{ once: true }}
  >
    <Card className="flex flex-col items-center justify-center text-center">
      <CardHeader>
        <Icon />
      </CardHeader>
      <h2 className="mt-4 text-lg font-bold text-gray-800 dark:text-gray-100">
        {title}
      </h2>
      <CardContent>
        <p className="mt-2 text-gray-500">{content}</p>
        <p className="text-primary-800 mt-2">{email}</p>
      </CardContent>
    </Card>
  </motion.div>
);

export default function Contact() {
  return (
    <Section id="contact" className="px-4 py-10 md:py-20" header="Get In Touch">
      <div className="mt-16 grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-3">
        <ContactCard
          Icon={Mail as React.ComponentType<unknown>}
          title="Email"
          content="Our friendly team is here to help."
          email="admin@meetquoteshack.com"
        />
        <ContactCard
          Icon={MapPin as React.ComponentType<unknown>}
          title="Office"
          content="Come say hello at our office HQ."
          email="777 Hornby St Suite 600 Vancouver BC V6Z 1S4"
        />
        <ContactCard
          Icon={PhoneOutgoing as React.ComponentType<unknown>}
          title="Phone"
          content="Call us directly at our toll-free number."
          email="(639) 309-6004"
        />
      </div>
    </Section>
  );
}
