import { Stethoscope, ClipboardCheck } from "lucide-react";
import { Visit } from "@/lib/reception-data";

type PatientTimelineProps = {
  visits: Visit[];
};

export default function PatientTimeline({ visits }: PatientTimelineProps) {
  return (
    <div className="rounded-2xl border border-slate-150 bg-white p-6 shadow-card">
      <div className="mb-5 flex items-start gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-clinical-50 text-clinical-600">
          <ClipboardCheck size={18} />
        </span>
        <div>
          <h2 className="font-display text-base font-semibold text-navy-900">Patient Timeline</h2>
          <p className="mt-0.5 text-xs text-navy-300">Previous visits, most recent first</p>
        </div>
      </div>

      <ol className="relative space-y-6 border-l border-slate-150 pl-6">
        {visits.map((v, i) => (
          <li key={i} className="relative">
            <span className="absolute -left-[27px] top-0.5 flex h-4 w-4 items-center justify-center rounded-full border-2 border-white bg-clinical-500 ring-2 ring-clinical-100" />
            <p className="text-xs font-semibold uppercase tracking-wide text-navy-300">{v.date}</p>
            <p className="mt-1 font-display text-sm font-semibold text-navy-900">{v.hospital}</p>
            <div className="mt-2 grid grid-cols-2 gap-2 text-sm sm:grid-cols-3">
              <div className="flex items-center gap-1.5 text-navy-600">
                <Stethoscope size={13} className="text-navy-300" />
                {v.doctor}
              </div>
              <div className="text-navy-600">
                <span className="text-navy-300">Diagnosis:</span> {v.diagnosis}
              </div>
              <div className="text-navy-600">{v.note}</div>
            </div>
            <span
              className={`mt-2 inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                v.status === "Completed"
                  ? "bg-health-50 text-health-700"
                  : "bg-seal-50 text-seal-700"
              }`}
            >
              {v.status}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}
