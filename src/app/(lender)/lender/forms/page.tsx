"use client"
import Section from "@/components/shared/section"
import Link from "next/link"
import Image from "next/image"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

type CustomForm = {
  id: string
  name: string
  status: "ACTIVE" | "DISABLED"
  createdAt: string
  branding?: {
    logo?: string | null
  }
}

export default function LenderCustomFormsPage() {
  const router = useRouter()

  const [forms, setForms] = useState<CustomForm[]>([])
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    disabled: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchForms = async () => {
      try {
        const res = await fetch("/api/lender/customForm/list")
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

  const toSentenceCase = (text: string) => {
    return text?.toLowerCase().replace(/^\w/, (c) => c.toUpperCase())
  }
  return (
    <Section className="py-12">
      <div className="flex flex-col gap-6">
        <div className="flex h-[58px] items-start justify-between py-3">
          <h1 className="text-[28px] font-bold leading-normal text-violet-600">
            Custom Forms
          </h1>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-4 rounded-lg border border-slate-200 bg-white p-3">
            <div className="flex h-[38px] w-[38px] items-center justify-center rounded-full bg-violet-600">
              <Image
                src="/list-details.svg"
                alt="Success"
                width={18}
                height={18}
                priority
                sizes=""
                color="#ffffff"
              />
            </div>
            <div className="flex flex-1 flex-col gap-0.5">
              <p className="text-[17px] font-semibold leading-[25.5px] text-slate-900">
                Create Custom Form
              </p>
              <p className="text-[11.333px] leading-[17px] text-slate-500">
                Create a form tailored to your requirements, select steps,
                fields and share it with applicants
              </p>
            </div>
            <Link href="/lender/forms/create">
              <Button
                type="button"
                className="flex items-center justify-center gap-[10px] rounded-[6px] bg-violet-600 px-[11px] py-[5px] text-[12px] font-medium text-white shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_rgba(0,0,0,0.1)] transition-all duration-200 hover:bg-violet-700 active:scale-95"
              >
                Create
              </Button>
            </Link>
          </div>

          <div className="flex h-[49px] items-center rounded-lg bg-slate-50 px-4 py-1.5">
            <div className="flex items-center gap-4">
              <div className="rounded-[4.283px] bg-white px-3 py-1.5 text-[12px] font-medium text-slate-950 shadow-[0px_0px_0px_0px_rgba(0,0,0,0),0px_0px_0px_0px_rgba(0,0,0,0),0px_0.714px_1.428px_0px_rgba(0,0,0,0.05)]">
                Total : {stats.total}
              </div>
              <div className="rounded-[4.283px] bg-white px-3 py-1.5 text-[12px] font-medium text-slate-950 shadow-[0px_0px_0px_0px_rgba(0,0,0,0),0px_0px_0px_0px_rgba(0,0,0,0),0px_0.714px_1.428px_0px_rgba(0,0,0,0.05)]">
                Active : {stats.active}
              </div>
              <div className="rounded-[4.283px] bg-white px-3 py-1.5 text-[12px] font-medium text-slate-950 shadow-[0px_0px_0px_0px_rgba(0,0,0,0),0px_0px_0px_0px_rgba(0,0,0,0),0px_0.714px_1.428px_0px_rgba(0,0,0,0.05)]">
                Disabled : {stats.disabled}
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex h-[80px] items-center justify-center">
            <p className="text-sm text-slate-500">Loading...</p>
          </div>
        ) : forms.length === 0 ? (
          <div className="flex h-[80px] items-center justify-center rounded-lg bg-slate-50 px-4">
            <p className="text-[12px] text-slate-600">
              No Custom Form Available
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {forms.map((form) => (
              <div
                key={form.id}
                onClick={() => router.push(`/lender/forms/${form.id}`)}
                className="flex cursor-pointer items-center justify-between rounded-lg border border-slate-200 bg-white p-4 hover:bg-slate-50"
              >
                <div className="flex items-center gap-4">
                  <div className="relative h-10 w-10 overflow-hidden rounded-full bg-slate-200">
                    {form.branding?.logo ? (
                      <Image
                        src={form.branding.logo}
                        alt="logo"
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-xs text-slate-400">
                        N/A
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-[14px] font-semibold text-slate-900">
                      {form.name}
                    </p>
                    <p className="text-[12px] text-slate-500">
                      Updated {new Date(form.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <span
                  className={`flex items-center gap-1 rounded-md px-3 py-1 text-sm font-medium ${
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
