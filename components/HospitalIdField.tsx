type HospitalIdFieldProps = {
  value: string;
};

export default function HospitalIdField({ value }: HospitalIdFieldProps) {
  return (
    <div>
      <label className="field-label">
        Hospital Registry ID
        <span className="ml-1.5 font-normal normal-case tracking-normal text-navy-300">
          (auto-generated)
        </span>
      </label>
      <div className="relative flex items-center justify-between overflow-hidden rounded-lg border border-dashed border-seal-400/60 bg-seal-50 px-4 py-3 shadow-stamp">
        <div className="flex items-center gap-2.5">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-seal-600">
            <path d="M12 2 20 6v6c0 5-3.6 8.6-8 10-4.4-1.4-8-5-8-10V6l8-4Z" stroke="currentColor" strokeWidth="1.8" />
            <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="font-mono text-[15px] font-semibold tracking-[0.08em] text-seal-700">
            {value}
          </span>
        </div>
        <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-seal-700">
          Pending
        </span>
      </div>
      <p className="field-hint">
        Issued on submission — this ID will identify your hospital across N-GEMS.
      </p>
    </div>
  );
}
