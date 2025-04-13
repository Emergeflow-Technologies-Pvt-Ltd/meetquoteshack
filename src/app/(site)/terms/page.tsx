import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Terms and Conditions | QuoteShack",
  description: "Terms and conditions for using QuoteShack services",
}

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8 text-center">Terms and Conditions</h1>
      
      <div className="space-y-8 text-gray-700">
        <section className="bg-white rounded-lg shadow-sm p-6">
          <p className="leading-relaxed">
            In this agreement, the words &quot;we&quot;, &quot;our&quot;, &quot;us&quot; mean QuoteShack or group members or the collective group of QuoteShack, and includes any program or joint venture any of these parties participate in. The word &quot;you&quot; and &quot;your&quot; mean the applicant/borrower and co-applicant.
          </p>

          <p className="leading-relaxed mt-4">
            All this information which you give us at any time will be true and complete, we may cancel this loan or mortgage application and will exercise any legal remedies available to us.
          </p>

          <p className="leading-relaxed mt-4">
            You agree to advise us if any information on this application changes so we can update the right information.
          </p>
        </section>

        <section className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Privacy</h2>
          <p className="leading-relaxed">
            The QuoteShack may collect, use and share your information with financial institutions, lenders and agents. We will not keep any information for more than 30 days, after 30 days the data will automatically be archived.
          </p>
        </section>

        <section className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Information We Collect</h2>
          <p className="leading-relaxed">
            Information that we hold about you may come from your directly, however we may collect and verify information about you from all other available sources, including information from credit reporting agencies (for example, where you apply for credit, or where we must identify you or where we must recognize you), people appointed to act on your behalf, our social media pages, IP addresses from where you are applying, email addresses you are providing, phone numbers you are providing, from dealerships or agents or car manufacturers or other financial institutions or lenders.
          </p>
        </section>

        <section className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">How We Use Your Information</h2>
          <p className="leading-relaxed">
            We may collect, use and exchange personal information for the following purposes: to set up, manage and offer products or services that meet your needs, to confirm your identity, to determine your eligibility or suitability for our products and services, to understand your needs, to meet our legal requirements, to manage and asses risks, to prevent or detect frauds or criminal activity and to identify and correct errors. We may also use your information to send you messages, either by post, telephone, emails or other digital methods or apps. These messages may help you to manage your application, meet the regulatory requirements, and inform you about our product and services that can help or interest you.
          </p>
        </section>

        <section className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Information Sharing</h2>
          <p className="leading-relaxed">
            We will keep your information confidential, but we may share it with third parties (who also have to keep it secure and confidential) to fulfil your needs and requirements. Also, we can share in special circumstances with fraud prevention agencies, other financial institutions or lenders. Some of this may remain outside Canada.
          </p>
        </section>

        <section className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Use of Social Insurance Number</h2>
          <p className="leading-relaxed">
            We may ask for your SIN to verify and report credit information to consumer credit agencies, as well as to confirm your identity. This allows us to keep your personal information separate from that of other applicants, particularly those with same first and last names, and helps maintain the integrity and accuracy of your personal information. You may refuse to consent to its use or disclosure for these purposes other than as required by law.
          </p>
        </section>

        <section className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Credit Reporting</h2>
          <p className="leading-relaxed">
            For the purpose of assessing your application, you agree that we will exchange information such as your name, address, date of birth with credit reporting agencies (credit bureaus), so that we can obtain a separate credit report on you and your co-applicant. We will also verify your income, employment, address with credit reporting agencies, other agencies and organizations.
          </p>
        </section>

        <section className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Sharing of Information</h2>
          <p className="leading-relaxed">
            I/we the submitted applicant/co-applicant(s) is/are applying with the assistance of QuoteShack to get or fulfil there needs or requirements and agrees with them to share and retain personal information to complete the application process, to share with third parties connecting with processing application, such as my/our financial behavior (payment history, credit agency reports, credit worthiness, etc), financial information (income, employment, job status, etc), information establishing your identity and contact information (name, address, phone number, email, social media, IP address from application submitted, etc), and my/our personal background.
          </p>

          <p className="leading-relaxed mt-4">
            The applicant/co-applicant agrees that his personal information, including financial information in connection to application, will be collected, used and disclosed in accordance with QuoteShack&apos;s privacy policies and terms and conditions.
          </p>

          <p className="leading-relaxed mt-4">
            The applicant further acknowledges that a QuoteShack may use automated technology tools to collect personal, banking and financial information to make decisions a real time. The applicant understands that they may request additional information about such automated processes.
          </p>

          <p className="leading-relaxed mt-4">
            The applicant consents to QuoteShack disclosing his/her personal information to third parties such as to financial institutions, lenders, agents/brokers, so that those third parties can provide the applicant with information about their required products or services that may be of interest to the applicant. The applicant understands and agrees that QuoteShack has no control over or responsibility for the third party offers or any loss that the applicant may suffer because of the applicant&apos;s use of such third party offers.
          </p>
        </section>

        <div className="mt-8 p-6 bg-blue-50 rounded-lg border border-blue-100">
          <p className="font-semibold text-blue-800">By signing up and submitting the application you gave us a CONSENT TO USE OF PERSONAL INFORMATION.</p>
          <p className="mt-4 text-blue-700">
            By signing up and submitting the application confirms that I/We has/have received, read and understand the content of this terms and conditions page.
          </p>
        </div>
      </div>
    </div>
  )
}
