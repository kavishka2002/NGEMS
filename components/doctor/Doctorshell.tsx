'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Activity, BedDouble, Bell, CalendarDays, ChevronLeft, ClipboardList, FileText, FlaskConical, LayoutDashboard, LogOut, Menu, NotebookPen, Search, ScanLine, Settings, Stethoscope, User, Users, X } from 'lucide-react';
import { doctor } from '@/lib/data';
import StatusDot from './StatusDot';

const nav = [
  ['Dashboard', '/doctor', LayoutDashboard],
  ['My Patients', '/doctor/patients', Users],
  ['Appointments', '/doctor/appointments', CalendarDays],
  ["Today's Queue", '/doctor/queue', ClipboardList],
  ['Prescriptions', '/doctor/prescriptions', FileText],
  ['Laboratory', '/doctor/laboratory', FlaskConical],
  ['Radiology', '/doctor/radiology', ScanLine],
  ['Admissions', '/doctor/admissions', BedDouble],
  ['Referrals', '/doctor/referrals', Activity],
  ['Medical Notes', '/doctor/medical-notes', NotebookPen],
  ['My Schedule', '/doctor/schedule', CalendarDays],
  ['Notifications', '/doctor/notifications', Bell],
  ['Profile', '/doctor/profile', User],
  ['Settings', '/doctor/settings', Settings],
] as const;

