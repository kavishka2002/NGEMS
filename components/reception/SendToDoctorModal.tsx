"use client";

import { useState } from "react";
import Button from "@/components/Button";
import { Send, CheckCircle2 } from "lucide-react";

type Props = {
    patient: any;
    onClose: () => void;
    onSent?: (data: any) => void;
};

const DEPARTMENTS = ["OPD", "Emergency", "Cardiology", "Pediatrics", "Surgery", "Orthopedics"];

export default function SendToDoctorModal({ patient, onClose, onSent }: Props) {
    const [department, setDepartment] = useState(patient?.department || "");
    const [doctor, setDoctor] = useState(patient?.doctor || "");
    const [priority, setPriority] = useState("Normal");
    const [notes, setNotes] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [sent, setSent] = useState(false);

    const submit = async () => {
        if (!doctor.trim()) {
            setError("Please select or enter a doctor name");
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
                priority,
                notes,
                sentAt: new Date().toISOString(),
            };

            const res = await fetch("/api/referrals", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            const payload = await res.json();

            if (!res.ok) {
                setError(payload?.error || "Failed to send to doctor.");
                setLoading(false);
                return;
            }

            setSent(true);
            onSent?.(payload.referral || payload.data || body);
            setTimeout(() => onClose(), 2000);
        } catch (err) {
            setError(String(err));
        } finally {
            setLoading(false);
        }
    };

    if (sent) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center">
                    <CheckCircle2 size={48} className="mx-auto mb-4 text-health-600" />
                    <h3 className="mb-2 text-lg font-semibold">Sent to Doctor</h3>
                    <p className="text-sm text-navy-400">
                        Patient record has been successfully sent to <strong>{doctor}</strong>.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="w-full max-w-md rounded-2xl bg-white p-6">
                <h3 className="mb-2 text-lg font-semibold">Send to Doctor</h3>
                <p className="mb-4 text-sm text-navy-400">Patient: {patient?.name || patient?.fullName || "Unknown"}</p>

                <div className="space-y-3">
                    <div>
                        <label className="block text-xs text-navy-400">Department</label>
                        <select
                            value={department}
                            onChange={(e) => setDepartment(e.target.value)}
                            className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
                        >
                            <option value="">Select Department</option>
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
                        <label className="block text-xs text-navy-400">Priority</label>
                        <select
                            value={priority}
                            onChange={(e) => setPriority(e.target.value)}
                            className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
                        >
                            <option>Normal</option>
                            <option>Urgent</option>
                            <option>Critical</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs text-navy-400">Notes (Optional)</label>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Add any notes for the doctor..."
                            className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
                            rows={3}
                        />
                    </div>
                </div>

                {error && <p className="mt-3 text-sm text-rose-600">{error}</p>}

                <div className="mt-4 flex items-center justify-end gap-2">
                    <Button variant="secondary" onClick={onClose} type="button">
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={submit} type="button" disabled={loading}>
                        <Send size={14} />
                        {loading ? "Sending..." : "Send"}
                    </Button>
                </div>
            </div>
        </div>
    );
}
