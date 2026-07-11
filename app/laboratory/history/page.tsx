"use client";

import LaboratoryNavbar from "@/components/laboratory/LaboratoryNavbar";
import LaboratorySidebar from "@/components/laboratory/LaboratorySidebar";
import { Clock, FileText, CheckCircle2, AlertCircle } from "lucide-react";
import Link from "next/link";

interface LabHistory {
  id: string;
  requestId: string;
  patientName: string;
  testType: string;
  status: "completed" | "failed" | "reported";
  completionDate: string;
  resultStatus: "normal" | "abnormal";
  technician: string;
}

const mockHistory: LabHistory[] = [
  {
    id: "1",
    requestId: "LAB-2025-050",
    patientName: "John Doe",
    testType: "Blood Work - Complete Blood Count",
    status: "reported",
    completionDate: "2025-07-09 14:30",
    resultStatus: "normal",
    technician: "Technician A",
  },
  {
    id: "2",
    requestId: "LAB-2025-049",
    patientName: "Jane Smith",
    testType: "Urine Test - Full Analysis",
    status: "reported",
    completionDate: "2025-07-09 13:15",
    resultStatus: "normal",
    technician: "Technician B",
  },
  {
    id: "3",
    requestId: "LAB-2025-048",
    patientName: "Robert Wilson",
    testType: "COVID-19 RT-PCR Test",
    status: "completed",
    completionDate: "2025-07-09 11:00",
    resultStatus: "normal",
    technician: "Technician C",
  },
  {
    id: "4",
    requestId: "LAB-2025-047",
    patientName: "Emily Davis",
    testType: "Glucose Test - Fasting",
    status: "reported",
    completionDate: "2025-07-08 16:45",
    resultStatus: "abnormal",
    technician: "Technician A",
  },
  {
    id: "5",
    requestId: "LAB-2025-046",
    patientName: "Michael Brown",
    testType: "Thyroid Function Test",
    status: "completed",
    completionDate: "2025-07-08 15:20",
    resultStatus: "normal",
    technician: "Technician D",
  },
  {
    id: "6",
    requestId: "LAB-2025-045",
    patientName: "Sarah Johnson",
    testType: "Lipid Panel",
    status: "failed",
    completionDate: "2025-07-08 10:30",
    resultStatus: "normal",
    technician: "Technician B",
  },
];

export default function HistoryPage() {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-4 w-4 text-blue-600" />;
      case "reported":
        return <FileText className="h-4 w-4 text-green-600" />;
      case "failed":
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-blue-100 text-blue-700";
      case "reported":
        return "bg-green-100 text-green-700";
      case "failed":
        return "bg-red-100 text-red-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  const getResultBadge = (result: string) => {
    return result === "normal"
      ? "bg-green-100 text-green-700"
      : "bg-orange-100 text-orange-700";
  };

  return (
    <div className="flex h-screen bg-slate-50">
      <LaboratorySidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <LaboratoryNavbar />
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 md:p-8">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-semibold text-navy/60">TEST RECORDS</h2>
                  <h1 className="mt-2 text-3xl font-bold text-navy">Laboratory History</h1>
                  <p className="mt-1 text-sm text-navy/60">
                    View completed and reported laboratory tests
                  </p>
                </div>
                <Link href="/laboratory/dashboard">
                  <button className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-navy shadow-sm hover:bg-slate-50">
                    ← Back to Dashboard
                  </button>
                </Link>
              </div>
            </div>

            {/* Search & Filter */}
            <div className="mb-6 flex flex-col gap-4 md:flex-row">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search by patient name or request ID..."
                  className="w-full rounded-lg border border-slate-border bg-white px-4 py-2 text-sm text-navy placeholder-navy/40 focus:border-seal-500 focus:outline-none focus:ring-1 focus:ring-seal-500"
                />
              </div>
              <button className="rounded-lg border border-slate-border bg-white px-4 py-2 text-sm font-medium text-navy shadow-sm hover:bg-slate-50">
                📅 Date Range
              </button>
              <button className="rounded-lg border border-slate-border bg-white px-4 py-2 text-sm font-medium text-navy shadow-sm hover:bg-slate-50">
                🔍 Status Filter
              </button>
            </div>

            {/* History Table */}
            <div className="rounded-lg bg-white shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-slate-border bg-slate-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-navy/60">
                        Request ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-navy/60">
                        Patient Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-navy/60">
                        Test Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-navy/60">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-navy/60">
                        Result
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-navy/60">
                        Completion Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-navy/60">
                        Technician
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-border">
                    {mockHistory.map((record) => (
                      <tr key={record.id} className="hover:bg-slate-50">
                        <td className="px-6 py-4 font-semibold text-seal-600">{record.requestId}</td>
                        <td className="px-6 py-4 text-sm text-navy">{record.patientName}</td>
                        <td className="px-6 py-4 text-sm text-navy/70">{record.testType}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${getStatusBadge(record.status)}`}>
                            {getStatusIcon(record.status)}
                            {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${getResultBadge(record.resultStatus)}`}>
                            {record.resultStatus === "normal" ? "✓" : "⚠"} {record.resultStatus.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-xs text-navy/60">{record.completionDate}</td>
                        <td className="px-6 py-4 text-sm text-navy/70">{record.technician}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