export default function DoctorShell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [notificationsCount, setNotificationsCount] = useState(0);
  const [notificationsRead, setNotificationsRead] = useState(false);
  const [profile, setProfile] = useState({
    name: doctor.name,
    specialization: doctor.specialization,
    status: doctor.status,
  });

  useEffect(() => {
    const rawSession = window.localStorage.getItem('ngemsHospitalSession');
    if (!rawSession) return;

    try {
      const session = JSON.parse(rawSession) as Record<string, unknown>;
      const username = typeof session.username === 'string' ? session.username : '';
      const fullName = typeof session.fullName === 'string' ? session.fullName : '';
      const specialization = typeof session.specialization === 'string' ? session.specialization : '';
      setProfile((current) => ({
        name: fullName || username || current.name,
        specialization: specialization || current.specialization,
        status: current.status,
      }));
    } catch {
      // Keep the default profile when the saved session is invalid.
    }
  }, []);

  useEffect(() => {
    if (!search.trim()) {
      setSearchResults([]);
      return;
    }

    const controller = new AbortController();
    fetch(`/api/doctor/search?q=${encodeURIComponent(search)}`, { signal: controller.signal })
      .then((res) => res.json())
      .then((data) => {
        setSearchResults([...data.patientMatches, ...data.appointmentMatches].slice(0, 6));
      })
      .catch(() => setSearchResults([]));

    return () => controller.abort();
  }, [search]);

  useEffect(() => {
    const read = window.localStorage.getItem('doctorNotificationsRead') === 'true';
    setNotificationsRead(read);

    fetch('/api/doctor/notifications')
      .then((res) => res.json())
      .then((data) => {
        const unreadCount = data.notifications.filter((item: any) => item.unread).length;
        setNotificationsCount(read ? 0 : unreadCount);
      })
      .catch(() => setNotificationsCount(0));
  }, []);

  useEffect(() => {
    if (path === '/doctor/notifications') {
      window.localStorage.setItem('doctorNotificationsRead', 'true');
      setNotificationsRead(true);
      setNotificationsCount(0);
    }
  }, [path]);

  const Side = () => (
    <aside className={`h-full bg-slate-950 text-slate-100 transition-all ${collapsed ? 'w-20' : 'w-72'}`}>
      <div className="flex h-20 items-center justify-between border-b border-slate-800 px-5">
        <Link href="/doctor" className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-2xl bg-white text-slate-950 shadow-sm">
            <Stethoscope size={22} />
          </div>
          {!collapsed && (
            <div>
              <div className="text-lg font-semibold text-white">N-GEMS</div>
              <div className="text-xs text-slate-400">Doctor Portal</div>
            </div>
          )}
        </Link>
        <button onClick={() => setCollapsed(!collapsed)} className="hidden rounded-lg p-2 text-slate-300 transition hover:bg-white/10 lg:block">
          <ChevronLeft className={collapsed ? 'rotate-180' : ''} />
        </button>
      </div>
      <nav className="space-y-2 p-3">
        {nav.map(([label, href, Icon]) => (
          <Link
            key={href}
            href={href}
            onClick={() => setOpen(false)}
            className={`flex items-center gap-3 rounded-2xl px-3 py-3 text-sm transition ${
              path === href
                ? 'bg-slate-200 text-slate-950 shadow-sm'
                : 'text-slate-300 hover:bg-white/10 hover:text-white'
            }`}
          >
            <Icon size={18} />
            {!collapsed && label}
          </Link>
        ))}
        <Link href="/staff-login" className="mt-4 flex items-center gap-3 rounded-2xl bg-rose-500/10 px-3 py-3 text-sm text-rose-200 transition hover:bg-rose-500/20">
          <LogOut size={19} />
          {!collapsed && 'Logout'}
        </Link>
      </nav>
    </aside>
  );

  return (
    <div className="min-h-screen lg:flex bg-slate-100">
      <div className="hidden lg:block">
        <Side />
      </div>
      {open && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <div className="relative">
            <Side />
          </div>
          <button className="relative m-3 h-10 rounded-xl bg-white p-2" onClick={() => setOpen(false)}>
            <X />
          </button>
        </div>
      )}
      <main className="min-w-0 flex-1 bg-slate-100">
        <header className="sticky top-0 z-30 flex h-20 items-center gap-4 border-b border-slate-200 bg-white/95 px-4 backdrop-blur md:px-6 shadow-sm">
          <button className="rounded-xl border p-2 lg:hidden" onClick={() => setOpen(true)}>
            <Menu />
          </button>
          <div className="relative max-w-xl flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-2.5 pl-11 pr-4 text-sm text-slate-900 shadow-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
              placeholder="Search patient by ID, NIC, name or phone"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {searchResults.length > 0 && (
              <div className="absolute top-12 z-50 w-full rounded-xl border border-slate-200 bg-white p-2 shadow-xl">
                {searchResults.map((item) => (
                  <Link
                    key={item.id ?? item.patientId}
                    href={item.patientId ? `/doctor/patients/${item.patientId}` : `/doctor/patients/${item.id}`}
                    onClick={() => setSearch('')}
                    className="flex justify-between rounded-lg px-3 py-3 text-sm text-slate-700 transition hover:bg-slate-50"
                  >
                    <div>
                      <div className="font-semibold">{item.name ?? item.patient}</div>
                      <div className="text-[11px] text-slate-500">{item.patientId ?? item.id} • {item.reason ?? item.nic ?? item.type}</div>
                    </div>
                    <StatusDot status={item.status ?? item.type ?? 'Info'} />
                  </Link>
                ))}
              </div>
            )}
          </div>
          <Link
            href="/doctor/notifications"
            onClick={() => {
              window.localStorage.setItem('doctorNotificationsRead', 'true');
              setNotificationsRead(true);
              setNotificationsCount(0);
            }}
            className="relative rounded-xl border border-slate-200 bg-white/90 p-2.5 text-slate-700 transition hover:border-brand-300 hover:text-brand-700"
          >
            <Bell size={19} />
            {notificationsCount > 0 && !notificationsRead && (
              <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-rose-500 ring-2 ring-white" />
            )}
          </Link>
          <div className="hidden items-center gap-3 md:flex">
            <div className="grid h-10 w-10 place-items-center rounded-full bg-brand-100 font-bold text-brand-700">{profile.name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase()}</div>
            <div>
              <div className="text-sm font-semibold text-slate-900">{profile.name}</div>
              <div className="text-xs text-slate-500">{profile.specialization} · <span className="text-emerald-600">{profile.status}</span></div>
            </div>
          </div>
        </header>
        <div className="p-4 md:p-6">{children}</div>
      </main>
    </div>
  );
}
