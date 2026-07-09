import { UserPlus, Stethoscope, FlaskConical, Pill, BedDouble, type LucideIcon } from "lucide-react";
import { todaysActivity } from "@/lib/data";

const iconMap: Record<string, LucideIcon> = {
  UserPlus,
  Stethoscope,
  FlaskConical,
  Pill,
  BedDouble,
};

export default function ActivityStrip() {
  return (
    <div className="rounded-card border border-slate-border bg-white p-5 shadow-card">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="font-display text-base font-semibold text-navy">Today&apos;s Hospital Activity</h3>
          <p className="text-xs text-navy/40">Live figures as of today</p>
        </div>
        <span className="flex items-center gap-1.5 rounded-full bg-health-50 px-2.5 py-1 text-[11px] font-medium text-health-700">
          <span className="h-1.5 w-1.5 rounded-full bg-health-600 animate-pulse" />
          Live
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        {todaysActivity.map((a) => {
          const Icon = iconMap[a.icon];
          return (
            <div key={a.label} className="flex flex-col items-start gap-2 rounded-md border border-slate-border bg-slate-bg p-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-white text-clinical-600 shadow-sm">
                <Icon size={16} strokeWidth={2.1} />
              </div>
              <p className="font-display text-xl font-semibold text-navy">{a.value}</p>
              <p className="text-[11px] leading-tight text-navy/50">{a.label}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
