type BarChartProps = {
  title: string;
  description?: string;
  data: { label: string; value: number }[];
  color?: string;
  suffix?: string;
};

export default function BarChart({
  title,
  description,
  data,
  color = "#146C94",
  suffix = "",
}: BarChartProps) {
  const max = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className="rounded-2xl border border-slate-150 bg-white p-6 shadow-card">
      <h3 className="font-display text-sm font-semibold text-navy-900">{title}</h3>
      {description && <p className="mt-0.5 text-xs text-navy-300">{description}</p>}

      <div className="mt-5 flex h-32 items-end gap-2.5">
        {data.map((d) => (
          <div key={d.label} className="flex flex-1 flex-col items-center gap-2">
            <div className="relative flex h-full w-full items-end justify-center">
              <div
                title={`${d.label}: ${d.value}${suffix}`}
                className="w-full rounded-t-md transition-all"
                style={{
                  height: `${Math.max((d.value / max) * 100, 4)}%`,
                  backgroundColor: color,
                  opacity: 0.85,
                }}
              />
            </div>
            <span className="text-[10px] font-medium text-navy-300">{d.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
