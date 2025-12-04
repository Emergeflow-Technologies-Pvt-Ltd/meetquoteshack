"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Section from "@/components/shared/section";
import { Plus, User, Mail, Phone } from "lucide-react";

type Loanee = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  appliedAt?: string | null;
  applicationId?: string | null;
};

const DUMMY_LOANEES: Loanee[] = [
  {
    id: "ln_1",
    name: "Ravi Sharma",
    email: "ravi.sharma@example.com",
    phone: "9876543210",
    appliedAt: "2025-11-20T10:12:00.000Z",
    applicationId: "app_101",
  },
  {
    id: "ln_2",
    name: "Sneha Patil",
    email: "sneha.patil@example.com",
    phone: "9123456780",
    appliedAt: null,
    applicationId: null,
  },
  {
    id: "ln_3",
    name: "Amit Kulkarni",
    email: "amit.k@example.com",
    phone: "9988776655",
    appliedAt: "2025-11-26T09:00:00.000Z",
    applicationId: "app_109",
  },
];

export default function AgentDashboardPage() {
  const [loanees, setLoanees] = useState<Loanee[]>(DUMMY_LOANEES);
  const [query, setQuery] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const stats = {
    total: loanees.length,
    withApplication: loanees.filter((l) => l.applicationId).length,
    pending: loanees.filter((l) => !l.applicationId).length,
  };

  function handleInvite(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !email) return;

    const newLoanee: Loanee = {
      id: `ln_${Math.random().toString(36).slice(2, 9)}`,
      name,
      email,
      phone: phone || undefined,
      appliedAt: null,
      applicationId: null,
    };

    setLoanees((s) => [newLoanee, ...s]);
    setName("");
    setEmail("");
    setPhone("");
  }

  const filtered = loanees.filter((l) =>
    `${l.name} ${l.email} ${l.phone ?? ""}`.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <Section className="py-12">

      <h1 className="text-3xl  font-bold mb-6 bg-gradient-to-r from-violet-700 to-purple-600 bg-clip-text text-transparent">
        Agent Dashboard       
        </h1>  
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT: Stats & Invite */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Agent Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <div className="text-sm text-gray-500">Total Loanees</div>
                  <div className="font-medium">{stats.total}</div>
                </div>
                <div className="flex justify-between">
                  <div className="text-sm text-gray-500">With Application</div>
                  <div className="font-medium">{stats.withApplication}</div>
                </div>
                <div className="flex justify-between">
                  <div className="text-sm text-gray-500">Pending (not applied)</div>
                  <div className="font-medium">{stats.pending}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Invite a Loanee</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleInvite} className="space-y-3">
                <div className="flex flex-col">
                  <label className="text-sm mb-1">Full name</label>
                  <Input value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="flex flex-col">
                  <label className="text-sm mb-1">Email</label>
                  <Input value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="flex flex-col">
                  <label className="text-sm mb-1">Phone (optional)</label>
                  <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
                </div>

                <div className="flex justify-end">
                  <Button type="submit" className="flex items-center gap-2">
                    <Plus /> Invite
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* MIDDLE: Loanee list */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">My Loanees</h2>
            <div className="w-64">
              <Input
                placeholder="Search loanees by name, email or phone"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {filtered.map((l) => (
              <Card key={l.id}>
                <CardContent>
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
                      <User />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{l.name}</div>
                          <div className="text-sm text-gray-500">{l.email}</div>
                        </div>
                        <div className="text-sm text-gray-500">
                          {l.applicationId ? (
                            <span className="px-2 py-1 rounded bg-green-50 text-green-700">Applied</span>
                          ) : (
                            <span className="px-2 py-1 rounded bg-yellow-50 text-yellow-700">Pending</span>
                          )}
                        </div>
                      </div>

                      <div className="mt-2 flex gap-4 items-center text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Mail className="w-4 h-4" /> {l.email}
                        </div>
                        {l.phone && (
                          <div className="flex items-center gap-1">
                            <Phone className="w-4 h-4" /> {l.phone}
                          </div>
                        )}
                      </div>

                      <div className="mt-3 flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => alert(`Open profile ${l.id}`)}>
                          View Profile
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => alert(`Send invite link to ${l.email}`)}>
                          Resend Invite
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {filtered.length === 0 && (
              <Card>
                <CardContent>
                  <div className="text-center text-gray-500 py-8">No loanees found.</div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </Section>
  );
}
