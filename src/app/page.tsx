import Contact from "@/components/shared/Contact";
import { CreateAccount } from "@/components/shared/CreateAccount";
import EmailUpdate from "@/components/shared/EmailUpdate";
import Faq from "@/components/shared/Faq";
import ChooseUs from "@/components/shared/Features";
import Footer from "@/components/shared/Footer";
import Hero from "@/components/shared/Hero";
import Security from "@/components/shared/Security";
import { ServicesSection } from "@/components/shared/Services";
import faq from "@/data/faq";

export default function Home() {
  return (
    <div>
      <Hero />
      <ChooseUs />
      <Security />
      <ServicesSection />
      <Faq data={faq.general} />
      <CreateAccount />
      <Contact />
      <EmailUpdate />
      <Footer />
    </div>
  );
}

