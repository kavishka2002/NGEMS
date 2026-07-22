"use client";

import PharmacyNavbar from "@/components/pharmacy/PharmacyNavbar";
import PharmacySidebar from "@/components/pharmacy/PharmacySidebar";
import Button from "@/components/Button";
import { Plus, Search } from "lucide-react";
import Link from "next/link";

export default function DispensingPage() {
  return (
    <div className="flex h-screen flex-col overflow-hidden bg-slate-50">
      <PharmacyNavbar />
      <div className="flex flex-1 min-h-0 overflow-hidden">
        <PharmacySidebar />

        <main className="min-w-0 flex-1 overflow-y-auto overflow-x-hidden px-4 py-6 md:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="rounded-lg bg-white px-6 py-6 shadow-sm border border-slate-border">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-health-600">
                    Medicine Dispensing
                  </p>
                  <h1 className="mt-2 font-display text-3xl font-bold text-navy-900">
                    Dispense Medicines
                  </h1>
                  <p className="mt-2 text-sm text-navy/60">
                    Record and track medicine dispensing
                  </p>
                </div>
                <Button type="button" variant="primary" className="px-4 py-2 text-sm w-fit">
                  <Plus size={16} className="mr-2 inline" />
                  New Dispensing
                </Button>
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="mb-6">
            <div className="relative">
              <Search size={18} className="absolute left-3 top-3 text-navy/40" />
              <input
                type="text"
                placeholder="Search medicines, patients, or prescriptions..."
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-health-600 focus:border-transparent"
              />
            </div>
          </div>

          {/* Dispensing Content */}
          <div className="rounded-lg bg-white shadow-sm border border-slate-border p-6">
            <div className="text-center py-12">
              <p className="text-navy/60 mb-4">Dispensing records will be displayed here</p>
              <Link href="/pharmacy/dashboard">
                <Button type="button" variant="secondary" className="px-4 py-2 text-sm">
                  Back to Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
