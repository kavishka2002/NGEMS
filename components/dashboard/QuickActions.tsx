import { UserPlus, Building, Users, Pill, FlaskConical, FileBarChart2, type LucideIcon } from "lucide-react";

const actions: { label: string; icon: LucideIcon; accent: string }[] = [
  { label: "Register Staff", icon: UserPlus, accent: "clinical" },
  { label: "Add Department", icon: Building, accent: "health" },
  { label: "View Patients", icon: Users, accent: "clinical" },
  { label: "Manage Pharmacy", icon: Pill, accent: "seal" },
  { label: "View Laboratory", icon: FlaskConical, accent: "health" },
  { label: "Generate Reports", icon: FileBarChart2, accent: "navy" },
];

const accentStyles: Record<string, string> = {
  clinical: "bg-clinical-50 text-clinical-600 group-hover:bg-clinical-600",
  health: "bg-health-50 text-health-600 group-hover:bg-health-600",
  seal: "bg-seal-50 text-seal-600 group-hover:bg-seal-600",
  navy: "bg-navy-50 text-navy group-hover:bg-navy",
};

export default function QuickActions() {
  return (
    <div className="rounded-card border border-slate-border bg-white p-5 shadow-card">
      <h3 className="font-display text-base font-semibold text-navy">Quick Actions</h3>
      <p className="mb-4 text-xs text-navy/40">Jump straight into common tasks</p>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {actions.map((a) => (
          <button
            key={a.label}
            className="group flex flex-col items-start gap-3 rounded-md border border-slate-border p-3.5 text-left transition-all hover:border-clinical-600 hover:shadow-cardHover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clinical-600"
          >
            <div className={`flex h-9 w-9 items-center justify-center rounded-md transition-colors ${accentStyles[a.accent]} group-hover:text-white`}>
              <a.icon size={17} strokeWidth={2.1} />
            </div>
            <span className="text-sm font-medium text-navy">{a.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
