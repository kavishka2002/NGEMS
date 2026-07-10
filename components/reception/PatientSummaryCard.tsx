import { ClipboardList } from "lucide-react";
import { PatientRecord, calcAge } from "@/lib/reception-data";

type PatientSummaryCardProps = {
  record: PatientRecord;
};

export default function PatientSummaryCard({ record }: PatientSummaryCardProps) {
  const { patient, medicines, visits } = record;
  const chronic = Array.from(new Set(visits.map((v) => v.diagnosis)));
  const activeMeds = medicines.filter((m) => m.status === "Active");
  const lastVisit = visits[0];

  const rows: { label: string; value: string }[] = [
    { label: "Patient ID", value: patient.id },
    { label: "Current Age", value: `${calcAge(patient.dob)} years` },
    { label: "Blood Group", value: patient.bloodGroup },
    { label: "Known Allergies", value: patient.alerts.join(", ") || "None recorded" },
    { label: "Chronic Diseases", value: chronic.join(", ") || "None recorded" },
    { label: "Current Medicines", value: activeMeds.map((m) => m.name).join(", ") || "None active" },
    { label: "Last Visit", value: lastVisit?.date ?? "—" },
    { label: "Last Hospital", value: lastVisit?.hospital ?? "—" },
  ];

  return (
    <div className="rounded-2xl border border-slate-150 bg-white p-6 shadow-card">
      <div className="mb-5 flex items-start gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-navy-50 text-navy-700">
          <ClipboardList size={18} />
        </span>
        <div>
          <h2 className="font-display text-base font-semibold text-navy-900">Patient Summary</h2>
          <p className="mt-0.5 text-xs text-navy-300">Quick clinical snapshot</p>
        </div>
      </div>

      <dl className="divide-y divide-slate-100">
        {rows.map((row) => (
          <div key={row.label} className="flex items-start justify-between gap-4 py-2.5 text-sm">
            <dt className="shrink-0 text-navy-300">{row.label}</dt>
            <dd className="text-right font-medium text-navy-800">{row.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
