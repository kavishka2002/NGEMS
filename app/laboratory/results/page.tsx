"use client";

import { useEffect, useState } from "react";
import LaboratoryNavbar from "@/components/laboratory/LaboratoryNavbar";
import LaboratorySidebar from "@/components/laboratory/LaboratorySidebar";
import Button from "@/components/Button";

export default function ResultEntryPage() {
  const [requestId, setRequestId] = useState("");
  const [testName, setTestName] = useState("");
  const [parameter, setParameter] = useState("");
  const [resultValue, setResultValue] = useState("");
  const [unit, setUnit] = useState("");
  const [referenceRange, setReferenceRange] = useState("");
  const [resultStatus, setResultStatus] = useState("Normal");
  const [technicianComment, setTechnicianComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setMessage(null);

    const session = window.localStorage.getItem("ngemsLaboratorySession");
    const parsed = session ? JSON.parse(session) : {};

    const response = await fetch("/api/laboratory/results", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        hospitalId: parsed.hospitalId || "",
        requestId,
        testName,
        parameter,
        resultValue,
        unit,
        referenceRange,
        resultStatus,
        technicianComment,
      }),
    });

    const data = await response.json();
    setSubmitting(false);
    if (data.success) {
      setMessage("Result submitted for verification.");
    } else {
      setMessage(data.error || "Unable to save result.");
    }
  };

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-slate-50">
      <LaboratoryNavbar />
      <div className="flex flex-1 min-h-0 overflow-hidden">
        <LaboratorySidebar />
        <main className="min-w-0 flex-1 overflow-y-auto overflow-x-hidden px-4 py-6 md:px-6 lg:px-8">
          <div className="rounded-2xl bg-white p-8 shadow-sm">
            <h1 className="text-3xl font-semibold text-navy">Result Entry</h1>
            <p className="mt-2 text-sm text-navy/70">Enter test results and submit them for verification.</p>
            {message ? <div className="mt-4 rounded-lg border border-seal-200 bg-seal-50 px-4 py-3 text-sm text-seal-700">{message}</div> : null}
            <form onSubmit={handleSubmit} className="mt-6 grid gap-4 md:grid-cols-2">
              <input className="rounded-lg border border-slate-200 px-3 py-2" placeholder="Request ID" value={requestId} onChange={(e) => setRequestId(e.target.value)} />
              <input className="rounded-lg border border-slate-200 px-3 py-2" placeholder="Test Name" value={testName} onChange={(e) => setTestName(e.target.value)} />
              <input className="rounded-lg border border-slate-200 px-3 py-2" placeholder="Parameter" value={parameter} onChange={(e) => setParameter(e.target.value)} />
              <input className="rounded-lg border border-slate-200 px-3 py-2" placeholder="Result Value" value={resultValue} onChange={(e) => setResultValue(e.target.value)} />
              <input className="rounded-lg border border-slate-200 px-3 py-2" placeholder="Unit" value={unit} onChange={(e) => setUnit(e.target.value)} />
              <input className="rounded-lg border border-slate-200 px-3 py-2" placeholder="Reference Range" value={referenceRange} onChange={(e) => setReferenceRange(e.target.value)} />
              <select className="rounded-lg border border-slate-200 px-3 py-2" value={resultStatus} onChange={(e) => setResultStatus(e.target.value)}>
                <option value="Normal">Normal</option>
                <option value="Low">Low</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
              <textarea className="md:col-span-2 rounded-lg border border-slate-200 px-3 py-2" placeholder="Technician Comment" value={technicianComment} onChange={(e) => setTechnicianComment(e.target.value)} />
              <div className="md:col-span-2">
                <Button type="submit" loading={submitting}>Submit for Verification</Button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
