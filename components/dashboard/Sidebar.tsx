"use client";

import { useState } from "react";
import clsx from "clsx";
import {
  LayoutDashboard,
  Building2,
  Stethoscope,
  HeartPulse,
  Pill,
  FlaskConical,
  UserRound,
  Building,
  Users,
  CalendarCheck,
  BedDouble,
  FileBarChart2,
  Settings,
  ChevronDown,
  type LucideIcon,
} from "lucide-react";
import { sidebarSections } from "@/lib/data";

const iconMap: Record<string, LucideIcon> = {
  LayoutDashboard,
  Building2,
  Stethoscope,
  HeartPulse,
  Pill,
  FlaskConical,
  UserRound,
  Building,
  Users,
  CalendarCheck,
  BedDouble,
  FileBarChart2,
  Settings,
};

export default function Sidebar() {
  const [active, setActive] = useState("Dashboard");
  const [openSection, setOpenSection] = useState("Staff Management");

  return (
    <aside className="thin-scroll hidden w-64 shrink-0 flex-col overflow-y-auto border-r border-slate-border bg-white md:flex md:h-[calc(100vh-4rem)] md:sticky md:top-16">
      <nav className="flex flex-col gap-5 px-3 py-5">
        {sidebarSections.map((section) => (
          <div key={section.label}>
            <button
              onClick={() => setOpenSection(openSection === section.label ? "" : section.label)}
              className="flex w-full items-center justify-between px-2.5 pb-1.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-navy/40"
            >
              {section.label}
              {section.label === "Staff Management" && (
                <ChevronDown
                  size={13}
                  className={clsx(
                    "transition-transform duration-150",
                    openSection === section.label ? "rotate-180" : ""
                  )}
                />
              )}
            </button>
            <ul
              className={clsx(
                "flex flex-col gap-0.5",
                section.label === "Staff Management" && openSection !== section.label && "hidden"
              )}
            >
              {section.items.map((item) => {
                const Icon = iconMap[item.icon];
                const isActive = active === item.name;
                return (
                  <li key={item.name}>
                    <a
                      href={item.href}
                      onClick={(e) => {
                        e.preventDefault();
                        setActive(item.name);
                      }}
                      className={clsx(
                        "group flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm transition-colors",
                        isActive
                          ? "bg-clinical-50 font-medium text-clinical-700"
                          : "text-navy/70 hover:bg-slate-bg hover:text-navy",
                        section.label === "Staff Management" && "ml-2"
                      )}
                    >
                      <Icon
                        size={16}
                        strokeWidth={2}
                        className={clsx(
                          isActive ? "text-clinical-600" : "text-navy/40 group-hover:text-clinical-600"
                        )}
                      />
                      {item.name}
                      {isActive && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-seal-600" />}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="mt-auto border-t border-slate-border px-4 py-4">
        <div className="rounded-md border border-seal-100 bg-seal-50 px-3 py-2.5">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-seal-700">
            Official Portal
          </p>
          <p className="mt-0.5 text-[11px] leading-snug text-navy/60">
            Ministry of Health — Government of Sri Lanka
          </p>
        </div>
      </div>
    </aside>
  );
}
