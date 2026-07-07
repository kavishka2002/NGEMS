"use client";

import Button from "./Button";

type SuccessModalProps = {
  open: boolean;
  hospitalId: string;
  hospitalName: string;
  onClose: () => void;
};

export default function SuccessModal({
  open,
  hospitalId,
  hospitalName,
  onClose,
}: SuccessModalProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/60 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-md animate-scale-in rounded-2xl border border-slate-150 bg-white p-8 text-center shadow-card">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-health-50">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="#1B998B" strokeWidth="1.6" />
            <path d="M8 12.5l2.6 2.6L16 9.6" stroke="#1B998B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h2 className="font-display text-xl font-semibold text-navy-900">
          Hospital Registration Completed
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-navy-300">
          <span className="font-medium text-navy-700">{hospitalName}</span> has been
          submitted to N-GEMS for verification. You&apos;ll receive an email once your
          registry ID is activated.
        </p>

        <div className="mt-5 flex items-center justify-between rounded-lg bg-slate-50 px-4 py-3">
          <span className="text-xs font-medium uppercase tracking-wide text-navy-300">
            Registry ID
          </span>
          <span className="font-mono text-sm font-semibold text-navy-800">{hospitalId}</span>
        </div>

        <div className="mt-6 flex flex-col gap-2.5">
          <Button variant="primary" onClick={onClose}>
            Continue to Hospital Login
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Back to Registration
          </Button>
        </div>
      </div>
    </div>
  );
}
