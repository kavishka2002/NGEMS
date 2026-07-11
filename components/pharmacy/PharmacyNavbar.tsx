"use client";

import Link from "next/link";
import { LogOut, Menu, X, Home } from "lucide-react";
import { useState } from "react";
import Logo from "@/components/Logo";

export default function PharmacyNavbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-30 border-b border-slate-200 bg-white shadow-md backdrop-blur-sm bg-white/95">
      <div className="mx-auto flex items-center justify-between px-4 py-3 md:px-8 lg:px-10">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="rounded-lg p-2 hover:bg-slate-100 md:hidden transition"
          >
            {isOpen ? <X size={24} className="text-health-600" /> : <Menu size={24} className="text-navy" />}
          </button>
          <Logo />
          <div className="hidden md:block">
            <p className="text-xs font-bold uppercase tracking-widest text-health-600">
              💊 Pharmacy
            </p>
            <h2 className="font-bold text-navy text-base">
              Medicine Management
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden lg:flex items-center gap-8">
            <Link href="/pharmacy/dashboard" className="text-sm font-medium text-navy hover:text-health-600 transition duration-200">
              Dashboard
            </Link>
            <Link href="/pharmacy/prescriptions" className="text-sm font-medium text-navy hover:text-health-600 transition duration-200">
              Prescriptions
            </Link>
            <Link href="/pharmacy/dispensing" className="text-sm font-medium text-navy hover:text-health-600 transition duration-200">
              Dispensing
            </Link>
            <Link href="/pharmacy/inventory" className="text-sm font-medium text-navy hover:text-health-600 transition duration-200">
              Inventory
            </Link>
            <div className="h-5 w-px bg-slate-300"></div>
            <Link href="/dashboard" className="flex items-center gap-2 text-sm font-medium text-navy/70 hover:text-health-600 transition duration-200">
              <Home size={16} />
              Main Dashboard
            </Link>
          </div>

          <button className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-health-600 to-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:shadow-lg hover:from-health-700 hover:to-emerald-700 transition duration-200">
            <LogOut size={16} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="border-t border-slate-200 bg-slate-50 px-4 py-4 md:hidden shadow-md">
          <div className="flex flex-col gap-3">
            <Link href="/pharmacy/dashboard" className="rounded-lg px-3 py-2 text-sm font-medium text-navy hover:bg-health-50 hover:text-health-600 transition">
              Dashboard
            </Link>
            <Link href="/pharmacy/prescriptions" className="rounded-lg px-3 py-2 text-sm font-medium text-navy hover:bg-health-50 hover:text-health-600 transition">
              Prescriptions
            </Link>
            <Link href="/pharmacy/dispensing" className="rounded-lg px-3 py-2 text-sm font-medium text-navy hover:bg-health-50 hover:text-health-600 transition">
              Dispensing
            </Link>
            <Link href="/pharmacy/inventory" className="rounded-lg px-3 py-2 text-sm font-medium text-navy hover:bg-health-50 hover:text-health-600 transition">
              Inventory
            </Link>
            <div className="my-2 border-t border-slate-200"></div>
            <Link href="/dashboard" className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-navy/70 hover:bg-health-50 hover:text-health-600 transition">
              <Home size={16} />
              Back to Main Dashboard
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
