"use client";

import { useEffect, useState } from "react";
import LaboratoryNavbar from "@/components/laboratory/LaboratoryNavbar";
import LaboratorySidebar from "@/components/laboratory/LaboratorySidebar";
import Button from "@/components/Button";
import { Search, Filter } from "lucide-react";

interface LabRequestItem {
  id: string;
  requestId: string;
  patientId: string;
  patientName: string;
  doctorName: string;
  testName: string;
  status: string;
  priority: string;
  requestDate: string;
}

export default function LabRequestsPage() {
  const [requests, setRequests] = useState<LabRequestItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const session = window.localStorage.getItem("ngemsLaboratorySession");
    const parsed = session ? JSON.parse(session) : {};
    fetch(`/api/laboratory/requests?hospitalId=${parsed.hospitalId || ""}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.success) setRequests(data.data || []);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-slate-50">
      <LaboratoryNavbar />
      <div className="flex flex-1 min-h-0 overflow-hidden">
        <LaboratorySidebar />
        <main className="min-w-0 flex-1 overflow-y-auto overflow-x-hidden px-4 py-6 md:px-6 lg:px-8">
          <div className="mb-8 rounded-2xl bg-white p-6 shadow-sm">
            <h1 className="text-3xl font-semibold text-navy">Laboratory Test Requests</h1>
            <p className="mt-2 text-sm text-navy/70">View and manage incoming laboratory requests.</p>
          </div>

          <div className="mb-6 flex flex-col gap-3 md:flex-row">
            <div className="relative flex-1">
              <Search size={18} className="absolute left-3 top-3 text-navy/40" />
              <input className="w-full rounded-lg border border-slate-200 py-2.5 pl-10 pr-4" placeholder="Search requests" />
            </div>
            <Button type="button" variant="secondary" className="flex items-center gap-2 px-4 py-2.5">
              <Filter size={16} />
              Filters
            </Button>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            {loading ? <div className="h-24 animate-pulse bg-slate-100" /> : (
              <table className="min-w-full text-sm">
                <thead className="bg-slate-50 text-left text-xs uppercase tracking-wider text-navy/60">
                  <tr>
                    <th className="px-4 py-3">Request ID</th>
                    <th className="px-4 py-3">Patient</th>
                    <th className="px-4 py-3">Doctor</th>
                    <th className="px-4 py-3">Test</th>
                    <th className="px-4 py-3">Priority</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((request) => (
                    <tr key={request.id} className="border-t border-slate-100">
                      <td className="px-4 py-3 font-medium text-seal-600">{request.requestId || request.id}</td>
                      <td className="px-4 py-3">{request.patientName || request.patientId}</td>
                      <td className="px-4 py-3">{request.doctorName}</td>
                      <td className="px-4 py-3">{request.testName}</td>
                      <td className="px-4 py-3">{request.priority}</td>
                      <td className="px-4 py-3">{request.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
