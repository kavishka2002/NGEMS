"use client";

import DashboardNavbar from "@/components/dashboard/DashboardNavbar";
import Sidebar from "@/components/dashboard/Sidebar";
import Button from "@/components/Button";
import { Plus, Search, Calendar } from "lucide-react";
import Link from "next/link";

export default function AppointmentsPage() {
  return (
    <div className="flex h-screen flex-col overflow-hidden" style={{backgroundColor: "#F0F4F8"}}>
      <DashboardNavbar />
      <div className="flex flex-1 min-h-0 overflow-hidden">
        <Sidebar />

        <main className="min-w-0 flex-1 overflow-y-auto overflow-x-hidden px-4 py-6 md:px-6 lg:px-8">
          <div className="mb-6">
            <div className="max-w-7xl w-full mx-auto rounded-lg bg-white/60 px-4 py-6 shadow-sm md:px-6 lg:px-8">
              <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-amber-600">
                    Operations Management
                  </p>
                  <h1 className="mt-1 font-display text-3xl font-bold leading-tight text-[#0B2545]">
                    Appointments
                  </h1>
                  <p className="mt-1 text-sm text-[#146C94]">
                    Schedule and manage patient appointments
                  </p>
                </div>
                <Button type="button" variant="primary" className="w-auto px-4 py-2 text-sm">
                  <Plus size={16} className="mr-2 inline" />
                  New Appointment
                </Button>
              </div>
            </div>
          </div>

          <div className="mb-6 flex gap-4">
            <div className="flex-1 relative">
              <Search size={18} className="absolute left-3 top-3 text-navy/40" />
              <input
                type="text"
                placeholder="Search appointments..."
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-health-600 focus:border-transparent"
              />
            </div>
            <Button type="button" variant="secondary" className="flex items-center gap-2 px-4 py-2.5">
              <Calendar size={16} />
              <span className="hidden sm:inline">Today</span>
            </Button>
          </div>

          <div className="rounded-lg bg-white shadow-sm border border-slate-border p-6">
            <div className="text-center py-12">
              <p className="text-navy/60 mb-4">Appointments list will be displayed here</p>
              <Link href="/dashboard">
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
