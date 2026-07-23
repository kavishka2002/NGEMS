"use client";

import { useEffect, useState } from "react";
import PharmacyNavbar from "@/components/pharmacy/PharmacyNavbar";
import PharmacySidebar from "@/components/pharmacy/PharmacySidebar";
import Button from "@/components/Button";
import { Plus, Search, X } from "lucide-react";
import Link from "next/link";
import * as service from "@/lib/pharmacy-service";

export default function DispensingPage() {
  const [dispensing, setDispensing] = useState<any[]>([]);
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    let mounted = true;
    Promise.all([service.getDispensing(), service.getPrescriptions()]).then(([records, prescriptionRecords]) => {
      if (mounted) {
        setDispensing(records);
        setPrescriptions(prescriptionRecords.filter((prescription: any) => String(prescription.status || "pending").toLowerCase() === "pending"));
      }
    }).catch(() => {
      if (mounted) setError("Unable to load dispensing data.");
    }).finally(() => {
      if (mounted) setLoading(false);
    });
    return () => { mounted = false; };
  }, []);

  const filteredDispensing = dispensing.filter((record) =>
    `${record.prescriptionId} ${record.performedBy || ""} ${(record.items || []).map((item: any) => item.name || item).join(" ")}`
      .toLowerCase().includes(search.toLowerCase())
  );

  async function submitDispensing(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedPrescription) {
      setError("Select a pending prescription.");
      return;
    }
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      await service.dispensePrescription(selectedPrescription);
      const records = await service.getDispensing();
      setDispensing(records);
      setPrescriptions((current) => current.filter((prescription) => prescription.id !== selectedPrescription));
      setSelectedPrescription("");
      setShowForm(false);
      setSuccess("Medicine dispensing recorded successfully.");
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Unable to record dispensing.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-slate-50">
      <PharmacyNavbar />
      <div className="flex flex-1 min-h-0 overflow-hidden">
        <PharmacySidebar />

        <main className="min-w-0 flex-1 overflow-y-auto overflow-x-hidden px-4 py-6 md:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="rounded-lg bg-white px-6 py-6 shadow-sm border border-slate-border">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-health-600">
                    Medicine Dispensing
                  </p>
                  <h1 className="mt-2 font-display text-3xl font-bold text-navy-900">
                    Dispense Medicines
                  </h1>
                  <p className="mt-2 text-sm text-navy/60">
                    Record and track medicine dispensing
                  </p>
                </div>
                <Button type="button" variant="primary" onClick={() => { setShowForm(true); setError(""); setSuccess(""); }} className="px-4 py-2 text-sm w-fit">
                  <Plus size={16} className="mr-2 inline" />
                  New Dispensing
                </Button>
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="mb-6">
            <div className="relative">
              <Search size={18} className="absolute left-3 top-3 text-navy/40" />
              <input
                type="text"
                placeholder="Search medicines, patients, or prescriptions..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-health-600 focus:border-transparent"
              />
            </div>
          </div>

          {/* Dispensing Content */}
          <div className="rounded-lg bg-white shadow-sm border border-slate-border p-6">
            {success && <div className="mb-4 rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">{success}</div>}
            {error && !showForm && <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
            {loading ? (
              <div className="text-center py-12 text-slate-500">Loading dispensing records...</div>
            ) : filteredDispensing.length === 0 ? (
              <div className="text-center py-12 text-slate-500">No dispensing records found.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-border bg-slate-50">
                      <th className="px-4 py-3 text-left font-semibold text-navy">Prescription ID</th>
                      <th className="px-4 py-3 text-left font-semibold text-navy">Items</th>
                      <th className="px-4 py-3 text-left font-semibold text-navy">Performed By</th>
                      <th className="px-4 py-3 text-left font-semibold text-navy">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-border">
                    {filteredDispensing.map((record) => (
                      <tr key={record.id} className="hover:bg-slate-50">
                        <td className="px-4 py-3 text-sm text-slate-700">{record.prescriptionId}</td>
                        <td className="px-4 py-3 text-sm text-slate-700">{(record.items || []).map((item: any) => item.name || item).join(', ')}</td>
                        <td className="px-4 py-3 text-sm text-slate-700">{record.performedBy || '-'}</td>
                        <td className="px-4 py-3 text-sm text-slate-700">{record.createdAt?.slice(0, 10) || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <div className="mt-6 text-center">
              <Link href="/pharmacy/dashboard">
                <Button type="button" variant="secondary" className="px-4 py-2 text-sm">
                  Back to Dashboard
                </Button>
              </Link>
            </div>
          </div>

          {showForm && <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy/40 p-4" onClick={() => setShowForm(false)}>
            <form onSubmit={submitDispensing} className="w-full max-w-lg rounded-lg bg-white p-6 shadow-xl" onClick={(event) => event.stopPropagation()}>
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-xl font-bold text-navy">New Dispensing</h2>
                <button type="button" title="Close" onClick={() => setShowForm(false)} className="rounded-md p-1 text-navy/60 hover:bg-slate-100"><X size={20} /></button>
              </div>
              {error && <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
              <label className="block text-sm font-medium text-navy">Pending prescription
                <select required value={selectedPrescription} onChange={(event) => setSelectedPrescription(event.target.value)} className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 font-normal outline-none focus:border-health-600">
                  <option value="">Select a prescription</option>
                  {prescriptions.map((prescription) => <option key={prescription.id} value={prescription.id}>{prescription.id} - {prescription.patientName || "Unknown patient"}</option>)}
                </select>
              </label>
              {prescriptions.length === 0 && <p className="mt-2 text-sm text-navy/60">There are no pending prescriptions to dispense.</p>}
              <div className="mt-6 flex justify-end gap-3">
                <Button type="button" variant="secondary" onClick={() => setShowForm(false)} className="px-4 py-2 text-sm">Cancel</Button>
                <Button type="submit" variant="primary" disabled={saving || prescriptions.length === 0} className="px-4 py-2 text-sm">{saving ? "Saving..." : "Record Dispensing"}</Button>
              </div>
            </form>
          </div>}
        </main>
      </div>
    </div>
  );
}
