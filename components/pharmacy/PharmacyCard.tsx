import { Pill, Package, AlertCircle, CheckCircle2, TrendingUp, type LucideIcon } from "lucide-react";
import clsx from "clsx";

const accentMap: Record<string, { bg: string; text: string; gradient: string }> = {
  prescriptions: { bg: "bg-blue-50", text: "text-blue-600", gradient: "from-blue-600 to-blue-700" },
  dispensing: { bg: "bg-emerald-50", text: "text-emerald-600", gradient: "from-emerald-600 to-green-600" },
  inventory: { bg: "bg-amber-50", text: "text-amber-600", gradient: "from-amber-600 to-orange-600" },
  stock: { bg: "bg-red-50", text: "text-red-600", gradient: "from-red-600 to-rose-600" },
  completed: { bg: "bg-green-50", text: "text-green-600", gradient: "from-green-600 to-emerald-600" },
};

interface PharmacyCardProps {
  cardKey: string;
  label: string;
  value: number | string;
  description?: string;
  icon: LucideIcon;
  trend?: string;
}

export default function PharmacyCard({
  cardKey,
  label,
  value,
  description,
  icon: Icon,
  trend,
}: PharmacyCardProps) {
  const accent = accentMap[cardKey] ?? accentMap.prescriptions;

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
        <p className="mt-5 font-display text-3xl font-bold bg-gradient-to-r from-blue-900 to-blue-700 bg-clip-text text-transparent">{value}</p>
        <p className="mt-1 text-sm font-semibold text-slate-700">{label}</p>
        {description && <p className="mt-3 text-xs text-slate-600 leading-relaxed">{description}</p>}
      </div>
    </div>
  );
}
