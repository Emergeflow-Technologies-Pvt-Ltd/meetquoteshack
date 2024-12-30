import Image from "next/image";
import Section from "@/components/shared/section";
import { Fingerprint, ShieldCheck } from "lucide-react";

const images = [
  {
    src: "https://img.freepik.com/free-vector/payment-receipt-payroll-electronic-bill-online-buying-concept_39422-719.jpg",
    alt: "hand-drawn-female-team-illustration",
  },
  {
    src: "https://img.freepik.com/free-vector/isometric-business-concept-man-thinking-crm-system-artificial-intelligence-robot-ai_39422-771.jpg",
    alt: "",
  },
];

function Security() {
  return (
    <div className="py-10 lg:py-20 bg-violet-100 dark:bg-violet-900">
      <Section className="flex items-center gap-10 px-4 md:px-0 flex-col md:flex-row">
        <section className="w-full md:w-1/2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="">
              <Image
                src="https://img.freepik.com/free-vector/cryptocurrency-mining-isometric_107791-252.jpg"
                alt="coworking-illustration"
                width={500}
                height={500}
                className={`w-full md:max-w-[600px] rounded-xl opacity-90 object-cover`}
              />
            </div>

            <div className="space-y-6">
              {images.map((image, index) => (
                <div key={index}>
                  <Image
                    src={image.src}
                    alt={image.alt}
                    width={500}
                    height={500}
                    className={`w-full md:max-w-[600px] object-cover rounded-xl opacity-90`}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="w-full md:w-1/2 space-y-4">
          <p className="font-bold md:text-lg text-primary-500">Security</p>
          <h2 className="qs-heading text-3xl lg:text-4xl font-bold">
            Take The Stress Out Of Managing Property And Money
          </h2>
          <p className="opacity-80 md:text-lg">
            Ensuring the security of our application is of utmost importance. We
            implement various measures to protect user data and maintain the
            integrity of our systems. From encryption to regular security
            audits, our team is dedicated to safeguarding against potential
            threats and vulnerabilities.
          </p>

          <div className="flex flex-col gap-4 mt-4 opacity-80 md:text-lg">
            <div className="flex items-center gap-2">
              <div className="p-3 rounded-lg bg-primary-100 hover:bg-primary-200 transition duration-300">
                <Fingerprint className="text-primary-500" size={20} />
              </div>
              <div>
                <h4>Pay Online Securely With Instant Notifications</h4>
                <p></p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="p-3 rounded-lg bg-primary-100 hover:bg-primary-200 transition duration-300">
                <ShieldCheck className="text-primary-500" size={20} />
              </div>
              <div>
                <h4>Convert Your Money In Seconds</h4>
                <p></p>
              </div>
            </div>
          </div>
        </section>
      </Section>
    </div>
  );
}

export default Security;