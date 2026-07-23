"use client";

import { useEffect, useState } from 'react';
import { medicalNotes } from '@/lib/data';

export default function DoctorMedicalNotesPage() {
  const [notes, setNotes] = useState(medicalNotes);

  useEffect(() => {
    fetch('/api/doctor/medical-notes')
      .then((res) => res.json())
      .then((data) => setNotes(data.medicalNotes))
      .catch(() => setNotes(medicalNotes));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-slate-500">Doctor Portal</p>
        <h1 className="text-3xl font-semibold text-slate-950">Medical Notes</h1>
        <p className="mt-1 text-sm text-slate-500">Review and create patient notes.</p>
      </div>

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="divide-y divide-slate-200">
          {notes.map((note) => (
            <div key={note.id} className="space-y-3 px-6 py-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-semibold text-slate-950">{note.patient}</p>
                  <p className="text-xs text-slate-500">{note.patientId} • {note.date}</p>
                </div>
                <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">{note.author}</div>
              </div>
              <p className="text-sm leading-6 text-slate-700">{note.note}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
