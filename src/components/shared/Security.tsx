import Image from "next/image";
import Section from "@/components/shared/section";

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
    <div className="bg-violet-100 py-10 dark:bg-violet-900 lg:py-20">
      <Section className="flex flex-col items-center gap-10 px-4 md:flex-row md:px-0">
        <section className="w-full md:w-1/2">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="">
              <Image
                src="https://img.freepik.com/free-vector/cryptocurrency-mining-isometric_107791-252.jpg"
                alt="coworking-illustration"
                width={500}
                height={500}
                className={`w-full rounded-xl object-cover opacity-90 md:max-w-[600px]`}
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
                    className={`w-full rounded-xl object-cover opacity-90 md:max-w-[600px]`}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="w-full space-y-4 md:w-1/2">
          <p className="text-primary-500 font-bold md:text-lg">Security</p>
          <h2 className="qs-heading text-3xl font-bold lg:text-4xl">
            Take The Stress Out Of Managing Property And Money
          </h2>
          <p className="opacity-80 md:text-lg">
            Ensuring the security of our application is of utmost importance. We
            implement various measures to protect user data and maintain the
            integrity of our systems. From encryption to regular security
            audits, our team is dedicated to safeguarding against potential
            threats and vulnerabilities.
          </p>
        </section>
      </Section>
    </div>
  );
}

export default Security;
