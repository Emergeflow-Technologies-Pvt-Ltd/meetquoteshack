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
      <div className="mx-auto grid w-full max-w-screen-lg gap-6 sm:grid-cols-2 lg:grid-cols-2">
        {serviceList.map(({ title, description }) => (
          <Card key={title} className="relative h-full bg-muted">
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
