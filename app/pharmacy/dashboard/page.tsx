"use client";

import PharmacyNavbar from "@/components/pharmacy/PharmacyNavbar";
import PharmacySidebar from "@/components/pharmacy/PharmacySidebar";
import PharmacyDashboardStats from "@/components/pharmacy/PharmacyDashboardStats";
import PrescriptionList from "@/components/pharmacy/PrescriptionList";
import { FileText, Plus, DownloadCloud, ArrowUpRight } from "lucide-react";
import Link from "next/link";

export default function PharmacyDashboardPage() {
  return (
    <div className="flex h-screen flex-col overflow-hidden bg-gradient-to-br from-slate-50 via-slate-50 to-blue-50">
      <PharmacyNavbar />
      <div className="flex flex-1 min-h-0 overflow-hidden">
        <PharmacySidebar />

        <main className="min-w-0 flex-1 overflow-y-auto overflow-x-hidden px-4 py-8 md:px-8 lg:px-10">
          {/* Hero Header */}
          <div className="mb-10">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-health-600 via-health-500 to-emerald-500 text-white p-8 shadow-lg">
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
              </div>
              <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div>
                  <div className="inline-block mb-3 px-3 py-1 rounded-full bg-white/20 text-xs font-semibold uppercase tracking-wider">
                    💊 Pharmacy Module
                  </div>
                  <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                    Pharmacy Dashboard
                  </h1>
                  <p className="mt-3 text-white/90 text-lg">
                    Real-time medicine management & prescription tracking
                  </p>
                </div>
                <div className="flex gap-3 flex-wrap">
                  <button className="group flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white font-medium px-5 py-3 rounded-lg transition backdrop-blur">
                    <FileText size={18} />
                    Export Report
                  </button>
                  <button className="group flex items-center gap-2 bg-white text-health-600 hover:bg-white/95 font-semibold px-5 py-3 rounded-lg transition shadow-lg hover:shadow-xl">
                    <Plus size={18} />
                    New Prescription
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Dashboard Stat */}
          <div className="mb-10">
            <PharmacyDashboardStats />
          </div>

          {/* Recent Prescriptions Card */}
          <div className="mb-10">
            <div className="rounded-2xl bg-white p-8 shadow-lg border border-slate-100 hover:shadow-xl transition">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-navy">Recent Prescriptions</h2>
                  <p className="mt-2 text-navy/60 text-sm">Latest prescriptions requiring attention</p>
                </div>
                <Link href="/pharmacy/prescriptions">
                  <button className="flex items-center gap-2 text-health-600 hover:text-health-700 font-semibold text-sm">
                    View All
                    <ArrowUpRight size={16} />
                  </button>
                </Link>
              </div>
              <PrescriptionList />
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mb-10">
            <div className="rounded-2xl bg-gradient-to-br from-health-50 to-emerald-50 border border-health-200 p-8 shadow-sm">
              <h3 className="font-bold text-xl text-navy mb-6">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Link href="/pharmacy/prescriptions">
                  <button className="w-full group relative overflow-hidden rounded-xl bg-white border-2 border-health-200 p-5 hover:border-health-400 hover:shadow-lg transition">
                    <div className="absolute inset-0 bg-gradient-to-r from-health-50 to-transparent opacity-0 group-hover:opacity-100 transition"></div>
                    <div className="relative">
                      <div className="inline-block p-2 bg-health-100 rounded-lg mb-3">
                        <FileText size={20} className="text-health-600" />
                      </div>
                      <p className="font-semibold text-navy">View Prescriptions</p>
                      <p className="text-xs text-navy/60 mt-1">Manage all prescriptions</p>
                    </div>
                  </button>
                </Link>
                <Link href="/pharmacy/inventory">
                  <button className="w-full group relative overflow-hidden rounded-xl bg-white border-2 border-health-200 p-5 hover:border-health-400 hover:shadow-lg transition">
                    <div className="absolute inset-0 bg-gradient-to-r from-health-50 to-transparent opacity-0 group-hover:opacity-100 transition"></div>
                    <div className="relative">
                      <div className="inline-block p-2 bg-health-100 rounded-lg mb-3">
                        <FileText size={20} className="text-health-600" />
                      </div>
                      <p className="font-semibold text-navy">Manage Inventory</p>
                      <p className="text-xs text-navy/60 mt-1">Track medicine stock</p>
                    </div>
                  </button>
                </Link>
                <Link href="/pharmacy/stock-alerts">
                  <button className="w-full group relative overflow-hidden rounded-xl bg-white border-2 border-health-200 p-5 hover:border-health-400 hover:shadow-lg transition">
                    <div className="absolute inset-0 bg-gradient-to-r from-health-50 to-transparent opacity-0 group-hover:opacity-100 transition"></div>
                    <div className="relative">
                      <div className="inline-block p-2 bg-health-100 rounded-lg mb-3">
                        <FileText size={20} className="text-health-600" />
                      </div>
                      <p className="font-semibold text-navy">Low Stock Items</p>
                      <p className="text-xs text-navy/60 mt-1">Check alerts</p>
                    </div>
                  </button>
                </Link>
                <Link href="/pharmacy/reports">
                  <button className="w-full group relative overflow-hidden rounded-xl bg-white border-2 border-health-200 p-5 hover:border-health-400 hover:shadow-lg transition">
                    <div className="absolute inset-0 bg-gradient-to-r from-health-50 to-transparent opacity-0 group-hover:opacity-100 transition"></div>
                    <div className="relative">
                      <div className="inline-block p-2 bg-health-100 rounded-lg mb-3">
                        <DownloadCloud size={20} className="text-health-600" />
                      </div>
                      <p className="font-semibold text-navy">Generate Reports</p>
                      <p className="text-xs text-navy/60 mt-1">Download reports</p>
                    </div>
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
