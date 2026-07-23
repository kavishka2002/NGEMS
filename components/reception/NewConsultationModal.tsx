"use client";

import { useState } from "react";
import Button from "@/components/Button";
import { Stethoscope, CheckCircle2 } from "lucide-react";

type Props = {
    patient: any;
    onClose: () => void;
    onCreated?: (consultation: any) => void;
};

const CONSULTATION_TYPES = ["Initial Consultation", "Follow-up", "Emergency", "Referral"];
const DEPARTMENTS = ["OPD", "Emergency", "Cardiology", "Pediatrics", "Surgery", "Orthopedics"];

export default function NewConsultationModal({ patient, onClose, onCreated }: Props) {
    const [department, setDepartment] = useState(patient?.department || "OPD");
    const [doctor, setDoctor] = useState(patient?.doctor || "");
    const [consultationType, setConsultationType] = useState("Initial Consultation");
    const [symptoms, setSymptoms] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [created, setCreated] = useState(false);

    const submit = async () => {
        if (!doctor.trim() || !symptoms.trim()) {
            setError("Please fill in doctor name and symptoms");
            return;
        }

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
                consultationType,
                symptoms,
                consultedAt: new Date().toISOString(),
                status: "Scheduled",
            };

            const res = await fetch("/api/consultations", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            const payload = await res.json();

            if (!res.ok) {
                setError(payload?.error || "Failed to create consultation.");
                setLoading(false);
                return;
            }

            setCreated(true);
            onCreated?.(payload.consultation || payload.data || body);
            setTimeout(() => onClose(), 2000);
        } catch (err) {
            setError(String(err));
        } finally {
            setLoading(false);
        }
    };

    if (created) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center">
                    <CheckCircle2 size={48} className="mx-auto mb-4 text-health-600" />
                    <h3 className="mb-2 text-lg font-semibold">Consultation Created</h3>
                    <p className="text-sm text-navy-400">
                        New consultation with <strong>{doctor}</strong> has been scheduled for {patient?.name || "the patient"}.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 max-h-[90vh] overflow-y-auto">
                <h3 className="mb-2 text-lg font-semibold">New Consultation</h3>
                <p className="mb-4 text-sm text-navy-400">Patient: {patient?.name || patient?.fullName || "Unknown"}</p>

                <div className="space-y-3">
                    <div>
                        <label className="block text-xs text-navy-400">Department</label>
                        <select
                            value={department}
                            onChange={(e) => setDepartment(e.target.value)}
                            className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
                        >
                            {DEPARTMENTS.map((d) => (
                                <option key={d} value={d}>
                                    {d}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs text-navy-400">Doctor Name</label>
                        <input
                            value={doctor}
                            onChange={(e) => setDoctor(e.target.value)}
                            placeholder="Enter doctor name"
                            className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
                        />
                    </div>

                    <div>
                        <label className="block text-xs text-navy-400">Consultation Type</label>
                        <select
                            value={consultationType}
                            onChange={(e) => setConsultationType(e.target.value)}
                            className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
                        >
                            {CONSULTATION_TYPES.map((t) => (
                                <option key={t} value={t}>
                                    {t}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs text-navy-400">Chief Complaint / Symptoms</label>
                        <textarea
                            value={symptoms}
                            onChange={(e) => setSymptoms(e.target.value)}
                            placeholder="Describe patient symptoms and chief complaint..."
                            className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
                            rows={4}
                        />
                    </div>
                </div>

                {error && <p className="mt-3 text-sm text-rose-600">{error}</p>}

                <div className="mt-4 flex items-center justify-end gap-2">
                    <Button variant="secondary" onClick={onClose} type="button">
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={submit} type="button" disabled={loading}>
                        <Stethoscope size={14} />
                        {loading ? "Creating..." : "Create"}
                    </Button>
                </div>
            </div>
        </div>
    );
}
