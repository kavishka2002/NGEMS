"use client";

import PharmacyNavbar from "@/components/pharmacy/PharmacyNavbar";
import PharmacySidebar from "@/components/pharmacy/PharmacySidebar";
import { FileText, Download, Calendar, Filter } from "lucide-react";
import Link from "next/link";

interface Report {
  id: string;
  name: string;
  type: string;
  generatedDate: string;
  period: string;
  status: "ready" | "generating" | "failed";
  size: string;
}

const mockReports: Report[] = [
  {
    id: "1",
    name: "Monthly Dispensing Report - June 2025",
    type: "Dispensing",
    generatedDate: "2025-07-01",
    period: "June 1-30, 2025",
    status: "ready",
    size: "2.4 MB",
  },
  {
    id: "2",
    name: "Inventory Status Report - June 2025",
    type: "Inventory",
    generatedDate: "2025-07-01",
    period: "June 1-30, 2025",
    status: "ready",
    size: "1.8 MB",
  },
  {
    id: "3",
    name: "Stock Movement Analysis - Q2 2025",
    type: "Analysis",
    generatedDate: "2025-06-30",
    period: "April 1 - June 30, 2025",
    status: "ready",
    size: "3.2 MB",
  },
  {
    id: "4",
    name: "Prescription Summary Report - May 2025",
    type: "Prescriptions",
    generatedDate: "2025-06-01",
    period: "May 1-31, 2025",
    status: "ready",
    size: "2.1 MB",
  },
  {
    id: "5",
    name: "Expiry Alert Report - Current",
    type: "Expiry",
    generatedDate: "2025-07-10",
    period: "Current stock items",
    status: "ready",
    size: "856 KB",
  },
];

export default function ReportsPage() {
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
                    {mockReports.map((report) => (
                      <tr key={report.id} className="hover:bg-slate-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-health-50 p-2">
                              <FileText className="h-4 w-4 text-health-600" />
                            </div>
                            <span className="font-medium text-navy">{report.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-navy/70">{report.type}</td>
                        <td className="px-6 py-4 text-sm text-navy/70">{report.period}</td>
                        <td className="px-6 py-4 text-sm text-navy/70">{report.generatedDate}</td>
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
                    ))}
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
