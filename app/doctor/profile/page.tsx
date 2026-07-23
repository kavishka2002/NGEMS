"use client";

import { useEffect, useState } from 'react';
import { doctorProfile } from '@/lib/data';

export default function DoctorProfilePage() {
  const [profile, setProfile] = useState(doctorProfile);

  useEffect(() => {
    fetch('/api/doctor/profile')
      .then((res) => res.json())
      .then((data) => setProfile(data.doctorProfile))
      .catch(() => setProfile(doctorProfile));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-slate-500">Doctor Portal</p>
        <h1 className="text-3xl font-semibold text-slate-950">Profile</h1>
        <p className="mt-1 text-sm text-slate-500">View your professional profile and contact details.</p>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-sm text-slate-500">Name</p>
            <p className="mt-1 text-lg font-semibold text-slate-950">{profile.name}</p>
          </div>
          <div>
            <p className="text-sm text-slate-500">Specialization</p>
            <p className="mt-1 text-lg font-semibold text-slate-950">{profile.specialization}</p>
          </div>
          <div>
            <p className="text-sm text-slate-500">Department</p>
            <p className="mt-1 text-lg font-semibold text-slate-950">{profile.department}</p>
          </div>
          <div>
            <p className="text-sm text-slate-500">Status</p>
            <p className="mt-1 text-lg font-semibold text-emerald-600">{profile.status}</p>
          </div>
          <div>
            <p className="text-sm text-slate-500">Email</p>
            <p className="mt-1 text-lg font-semibold text-slate-950">{profile.email}</p>
          </div>
          <div>
            <p className="text-sm text-slate-500">Phone</p>
            <p className="mt-1 text-lg font-semibold text-slate-950">{profile.phone}</p>
          </div>
          <div className="sm:col-span-2">
            <p className="text-sm text-slate-500">Experience</p>
            <p className="mt-1 text-lg font-semibold text-slate-950">{profile.experience}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
