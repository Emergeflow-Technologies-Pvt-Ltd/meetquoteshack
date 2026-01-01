"use client";
import { memo } from "react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import Section from "@/components/shared/section";

interface Props {
  data: { question: string; answer: string }[];
}

const Faq = memo(({ data }: Props) => {
  return (
    <Section id="faq" header="FAQ" className="max-w-screen-lg py-20">
      <div className="mx-auto max-w-2xl space-y-4 px-4 text-center lg:px-0">
        <p className="opacity-70">
          Get answers to all questions you have and boost your knowledge so you
          can save, invest and spend smarter. See all questions here!
        </p>
      </div>
      <Accordion type="multiple">
        {data.map((faq, index) => (
          <AccordionItem key={index} value={`faq-${index}`}>
            <AccordionTrigger aria-label={`Accordion ${index + 1}`}>
              <strong>{faq.question}</strong>
            </AccordionTrigger>
            <AccordionContent>
              <p>{faq.answer}</p>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </Section>
  );
});

Faq.displayName = "Faq";

export default Faq;
