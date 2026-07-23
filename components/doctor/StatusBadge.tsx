const styles: Record<string, string> = {
  Waiting: 'bg-amber-100 text-amber-800',
  Called: 'bg-sky-100 text-sky-800',
  'In Consultation': 'bg-violet-100 text-violet-800',
  Completed: 'bg-emerald-100 text-emerald-800',
  Emergency: 'bg-red-100 text-red-800',
  'No Show': 'bg-slate-100 text-slate-700',
  Pending: 'bg-amber-100 text-amber-800',
  'In Progress': 'bg-violet-100 text-violet-800',
  Urgent: 'bg-red-100 text-red-800',
  Active: 'bg-emerald-100 text-emerald-800',
  'Follow-up': 'bg-blue-100 text-blue-800',
  Inpatient: 'bg-purple-100 text-purple-800',
  Issued: 'bg-emerald-100 text-emerald-800',
  Requested: 'bg-sky-100 text-sky-800',
  Processing: 'bg-violet-100 text-violet-800',
  'Result Available': 'bg-emerald-100 text-emerald-800',
  Reviewed: 'bg-slate-100 text-slate-700',
};

export default function StatusBadge({ value }: { value: string }) {
  return <span className={`badge ${styles[value] ?? 'bg-slate-100 text-slate-700'}`}>{value}</span>;
}
