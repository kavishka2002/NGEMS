"use client";

import { Pill, TrendingUp, AlertTriangle, CheckCircle2 } from "lucide-react";
import PharmacyCard from "./PharmacyCard";

export default function PharmacyDashboardStats() {
  const stats = [
    {
      key: "prescriptions",
      label: "Pending Prescriptions",
      value: 24,
      description: "Awaiting dispensing",
      icon: Pill,
      trend: "+5 today",
    },
    {
      key: "dispensing",
      label: "Dispensed Today",
      value: 45,
      description: "Medicines distributed",
      icon: CheckCircle2,
      trend: "+12 from yesterday",
    },
    {
      key: "inventory",
      label: "Total Medicines",
      value: 1230,
      description: "Active inventory items",
      icon: TrendingUp,
      trend: "4 items expired",
    },
    {
      key: "stock",
      label: "Low Stock Alerts",
      value: 8,
      description: "Medicines below minimum",
      icon: AlertTriangle,
      trend: "Urgent action needed",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <PharmacyCard
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
