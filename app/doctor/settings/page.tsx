"use client";

import { useEffect, useState } from 'react';
import { doctorProfile } from '@/lib/data';

export default function DoctorSettingsPage() {
  const [profile, setProfile] = useState(doctorProfile);
  const [prefs, setPrefs] = useState({
    unreadBadge: true,
    emailReminders: true,
    profileVisibility: true,
    defaultPage: 'dashboard',
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch('/api/doctor/profile')
      .then((res) => res.json())
      .then((data) => setProfile(data.doctorProfile))
      .catch(() => setProfile(doctorProfile));

    if (typeof window !== 'undefined') {
      const storedProfile = window.localStorage.getItem('doctorProfileSettings');
      const storedPrefs = window.localStorage.getItem('doctorSettingsPreferences');
      if (storedProfile) setProfile(JSON.parse(storedProfile));
      if (storedPrefs) setPrefs(JSON.parse(storedPrefs));
    }
  }, []);

  const handleSave = () => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem('doctorProfileSettings', JSON.stringify(profile));
    window.localStorage.setItem('doctorSettingsPreferences', JSON.stringify(prefs));
    setSaved(true);
    window.setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-slate-500">Doctor Portal</p>
        <h1 className="text-3xl font-semibold text-slate-950">Settings</h1>
        <p className="mt-1 text-sm text-slate-500">Update your profile and notification preferences.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_0.7fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-950">Account Settings</h2>
          <div className="mt-5 grid gap-4">
            <div>
              <label className="text-sm font-semibold text-slate-700" htmlFor="profile-name">Name</label>
              <input
                id="profile-name"
                value={profile.name}
                onChange={(event) => setProfile({ ...profile, name: event.target.value })}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-700" htmlFor="profile-email">Email</label>
              <input
                id="profile-email"
                type="email"
                value={profile.email}
                onChange={(event) => setProfile({ ...profile, email: event.target.value })}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-700" htmlFor="profile-phone">Phone</label>
              <input
                id="profile-phone"
                value={profile.phone}
                onChange={(event) => setProfile({ ...profile, phone: event.target.value })}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-700" htmlFor="profile-department">Department</label>
              <input
                id="profile-department"
                value={profile.department}
                onChange={(event) => setProfile({ ...profile, department: event.target.value })}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-700" htmlFor="profile-specialization">Specialization</label>
              <input
                id="profile-specialization"
                value={profile.specialization}
                onChange={(event) => setProfile({ ...profile, specialization: event.target.value })}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-700" htmlFor="profile-status">Status</label>
              <select
                id="profile-status"
                value={profile.status}
                onChange={(event) => setProfile({ ...profile, status: event.target.value })}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
              >
                <option value="Available">Available</option>
                <option value="Busy">Busy</option>
                <option value="Away">Away</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-700" htmlFor="profile-experience">Experience</label>
              <input
                id="profile-experience"
                value={profile.experience}
                onChange={(event) => setProfile({ ...profile, experience: event.target.value })}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
              />
            </div>
            <button
              onClick={handleSave}
              className="mt-2 inline-flex items-center justify-center rounded-2xl bg-brand-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-800"
            >
              Save Changes
            </button>
            {saved && <p className="text-sm text-emerald-600">Settings saved successfully.</p>}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-950">Notification Preferences</h2>
          <div className="mt-5 space-y-4">
            <div className="flex flex-col gap-3 rounded-2xl bg-slate-50 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-slate-900">Unread notification badge</p>
                  <p className="text-sm text-slate-500">Show the red dot for new notifications.</p>
                </div>
                <label className="inline-flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={prefs.unreadBadge}
                    onChange={(event) => setPrefs({ ...prefs, unreadBadge: event.target.checked })}
                    className="h-5 w-5 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                  />
                </label>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-slate-900">Email reminders</p>
                  <p className="text-sm text-slate-500">Send reminder emails for upcoming appointments.</p>
                </div>
                <label className="inline-flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={prefs.emailReminders}
                    onChange={(event) => setPrefs({ ...prefs, emailReminders: event.target.checked })}
                    className="h-5 w-5 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                  />
                </label>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-slate-900">Profile visibility</p>
                  <p className="text-sm text-slate-500">Allow staff to see your profile and availability.</p>
                </div>
                <label className="inline-flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={prefs.profileVisibility}
                    onChange={(event) => setPrefs({ ...prefs, profileVisibility: event.target.checked })}
                    className="h-5 w-5 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                  />
                </label>
              </div>
              <div>
                <label htmlFor="default-page" className="font-semibold text-slate-900">Default landing page</label>
                <select
                  id="default-page"
                  value={prefs.defaultPage}
                  onChange={(event) => setPrefs({ ...prefs, defaultPage: event.target.value })}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                >
                  <option value="dashboard">Dashboard</option>
                  <option value="patients">Patients</option>
                  <option value="appointments">Appointments</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
