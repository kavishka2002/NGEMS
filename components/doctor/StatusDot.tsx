export default function StatusDot({ status }: { status: string }) {
  return <span className="self-center rounded-full bg-emerald-50 px-2 py-1 text-xs text-emerald-700">{status}</span>;
}
