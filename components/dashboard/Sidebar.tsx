"use client";

import { useEffect, useMemo, useState } from "react";
import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
  UserPlus,
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
  UserPlus,
};

export default function Sidebar() {
  const pathname = usePathname() || "/";
  const [openSection, setOpenSection] = useState("Staff Management");

  const activeItemName = useMemo(() => {
    const matched = sidebarSections
      .flatMap((section) => section.items)
      .find((item) => item.href !== "#" && pathname.startsWith(item.href));
    return matched?.name ?? "Dashboard";
  }, [pathname]);

  useEffect(() => {
    const activeSection = sidebarSections.find((section) =>
      section.items.some((item) => item.name === activeItemName)
    );
    if (activeSection) {
      setOpenSection(activeSection.label);
    }
  }, [activeItemName]);

  return (
    <aside className="sticky top-0 z-20 flex h-full w-20 shrink-0 flex-col border-r border-slate-border bg-white md:w-64">
      <div className="flex-1 overflow-y-auto">
        <nav className="flex flex-col gap-5 px-2 py-5 md:px-3">
          {sidebarSections.map((section) => (
            <div key={section.label}>
              <button
                onClick={() => setOpenSection(openSection === section.label ? "" : section.label)}
                className="flex w-full items-center justify-between px-2.5 pb-1.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-navy/40"
              >
                <span className="hidden md:inline">{section.label}</span>
                <span className="md:hidden">•</span>
                <ChevronDown
                  size={13}
                  className={clsx(
                    "hidden transition-transform duration-150 md:block",
                    openSection === section.label ? "rotate-180" : ""
                  )}
                />
              </button>
              <ul className={clsx("flex flex-col gap-0.5", openSection !== section.label && "hidden")}>
                {section.items.map((item) => {
                  const Icon = iconMap[item.icon];
                  const isActive = activeItemName === item.name;
                  return (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className={clsx(
                          "group flex items-center justify-center gap-2.5 rounded-md px-2 py-2 text-sm transition-colors md:justify-start md:px-2.5",
                          isActive
                            ? "bg-clinical-50 font-medium text-clinical-700"
                            : "text-navy/70 hover:bg-slate-bg hover:text-navy",
                          section.label === "Staff Management" && "md:ml-2"
                        )}
                      >
                        <Icon
                          size={16}
                          strokeWidth={2}
                          className={clsx(
                            isActive ? "text-clinical-600" : "text-navy/40 group-hover:text-clinical-600"
                          )}
                        />
                        <span className="hidden md:inline">{item.name}</span>
                        {isActive && <span className="ml-auto hidden h-1.5 w-1.5 rounded-full bg-seal-600 md:block" />}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
      </div>

      <div className="mt-auto border-t border-slate-border px-2 py-3 md:px-4 md:py-4">
        <div className="rounded-md border border-seal-100 bg-seal-50 px-2 py-2.5 md:px-3">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-seal-700 md:text-[11px]">
            Official Portal
          </p>
          <p className="mt-0.5 hidden text-[11px] leading-snug text-navy/60 md:block">
            Ministry of Health — Government of Sri Lanka
          </p>
        </div>
      </div>
    </aside>
  );
}

