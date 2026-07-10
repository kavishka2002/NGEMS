"use client";

import { FlaskConical, Eye } from "lucide-react";
import { LabReport } from "@/lib/reception-data";

type LabReportsCardProps = {
  reports: LabReport[];
};

export default function LabReportsCard({ reports }: LabReportsCardProps) {
  return (
    <div className="rounded-2xl border border-slate-150 bg-white p-6 shadow-card">
      <div className="mb-5 flex items-start gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-clinical-50 text-clinical-600">
          <FlaskConical size={18} />
        </span>
        <div>
          <h2 className="font-display text-base font-semibold text-navy-900">
            Recent Lab Reports
          </h2>
          <p className="mt-0.5 text-xs text-navy-300">Latest diagnostic results on file</p>
        </div>
      </div>

      <div className="space-y-3">
        {reports.map((r, i) => (
          <div
            key={i}
            className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-100 bg-slate-25 px-4 py-3"
          >
            <div className="min-w-0">
              <p className="text-sm font-semibold text-navy-800">{r.name}</p>
              <p className="mt-0.5 text-xs text-navy-400">
                {r.hospital} &middot; {r.doctor}
              </p>
              <p className="mt-0.5 text-xs text-navy-300">{r.date}</p>
            </div>
            <div className="flex shrink-0 items-center gap-2.5">
              <span
                className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                  r.status === "Completed"
                    ? "bg-health-50 text-health-700"
                    : "bg-seal-50 text-seal-700"
                }`}
              >
                {r.status}
              </span>
              <button
                type="button"
                className="focus-ring flex items-center gap-1 rounded-md border border-clinical-200 px-2.5 py-1 text-xs font-medium text-clinical-600 hover:bg-clinical-50"
              >
                <Eye size={12} />
                View
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
