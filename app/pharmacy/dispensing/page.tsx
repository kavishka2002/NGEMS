"use client";

import { useEffect, useState } from "react";
import PharmacyNavbar from "@/components/pharmacy/PharmacyNavbar";
import PharmacySidebar from "@/components/pharmacy/PharmacySidebar";
import Button from "@/components/Button";
import { Plus, Search } from "lucide-react";
import Link from "next/link";
import * as service from "@/lib/pharmacy-service";

export default function DispensingPage() {
  const [dispensing, setDispensing] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    service.getDispensing().then((data) => {
      if (mounted) setDispensing(data);
    }).catch((err) => {
      console.error('Failed to load dispensing records', err);
    }).finally(() => {
      if (mounted) setLoading(false);
    });
    return () => { mounted = false; };
  }, []);

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
            {loading ? (
              <div className="text-center py-12 text-slate-500">Loading dispensing records...</div>
            ) : dispensing.length === 0 ? (
              <div className="text-center py-12 text-slate-500">No dispensing records found.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-border bg-slate-50">
                      <th className="px-4 py-3 text-left font-semibold text-navy">Prescription ID</th>
                      <th className="px-4 py-3 text-left font-semibold text-navy">Items</th>
                      <th className="px-4 py-3 text-left font-semibold text-navy">Performed By</th>
                      <th className="px-4 py-3 text-left font-semibold text-navy">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-border">
                    {dispensing.map((record) => (
                      <tr key={record.id} className="hover:bg-slate-50">
                        <td className="px-4 py-3 text-sm text-slate-700">{record.prescriptionId}</td>
                        <td className="px-4 py-3 text-sm text-slate-700">{(record.items || []).map((item: any) => item.name || item).join(', ')}</td>
                        <td className="px-4 py-3 text-sm text-slate-700">{record.performedBy || '-'}</td>
                        <td className="px-4 py-3 text-sm text-slate-700">{record.createdAt?.slice(0, 10) || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <div className="mt-6 text-center">
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
