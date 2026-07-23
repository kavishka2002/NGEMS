"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import StatusBadge from '@/components/doctor/StatusBadge';
import Link from 'next/link';

export default function DoctorPatientDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetch(`/api/doctor/patients/${encodeURIComponent(id)}`)
      .then((res) => {
        if (!res.ok) throw new Error('Patient not found');
        return res.json();
      })
      .then((payload) => {
        setData(payload);
        setError(null);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <div className="p-6 text-slate-700">Loading patient details…</div>;
  }

  if (error || !data?.patient) {
    return <div className="p-6 text-rose-700">{error || 'Patient details could not be loaded.'}</div>;
  }

  const { patient, appointments, notes, prescriptions, referrals, admissions, laboratory, radiology } = data;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm text-slate-500">Doctor Portal</p>
          <h1 className="text-3xl font-semibold text-slate-950">{patient.name}</h1>
          <p className="text-sm text-slate-500">Patient ID: {patient.id} · {patient.status}</p>
        </div>
        <Link href="/doctor/patients" className="rounded-2xl bg-brand-700 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-brand-800">
          Back to Patients
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-950">Patient Summary</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm text-slate-500">Age / Gender</p>
                <p className="mt-1 text-slate-900">{patient.age} yrs · {patient.gender}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Blood Type</p>
                <p className="mt-1 text-slate-900">{patient.blood}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Phone</p>
                <p className="mt-1 text-slate-900">{patient.phone}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">NIC</p>
                <p className="mt-1 text-slate-900">{patient.nic}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Last Visit</p>
                <p className="mt-1 text-slate-900">{patient.lastVisit}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Diagnosis</p>
                <p className="mt-1 text-slate-900">{patient.diagnosis}</p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-950">Current Medication</h2>
            <p className="mt-3 text-slate-700">{patient.medication}</p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm text-slate-500">Allergies</p>
                <p className="mt-1 text-slate-900">{patient.allergies}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Patient Status</p>
                <StatusBadge value={patient.status} />
              </div>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-base font-semibold text-slate-950">Recent Appointments</h3>
              <div className="mt-4 space-y-3">
                {appointments.length ? appointments.map((item: any) => (
                  <div key={item.id} className="rounded-2xl bg-slate-50 p-4">
                    <p className="font-semibold text-slate-900">{item.date} · {item.time}</p>
                    <p className="text-sm text-slate-500">{item.type} · {item.reason}</p>
                    <StatusBadge value={item.status} />
                  </div>
                )) : <p className="text-sm text-slate-500">No appointments found.</p>}
              </div>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-base font-semibold text-slate-950">Notes</h3>
              <div className="mt-4 space-y-3">
                {notes.length ? notes.map((note: any) => (
                  <div key={note.id} className="rounded-2xl bg-slate-50 p-4">
                    <p className="font-semibold text-slate-900">{note.date}</p>
                    <p className="text-sm text-slate-500">{note.author}</p>
                    <p className="mt-2 text-slate-700">{note.note}</p>
                  </div>
                )) : <p className="text-sm text-slate-500">No notes found.</p>}
              </div>
            </section>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-950">Prescriptions</h2>
            <div className="mt-4 space-y-3">
              {prescriptions.length ? prescriptions.map((item: any) => (
                <div key={item.id} className="rounded-2xl bg-slate-50 p-4">
                  <p className="font-semibold text-slate-900">{item.medication} · {item.dosage}</p>
                  <p className="text-sm text-slate-500">{item.frequency}</p>
                </div>
              )) : <p className="text-sm text-slate-500">No prescriptions found.</p>}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-950">Referrals</h2>
            <div className="mt-4 space-y-3">
              {referrals.length ? referrals.map((item: any) => (
                <div key={item.id} className="rounded-2xl bg-slate-50 p-4">
                  <p className="font-semibold text-slate-900">{item.referredTo}</p>
                  <p className="text-sm text-slate-500">{item.reason}</p>
                  <StatusBadge value={item.status} />
                </div>
              )) : <p className="text-sm text-slate-500">No referrals found.</p>}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-950">Recent Lab / Radiology</h2>
            <div className="mt-4 space-y-3">
              {laboratory.length ? laboratory.map((item: any) => (
                <div key={item.id} className="rounded-2xl bg-slate-50 p-4">
                  <p className="font-semibold text-slate-900">{item.test}</p>
                  <p className="text-sm text-slate-500">{item.result}</p>
                  <StatusBadge value={item.status} />
                </div>
              )) : <p className="text-sm text-slate-500">No lab tests found.</p>}
              {radiology.length ? radiology.map((item: any) => (
                <div key={item.id} className="rounded-2xl bg-slate-50 p-4">
                  <p className="font-semibold text-slate-900">{item.study}</p>
                  <p className="text-sm text-slate-500">{item.findings}</p>
                  <StatusBadge value={item.status} />
                </div>
              )) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
