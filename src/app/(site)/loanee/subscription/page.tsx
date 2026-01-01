// "use client";

// import { Card } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Check, Crown, Zap } from "lucide-react";

// export default function LoaneeSubscriptionPage() {
//   return (
//     <div className="min-h-screen bg-gray-50 py-12 px-4">
//       <div className="max-w-6xl mx-auto">
//         {/* Header */}
//         <div className="text-center mb-12">
//           <h1 className="text-4xl font-bold text-gray-900">
//             Choose Your Plan
//           </h1>
//           <p className="mt-3 text-gray-600">
//             Select a plan that fits your loan journey
//           </p>
//         </div>

//         {/* Plans */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//           {/* BASIC PLAN */}
//           <Card className="p-8 rounded-2xl border border-gray-200 shadow-sm flex flex-col">
//             <div className="flex items-center gap-3 mb-6">
//               <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center">
//                 <Zap className="text-green-600" />
//               </div>
//               <div>
//                 <h2 className="text-2xl font-bold">Basic</h2>
//                 <p className="text-gray-500 text-sm">
//                   Everything you need to begin
//                 </p>
//               </div>
//             </div>

//             <div className="mb-6">
//               <span className="text-5xl font-bold text-green-600">$0</span>
//               <span className="text-gray-500 text-lg"> /month</span>
//             </div>

//             <ul className="space-y-4 flex-1">
//               {[
//                 "Apply for loans",
//                 "Upload & send documents",
//                 "Chat with lenders",
//               ].map((feature) => (
//                 <li key={feature} className="flex items-center gap-3">
//                   <Check className="text-green-600" />
//                   <span className="text-gray-700">{feature}</span>
//                 </li>
//               ))}
//             </ul>

//             <Button
//               variant="outline"
//               className="mt-8 border-green-600 text-green-600 hover:bg-green-50"
//             >
//               Continue Free
//             </Button>
//           </Card>

//           {/* SMART PLAN */}
//           <Card className="relative p-8 rounded-2xl border-2 border-violet-500 shadow-xl flex flex-col">
//             {/* Most Popular Badge */}
//             <div className="absolute -top-4 left-1/2 -translate-x-1/2">
//               <span className="bg-violet-600 text-white text-xs font-semibold px-4 py-1 rounded-full">
//                 Most Popular
//               </span>
//             </div>

//             <div className="flex items-center gap-3 mb-6">
//               <div className="h-12 w-12 rounded-lg bg-violet-100 flex items-center justify-center">
//                 <Crown className="text-violet-600" />
//               </div>
//               <div>
//                 <h2 className="text-2xl font-bold">Smart</h2>
//                 <p className="text-gray-500 text-sm">
//                   Proactive borrowers
//                 </p>
//               </div>
//             </div>

//             <div className="mb-6">
//               <span className="text-5xl font-bold text-violet-600">$2.99</span>
//               <span className="text-gray-500 text-lg"> /month</span>
//             </div>

//             <ul className="space-y-4 flex-1">
//               {[
//                 "Pre-qualification check",
//                 "Unlimited lender matching",
//                 "Credit score monitoring",
//                 "Analytics reports",
//                 "Expert loan advice",
//               ].map((feature) => (
//                 <li key={feature} className="flex items-center gap-3">
//                   <Check className="text-violet-600" />
//                   <span className="text-gray-700">{feature}</span>
//                 </li>
//               ))}
//             </ul>

//             <Button className="mt-8 bg-violet-600 hover:bg-violet-700 text-white">
//               Subscribe
//             </Button>
//           </Card>
//         </div>
//       </div>
//     </div>
//   );
// }

import Section from "@/components/shared/section";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import { UserRole } from "@prisma/client";
import { redirect } from "next/navigation";
import LoaneePlans from "@/components/loanee/LoaneePlans";

export default async function LoaneePlansPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/api/auth/signin");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });

  if (!user || user.role !== UserRole.LOANEE) {
    redirect("/");
  }

  return (
    <Section className="py-20">
      <h1 className="mb-10 text-center text-3xl font-bold">
        Choose a subscription plan
      </h1>
      <LoaneePlans />
    </Section>
  );
}
