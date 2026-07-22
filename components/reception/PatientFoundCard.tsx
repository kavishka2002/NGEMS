"use client";

import {
  FileClock,
  CalendarPlus,
  Send,
  Stethoscope,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import Button from "@/components/Button";
import { Patient, calcAge } from "@/lib/reception-data";
import { useState } from "react";
import AppointmentModal from "@/components/reception/AppointmentModal";

type PatientFoundCardProps = {
  patient: Patient;
  onViewHistory: () => void;
};

export default function PatientFoundCard({ patient, onViewHistory }: PatientFoundCardProps) {
  const [showBooking, setShowBooking] = useState(false);
  const displayName = (patient && (patient.name || (patient as any).fullName || patient.mobile)) || "Unknown";
  const initials = displayName
    .toString()
    .split(" ")
    .map((p) => (p ? p[0] : ""))
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="rounded-2xl border border-health-100 bg-health-50/60 p-6 shadow-card">
      <div className="mb-4 flex items-center gap-2 text-health-700">
        <CheckCircle2 size={16} />
        <p className="text-xs font-semibold uppercase tracking-wide">Existing Patient Found</p>
      </div>

      <div className="flex items-center gap-4">
        <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-navy-900 font-display text-lg font-semibold text-white">
          {initials}
        </span>
        <div className="min-w-0">
          <p className="truncate font-display text-base font-semibold text-navy-900">
            {displayName}
          </p>
          <p className="font-mono text-xs text-navy-400">{patient.id}</p>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
        <div>
          <p className="text-[11px] uppercase tracking-wide text-navy-300">Age</p>
          <p className="font-medium text-navy-800">{calcAge(patient.dob)} yrs</p>
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-wide text-navy-300">Gender</p>
          <p className="font-medium text-navy-800">{patient.gender}</p>
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-wide text-navy-300">Blood Group</p>
          <p className="font-medium text-navy-800">{patient.bloodGroup}</p>
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-wide text-navy-300">Registered</p>
          <p className="font-medium text-navy-800">{patient.regDate}</p>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between rounded-lg bg-white px-3.5 py-2.5">
        <span className="text-xs font-medium text-navy-400">Current Status</span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-health-100 px-2.5 py-0.5 text-xs font-semibold text-health-700">
          <span className="h-1.5 w-1.5 rounded-full bg-health-500" />
          {patient.status}
        </span>
      </div>

      {patient.alerts.length > 0 && (
        <div className="mt-3 flex items-start gap-2 rounded-lg border border-rose-200 bg-rose-50 px-3.5 py-2.5">
          <AlertTriangle size={14} className="mt-0.5 shrink-0 text-rose-500" />
          <div className="flex flex-wrap gap-1.5">
            {patient.alerts.map((alert) => (
              <span key={alert} className="text-xs font-medium text-rose-700">
                {alert}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="mt-5 grid grid-cols-2 gap-2.5">
        <Button variant="secondary" fullWidth onClick={onViewHistory} type="button">
          <FileClock size={14} />
          Medical History
        </Button>
        <Button variant="secondary" fullWidth type="button" onClick={() => setShowBooking(true)}>
          <CalendarPlus size={14} />
          Book Appointment
        </Button>
        <Button variant="ghost" fullWidth type="button" className="border border-slate-200">
          <Send size={14} />
          Send To Doctor
        </Button>
        <Button variant="primary" fullWidth type="button">
          <Stethoscope size={14} />
          New Consultation
        </Button>
      </div>
      {showBooking && (
        <AppointmentModal
          patient={patient}
          onClose={() => setShowBooking(false)}
          onSaved={(appt) => {
            // Optionally notify user or refresh lists
            console.log("Appointment created", appt);
          }}
        />
      )}
    </div>
  );
}
