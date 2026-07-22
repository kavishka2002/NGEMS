"use client";

import { useEffect, useMemo, useState } from "react";
import DashboardNavbar from "@/components/dashboard/DashboardNavbar";
import Sidebar from "@/components/dashboard/Sidebar";
import Button from "@/components/Button";
import { Plus, Search } from "lucide-react";
import Link from "next/link";
import { getPatients } from "@/lib/operations-service";

export default function PatientsPage() {
  const [patients, setPatients] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const session = typeof window !== "undefined" ? window.localStorage.getItem("ngemsHospitalSession") : null;
    const hospitalId = session ? JSON.parse(session).hospitalId : null;

    if (!hospitalId) {
      setError("Hospital context is missing. Please sign in again.");
      setIsLoading(false);
      return;
    }

    const fetchPatients = async () => {
      const data = await getPatients(hospitalId);
      setPatients(data);
      setIsLoading(false);
    };

    void fetchPatients();
  }, []);

  const filteredPatients = useMemo(
    () =>
      patients.filter((item) =>
        [item.fullName, item.patientId, item.email, item.phone]
          .filter(Boolean)
          .some((value) => value.toLowerCase().includes(searchTerm.toLowerCase()))
      ),
    [patients, searchTerm]
  );

  return (
    <div className="flex h-screen flex-col overflow-hidden" style={{ backgroundColor: "#F0F4F8" }}>
      <DashboardNavbar />
      <div className="flex flex-1 min-h-0 overflow-hidden">
        <Sidebar />

        <main className="min-w-0 flex-1 overflow-y-auto overflow-x-hidden px-4 py-6 md:px-6 lg:px-8">
          <div className="mb-6">
            <div className="max-w-7xl w-full mx-auto rounded-lg bg-white/60 px-4 py-6 shadow-sm md:px-6 lg:px-8">
              <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-amber-600">Operations Management</p>
                  <h1 className="mt-1 font-display text-3xl font-bold leading-tight text-[#0B2545]">Patients</h1>
                  <p className="mt-1 text-sm text-[#146C94]">View and manage patient records and history.</p>
                </div>
                <Button type="button" variant="primary" className="w-auto px-4 py-2 text-sm">
                  <Plus size={16} className="mr-2 inline" /> Register Patient
                </Button>
              </div>
            </div>
          </div>

          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search size={18} className="absolute left-3 top-3 text-navy/40" />
              <input
                type="text"
                placeholder="Search patients by name, ID, or contact..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-health-600 focus:border-transparent"
              />
            </div>
          </div>

          <div className="rounded-lg bg-white shadow-sm border border-slate-border p-6">
            {isLoading ? (
              <div className="text-center py-12 text-slate-500">Loading patients...</div>
            ) : error ? (
              <div className="text-center py-12 text-rose-600">{error}</div>
            ) : filteredPatients.length === 0 ? (
              <div className="text-center py-12 text-slate-500">No patients found.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[700px] table-auto text-left">
                  <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-600">
                    <tr>
                      <th className="px-4 py-3">Patient Name</th>
                      <th className="px-4 py-3">Patient ID</th>
                      <th className="px-4 py-3">Phone</th>
                      <th className="px-4 py-3">Ward</th>
                      <th className="px-4 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {filteredPatients.map((patient) => (
                      <tr key={patient.id} className="hover:bg-slate-50">
                        <td className="px-4 py-4 font-medium text-slate-900">{patient.fullName || "Unknown"}</td>
                        <td className="px-4 py-4 text-slate-600">{patient.patientId || "—"}</td>
                        <td className="px-4 py-4 text-slate-600">{patient.phone || "—"}</td>
                        <td className="px-4 py-4 text-slate-600">{patient.ward || "—"}</td>
                        <td className="px-4 py-4 text-slate-600">{patient.status || "Active"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
