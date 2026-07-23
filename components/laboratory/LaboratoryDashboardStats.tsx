"use client";

import { useEffect, useState } from "react";
import { FlaskConical, Droplet, CheckCircle2, TrendingUp, ShieldAlert } from "lucide-react";
import LaboratoryCard from "./LaboratoryCard";

interface DashboardStat {
  key: string;
  label: string;
  value: number;
  description: string;
  icon: typeof FlaskConical;
  trend: string;
}

export default function LaboratoryDashboardStats() {
  const [stats, setStats] = useState<DashboardStat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const hospitalId = window.localStorage.getItem("ngemsLaboratorySession");
    if (!hospitalId) {
      setLoading(false);
      return;
    }

    const session = JSON.parse(hospitalId);
    fetch(`/api/laboratory/dashboard?hospitalId=${session.hospitalId || ""}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          const mapped = data.stats.map((item: any) => ({
            key: item.key,
            label: item.label,
            value: item.value,
            description: item.description,
            icon: item.key === "critical" ? ShieldAlert : item.key === "samples" ? Droplet : item.key === "processing" ? TrendingUp : item.key === "reports" || item.key === "verification" ? CheckCircle2 : FlaskConical,
            trend: item.trend,
          }));
          setStats(mapped);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">{Array.from({ length: 4 }).map((_, index) => <div key={index} className="h-36 animate-pulse rounded-2xl bg-slate-200" />)}</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <LaboratoryCard
          key={stat.key}
          cardKey={stat.key}
          label={stat.label}
          value={stat.value}
          description={stat.description}
          icon={stat.icon}
          trend={stat.trend}
        />
      ))}
    </div>
  );
}
