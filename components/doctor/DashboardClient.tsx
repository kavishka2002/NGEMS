'use client';

import Link from 'next/link';
import { Activity, ArrowUpRight, BedDouble, CalendarDays, Clock3, ClipboardPlus, FlaskConical, ScanLine, Stethoscope, Users } from 'lucide-react';
import { queue } from '@/lib/data';
import StatusBadge from './StatusBadge';
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const stats = [
  ['Today’s Appointments', '18', '12 completed', CalendarDays],
  ['Today’s Patients', '24', '7 waiting', Users],
  ['Pending Lab Results', '8', '2 abnormal', FlaskConical],
  ['Radiology Reports', '5', '3 available', ScanLine],
  ['Admissions', '6', '2 new today', BedDouble],
  ['Follow-ups', '11', 'Next 7 days', Activity],
] as const;

const chart = [
  { d: 'Mon', p: 18 },
  { d: 'Tue', p: 24 },
  { d: 'Wed', p: 21 },
  { d: 'Thu', p: 29 },
  { d: 'Fri', p: 26 },
  { d: 'Sat', p: 14 },
  { d: 'Sun', p: 9 },
];

export default function DashboardClient() {
  return (
    <>
      <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-medium text-brand-700">Wednesday, 22 July 2026 · 10:42 AM</p>
          <h1 className="mt-1 text-3xl font-bold">Good Morning, Dr. Kasun</h1>
          <p className="mt-2 text-slate-500">Here is your clinical overview for today.</p>
        </div>
        <Link href="/doctor/queue" className="btn-primary inline-flex items-center gap-2">
          <Stethoscope size={18} /> Start Consultation
        </Link>
      </div>

      <div className="mb-6 grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
        {stats.map(([title, value, sub, Icon]) => (
          <div key={title} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md min-h-[180px]">
            <div className="flex h-full flex-col justify-between gap-4">
              <div>
                <div className="flex items-start justify-between gap-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">{title}</p>
                  <div className="rounded-3xl bg-brand-50 p-3 text-brand-700 shadow-sm">
                    <Icon size={20} />
                  </div>
                </div>
                <div className="mt-5 text-3xl font-semibold leading-none text-slate-950">{value}</div>
                <p className="mt-2 text-sm text-slate-500">{sub}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-bold">Today’s Patient Queue</h2>
            <Link href="/doctor/queue" className="text-sm font-semibold text-brand-700">
              View all
            </Link>
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
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {queue.map((q) => (
                  <tr key={q.no} className={q.priority === 'Emergency' ? 'bg-red-50' : ''}>
                    <td className="whitespace-nowrap px-4 py-4 font-semibold text-slate-900">{q.no}</td>
                    <td className="px-4 py-4">
                      <div className="font-semibold text-slate-900">{q.patient}</div>
                      <div className="text-[11px] text-slate-500">{q.id}</div>
                    </td>
                    <td className="px-4 py-4 text-slate-700">{q.time}</td>
                    <td className="px-4 py-4">
                      <StatusBadge value={q.priority} />
                    </td>
                    <td className="px-4 py-4">
                      <StatusBadge value={q.status} />
                    </td>
                    <td className="px-4 py-4 text-right">
                      <Link href={`/doctor/patients/${q.id}/consultation`} className="font-semibold text-brand-700 hover:text-brand-800">
                        Open
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="font-bold">Patients Seen</h2>
              <p className="text-xs text-slate-500">Last 7 days</p>
            </div>
            <ArrowUpRight className="text-emerald-600" />
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chart}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="d" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="p" stroke="#138a72" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 flex items-center gap-2 rounded-xl bg-amber-50 p-3 text-sm text-amber-800">
            <Clock3 size={18} /> Next clinic session starts at 1:30 PM.
          </div>
        </div>
      </div>
    </>
  );
}
