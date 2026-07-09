import { Building2, CheckCircle2, MapPin, Phone, Mail, ShieldCheck } from "lucide-react";
import { hospital } from "@/lib/data";

const fields: { label: string; value: string }[] = [
  { label: "Hospital Type", value: hospital.type },
  { label: "Province", value: hospital.province },
  { label: "District", value: hospital.district },
  { label: "Address", value: hospital.address },
  { label: "Contact Number", value: hospital.contact },
  { label: "Email", value: hospital.email },
  { label: "Registered On", value: hospital.registeredOn },
];

export default function ProfileCard() {
  return (
    <div className="overflow-hidden rounded-card border border-slate-border bg-white shadow-card">
      <div className="flex items-center justify-between bg-navy px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-md border border-white/15 bg-white/10">
            <Building2 size={22} className="text-white" />
          </div>
          <div>
            <p className="font-display text-lg font-semibold text-white">{hospital.name}</p>
            <p className="text-xs text-navy-100/60">Hospital Profile</p>
          </div>
        </div>

        <div className="hidden items-center gap-2 rounded-md border border-seal-600/60 bg-seal-600/10 px-3 py-1.5 sm:flex">
          <ShieldCheck size={15} className="text-seal-100" />
          <div className="leading-tight">
            <p className="text-[9px] uppercase tracking-[0.14em] text-seal-100/70">Registry ID</p>
            <p className="font-mono text-sm font-semibold tracking-wide text-white">{hospital.id}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-x-8 gap-y-4 p-5 sm:grid-cols-2">
        {fields.map((f) => (
          <div key={f.label} className="min-w-0">
            <p className="text-[11px] uppercase tracking-wider text-navy/40">{f.label}</p>
            <p className="mt-0.5 truncate text-sm font-medium text-navy" title={f.value}>
              {f.value}
            </p>
          </div>
        ))}

        <div>
          <p className="text-[11px] uppercase tracking-wider text-navy/40">Registration Status</p>
          <div className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-health-50 px-2.5 py-1 text-xs font-semibold text-health-700">
            <CheckCircle2 size={13} />
            {hospital.status}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 border-t border-slate-border bg-slate-bg px-5 py-3 text-xs text-navy/50">
        <span className="flex items-center gap-1.5">
          <MapPin size={13} /> {hospital.district}, {hospital.province}
        </span>
        <span className="flex items-center gap-1.5">
          <Phone size={13} /> {hospital.contact}
        </span>
        <span className="flex items-center gap-1.5">
          <Mail size={13} /> {hospital.email}
        </span>
      </div>
    </div>
  );
}
