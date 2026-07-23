"use client";

import PharmacyNavbar from "@/components/pharmacy/PharmacyNavbar";
import PharmacySidebar from "@/components/pharmacy/PharmacySidebar";
import { useEffect, useState } from "react";
import { AlertCircle, TrendingDown, Package } from "lucide-react";
import Link from "next/link";
import * as service from "@/lib/pharmacy-service";

interface StockAlert {
  id: string;
  name: string;
  quantity: number;
  minStock: number;
  unit?: string;
  status?: string;
  updatedAt?: string;
}

export default function StockAlertsPage() {
  const [alerts, setAlerts] = useState<StockAlert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    service.getStockAlerts().then((data) => {
      if (mounted) setAlerts(data);
    }).catch((err) => {
      console.error('Failed to load stock alerts', err);
    }).finally(() => {
      if (mounted) setLoading(false);
    });
    return () => { mounted = false; };
  }, []);

  const criticalCount = alerts.filter((a) => (a.quantity || 0) <= (a.minStock || 0) / 2).length;
  const warningCount = alerts.filter((a) => (a.quantity || 0) > (a.minStock || 0) / 2).length;

  return (
    <div className="flex h-screen bg-slate-50">
      <PharmacySidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <PharmacyNavbar />
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 md:p-8">
            {/* Header */}
            <div className="mb-8">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-semibold text-navy/60">STOCK MANAGEMENT</h2>
                  <h1 className="mt-2 text-3xl font-bold text-navy">Stock Alerts</h1>
                  <p className="mt-1 text-sm text-navy/60">
                    Monitor medicine stock levels and manage low inventory
                  </p>
                </div>
                <Link href="/pharmacy/dashboard">
                  <button className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-navy shadow-sm hover:bg-slate-50">
                    ← Back to Dashboard
                  </button>
                </Link>
              </div>

              {/* Summary Cards */}
              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-lg bg-white p-4 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-red-100 p-3">
                      <AlertCircle className="h-5 w-5 text-red-600" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-navy/60">CRITICAL</p>
                      <p className="text-2xl font-bold text-red-600">{criticalCount}</p>
                    </div>
                  </div>
                </div>
                <div className="rounded-lg bg-white p-4 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-yellow-100 p-3">
                      <TrendingDown className="h-5 w-5 text-yellow-600" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-navy/60">WARNING</p>
                      <p className="text-2xl font-bold text-yellow-600">{warningCount}</p>
                    </div>
                  </div>
                </div>
                <div className="rounded-lg bg-white p-4 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-green-100 p-3">
                      <Package className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-navy/60">TOTAL ITEMS</p>
                      <p className="text-2xl font-bold text-green-600">{alerts.length}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Alerts Table */}
            <div className="rounded-lg bg-white shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-slate-border bg-slate-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-navy/60">
                        Medicine Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-navy/60">
                        Current Stock
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-navy/60">
                        Minimum Level
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-navy/60">
                        Variance
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-navy/60">
                        Severity
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-navy/60">
                        Last Updated
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-border">
                    {loading ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-8 text-center text-slate-500">Loading stock alerts...</td>
                      </tr>
                    ) : alerts.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-8 text-center text-slate-500">No low stock items found.</td>
                      </tr>
                    ) : (
                      alerts.map((alert) => (
                        <tr key={alert.id} className="hover:bg-slate-50">
                          <td className="px-6 py-4 text-sm font-medium text-navy">{alert.name || 'Unknown'}</td>
                          <td className="px-6 py-4 text-sm text-navy/70">{alert.quantity ?? 0} {alert.unit || ''}</td>
                          <td className="px-6 py-4 text-sm text-navy/70">{alert.minStock ?? 0} {alert.unit || ''}</td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${
                                (alert.quantity ?? 0) < ((alert.minStock ?? 0) / 2)
                                  ? "bg-red-100 text-red-700"
                                  : "bg-yellow-100 text-yellow-700"
                              }`}
                            >
                              -{Math.max((alert.minStock ?? 0) - (alert.quantity ?? 0), 0)} {alert.unit || ''}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${
                                (alert.quantity ?? 0) <= ((alert.minStock ?? 0) / 2)
                                  ? "bg-red-100 text-red-700"
                                  : "bg-yellow-100 text-yellow-700"
                              }`}
                            >
                              {(alert.quantity ?? 0) <= ((alert.minStock ?? 0) / 2) ? "🔴" : "🟡"} {((alert.quantity ?? 0) <= ((alert.minStock ?? 0) / 2) ? 'CRITICAL' : 'WARNING')}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-xs text-navy/60">{alert.updatedAt?.slice(0, 16) || '-'}</td>
                        </tr>
                      ))
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
