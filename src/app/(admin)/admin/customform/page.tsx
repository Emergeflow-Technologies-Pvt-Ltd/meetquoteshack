"use client"

import Section from "@/components/shared/section"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { CustomForm } from "@prisma/client"

type Branding = {
  logo?: string | null
}

type CustomFormWithBranding = CustomForm & {
  branding?: Branding | null
}

export default function AdminCustomFormsPage() {
  const router = useRouter()

  const [forms, setForms] = useState<CustomFormWithBranding[]>([])
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    disabled: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchForms = async () => {
      try {
        // ✅ Admin API (recommended)
        const res = await fetch("/api/admin/customform/list")
        const data = await res.json()

        if (data.success) {
          setForms(data.forms)
          setStats(data.stats)
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchForms()
  }, [])

  // ✅ FIXED (no optional chaining issue)
  const toSentenceCase = (text?: string | null) => {
    if (!text) return "-"
    return text.toLowerCase().replace(/^\w/, (c) => c.toUpperCase())
  }

  return (
    <Section className="py-12">
      <div className="flex flex-col gap-6">
        {/* HEADER */}
        <div className="flex h-[58px] items-start justify-between py-3">
          <h1 className="text-[28px] font-bold text-violet-600">
            Custom Forms
          </h1>
        </div>

        {/* CREATE CARD */}
        <div className="flex flex-col gap-3">
          {/* STATS */}
          <div className="flex items-center rounded-lg bg-slate-50 px-4 py-2">
            <div className="flex gap-4 text-sm">
              <div className="rounded bg-white px-3 py-1 shadow">
                Total: {stats.total}
              </div>
              <div className="rounded bg-white px-3 py-1 shadow">
                Active: {stats.active}
              </div>
              <div className="rounded bg-white px-3 py-1 shadow">
                Disabled: {stats.disabled}
              </div>
            </div>
          </div>
        </div>

        {/* CONTENT */}
        {loading ? (
          <div className="flex h-20 items-center justify-center">
            <p className="text-sm text-slate-500">Loading...</p>
          </div>
        ) : forms.length === 0 ? (
          <div className="flex h-20 items-center justify-center rounded-lg bg-slate-50">
            <p className="text-sm text-slate-600">No Custom Forms Available</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {forms.map((form) => (
              <div
                key={form.id}
                onClick={() => router.push(`/admin/customform/${form.id}`)} // ✅ FIXED ROUTE
                className="flex cursor-pointer items-center justify-between rounded-lg border bg-white p-4 hover:bg-slate-50"
              >
                {/* LEFT */}
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 overflow-hidden rounded-full bg-slate-200">
                    {form.branding?.logo ? (
                      <>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={form.branding.logo}
                          alt="logo"
                          className="h-full w-full object-cover"
                        />
                      </>
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-xs text-slate-400">
                        N/A
                      </div>
                    )}
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      {form.name}
                    </p>
                    <p className="text-xs text-slate-500">
                      Updated {new Date(form.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* STATUS */}
                <span
                  className={`rounded-md px-3 py-1 text-xs font-medium ${
                    form.status === "ACTIVE"
                      ? "bg-[#DCFCE7] text-[#166534]"
                      : "bg-[#FFF7D7] text-[#E1A325]"
                  }`}
                >
                  {toSentenceCase(form.status)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </Section>
  )
}
