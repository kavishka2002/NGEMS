"use client";

import { useState } from "react";
import { ChevronDown, Eye, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import Button from "@/components/Button";

interface LabRequest {
  id: string;
  patientName: string;
  patientId: string;
  doctorName: string;
  testType: string;
  tests: string[];
  dateRequested: string;
  status: "pending" | "collected" | "processing" | "completed";
  priority: "normal" | "urgent";
}

const mockLabRequests: LabRequest[] = [
  {
    id: "LAB001",
    patientName: "John Doe",
    patientId: "P001",
    doctorName: "Dr. Smith",
    testType: "Blood Work",
    tests: ["Complete Blood Count (CBC)", "Blood Sugar", "Liver Function Tests"],
    dateRequested: "2026-07-10",
    status: "pending",
    priority: "normal",
  },
  {
    id: "LAB002",
    patientName: "Jane Smith",
    patientId: "P002",
    doctorName: "Dr. Johnson",
    testType: "Urine Test",
    tests: ["Urinalysis", "Urine Culture"],
    dateRequested: "2026-07-09",
    status: "collected",
    priority: "urgent",
  },
  {
    id: "LAB003",
    patientName: "Robert Wilson",
    patientId: "P003",
    doctorName: "Dr. Brown",
    testType: "COVID-19 Test",
    tests: ["RT-PCR Test"],
    dateRequested: "2026-07-08",
    status: "completed",
    priority: "normal",
  },
];

function clsx(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}

export default function LabRequestsList() {
  const [expanded, setExpanded] = useState<string | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "collected":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "processing":
        return "bg-purple-50 text-purple-700 border-purple-200";
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
      case "collected":
        return <AlertCircle size={14} />;
      case "processing":
        return <Eye size={14} />;
      case "completed":
        return <CheckCircle2 size={14} />;
      default:
        return null;
    }
  };

  const getPriorityColor = (priority: string) => {
    return priority === "urgent"
      ? "bg-red-50 text-red-700 border-red-200"
      : "bg-gray-50 text-gray-700 border-gray-200";
  };

  return (
    <div className="space-y-3">
      {mockLabRequests.map((request) => (
        <div
          key={request.id}
          className="rounded-lg border border-slate-border bg-white shadow-sm transition-all hover:shadow-card"
        >
          <button
            onClick={() =>
              setExpanded(expanded === request.id ? null : request.id)
            }
            className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-slate-50"
          >
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <p className="font-semibold text-navy">{request.patientName}</p>
                <span
                  className={clsx(
                    "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border",
                    getStatusColor(request.status)
                  )}
                >
                  {getStatusIcon(request.status)}
                  {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                </span>
                <span
                  className={clsx(
                    "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border",
                    getPriorityColor(request.priority)
                  )}
                >
                  {request.priority.charAt(0).toUpperCase() + request.priority.slice(1)}
                </span>
              </div>
              <p className="text-sm text-navy/60">
                ID: {request.patientId} | Dr. {request.doctorName} | {request.testType}
              </p>
            </div>
            <ChevronDown
              size={20}
              className={clsx(
                "text-navy/40 transition-transform",
                expanded === request.id ? "rotate-180" : ""
              )}
            />
          </button>

          {expanded === request.id && (
            <div className="border-t border-slate-border px-6 py-4 bg-slate-50">
              <div className="mb-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-navy/50 mb-2">
                  Tests Requested
                </p>
                <ul className="space-y-2">
                  {request.tests.map((test, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm text-navy">
                      <span className="h-1.5 w-1.5 rounded-full bg-seal-600" />
                      {test}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex gap-2">
                {request.status === "pending" && (
                  <Button type="button" variant="primary" className="px-4 py-2 text-sm">
                    Collect Sample
                  </Button>
                )}
                {request.status === "collected" && (
                  <Button type="button" variant="primary" className="px-4 py-2 text-sm">
                    Start Processing
                  </Button>
                )}
                {request.status === "processing" && (
                  <Button type="button" variant="primary" className="px-4 py-2 text-sm">
                    Upload Results
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
