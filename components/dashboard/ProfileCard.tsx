import { Building2, CheckCircle2, MapPin, Phone, Mail, ShieldCheck } from "lucide-react";
import { hospital as defaultHospital } from "@/lib/data";

type HospitalProfile = {
  hospitalId?: string;
  hospitalName?: string;
  hospitalType?: string;
  province?: string;
  district?: string;
  address?: string;
  contactNumber?: string;
  email?: string;
  status?: string;
  registeredOn?: string;
};

type ProfileCardProps = {
  hospital?: HospitalProfile | null;
};

export default function ProfileCard({ hospital }: ProfileCardProps) {
  const profile = {
    name: hospital?.hospitalName || hospital?.name || defaultHospital.name,
    id: hospital?.hospitalId || defaultHospital.id,
    type: hospital?.hospitalType || defaultHospital.type,
    province: hospital?.province || defaultHospital.province,
    district: hospital?.district || defaultHospital.district,
    address: hospital?.address || defaultHospital.address,
    contact: hospital?.contactNumber || defaultHospital.contact,
    email: hospital?.email || defaultHospital.email,
    status: hospital?.status || defaultHospital.status,
    registeredOn: hospital?.registeredOn || defaultHospital.registeredOn,
  };

  const fields = [
    { label: "Hospital Type", value: profile.type },
    { label: "Province", value: profile.province },
    { label: "District", value: profile.district },
    { label: "Address", value: profile.address },
    { label: "Contact Number", value: profile.contact },
    { label: "Email", value: profile.email },
    { label: "Registered On", value: profile.registeredOn },
  ];

  return (
    <div className="overflow-hidden rounded-card border border-slate-border bg-white shadow-card">
      <div className="flex items-center justify-between bg-navy px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-md border border-white/15 bg-white/10">
            <Building2 size={22} className="text-white" />
          </div>
          <div>
            <p className="font-display text-lg font-semibold text-white">{profile.name}</p>
            <p className="text-xs text-navy-100/60">Hospital Profile</p>
          </div>
        </div>

        <div className="hidden items-center gap-2 rounded-md border border-seal-600/60 bg-seal-600/10 px-3 py-1.5 sm:flex">
          <ShieldCheck size={15} className="text-seal-100" />
          <div className="leading-tight">
            <p className="text-[9px] uppercase tracking-[0.14em] text-seal-100/70">Registry ID</p>
            <p className="font-mono text-sm font-semibold tracking-wide text-white">{profile.id}</p>
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
            {profile.status}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 border-t border-slate-border bg-slate-bg px-5 py-3 text-xs text-navy/50">
        <span className="flex items-center gap-1.5">
          <MapPin size={13} /> {profile.district}, {profile.province}
        </span>
        <span className="flex items-center gap-1.5">
          <Phone size={13} /> {profile.contact}
        </span>
        <span className="flex items-center gap-1.5">
          <Mail size={13} /> {profile.email}
        </span>
      </div>
    </div>
  );
}
