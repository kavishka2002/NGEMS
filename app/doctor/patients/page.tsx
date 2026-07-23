"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { patients } from '@/lib/data';
import StatusBadge from '@/components/doctor/StatusBadge';

export default function DoctorPatientsPage() {
  const [patientList, setPatientList] = useState(patients);

  useEffect(() => {
    fetch('/api/doctor/patients')
      .then((res) => res.json())
      .then((data) => setPatientList(data.patients))
      .catch(() => setPatientList(patients));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-slate-500">Doctor Portal</p>
          <h1 className="text-3xl font-semibold text-slate-950">My Patients</h1>
        </div>
        <Link href="/doctor/patients" className="rounded-2xl bg-brand-700 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-brand-800">
          Refresh List
        </Link>
      </div>

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Patient</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">NIC</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Phone</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Status</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {patientList.map((patient) => (
              <tr key={patient.id}>
                <td className="px-4 py-4">
                  <div className="font-semibold text-slate-950">{patient.name}</div>
                  <div className="text-xs text-slate-500">{patient.age} yrs · {patient.gender}</div>
                </td>
                <td className="px-4 py-4 text-slate-700">{patient.nic}</td>
                <td className="px-4 py-4 text-slate-700">{patient.phone}</td>
                <td className="px-4 py-4">
                  <StatusBadge value={patient.status} />
                </td>
                <td className="px-4 py-4 text-right">
                  <Link href={`/doctor/patients/${patient.id}`} className="text-brand-700 hover:text-brand-900 font-semibold">
                    View
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
