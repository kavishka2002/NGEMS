"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Logo from "@/components/Logo";
import FormCard from "@/components/FormCard";
import Button from "@/components/Button";
import { Pill, FlaskConical } from "lucide-react";

export default function PharmacyPage() {
  const router = useRouter();

  const handlePharmacyAccess = (e: FormEvent) => {
    e.preventDefault();
    router.push("/pharmacy/dashboard");
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 flex flex-col overflow-hidden"
      style={{ backgroundColor: "#F0F4F8" }}
    >
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
        <div className="w-full max-w-4xl">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="h-14 w-14 rounded-lg bg-health-600 flex items-center justify-center">
                <Pill size={28} className="text-white" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-health-600">
                  Pharmacy Module
                </p>
                <h1 className="font-display text-3xl font-bold text-navy-900">
                  Medicine Management System
                </h1>
              </div>
            </div>
            <p className="text-lg text-navy/60 max-w-2xl mx-auto">
              Manage prescriptions, dispense medicines, and maintain inventory with our comprehensive pharmacy module.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Features Cards */}
            {[
              {
                icon: "📋",
                title: "Prescription Management",
                description: "View, process, and track patient prescriptions",
              },
              {
                icon: "💊",
                title: "Medicine Dispensing",
                description: "Record and manage medicine distribution",
              },
              {
                icon: "📦",
                title: "Inventory Management",
                description: "Track medicine stock and manage inventory",
              },
              {
                icon: "📊",
                title: "Reports & Analytics",
                description: "Generate pharmacy reports and insights",
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="rounded-lg border border-slate-border bg-white p-6 shadow-card hover:shadow-cardHover transition"
              >
                <p className="text-3xl mb-3">{feature.icon}</p>
                <h3 className="font-bold text-navy mb-2">{feature.title}</h3>
                <p className="text-sm text-navy/60">{feature.description}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              type="button"
              variant="primary"
              className="px-8 py-3 text-lg flex items-center justify-center gap-2"
              onClick={handlePharmacyAccess}
            >
              <Pill size={20} />
              Access Pharmacy
            </Button>
            <Link href="/dashboard">
              <Button type="button" variant="secondary" className="px-8 py-3 text-lg">
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
