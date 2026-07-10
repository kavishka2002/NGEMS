"use client";

import { UserPlus, UserSearch, CalendarPlus, ListOrdered, Printer } from "lucide-react";

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

const ACTIONS = [
  { label: "Register New Patient", icon: UserPlus, target: "registration", variant: "primary" as const },
  { label: "Search Existing Patient", icon: UserSearch, target: "search", variant: "secondary" as const },
  { label: "Book Appointment", icon: CalendarPlus, target: "search", variant: "secondary" as const },
  { label: "View Queue", icon: ListOrdered, target: "queue", variant: "secondary" as const },
  { label: "Print Token", icon: Printer, target: "queue", variant: "ghost" as const },
];

const VARIANT_CLASS: Record<string, string> = {
  primary: "bg-navy-900 text-white hover:bg-navy-800",
  secondary: "border border-clinical-500 text-clinical-600 bg-white hover:bg-clinical-50",
  ghost: "border border-slate-200 text-navy-600 bg-white hover:bg-slate-50",
};

export default function QuickActions() {
  return (
    <div className="flex flex-wrap gap-3">
      {ACTIONS.map(({ label, icon: Icon, target, variant }) => (
        <button
          key={label}
          type="button"
          onClick={() => scrollTo(target)}
          className={`focus-ring inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors ${VARIANT_CLASS[variant]}`}
        >
          <Icon size={16} strokeWidth={2} />
          {label}
        </button>
      ))}
    </div>
  );
}
