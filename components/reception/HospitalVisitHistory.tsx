import { Building2, BedDouble } from "lucide-react";
import { HospitalVisit } from "@/lib/reception-data";

type HospitalVisitHistoryProps = {
  history: HospitalVisit[];
};

export default function HospitalVisitHistory({ history }: HospitalVisitHistoryProps) {
  return (
    <div className="rounded-2xl border border-slate-150 bg-white p-6 shadow-card">
      <div className="mb-5 flex items-start gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-seal-50 text-seal-600">
          <Building2 size={18} />
        </span>
        <div>
          <h2 className="font-display text-base font-semibold text-navy-900">
            Hospital Visit History
          </h2>
          <p className="mt-0.5 text-xs text-navy-300">Admissions and OPD visits across facilities</p>
        </div>
      </div>

      <ol className="relative space-y-6 border-l border-slate-150 pl-6">
        {history.map((h, i) => (
          <li key={i} className="relative">
            <span className="absolute -left-[27px] top-0.5 flex h-4 w-4 items-center justify-center rounded-full border-2 border-white bg-seal-500 ring-2 ring-seal-50" />
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-display text-sm font-semibold text-navy-900">{h.hospital}</p>
              <span className="text-xs font-medium text-navy-300">{h.date}</span>
            </div>
            <p className="mt-1 text-sm text-navy-600">
              {h.department} &middot; {h.doctor}
            </p>
            <p className="mt-1 text-sm text-navy-600">
              <span className="text-navy-300">Diagnosis:</span> {h.diagnosis}
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-navy-400">
              <span className="flex items-center gap-1.5">
                <BedDouble size={13} />
                {h.admissionDays > 0 ? `${h.admissionDays} admission day(s)` : "OPD only"}
              </span>
              <span>Discharge: {h.dischargeDate}</span>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
