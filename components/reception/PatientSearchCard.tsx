"use client";

import { useState } from "react";
import { Search, X, ScanSearch } from "lucide-react";
import Select from "@/components/Select";
import Input from "@/components/Input";
import Button from "@/components/Button";

const SEARCH_BY_OPTIONS = ["Patient ID", "NIC Number", "Passport Number", "Mobile Number"];

type PatientSearchCardProps = {
  onResult: (record: Record<string, unknown> | null, searched: boolean) => void;
};

export default function PatientSearchCard({ onResult }: PatientSearchCardProps) {
  const [searchBy, setSearchBy] = useState("");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!query.trim()) {
      setError("Enter a value to search.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const rawSession = typeof window !== "undefined" ? window.localStorage.getItem("ngemsHospitalSession") : null;
      const hospitalId = rawSession ? (JSON.parse(rawSession) as { hospitalId?: string })?.hospitalId : "";

      if (!hospitalId) {
        setError("Hospital session not found. Please log in again.");
        onResult(null, true);
        return;
      }

      const params = new URLSearchParams({ hospitalId, query: query.trim() });
      if (searchBy) params.set("searchBy", searchBy);
      const response = await fetch(`/api/patients?${params.toString()}`);
      const payload = await response.json();

      if (!response.ok) {
        setError(payload?.error || "Patient search failed.");
        onResult(null, true);
        return;
      }

      onResult(payload.patient as PatientRecord, true);
    } catch (error) {
      console.error("Patient search failed", error);
      setError("Patient search failed. Try again later.");
      onResult(null, true);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setSearchBy("");
    setQuery("");
    setError("");
    onResult(null, false);
  };

  return (
    <div id="search" className="rounded-2xl border border-slate-150 bg-white p-6 shadow-card scroll-mt-24">
      <div className="mb-5 flex items-start gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-seal-50 text-seal-600">
          <ScanSearch size={18} />
        </span>
        <div>
          <h2 className="font-display text-base font-semibold text-navy-900">
            Existing Patient Search
          </h2>
          <p className="mt-0.5 text-xs text-navy-300">
            Check before registering to avoid duplicate records
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <Select
          label="Search By"
          name="searchBy"
          options={SEARCH_BY_OPTIONS}
          value={searchBy}
          onChange={(e) => setSearchBy(e.target.value)}
        />
        <Input
          label="Search Value"
          name="query"
          placeholder="e.g. 982345671V or PAT-02114"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          error={error}
          icon={<Search size={15} />}
        />

        <div className="flex gap-2.5 pt-1">
          <Button variant="primary" fullWidth={false} className="flex-1" onClick={handleSearch} loading={loading}>
            <Search size={15} />
            Search
          </Button>
          <Button variant="ghost" fullWidth={false} className="flex-1" onClick={handleClear} type="button">
            <X size={15} />
            Clear
          </Button>
        </div>

        <p className="text-[11px] text-navy-300">
          Search patients using an ID, NIC, passport or mobile number.
        </p>
      </div>
    </div>
  );
}
