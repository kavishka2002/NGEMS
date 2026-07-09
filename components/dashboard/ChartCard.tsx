"use client";

import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  patientTrend,
  monthlyAdmissions,
  medicineUsage,
  diseaseStats,
} from "@/lib/data";

const NAVY = "#0B2545";
const CLINICAL = "#146C94";
const HEALTH = "#1B998B";
const SEAL = "#B08D57";
const BORDER = "#D9E2E8";

const PIE_COLORS = [CLINICAL, HEALTH, SEAL, "#5B8DB8", "#9FB8C8"];

function ChartShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-card border border-slate-border bg-white p-5 shadow-card">
      <div className="mb-4">
        <h3 className="font-display text-base font-semibold text-navy">{title}</h3>
        <p className="text-xs text-navy/40">{subtitle}</p>
      </div>
      <div className="h-56 w-full">{children}</div>
    </div>
  );
}

const tooltipStyle = {
  borderRadius: 8,
  border: `1px solid ${BORDER}`,
  fontSize: 12,
  boxShadow: "0 4px 16px rgba(11,37,69,0.08)",
};

export function PatientTrendChart() {
  return (
    <ChartShell title="Patient Registration Trend" subtitle="New registrations, last 7 months">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={patientTrend} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="patientFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={CLINICAL} stopOpacity={0.28} />
              <stop offset="100%" stopColor={CLINICAL} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke={BORDER} vertical={false} />
          <XAxis dataKey="month" tick={{ fontSize: 11, fill: NAVY }} axisLine={{ stroke: BORDER }} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: NAVY }} axisLine={false} tickLine={false} width={40} />
          <Tooltip contentStyle={tooltipStyle} />
          <Area type="monotone" dataKey="patients" stroke={CLINICAL} strokeWidth={2.25} fill="url(#patientFill)" />
        </AreaChart>
      </ResponsiveContainer>
    </ChartShell>
  );
}

export function MonthlyAdmissionsChart() {
  return (
    <ChartShell title="Monthly Admissions" subtitle="In-patient admissions by month">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={monthlyAdmissions} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
          <CartesianGrid stroke={BORDER} vertical={false} />
          <XAxis dataKey="month" tick={{ fontSize: 11, fill: NAVY }} axisLine={{ stroke: BORDER }} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: NAVY }} axisLine={false} tickLine={false} width={32} />
          <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "#F4F7F9" }} />
          <Bar dataKey="admissions" fill={HEALTH} radius={[4, 4, 0, 0]} maxBarSize={28} />
        </BarChart>
      </ResponsiveContainer>
    </ChartShell>
  );
}

export function MedicineUsageChart() {
  return (
    <ChartShell title="Medicine Usage" subtitle="Share of medicines issued this month">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={medicineUsage} dataKey="value" nameKey="name" innerRadius={45} outerRadius={72} paddingAngle={2}>
            {medicineUsage.map((_, i) => (
              <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
            ))}
          </Pie>
          <Tooltip contentStyle={tooltipStyle} />
          <Legend iconType="circle" iconSize={7} wrapperStyle={{ fontSize: 11, color: NAVY }} />
        </PieChart>
      </ResponsiveContainer>
    </ChartShell>
  );
}

export function DiseaseStatsChart() {
  return (
    <ChartShell title="Disease Statistics" subtitle="Recorded cases by category, this quarter">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={diseaseStats} outerRadius="75%">
          <PolarGrid stroke={BORDER} />
          <PolarAngleAxis dataKey="disease" tick={{ fontSize: 10.5, fill: NAVY }} />
          <PolarRadiusAxis tick={{ fontSize: 9, fill: "#9AA9B8" }} axisLine={false} />
          <Radar dataKey="cases" stroke={SEAL} fill={SEAL} fillOpacity={0.28} strokeWidth={2} />
          <Tooltip contentStyle={tooltipStyle} />
        </RadarChart>
      </ResponsiveContainer>
    </ChartShell>
  );
}
