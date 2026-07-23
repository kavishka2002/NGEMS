"use client";

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import StatusBadge from '@/components/doctor/StatusBadge';

export default function DoctorSearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState<any[]>([]);

  useEffect(() => {
    if (!query.trim()) return;
    fetch(`/api/doctor/search?q=${encodeURIComponent(query)}`)
      .then((res) => res.json())
      .then((data) => setResults([...data.patientMatches, ...data.appointmentMatches]))
      .catch(() => setResults([]));
  }, [query]);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-slate-500">Doctor Portal</p>
        <h1 className="text-3xl font-semibold text-slate-950">Search Results</h1>
        <p className="mt-1 text-sm text-slate-500">Results for «{query}»</p>
      </div>

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="divide-y divide-slate-200">
          {results.map((item) => (
            <Link
              key={item.id ?? item.patientId}
              href={item.patientId ? `/doctor/patients/${item.patientId}` : `/doctor/patients/${item.id}`}
              className="flex items-center justify-between gap-4 px-6 py-5 transition hover:bg-slate-50"
            >
              <div>
                <div className="font-semibold text-slate-950">{item.name ?? item.patient}</div>
                <div className="text-sm text-slate-500">{item.patientId ?? item.id} • {item.reason ?? item.nic ?? item.type}</div>
              </div>
              <StatusBadge value={item.status ?? item.type ?? 'Info'} />
            </Link>
          ))}
          {results.length === 0 && (
            <div className="px-6 py-8 text-center text-slate-500">No results found.</div>
          )}
        </div>
      </div>
    </div>
  );
}
