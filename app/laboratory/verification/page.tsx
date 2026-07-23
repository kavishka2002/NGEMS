"use client";

import { useEffect, useState } from "react";
import LaboratoryNavbar from "@/components/laboratory/LaboratoryNavbar";
import LaboratorySidebar from "@/components/laboratory/LaboratorySidebar";
import Button from "@/components/Button";

interface VerificationItem {
  id: string;
  requestId: string;
  testName: string;
  parameter: string;
  resultValue: string;
  resultStatus: string;
  technicianComment: string;
}

export default function VerificationPage() {
  const [items, setItems] = useState<VerificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const session = window.localStorage.getItem("ngemsLaboratorySession");
    const parsed = session ? JSON.parse(session) : {};
    fetch(`/api/laboratory/verification?hospitalId=${parsed.hospitalId || ""}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.success) setItems(data.data || []);
      })
      .finally(() => setLoading(false));
  }, []);

  const approve = async (resultId: string) => {
    const session = window.localStorage.getItem("ngemsLaboratorySession");
    const parsed = session ? JSON.parse(session) : {};
    const response = await fetch("/api/laboratory/verification", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ hospitalId: parsed.hospitalId || "", resultId, status: "Approved" }),
    });
    const data = await response.json();
    setMessage(data.success ? "Result approved and report generated." : data.error || "Approval failed.");
  };

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-slate-50">
      <LaboratoryNavbar />
      <div className="flex flex-1 min-h-0 overflow-hidden">
        <LaboratorySidebar />
        <main className="min-w-0 flex-1 overflow-y-auto overflow-x-hidden px-4 py-6 md:px-6 lg:px-8">
          <div className="rounded-2xl bg-white p-8 shadow-sm">
            <h1 className="text-3xl font-semibold text-navy">Verification</h1>
            <p className="mt-2 text-sm text-navy/70">Review pending results, approve them, and finalize reports.</p>
            {message ? <div className="mt-4 rounded-lg border border-seal-200 bg-seal-50 px-4 py-3 text-sm text-seal-700">{message}</div> : null}
            {loading ? <div className="mt-6 h-24 animate-pulse rounded-lg bg-slate-100" /> : (
              <div className="mt-6 space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="rounded-xl border border-slate-200 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <p className="font-semibold text-navy">{item.testName}</p>
                        <p className="text-sm text-navy/60">Request: {item.requestId} • Parameter: {item.parameter}</p>
                      </div>
                      <div className="rounded-full bg-amber-100 px-3 py-1 text-sm text-amber-700">{item.resultStatus}</div>
                    </div>
                    <p className="mt-3 text-sm text-navy/70">{item.technicianComment || "No comment provided."}</p>
                    <div className="mt-4 flex gap-2">
                      <Button type="button" variant="primary" onClick={() => approve(item.id)}>Approve</Button>
                      <Button type="button" variant="secondary">Reject</Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
