"use client";

import LaboratoryNavbar from "@/components/laboratory/LaboratoryNavbar";
import LaboratorySidebar from "@/components/laboratory/LaboratorySidebar";
import { BarChart3, TrendingUp, Users, Zap } from "lucide-react";
import Link from "next/link";

export default function AnalyticsPage() {
  return (
    <div className="flex h-screen bg-slate-50">
      <LaboratorySidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <LaboratoryNavbar />
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 md:p-8">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-semibold text-navy/60">INSIGHTS & METRICS</h2>
                  <h1 className="mt-2 text-3xl font-bold text-navy">Analytics Dashboard</h1>
                  <p className="mt-1 text-sm text-navy/60">
                    Laboratory performance metrics and trends
                  </p>
                </div>
                <Link href="/laboratory/dashboard">
                  <button className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-navy shadow-sm hover:bg-slate-50">
                    ← Back to Dashboard
                  </button>
                </Link>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="grid gap-4 md:grid-cols-4">
              <div className="rounded-lg bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-navy/60">
                      Tests Completed
                    </p>
                    <p className="mt-2 text-3xl font-bold text-seal-600">487</p>
                    <p className="mt-1 text-xs text-green-600">↑ 12% from last month</p>
                  </div>
                  <div className="rounded-lg bg-seal-50 p-4">
                    <Zap className="h-6 w-6 text-seal-600" />
                  </div>
                </div>
              </div>

              <div className="rounded-lg bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-navy/60">
                      Avg Turnaround
                    </p>
                    <p className="mt-2 text-3xl font-bold text-blue-600">2.3h</p>
                    <p className="mt-1 text-xs text-green-600">↓ 15 mins faster</p>
                  </div>
                  <div className="rounded-lg bg-blue-50 p-4">
                    <TrendingUp className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="rounded-lg bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-navy/60">
                      Accuracy Rate
                    </p>
                    <p className="mt-2 text-3xl font-bold text-green-600">99.2%</p>
                    <p className="mt-1 text-xs text-green-600">↑ 0.3% improvement</p>
                  </div>
                  <div className="rounded-lg bg-green-50 p-4">
                    <BarChart3 className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="rounded-lg bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-navy/60">
                      Active Technicians
                    </p>
                    <p className="mt-2 text-3xl font-bold text-purple-600">8</p>
                    <p className="mt-1 text-xs text-purple-600">2 on break</p>
                  </div>
                  <div className="rounded-lg bg-purple-50 p-4">
                    <Users className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Charts Section */}
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {/* Test Volume Chart */}
              <div className="rounded-lg bg-white p-6 shadow-sm">
                <h3 className="mb-4 font-semibold text-navy">Monthly Test Volume</h3>
                <div className="space-y-3">
                  {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"].map((month, idx) => (
                    <div key={month} className="flex items-center gap-3">
                      <span className="w-10 text-sm font-medium text-navy/60">{month}</span>
                      <div className="flex-1 rounded-full bg-slate-100 h-6">
                        <div
                          className="rounded-full bg-gradient-to-r from-seal-500 to-seal-600 h-6"
                          style={{ width: `${[65, 72, 68, 80, 85, 92, 88][idx]}%` }}
                        ></div>
                      </div>
                      <span className="w-12 text-right text-sm font-medium text-navy">
                        {[465, 512, 487, 571, 607, 656, 628][idx]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Test Types Distribution */}
              <div className="rounded-lg bg-white p-6 shadow-sm">
                <h3 className="mb-4 font-semibold text-navy">Test Types Distribution</h3>
                <div className="space-y-4">
                  {[
                    { name: "Blood Work", count: 245, percentage: 35 },
                    { name: "Urine Tests", count: 156, percentage: 22 },
                    { name: "COVID-19", count: 112, percentage: 16 },
                    { name: "Other", count: 240, percentage: 27 },
                  ].map((test) => (
                    <div key={test.name} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-navy">{test.name}</span>
                        <span className="text-sm font-semibold text-seal-600">{test.count}</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-slate-100">
                        <div
                          className="h-2 rounded-full bg-seal-500"
                          style={{ width: `${test.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Performance Stats */}
            <div className="mt-8 rounded-lg bg-white p-6 shadow-sm">
              <h3 className="mb-4 font-semibold text-navy">Performance Summary</h3>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="border-l-4 border-seal-500 pl-4">
                  <p className="text-xs font-semibold text-navy/60">TESTS THIS MONTH</p>
                  <p className="mt-1 text-2xl font-bold text-navy">628</p>
                  <p className="mt-1 text-xs text-navy/60">↑ 4% from last month</p>
                </div>
                <div className="border-l-4 border-green-500 pl-4">
                  <p className="text-xs font-semibold text-navy/60">REPORTED RESULTS</p>
                  <p className="mt-1 text-2xl font-bold text-navy">612</p>
                  <p className="mt-1 text-xs text-navy/60">97.5% completion rate</p>
                </div>
                <div className="border-l-4 border-blue-500 pl-4">
                  <p className="text-xs font-semibold text-navy/60">AVG ACCURACY</p>
                  <p className="mt-1 text-2xl font-bold text-navy">99.2%</p>
                  <p className="mt-1 text-xs text-navy/60">Quality assurance: Excellent</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
