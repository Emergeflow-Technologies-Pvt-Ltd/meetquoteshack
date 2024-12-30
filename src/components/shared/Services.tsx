import { serviceList } from "@/data/services";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Section from "@/components/shared/section";

export const ServicesSection = () => {
  return (
    <Section id="services" header="Services" className="py-20">
      <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-6 w-full max-w-screen-lg mx-auto">
        {serviceList.map(({ title, description }) => (
          <Card  key={title} className="bg-muted h-full relative">
            <CardHeader>
              <CardTitle>{title}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </Section>
  );
};
