"use client";

import LaboratoryNavbar from "@/components/laboratory/LaboratoryNavbar";
import LaboratorySidebar from "@/components/laboratory/LaboratorySidebar";
import Button from "@/components/Button";
import { Plus, Search } from "lucide-react";
import Link from "next/link";

export default function SampleCollectionPage() {
  return (
    <div className="flex h-screen flex-col overflow-hidden bg-slate-50">
      <LaboratoryNavbar />
      <div className="flex flex-1 min-h-0 overflow-hidden">
        <LaboratorySidebar />

        <main className="min-w-0 flex-1 overflow-y-auto overflow-x-hidden px-4 py-6 md:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="rounded-lg bg-white px-6 py-6 shadow-sm border border-slate-border">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-seal-600">
                    Sample Collection
                  </p>
                  <h1 className="mt-2 font-display text-3xl font-bold text-navy-900">
                    Collect Samples
                  </h1>
                  <p className="mt-2 text-sm text-navy/60">
                    Record sample collection from patients
                  </p>
                </div>
                <Button type="button" variant="primary" className="px-4 py-2 text-sm w-fit">
                  <Plus size={16} className="mr-2 inline" />
                  Record Sample
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
                placeholder="Search samples, patients, or requests..."
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-seal-600 focus:border-transparent"
              />
            </div>
          </div>

          {/* Sample Collection Content */}
          <div className="rounded-lg bg-white shadow-sm border border-slate-border p-6">
            <div className="text-center py-12">
              <p className="text-navy/60 mb-4">Sample collection records will be displayed here</p>
              <Link href="/laboratory/dashboard">
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
