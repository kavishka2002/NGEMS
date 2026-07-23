"use client";

import { useEffect, useState } from 'react';
import { referrals } from '@/lib/data';
import StatusBadge from '@/components/doctor/StatusBadge';

export default function DoctorReferralsPage() {
  const [items, setItems] = useState(referrals);

  useEffect(() => {
    fetch('/api/doctor/referrals')
      .then((res) => res.json())
      .then((data) => setItems(data.referrals))
      .catch(() => setItems(referrals));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-slate-500">Doctor Portal</p>
        <h1 className="text-3xl font-semibold text-slate-950">Referrals</h1>
        <p className="mt-1 text-sm text-slate-500">Review and send referrals to specialists.</p>
      </div>

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Referral ID</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Patient</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Referred To</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Reason</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {items.map((item) => (
              <tr key={item.id}>
                <td className="px-4 py-4 font-semibold text-slate-950">{item.id}</td>
                <td className="px-4 py-4 text-slate-700">{item.patient}</td>
                <td className="px-4 py-4 text-slate-700">{item.referredTo}</td>
                <td className="px-4 py-4 text-slate-700">{item.reason}</td>
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
