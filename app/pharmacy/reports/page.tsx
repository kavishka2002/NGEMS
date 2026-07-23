"use client";

import PharmacyNavbar from "@/components/pharmacy/PharmacyNavbar";
import PharmacySidebar from "@/components/pharmacy/PharmacySidebar";
import { FileText, Download, Calendar, Filter } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";
import * as service from "@/lib/pharmacy-service";

export default function ReportsPage() {
  const [report, setReport] = useState<service.PharmacyReport | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    service.getReports().then(setReport).catch(() => setError("Unable to load pharmacy report."));
  }, []);

  return (
    <div className="flex h-screen bg-slate-50">
      <PharmacySidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <PharmacyNavbar />
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 md:p-8">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-semibold text-navy/60">REPORTS & ANALYTICS</h2>
                  <h1 className="mt-2 text-3xl font-bold text-navy">Pharmacy Reports</h1>
                  <p className="mt-1 text-sm text-navy/60">
                    Generate and download pharmacy reports
                  </p>
                </div>
                <div className="flex gap-3">
                  <Link href="/pharmacy/dashboard">
                    <button className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-navy shadow-sm hover:bg-slate-50">
                      ← Back
                    </button>
                  </Link>
                  <button className="flex items-center gap-2 rounded-lg bg-health-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-health-700">
                    <FileText size={16} />
                    Generate Report
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mb-6 grid gap-4 md:grid-cols-3">
              <button className="rounded-lg border border-slate-border bg-white p-4 text-left shadow-sm hover:border-health-500 hover:shadow-md">
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-health-50">
                  <Calendar className="h-5 w-5 text-health-600" />
                </div>
                <p className="text-xs font-semibold text-navy/60">QUICK GENERATE</p>
                <p className="mt-2 font-medium text-navy">Monthly Report</p>
              </button>
              <button className="rounded-lg border border-slate-border bg-white p-4 text-left shadow-sm hover:border-health-500 hover:shadow-md">
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-health-50">
                  <Filter className="h-5 w-5 text-health-600" />
                </div>
                <p className="text-xs font-semibold text-navy/60">QUICK GENERATE</p>
                <p className="mt-2 font-medium text-navy">Inventory Summary</p>
              </button>
              <button className="rounded-lg border border-slate-border bg-white p-4 text-left shadow-sm hover:border-health-500 hover:shadow-md">
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-health-50">
                  <FileText className="h-5 w-5 text-health-600" />
                </div>
                <p className="text-xs font-semibold text-navy/60">QUICK GENERATE</p>
                <p className="mt-2 font-medium text-navy">Stock Analysis</p>
              </button>
            </div>

            {/* Reports List */}
            <div className="rounded-lg bg-white shadow-sm">
              <div className="border-b border-slate-border px-6 py-4">
                <h3 className="font-semibold text-navy">Recent Reports</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-slate-border bg-slate-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-navy/60">
                        Report Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-navy/60">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-navy/60">
                        Period
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-navy/60">
                        Generated
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-navy/60">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-navy/60">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-border">
                    {error ? (
                      <tr><td colSpan={6} className="px-6 py-10 text-center text-sm text-red-600">{error}</td></tr>
                    ) : !report ? (
                      <tr><td colSpan={6} className="px-6 py-10 text-center text-sm text-navy/60">Loading pharmacy report...</td></tr>
                    ) : (
                      <tr className="hover:bg-slate-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-health-50 p-2">
                              <FileText className="h-4 w-4 text-health-600" />
                            </div>
                            <span className="font-medium text-navy">Current Pharmacy Summary</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-navy/70">Summary</td>
                        <td className="px-6 py-4 text-sm text-navy/70">Live database</td>
                        <td className="px-6 py-4 text-sm text-navy/70">{new Date().toLocaleDateString()}</td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                            ✓ Ready
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <button className="inline-flex items-center gap-2 rounded-lg bg-health-50 px-3 py-1.5 text-xs font-medium text-health-600 hover:bg-health-100">
                            <Download size={14} />
                            Download
                          </button>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
