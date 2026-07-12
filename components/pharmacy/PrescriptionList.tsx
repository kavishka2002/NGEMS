"use client";

import { useState } from "react";
import { ChevronDown, Eye, CheckCircle2, Clock } from "lucide-react";
import Button from "@/components/Button";

interface Prescription {
  id: string;
  patientName: string;
  patientId: string;
  doctorName: string;
  medicines: string[];
  dateIssued: string;
  status: "pending" | "dispensed" | "completed";
}

const mockPrescriptions: Prescription[] = [
  {
    id: "RX001",
    patientName: "John Doe",
    patientId: "P001",
    doctorName: "Dr. Smith",
    medicines: ["Aspirin 500mg x30", "Amoxicillin 250mg x10"],
    dateIssued: "2026-07-10",
    status: "pending",
  },
  {
    id: "RX002",
    patientName: "Jane Smith",
    patientId: "P002",
    doctorName: "Dr. Johnson",
    medicines: ["Ibuprofen 200mg x20"],
    dateIssued: "2026-07-09",
    status: "dispensed",
  },
  {
    id: "RX003",
    patientName: "Robert Wilson",
    patientId: "P003",
    doctorName: "Dr. Brown",
    medicines: ["Paracetamol 500mg x30", "Cough Syrup 100ml"],
    dateIssued: "2026-07-08",
    status: "completed",
  },
];

export default function PrescriptionList() {
  const [expanded, setExpanded] = useState<string | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "dispensed":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "completed":
        return "bg-green-50 text-green-700 border-green-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock size={14} />;
      case "dispensed":
        return <Eye size={14} />;
      case "completed":
        return <CheckCircle2 size={14} />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-3">
      {mockPrescriptions.map((prescription) => (
        <div
          key={prescription.id}
          className="rounded-lg border border-slate-border bg-white shadow-sm transition-all hover:shadow-card"
        >
          <button
            onClick={() =>
              setExpanded(expanded === prescription.id ? null : prescription.id)
            }
            className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-slate-50"
          >
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <p className="font-semibold text-blue-900">{prescription.patientName}</p>
                <span className={clsx("inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border", getStatusColor(prescription.status))}>
                  {getStatusIcon(prescription.status)}
                  {prescription.status.charAt(0).toUpperCase() + prescription.status.slice(1)}
                </span>
              </div>
              <p className="text-sm text-slate-600">
                ID: {prescription.patientId} | Dr. {prescription.doctorName}
              </p>
            </div>
            <ChevronDown
              size={20}
              className={clsx(
                "text-slate-400 transition-transform",
                expanded === prescription.id ? "rotate-180" : ""
              )}
            />
          </button>

          {expanded === prescription.id && (
            <div className="border-t border-slate-border px-6 py-4 bg-slate-50">
              <div className="mb-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-navy/50 mb-2">
                  Medicines Prescribed
                </p>
                <ul className="space-y-2">
                  {prescription.medicines.map((medicine, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm text-navy">
                      <span className="h-1.5 w-1.5 rounded-full bg-health-600" />
                      {medicine}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex gap-2">
                {prescription.status === "pending" && (
                  <Button type="button" variant="primary" className="px-4 py-2 text-sm">
                    Dispense
                  </Button>
                )}
                {prescription.status === "dispensed" && (
                  <Button type="button" variant="primary" className="px-4 py-2 text-sm">
                    Complete
                  </Button>
                )}
                <Button type="button" variant="secondary" className="px-4 py-2 text-sm">
                  View Details
                </Button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function clsx(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}
