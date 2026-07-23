"use client";

import { useEffect, useState } from 'react';
import { admissions } from '@/lib/data';
import StatusBadge from '@/components/doctor/StatusBadge';

export default function DoctorAdmissionsPage() {
  const [items, setItems] = useState(admissions);

  useEffect(() => {
    fetch('/api/doctor/admissions')
      .then((res) => res.json())
      .then((data) => setItems(data.admissions))
      .catch(() => setItems(admissions));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-slate-500">Doctor Portal</p>
        <h1 className="text-3xl font-semibold text-slate-950">Admissions</h1>
        <p className="mt-1 text-sm text-slate-500">Track current patient admissions and bed assignments.</p>
      </div>

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Admission ID</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Patient</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Ward / Bed</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Admitted On</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {items.map((item) => (
              <tr key={item.admissionId}>
                <td className="px-4 py-4 font-semibold text-slate-950">{item.admissionId}</td>
                <td className="px-4 py-4 text-slate-700">{item.patient}</td>
                <td className="px-4 py-4 text-slate-700">{item.ward} · {item.bed}</td>
                <td className="px-4 py-4 text-slate-700">{item.admittedOn}</td>
                <td className="px-4 py-4">
                  <StatusBadge value={item.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
