"use client";

import { useEffect, useState } from "react";
import LaboratoryNavbar from "@/components/laboratory/LaboratoryNavbar";
import LaboratorySidebar from "@/components/laboratory/LaboratorySidebar";
import Button from "@/components/Button";
import { Search } from "lucide-react";

export default function SampleCollectionPage() {
  const [samples, setSamples] = useState<any[]>([]);

  useEffect(() => {
    const session = window.localStorage.getItem("ngemsLaboratorySession");
    const parsed = session ? JSON.parse(session) : {};
    fetch(`/api/laboratory/samples?hospitalId=${parsed.hospitalId || ""}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.success) setSamples(data.data || []);
      });
  }, []);

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-slate-50">
      <LaboratoryNavbar />
      <div className="flex flex-1 min-h-0 overflow-hidden">
        <LaboratorySidebar />
        <main className="min-w-0 flex-1 overflow-y-auto overflow-x-hidden px-4 py-6 md:px-6 lg:px-8">
          <div className="mb-8 rounded-2xl bg-white p-6 shadow-sm">
            <h1 className="text-3xl font-semibold text-navy">Sample Collection</h1>
            <p className="mt-2 text-sm text-navy/70">Generate sample IDs, record collection status, and handle rejections.</p>
          </div>

          <div className="mb-6 relative">
            <Search size={18} className="absolute left-3 top-3 text-navy/40" />
            <input className="w-full rounded-lg border border-slate-200 py-2.5 pl-10 pr-4" placeholder="Search samples" />
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 text-left text-xs uppercase tracking-wider text-navy/60">
                <tr>
                  <th className="px-4 py-3">Sample ID</th>
                  <th className="px-4 py-3">Request ID</th>
                  <th className="px-4 py-3">Patient</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {samples.map((sample) => (
                  <tr key={sample.id} className="border-t border-slate-100">
                    <td className="px-4 py-3 font-medium text-seal-600">{sample.sampleId || sample.id}</td>
                    <td className="px-4 py-3">{sample.requestId}</td>
                    <td className="px-4 py-3">{sample.patient}</td>
                    <td className="px-4 py-3">{sample.collectionStatus}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <Button type="button" variant="primary">Collect</Button>
                        <Button type="button" variant="secondary">Reject</Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
}
