"use client";

import { useState } from "react";
import clsx from "clsx";
import {
  LayoutDashboard,
  FileText,
  Pill,
  Package,
  BarChart3,
  AlertCircle,
  Clock,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";

const sections = [
  {
    label: "Main",
    items: [
      { name: "Dashboard", href: "/pharmacy/dashboard", icon: LayoutDashboard },
    ],
  },
  {
    label: "Operations",
    items: [
      { name: "Prescriptions", href: "/pharmacy/prescriptions", icon: FileText },
      { name: "Medicine Dispensing", href: "/pharmacy/dispensing", icon: Pill },
      { name: "Inventory", href: "/pharmacy/inventory", icon: Package },
    ],
  },
  {
    label: "Management",
    items: [
      { name: "Stock Alerts", href: "/pharmacy/stock-alerts", icon: AlertCircle },
      { name: "History", href: "/pharmacy/history", icon: Clock },
      { name: "Reports", href: "/pharmacy/reports", icon: BarChart3 },
    ],
  },
];

export default function PharmacySidebar() {
  const [active, setActive] = useState("Dashboard");

  return (
    <aside className="sticky top-0 z-20 flex h-[calc(100vh-70px)] w-20 shrink-0 flex-col border-r border-slate-200 bg-white md:w-64 overflow-y-auto">
      <nav className="flex flex-col gap-6 px-2 py-5 md:px-4">
        {sections.map((section) => (
          <div key={section.label}>
            <p className="mb-3 px-2 text-[11px] font-semibold uppercase tracking-[0.1em] text-slate-400">
              <span className="hidden md:inline">{section.label}</span>
              <span className="md:hidden">•</span>
            </p>
            <ul className="flex flex-col gap-1">
              {section.items.map((item) => {
                const isActive = active === item.name;
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      onClick={() => setActive(item.name)}
                      className={clsx(
                        "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                        isActive
                          ? "bg-blue-50 text-blue-600"
                          : "text-slate-600 hover:bg-slate-50 hover:text-blue-600"
                      )}
                    >
                      <item.icon size={18} strokeWidth={1.5} />
                      <span className="hidden md:inline">{item.name}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
}
