import { FlaskConical, Droplet, FileCheck, TrendingUp, type LucideIcon } from "lucide-react";
import clsx from "clsx";

const accentMap: Record<string, { bg: string; text: string; gradient: string }> = {
  requests: { bg: "bg-clinical-50", text: "text-clinical-600", gradient: "from-clinical-600 to-seal-600" },
  samples: { bg: "bg-seal-50", text: "text-seal-600", gradient: "from-seal-600 to-blue-600" },
  processing: { bg: "bg-health-50", text: "text-health-600", gradient: "from-health-600 to-emerald-600" },
  completed: { bg: "bg-green-50", text: "text-green-600", gradient: "from-green-600 to-teal-600" },
  reports: { bg: "bg-navy-50", text: "text-navy", gradient: "from-navy to-seal-600" },
};

interface LaboratoryCardProps {
  cardKey: string;
  label: string;
  value: number | string;
  description?: string;
  icon: LucideIcon;
  trend?: string;
}

export default function LaboratoryCard({
  cardKey,
  label,
  value,
  description,
  icon: Icon,
  trend,
}: LaboratoryCardProps) {
  const accent = accentMap[cardKey] ?? accentMap.requests;

  return (
    <div className="group relative overflow-hidden rounded-2xl bg-white border border-slate-100 p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
      {/* Gradient Background */}
      <div className={clsx("absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-5 transition-opacity", accent.gradient)}></div>
      
      <div className="relative z-10">
        <div className="flex items-start justify-between">
          <div className={clsx("flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br", accent.gradient)}>
            <Icon size={28} className="text-white" strokeWidth={1.5} />
          </div>
          {trend && (
            <div className="flex items-center gap-1 text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">
              <TrendingUp size={12} />
              {trend}
            </div>
          )}
        </div>
        <p className="mt-5 font-display text-3xl font-bold bg-gradient-to-r from-navy to-navy/70 bg-clip-text text-transparent">{value}</p>
        <p className="mt-1 text-sm font-semibold text-navy/70">{label}</p>
        {description && <p className="mt-3 text-xs text-navy/50 leading-relaxed">{description}</p>}
      </div>
    </div>
  );
}
