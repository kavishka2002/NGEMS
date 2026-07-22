"use client";

import LaboratoryNavbar from "@/components/laboratory/LaboratoryNavbar";
import LaboratorySidebar from "@/components/laboratory/LaboratorySidebar";
import { FlaskConical, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import Link from "next/link";

interface TestProcessing {
  id: string;
  requestId: string;
  patientName: string;
  testType: string;
  status: "pending" | "in-progress" | "completed" | "failed";
  startTime: string;
  estimatedTime: string;
  technician: string;
}

const mockProcessing: TestProcessing[] = [
  {
    id: "1",
    requestId: "LAB-2025-001",
    patientName: "John Doe",
    testType: "Blood Work - Complete Blood Count",
    status: "in-progress",
    startTime: "2025-07-10 09:00",
    estimatedTime: "~30 mins",
    technician: "Technician A",
  },
  {
    id: "2",
    requestId: "LAB-2025-002",
    patientName: "Jane Smith",
    testType: "Urine Test - Full Analysis",
    status: "in-progress",
    startTime: "2025-07-10 09:30",
    estimatedTime: "~20 mins",
    technician: "Technician B",
  },
  {
    id: "3",
    requestId: "LAB-2025-003",
    patientName: "Robert Wilson",
    testType: "COVID-19 RT-PCR Test",
    status: "completed",
    startTime: "2025-07-10 08:00",
    estimatedTime: "~45 mins",
    technician: "Technician C",
  },
  {
    id: "4",
    requestId: "LAB-2025-004",
    patientName: "Emily Davis",
    testType: "Glucose Test - Fasting",
    status: "pending",
    startTime: "Pending",
    estimatedTime: "~15 mins",
    technician: "Awaiting Assignment",
  },
  {
    id: "5",
    requestId: "LAB-2025-005",
    patientName: "Michael Brown",
    testType: "Thyroid Function Test",
    status: "in-progress",
    startTime: "2025-07-10 10:15",
    estimatedTime: "~25 mins",
    technician: "Technician A",
  },
];

export default function TestProcessingPage() {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case "in-progress":
        return <FlaskConical className="h-4 w-4 text-blue-600 animate-pulse" />;
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case "failed":
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-700";
      case "in-progress":
        return "bg-blue-100 text-blue-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "failed":
        return "bg-red-100 text-red-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  const inProgressCount = mockProcessing.filter((t) => t.status === "in-progress").length;
  const completedCount = mockProcessing.filter((t) => t.status === "completed").length;
  const pendingCount = mockProcessing.filter((t) => t.status === "pending").length;

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
                  <h2 className="text-sm font-semibold text-navy/60">TEST MANAGEMENT</h2>
                  <h1 className="mt-2 text-3xl font-bold text-navy">Test Processing</h1>
                  <p className="mt-1 text-sm text-navy/60">
                    Monitor and manage laboratory test processing
                  </p>
                </div>
                <Link href="/laboratory/dashboard">
                  <button className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-navy shadow-sm hover:bg-slate-50">
                    ← Back to Dashboard
                  </button>
                </Link>
              </div>

              {/* Status Summary */}
              <div className="mt-6 grid gap-4 md:grid-cols-4">
                <div className="rounded-lg bg-white p-4 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-blue-100 p-3">
                      <FlaskConical className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-navy/60">IN PROGRESS</p>
                      <p className="text-2xl font-bold text-blue-600">{inProgressCount}</p>
                    </div>
                  </div>
                </div>
                <div className="rounded-lg bg-white p-4 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-green-100 p-3">
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-navy/60">COMPLETED</p>
                      <p className="text-2xl font-bold text-green-600">{completedCount}</p>
                    </div>
                  </div>
                </div>
                <div className="rounded-lg bg-white p-4 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-yellow-100 p-3">
                      <Clock className="h-5 w-5 text-yellow-600" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-navy/60">PENDING</p>
                      <p className="text-2xl font-bold text-yellow-600">{pendingCount}</p>
                    </div>
                  </div>
                </div>
                <div className="rounded-lg bg-white p-4 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-seal-100 p-3">
                      <FlaskConical className="h-5 w-5 text-seal-600" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-navy/60">TOTAL TESTS</p>
                      <p className="text-2xl font-bold text-seal-600">{mockProcessing.length}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tests Table */}
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
                        Start Time
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-navy/60">
                        Est. Time
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-navy/60">
                        Technician
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-border">
                    {mockProcessing.map((test) => (
                      <tr key={test.id} className="hover:bg-slate-50">
                        <td className="px-6 py-4 font-semibold text-seal-600">{test.requestId}</td>
                        <td className="px-6 py-4 text-sm text-navy">{test.patientName}</td>
                        <td className="px-6 py-4 text-sm text-navy/70">{test.testType}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${getStatusBadge(test.status)}`}>
                            {getStatusIcon(test.status)}
                            {test.status.charAt(0).toUpperCase() + test.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-navy/70">{test.startTime}</td>
                        <td className="px-6 py-4 text-sm text-navy/70">{test.estimatedTime}</td>
                        <td className="px-6 py-4 text-sm text-navy/70">{test.technician}</td>
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
