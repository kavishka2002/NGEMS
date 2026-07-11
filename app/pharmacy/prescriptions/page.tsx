"use client";

import PharmacyNavbar from "@/components/pharmacy/PharmacyNavbar";
import PharmacySidebar from "@/components/pharmacy/PharmacySidebar";
import Button from "@/components/Button";
import { Plus, Search, Filter } from "lucide-react";
import Link from "next/link";

export default function PrescriptionsPage() {
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
                    Prescriptions Module
                  </p>
                  <h1 className="mt-2 font-display text-3xl font-bold text-navy-900">
                    View Prescriptions
                  </h1>
                  <p className="mt-2 text-sm text-navy/60">
                    Manage and process patient prescriptions
                  </p>
                </div>
                <Button type="button" variant="primary" className="px-4 py-2 text-sm w-fit">
                  <Plus size={16} className="mr-2 inline" />
                  Add Prescription
                </Button>
              </div>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="mb-6 flex flex-col md:flex-row gap-3">
            <div className="flex-1 relative">
              <Search size={18} className="absolute left-3 top-3 text-navy/40" />
              <input
                type="text"
                placeholder="Search by patient name, ID, or prescription number..."
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-health-600 focus:border-transparent"
              />
            </div>
            <Button type="button" variant="secondary" className="flex items-center gap-2 px-4 py-2.5">
              <Filter size={16} />
              <span className="hidden sm:inline">Filters</span>
            </Button>
          </div>

          {/* Prescriptions Content */}
          <div className="rounded-lg bg-white shadow-sm border border-slate-border p-6">
            <div className="text-center py-12">
              <p className="text-navy/60 mb-4">Prescriptions list will be displayed here</p>
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
