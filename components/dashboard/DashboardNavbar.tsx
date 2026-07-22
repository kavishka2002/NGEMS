"use client";

import { useEffect, useState } from "react";
import { Bell, ChevronDown, LogOut, ShieldCheck } from "lucide-react";

type DashboardNavbarProps = {
  userName?: string;
  userRole?: string;
  hospitalName?: string;
  hospitalDistrict?: string;
  hospitalId?: string;
};

type HospitalSession = {
  hospitalId?: string;
  hospitalName?: string;
  district?: string;
  username?: string;
  role?: string;
};

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function DashboardNavbar({
  userName,
  userRole,
  hospitalName,
  hospitalDistrict,
  hospitalId,
}: DashboardNavbarProps) {
  const [session, setSession] = useState<HospitalSession | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = window.localStorage.getItem("ngemsHospitalSession");
    if (!raw) return;
    try {
      setSession(JSON.parse(raw) as HospitalSession);
    } catch {
      setSession(null);
    }
  }, []);

  const actualHospitalName = hospitalName || session?.hospitalName || "Your hospital";
  const actualHospitalDistrict = hospitalDistrict || session?.district || "";
  const actualHospitalId = hospitalId || session?.hospitalId || "NGEMS-HOS-2026-000000";
  const actualUserName = userName || session?.username || "Admin User";
  const actualUserRole = userRole || session?.role || "Hospital Administrator";
  const initials = getInitials(actualUserName);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-blue-300 px-4 md:px-6" style={{ backgroundColor: "#0B2545" }}>
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-md bg-seal-600">
          <ShieldCheck size={20} className="text-white" strokeWidth={2.25} />
        </div>
        <div className="hidden sm:block leading-tight">
          <p className="font-display text-[15px] font-semibold tracking-wide text-white">N-GEMS</p>
          <p className="text-[10px] uppercase tracking-[0.14em] text-white">
            National Gov. Electronic Medical System
          </p>
        </div>
      </div>

      <div className="hidden md:flex items-center gap-3 rounded-md border border-white/10 bg-white/5 px-3 py-1.5">
        <div className="text-right leading-tight">
          <p className="text-[10px] uppercase tracking-wider text-white">Hospital</p>
          <p className="text-sm font-medium text-white">{actualHospitalName}</p>
        </div>
        {actualHospitalDistrict ? (
          <>
            <div className="h-8 w-px bg-white/10" />
            <div className="text-left leading-tight">
              <p className="text-[10px] uppercase tracking-wider text-white">District</p>
              <p className="text-sm font-medium text-white">{actualHospitalDistrict}</p>
            </div>
          </>
        ) : null}
        <div className="h-8 w-px bg-white/10" />
        <div className="text-left leading-tight">
          <p className="text-[10px] uppercase tracking-wider text-white">Hospital ID</p>
          <p className="font-mono text-sm font-semibold tracking-wide text-white">{actualHospitalId}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <button
          aria-label="Notifications"
          className="relative flex h-9 w-9 items-center justify-center rounded-md text-white transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
        >
          <Bell size={18} />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-seal-600 ring-2 ring-navy" />
        </button>

        <button className="flex items-center gap-2 rounded-md py-1 pl-1 pr-2 text-white transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-clinical-600 text-xs font-semibold text-white">
            {initials}
          </div>
          <div className="hidden text-left leading-tight lg:block">
            <p className="text-sm font-medium text-white">{actualUserName}</p>
            <p className="text-[11px] text-white">{actualUserRole}</p>
          </div>
          <ChevronDown size={14} className="hidden text-white lg:block" />
        </button>

        <button className="flex h-9 items-center gap-1.5 rounded-md border border-white/15 px-3 text-sm font-medium text-white transition-colors hover:border-seal-600 hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40">
          <LogOut size={15} />
          <span className="hidden sm:inline">Log out</span>
        </button>
      </div>
    </header>
  );
}
