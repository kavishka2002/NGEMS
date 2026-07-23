"use client";

import { useEffect, useState } from 'react';
import { schedule } from '@/lib/data';
import StatusBadge from '@/components/doctor/StatusBadge';

export default function DoctorSchedulePage() {
  const [items, setItems] = useState(schedule);

  useEffect(() => {
    fetch('/api/doctor/schedule')
      .then((res) => res.json())
      .then((data) => setItems(data.schedule))
      .catch(() => setItems(schedule));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-slate-500">Doctor Portal</p>
        <h1 className="text-3xl font-semibold text-slate-950">My Schedule</h1>
        <p className="mt-1 text-sm text-slate-500">See your upcoming clinic sessions and patient appointments.</p>
      </div>

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Date</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Time</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Type</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Patient</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {items.map((item) => (
              <tr key={item.id}>
                <td className="px-4 py-4 font-semibold text-slate-950">{item.date}</td>
                <td className="px-4 py-4 text-slate-700">{item.time}</td>
                <td className="px-4 py-4 text-slate-700">{item.type}</td>
                <td className="px-4 py-4 text-slate-700">{item.patient}</td>
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
