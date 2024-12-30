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
    <Section id="faq" header="FAQ" className="py-20 max-w-screen-lg">
      <div className="text-center space-y-4 max-w-2xl mx-auto px-4 lg:px-0">
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
