"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { queue } from '@/lib/data';
import StatusBadge from '@/components/doctor/StatusBadge';

export default function DoctorQueuePage() {
  const [queueList, setQueueList] = useState(queue);

  useEffect(() => {
    fetch('/api/doctor/queue')
      .then((res) => res.json())
      .then((data) => setQueueList(data.queue))
      .catch(() => setQueueList(queue));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-slate-500">Doctor Portal</p>
        <h1 className="text-3xl font-semibold text-slate-950">Today’s Queue</h1>
      </div>

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Queue</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Patient</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Time</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Priority</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Status</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {queueList.map((item) => (
              <tr key={item.no} className={item.priority === 'Emergency' ? 'bg-red-50' : ''}>
                <td className="px-4 py-4 font-semibold text-slate-900">{item.no}</td>
                <td className="px-4 py-4">
                  <div className="font-semibold text-slate-900">{item.patient}</div>
                  <div className="text-xs text-slate-500">{item.id}</div>
                </td>
                <td className="px-4 py-4 text-slate-700">{item.time}</td>
                <td className="px-4 py-4">
                  <StatusBadge value={item.priority} />
                </td>
                <td className="px-4 py-4">
                  <StatusBadge value={item.status} />
                </td>
                <td className="px-4 py-4 text-right">
                  <Link href={`/doctor/patients/${item.id}/consultation`} className="text-brand-700 hover:text-brand-900 font-semibold">
                    Open
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
