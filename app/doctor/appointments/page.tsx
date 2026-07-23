"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { appointments } from '@/lib/data';
import StatusBadge from '@/components/doctor/StatusBadge';

export default function DoctorAppointmentsPage() {
  const [appointmentList, setAppointmentList] = useState(appointments);

  useEffect(() => {
    fetch('/api/doctor/appointments')
      .then((res) => res.json())
      .then((data) => setAppointmentList(data.appointments))
      .catch(() => setAppointmentList(appointments));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm text-slate-500">Doctor Portal</p>
          <h1 className="text-3xl font-semibold text-slate-950">Appointments</h1>
          <p className="mt-1 text-sm text-slate-500">Manage upcoming consultations and appointment status.</p>
        </div>
        <Link href="/doctor/appointments" className="rounded-2xl bg-brand-700 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-brand-800">
          Refresh Appointments
        </Link>
      </div>

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Appointment</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Patient</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Date</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Type</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Status</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {appointmentList.map((appointment) => (
              <tr key={appointment.id}>
                <td className="px-4 py-4 text-slate-900 font-semibold">{appointment.id}</td>
                <td className="px-4 py-4 text-slate-700">{appointment.patient}</td>
                <td className="px-4 py-4 text-slate-700">{appointment.date} · {appointment.time}</td>
                <td className="px-4 py-4 text-slate-700">{appointment.type}</td>
                <td className="px-4 py-4">
                  <StatusBadge value={appointment.status} />
                </td>
                <td className="px-4 py-4 text-right">
                  <Link href={`/doctor/appointments/${appointment.id}`} className="text-brand-700 hover:text-brand-900 font-semibold">
                    Details
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
