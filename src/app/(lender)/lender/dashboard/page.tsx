"use client";

import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";
import React from "react";

export default function LenderDashboard() {
  const { status } = useSession();
  const router = useRouter();

  if (status === "unauthenticated") {
    redirect("/lender/login");
  }

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="bg-gradient-to-r from-violet-50 to-purple-50 rounded-xl p-8 shadow-sm border border-violet-100">
        <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-violet-700 to-purple-600 bg-clip-text text-transparent">Lender Dashboard</h1>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button 
            onClick={() => router.push("/lender/applications")}
            className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white px-6 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
          >
            Access Applications
          </Button>
          <Button 
            variant="outline"
            onClick={() => alert("Coming soon")}
            className="border-violet-300 text-violet-700 hover:bg-violet-50 px-6 py-2 rounded-lg transition-all duration-200"
          >
            Manage Profile
          </Button>
        </div>
      </div>
    </div>
  );
}
