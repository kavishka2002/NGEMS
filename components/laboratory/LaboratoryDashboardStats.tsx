"use client";

import { FlaskConical, Droplet, CheckCircle2, TrendingUp } from "lucide-react";
import LaboratoryCard from "./LaboratoryCard";

export default function LaboratoryDashboardStats() {
  const stats = [
    {
      key: "requests",
      label: "Pending Requests",
      value: 18,
      description: "Awaiting sample collection",
      icon: FlaskConical,
      trend: "+4 today",
    },
    {
      key: "samples",
      label: "Samples Collected",
      value: 32,
      description: "Ready for testing",
      icon: Droplet,
      trend: "+8 from yesterday",
    },
    {
      key: "processing",
      label: "Tests Processing",
      value: 15,
      description: "Under analysis",
      icon: TrendingUp,
      trend: "-3 completed",
    },
    {
      key: "completed",
      label: "Reports Ready",
      value: 42,
      description: "Awaiting transmission",
      icon: CheckCircle2,
      trend: "+12 this week",
    },
  ];

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
