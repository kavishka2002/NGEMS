"use client";

import { Bell, ChevronDown, LogOut, ShieldCheck } from "lucide-react";
import { hospital } from "@/lib/data";

export default function DashboardNavbar() {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-border bg-navy px-4 md:px-6">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-md bg-seal-600">
          <ShieldCheck size={20} className="text-white" strokeWidth={2.25} />
        </div>
        <div className="hidden sm:block leading-tight">
          <p className="font-display text-[15px] font-semibold tracking-wide text-white">N-GEMS</p>
          <p className="text-[10px] uppercase tracking-[0.14em] text-navy-100/70">
            National Gov. Electronic Medical System
          </p>
        </div>
      </div>

      <div className="hidden md:flex items-center gap-3 rounded-md border border-white/10 bg-white/5 px-3 py-1.5">
        <div className="text-right leading-tight">
          <p className="text-[10px] uppercase tracking-wider text-navy-100/60">Hospital</p>
          <p className="text-sm font-medium text-white">{hospital.name}</p>
        </div>
        <div className="h-8 w-px bg-white/10" />
        <div className="text-left leading-tight">
          <p className="text-[10px] uppercase tracking-wider text-navy-100/60">Hospital ID</p>
          <p className="font-mono text-sm font-semibold tracking-wide text-seal-100">{hospital.id}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <button
          aria-label="Notifications"
          className="relative flex h-9 w-9 items-center justify-center rounded-md text-white/80 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
        >
          <Bell size={18} />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-seal-600 ring-2 ring-navy" />
        </button>

        <button className="flex items-center gap-2 rounded-md py-1 pl-1 pr-2 text-white transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-clinical-600 text-xs font-semibold text-white">AD</div>
          <div className="hidden text-left leading-tight lg:block">
            <p className="text-sm font-medium">Admin User</p>
            <p className="text-[11px] text-navy-100/60">Hospital Administrator</p>
          </div>
          <ChevronDown size={14} className="hidden text-white/60 lg:block" />
        </button>

        <button className="flex h-9 items-center gap-1.5 rounded-md border border-white/15 px-3 text-sm font-medium text-white/90 transition-colors hover:border-seal-600 hover:bg-white/5 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40">
          <LogOut size={15} />
          <span className="hidden sm:inline">Log out</span>
        </button>
      </div>
    </header>
  );
}
