"use client";

import { useState } from "react";
import Button from "@/components/Button";

type Props = {
  patient: any;
  onClose: () => void;
  onSaved?: (appointment: any) => void;
};

export default function AppointmentModal({ patient, onClose, onSaved }: Props) {
  const [department, setDepartment] = useState(patient?.department || "OPD");
  const [doctor, setDoctor] = useState(patient?.doctor || "");
  const [appointmentType, setAppointmentType] = useState("Consultation");
  const [scheduledAt, setScheduledAt] = useState(() => new Date().toISOString().slice(0, 16));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    setLoading(true);
    setError(null);

    try {
      const rawSession = typeof window !== "undefined" ? window.localStorage.getItem("ngemsHospitalSession") : null;
      const session = rawSession
        ? JSON.parse(rawSession)
        : {
            hospitalId: (process.env.NEXT_PUBLIC_HOSPITAL_ID as string) || undefined,
            hospitalName: (process.env.NEXT_PUBLIC_HOSPITAL_NAME as string) || undefined,
          };

      const body = {
        hospitalId: session?.hospitalId || patient?.hospitalId || "",
        hospitalName: session?.hospitalName || patient?.hospitalName || "",
        patientId: patient?.id || patient?.patientId || "",
        patientName: patient?.name || patient?.fullName || "",
        patientNic: patient?.nic || "",
        mobile: patient?.mobile || "",
        department,
        doctor,
        appointmentType,
        scheduledAt: new Date(scheduledAt).toISOString(),
      };

      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const payload = await res.json();

      if (!res.ok) {
        setError(payload?.error || "Failed to create appointment.");
        setLoading(false);
        return;
      }

      onSaved?.(payload.appointment || payload.data || payload.appointment);
      onClose();
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-2xl bg-white p-6">
        <h3 className="mb-2 text-lg font-semibold">Book Appointment</h3>
        <p className="mb-4 text-sm text-navy-400">Patient: {patient?.name || patient?.fullName || "Unknown"}</p>

        <div className="space-y-3">
          <div>
            <label className="block text-xs text-navy-400">Department</label>
            <input value={department} onChange={(e) => setDepartment(e.target.value)} className="mt-1 w-full rounded-md border px-3 py-2" />
          </div>
          <div>
            <label className="block text-xs text-navy-400">Doctor</label>
            <input value={doctor} onChange={(e) => setDoctor(e.target.value)} className="mt-1 w-full rounded-md border px-3 py-2" />
          </div>
          <div>
            <label className="block text-xs text-navy-400">Type</label>
            <select value={appointmentType} onChange={(e) => setAppointmentType(e.target.value)} className="mt-1 w-full rounded-md border px-3 py-2">
              <option>Consultation</option>
              <option>Follow-up</option>
              <option>Emergency</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-navy-400">Scheduled At</label>
            <input type="datetime-local" value={scheduledAt} onChange={(e) => setScheduledAt(e.target.value)} className="mt-1 w-full rounded-md border px-3 py-2" />
          </div>
        </div>

        {error && <p className="mt-3 text-sm text-rose-600">{error}</p>}

        <div className="mt-4 flex items-center justify-end gap-2">
          <Button variant="secondary" onClick={onClose} type="button">Cancel</Button>
          <Button variant="primary" onClick={submit} type="button" disabled={loading}>{loading ? "Saving..." : "Book"}</Button>
        </div>
      </div>
    </div>
  );
}
