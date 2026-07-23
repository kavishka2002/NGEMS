<<<<<<< HEAD
"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import Button from "@/components/Button";
import { Stethoscope, ClipboardList, Users, CalendarCheck } from "lucide-react";

export default function DoctorPage() {
  const features = [
    {
      icon: Stethoscope,
      title: "Patient Consultations",
      description: "Review patient charts, update diagnoses, and manage treatment plans in one place.",
    },
    {
      icon: ClipboardList,
      title: "Prescription Writing",
      description: "Create and review prescriptions for medications with a clear clinical workflow.",
    },
    {
      icon: Users,
      title: "Patient History",
      description: "Access clinical history, visit summaries, and lab reports for informed care decisions.",
    },
    {
      icon: CalendarCheck,
      title: "Today's Schedule",
      description: "View your appointments and rounds for the day with a simple overview.",
    },
  ];

  const schedule = [
    { time: "08:30", patient: "Anura Fernando", department: "General Medicine" },
    { time: "09:15", patient: "Nadeesha Perera", department: "Pediatrics" },
    { time: "10:00", patient: "Kasun Silva", department: "Cardiology" },
    { time: "11:30", patient: "Chamari Jayasekara", department: "ENT" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 flex flex-col overflow-hidden" style={{ backgroundColor: "#F0F4F8" }}>
      <Navbar />

      <main className="flex-1 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-6xl">
          <div className="rounded-3xl bg-white px-6 py-10 shadow-sm sm:px-10 sm:py-12">
            <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:items-center">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-health-600">
                  Doctor Portal
                </p>
                <h1 className="mt-4 text-4xl font-semibold tracking-tight text-navy-900 sm:text-5xl">
                  Welcome to the Doctor Dashboard
                </h1>
                <p className="mt-4 max-w-2xl text-base leading-7 text-navy/70 sm:text-lg">
                  Access patient records, review appointments, and manage care plans without needing a separate login page.
                  This route is available directly under <span className="font-medium text-navy">/doctor</span>.
                </p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Button type="button" variant="primary" className="px-6 py-3">
                    View Schedule
                  </Button>
                  <Link href="/">
                    <Button type="button" variant="secondary" className="px-6 py-3">
                      Back to Home
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="rounded-[32px] border border-slate-border bg-slate-50 p-6 shadow-sm">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-navy/60">
                      Today’s Overview
                    </p>
                    <p className="mt-2 text-3xl font-semibold text-navy">4 appointments</p>
                  </div>
                  <div className="inline-flex h-14 w-14 items-center justify-center rounded-3xl bg-health-600 text-white shadow-sm shadow-health-500/20">
                    <Stethoscope size={28} />
                  </div>
                </div>
                <div className="mt-8 space-y-4">
                  {schedule.map((item) => (
                    <div key={item.time} className="rounded-3xl bg-white p-4 shadow-sm">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-navy">{item.patient}</p>
                          <p className="text-sm text-navy/60">{item.department}</p>
                        </div>
                        <p className="rounded-full bg-health-50 px-3 py-1 text-sm font-semibold text-health-700">
                          {item.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <div key={feature.title} className="rounded-3xl border border-slate-border bg-slate-50 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-health-100 text-health-700">
                      <Icon size={24} />
                    </div>
                    <h2 className="mt-5 text-lg font-semibold text-navy">{feature.title}</h2>
                    <p className="mt-3 text-sm leading-6 text-navy/70">{feature.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
=======
import { redirect } from "next/navigation";

export default function DoctorPage() {
  redirect("/doctor/dashboard");
>>>>>>> Developer
}
