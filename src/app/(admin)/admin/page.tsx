import Link from "next/link";
import prisma from "@/lib/db";
import { LoanStatus } from "@prisma/client";
import Section from "@/components/shared/section";

export default async function AdminPage() {
  const applications = await prisma.mortgageApplication.findMany({
    where: {
      status: {
        in: [LoanStatus.PROCESSING, LoanStatus.PROGRESSING]
      }
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return (
    <Section header="Loan Applications" className="mt-12">
      <div className="grid grid-cols-3 gap-4">
        {applications.map((app) => (
          <Link
            key={app.id}
            href={`/admin/${app.id}`}
            className="block"
          >
            <div className="h-full p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="flex flex-col justify-between h-full">
                <div>
                  <h2 className="font-semibold">{app.firstName} {app.lastName}</h2>
                  <p className="text-sm text-gray-600">
                    Submitted: {app.createdAt.toLocaleDateString()}
                  </p>
                  <p className="mt-2">{app.currentAddress}</p>
                  <span className={`mt-2 inline-block px-2 py-1 text-sm rounded ${
                    app.status === LoanStatus.PROCESSING ? 'bg-green-100 text-green-800' :
                    app.status === LoanStatus.REJECTED ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {app.status.toLowerCase()}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
        {applications.length === 0 && (
          <p className="text-gray-500 text-center col-span-3">No applications found</p>
        )}
      </div>
    </Section>
  );
}
