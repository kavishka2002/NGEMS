import { Users, Stethoscope, HeartPulse, CalendarCheck, BedDouble, BedSingle, type LucideIcon } from "lucide-react";
import clsx from "clsx";

const iconMap: Record<string, LucideIcon> = {
  Users,
  Stethoscope,
  HeartPulse,
  CalendarCheck,
  BedDouble,
  BedSingle,
};

const accentMap: Record<string, { bg: string; text: string }> = {
  staff: { bg: "bg-clinical-50", text: "text-clinical-600" },
  doctors: { bg: "bg-health-50", text: "text-health-600" },
  patients: { bg: "bg-navy-50", text: "text-navy" },
  appointments: { bg: "bg-seal-50", text: "text-seal-600" },
  admissions: { bg: "bg-clinical-50", text: "text-clinical-600" },
  beds: { bg: "bg-health-50", text: "text-health-600" },
};

interface DashboardCardProps {
  statKey: string;
  label: string;
  value: number;
  delta: string;
  icon: string;
}

export default function DashboardCard({ statKey, label, value, delta, icon }: DashboardCardProps) {
  const Icon = iconMap[icon];
  const accent = accentMap[statKey] ?? accentMap.staff;

  return (
    <div className="group rounded-card border border-slate-border bg-white p-4 shadow-card transition-shadow hover:shadow-cardHover">
      <div className="flex items-start justify-between">
        <div className={clsx("flex h-10 w-10 items-center justify-center rounded-md", accent.bg)}>
          <Icon size={19} className={accent.text} strokeWidth={2.1} />
        </div>
      </div>
      <p className="mt-3 font-display text-2xl font-semibold text-navy">{value.toLocaleString()}</p>
      <p className="mt-0.5 text-sm font-medium text-navy/70">{label}</p>
      <p className="mt-1.5 text-xs text-navy/40">{delta}</p>
    </div>
  );
}
