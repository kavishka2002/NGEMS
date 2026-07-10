import { LucideIcon } from "lucide-react";

type StatCardProps = {
  label: string;
  value: string | number;
  icon: LucideIcon;
  accent?: "clinical" | "health" | "seal" | "rose";
  hint?: string;
};

const ACCENTS = {
  clinical: "bg-clinical-50 text-clinical-600",
  health: "bg-health-50 text-health-600",
  seal: "bg-seal-50 text-seal-600",
  rose: "bg-rose-50 text-rose-500",
};

export default function StatCard({
  label,
  value,
  icon: Icon,
  accent = "clinical",
  hint,
}: StatCardProps) {
  return (
    <div className="rounded-2xl border border-slate-150 bg-white p-5 shadow-card">
      <div className="flex items-center justify-between">
        <span className={`flex h-10 w-10 items-center justify-center rounded-lg ${ACCENTS[accent]}`}>
          <Icon size={18} strokeWidth={2} />
        </span>
      </div>
      <p className="mt-4 font-display text-2xl font-semibold text-navy-900">{value}</p>
      <p className="mt-1 text-xs font-medium text-navy-300">{label}</p>
      {hint && <p className="mt-2 text-[11px] text-navy-300/80">{hint}</p>}
    </div>
  );
}
