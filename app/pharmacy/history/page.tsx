"use client";

import PharmacyNavbar from "@/components/pharmacy/PharmacyNavbar";
import PharmacySidebar from "@/components/pharmacy/PharmacySidebar";
import { Clock, Pill, Plus, Minus } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";
import * as service from "@/lib/pharmacy-service";

export default function HistoryPage() {
  const [history, setHistory] = useState<service.TransactionHistory[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    service.getPharmacyHistory()
      .then(setHistory)
      .catch(() => setError("Unable to load pharmacy history."))
      .finally(() => setLoading(false));
  }, []);

  const filteredHistory = history.filter((record) =>
    `${record.medicineName} ${record.reason}`.toLowerCase().includes(search.toLowerCase())
  );

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "dispensed":
        return <Minus className="h-4 w-4 text-red-500" />;
      case "added":
        return <Plus className="h-4 w-4 text-green-500" />;
      case "adjusted":
        return <Clock className="h-4 w-4 text-blue-500" />;
      default:
        return null;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "dispensed":
        return "Dispensed";
      case "added":
        return "Added";
      case "adjusted":
        return "Adjusted";
      default:
        return type;
    }
  };

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case "dispensed":
        return "bg-red-50 text-red-700";
      case "added":
        return "bg-green-50 text-green-700";
      case "adjusted":
        return "bg-blue-50 text-blue-700";
      default:
        return "bg-slate-50 text-slate-700";
    }
  };

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
                  <h2 className="text-sm font-semibold text-navy/60">TRANSACTION LOG</h2>
                  <h1 className="mt-2 text-3xl font-bold text-navy">Pharmacy History</h1>
                  <p className="mt-1 text-sm text-navy/60">
                    View all pharmacy transactions and stock movements
                  </p>
                </div>
                <Link href="/pharmacy/dashboard">
                  <button className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-navy shadow-sm hover:bg-slate-50">
                    ← Back to Dashboard
                  </button>
                </Link>
              </div>
            </div>

            {/* Search & Filter */}
            <div className="mb-6 flex gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search medicine name or reason..."
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  className="w-full rounded-lg border border-slate-border bg-white px-4 py-2 text-sm text-navy placeholder-navy/40 focus:border-health-500 focus:outline-none focus:ring-1 focus:ring-health-500"
                />
              </div>
              <button className="rounded-lg border border-slate-border bg-white px-4 py-2 text-sm font-medium text-navy shadow-sm hover:bg-slate-50">
                📅 Date Range
              </button>
            </div>

            {/* History Table */}
            <div className="rounded-lg bg-white shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-slate-border bg-slate-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-navy/60">
                        Medicine
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-navy/60">
                        Transaction Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-navy/60">
                        Quantity
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-navy/60">
                        Reason
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-navy/60">
                        Operator
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-navy/60">
                        Date & Time
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-border">
                    {loading ? (
                      <tr><td colSpan={6} className="px-6 py-10 text-center text-sm text-navy/60">Loading pharmacy history...</td></tr>
                    ) : error ? (
                      <tr><td colSpan={6} className="px-6 py-10 text-center text-sm text-red-600">{error}</td></tr>
                    ) : filteredHistory.length === 0 ? (
                      <tr><td colSpan={6} className="px-6 py-10 text-center text-sm text-navy/60">No pharmacy transactions found.</td></tr>
                    ) : filteredHistory.map((record) => (
                      <tr key={record.id} className="hover:bg-slate-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-health-50 p-2">
                              <Pill className="h-4 w-4 text-health-600" />
                            </div>
                            <span className="font-medium text-navy">{record.medicineName}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${getTypeBadgeColor(record.type)}`}>
                            {getTypeIcon(record.type)}
                            {getTypeLabel(record.type)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-navy/70">
                          {record.quantity} {record.unit}
                        </td>
                        <td className="px-6 py-4 text-sm text-navy/70">{record.reason}</td>
                        <td className="px-6 py-4 text-sm text-navy/70">{record.operator}</td>
                        <td className="px-6 py-4 text-xs text-navy/60">{record.timestamp}</td>
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
