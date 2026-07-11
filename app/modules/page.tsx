"use client";

import { FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Button from "@/components/Button";
import { Pill, FlaskConical, StethoscopeIcon, ArrowRight } from "lucide-react";

export default function ModulesPage() {
  const router = useRouter();

  const modules = [
    {
      id: "pharmacy",
      icon: Pill,
      title: "💊 Pharmacy",
      description: "Manage prescriptions, medicines, and inventory",
      color: "from-health-600 to-health-700",
      href: "/pharmacy",
      features: [
        "View Prescriptions",
        "Dispense Medicines",
        "Manage Inventory",
        "Generate Reports",
      ],
    },
    {
      id: "laboratory",
      icon: FlaskConical,
      title: "🧪 Laboratory",
      description: "Handle lab requests, samples, and test results",
      color: "from-seal-600 to-seal-700",
      href: "/laboratory",
      features: [
        "View Lab Requests",
        "Collect Samples",
        "Process Tests",
        "Generate Reports",
      ],
    },
  ];

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 flex flex-col overflow-hidden"
      style={{ backgroundColor: "#F0F4F8" }}
    >
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
        <div className="w-full max-w-5xl">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-health-600 mb-3">
              Specialized Modules
            </p>
            <h1 className="font-display text-4xl font-bold text-navy-900 mb-4">
              Hospital Departments
            </h1>
            <p className="text-lg text-navy/60 max-w-2xl mx-auto">
              Access specialized modules for hospital departments and services
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {modules.map((module) => {
              const Icon = module.icon;
              return (
                <Link key={module.id} href={module.href}>
                  <div
                    className={`h-full rounded-lg bg-gradient-to-br ${module.color} text-white p-8 shadow-lg hover:shadow-xl transition-all cursor-pointer transform hover:scale-105`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <Icon size={40} strokeWidth={1.5} />
                      <ArrowRight size={24} className="opacity-50" />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">{module.title}</h2>
                    <p className="text-sm text-white/80 mb-6">{module.description}</p>

                    <div className="space-y-2">
                      <p className="text-xs font-semibold uppercase tracking-wider text-white/60">
                        Key Features
                      </p>
                      <ul className="space-y-1">
                        {module.features.map((feature, idx) => (
                          <li
                            key={idx}
                            className="flex items-center gap-2 text-sm text-white/90"
                          >
                            <span className="h-1 w-1 rounded-full bg-white/70" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Button
                      type="button"
                      variant="secondary"
                      className="mt-6 w-full bg-white text-navy hover:bg-slate-100 border-0"
                    >
                      Access Module
                    </Button>
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="text-center">
            <Link href="/dashboard">
              <Button type="button" variant="secondary" className="px-8 py-3">
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
