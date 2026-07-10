import { UserRound, Contact2, Building2, Landmark } from "lucide-react";

type StaffInfoCardProps = {
  role: string;
  name: string;
  employeeId: string;
  department: string;
  hospital: string;
};

export default function StaffInfoCard({
  role,
  name,
  employeeId,
  department,
  hospital,
}: StaffInfoCardProps) {
  return (
    <div className="flex flex-col gap-5 rounded-2xl border border-slate-150 bg-white p-6 shadow-card sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-4">
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-clinical-50 text-clinical-600">
          <UserRound size={26} />
        </span>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-health-600">
            {role}
          </p>
          <p className="font-display text-lg font-semibold text-navy-900">{name}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 border-t border-slate-100 pt-4 text-sm sm:grid-cols-3 sm:border-t-0 sm:border-l sm:pl-6 sm:pt-0">
        <div className="flex items-center gap-2.5">
          <Contact2 size={16} className="shrink-0 text-navy-300" />
          <div>
            <p className="text-[11px] uppercase tracking-wide text-navy-300">Employee ID</p>
            <p className="font-mono font-medium text-navy-800">{employeeId}</p>
          </div>
        </div>
        <div className="flex items-center gap-2.5">
          <Building2 size={16} className="shrink-0 text-navy-300" />
          <div>
            <p className="text-[11px] uppercase tracking-wide text-navy-300">Department</p>
            <p className="font-medium text-navy-800">{department}</p>
          </div>
        </div>
        <div className="flex items-center gap-2.5">
          <Landmark size={16} className="shrink-0 text-navy-300" />
          <div>
            <p className="text-[11px] uppercase tracking-wide text-navy-300">Hospital</p>
            <p className="font-medium text-navy-800">{hospital}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
