"use client";

import { useState } from "react";
import clsx from "clsx";
import {
  LayoutDashboard,
  FileText,
  FlaskConical,
  Droplet,
  BarChart3,
  FileCheck,
  Clock,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";

const sections = [
  {
    label: "Main",
    items: [
      { name: "Dashboard", href: "/laboratory/dashboard", icon: LayoutDashboard },
      { name: "Result Entry", href: "/laboratory/results", icon: FileText },
      { name: "Verification", href: "/laboratory/verification", icon: FileCheck },
    ],
  },
  {
    label: "Operations",
    items: [
      { name: "Lab Requests", href: "/laboratory/requests", icon: FileText },
      { name: "Sample Collection", href: "/laboratory/samples", icon: Droplet },
      { name: "Test Processing", href: "/laboratory/testing", icon: FlaskConical },
    ],
  },
  {
    label: "Management",
    items: [
      { name: "Lab Reports", href: "/laboratory/reports", icon: FileCheck },
      { name: "History", href: "/laboratory/history", icon: Clock },
      { name: "Analytics", href: "/laboratory/analytics", icon: BarChart3 },
    ],
  },
];

export default function LaboratorySidebar() {
  const [active, setActive] = useState("Dashboard");

  return (
    <aside className="sticky top-0 z-20 flex h-[calc(100vh-70px)] w-20 shrink-0 flex-col border-r border-slate-border bg-white md:w-64 overflow-y-auto">
      <nav className="flex flex-col gap-6 px-2 py-5 md:px-4">
        {sections.map((section) => (
          <div key={section.label}>
            <p className="mb-3 px-2 text-[11px] font-semibold uppercase tracking-[0.1em] text-navy/40">
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
                          ? "bg-seal-50 text-seal-600"
                          : "text-navy/60 hover:bg-slate-50 hover:text-navy"
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
