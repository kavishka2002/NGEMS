"use client";

import { useEffect, useState } from "react";
import LaboratoryNavbar from "@/components/laboratory/LaboratoryNavbar";
import LaboratorySidebar from "@/components/laboratory/LaboratorySidebar";
import Button from "@/components/Button";

export default function ReportsPage() {
  const [reports, setReports] = useState<any[]>([]);

  useEffect(() => {
    const session = window.localStorage.getItem("ngemsLaboratorySession");
    const parsed = session ? JSON.parse(session) : {};
    fetch(`/api/laboratory/dashboard?hospitalId=${parsed.hospitalId || ""}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.success) setReports(data.recentRequests || []);
      });
  }, []);

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-slate-50">
      <LaboratoryNavbar />
      <div className="flex flex-1 min-h-0 overflow-hidden">
        <LaboratorySidebar />
        <main className="min-w-0 flex-1 overflow-y-auto overflow-x-hidden px-4 py-6 md:px-6 lg:px-8">
          <div className="rounded-2xl bg-white p-8 shadow-sm">
            <h1 className="text-3xl font-semibold text-navy">Completed Reports</h1>
            <p className="mt-2 text-sm text-navy/70">Verified reports ready for viewing and export.</p>
            <div className="mt-6 space-y-3">
              {reports.map((item) => (
                <div key={item.id} className="flex items-center justify-between rounded-xl border border-slate-200 p-4">
                  <div>
                    <p className="font-semibold text-navy">{item.requestId}</p>
                    <p className="text-sm text-navy/60">{item.patientName} • {item.test}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button type="button" variant="secondary">View</Button>
                    <Button type="button" variant="primary">Print</Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
