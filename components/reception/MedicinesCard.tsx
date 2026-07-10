import { Pill } from "lucide-react";
import { Medicine } from "@/lib/reception-data";

type MedicinesCardProps = {
  medicines: Medicine[];
};

export default function MedicinesCard({ medicines }: MedicinesCardProps) {
  return (
    <div className="rounded-2xl border border-slate-150 bg-white p-6 shadow-card">
      <div className="mb-5 flex items-start gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-health-50 text-health-600">
          <Pill size={18} />
        </span>
        <div>
          <h2 className="font-display text-base font-semibold text-navy-900">Current Medicines</h2>
          <p className="mt-0.5 text-xs text-navy-300">Active and recently completed prescriptions</p>
        </div>
      </div>

      <div className="space-y-3">
        {medicines.map((m, i) => (
          <div
            key={i}
            className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-100 bg-slate-25 px-4 py-3"
          >
            <div className="min-w-0">
              <p className="text-sm font-semibold text-navy-800">{m.name}</p>
              <p className="mt-0.5 text-xs text-navy-400">
                {m.dosage} &middot; {m.duration}
              </p>
              <p className="mt-0.5 text-xs text-navy-300">
                {m.hospital} &middot; {m.doctor}
              </p>
            </div>
            <span
              className={`shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                m.status === "Active"
                  ? "bg-health-50 text-health-700"
                  : "bg-slate-150 text-navy-400"
              }`}
            >
              {m.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
