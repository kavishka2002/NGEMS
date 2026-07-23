"use client";

import { useEffect, useState } from "react";
import { Pill, TrendingUp, AlertTriangle, CheckCircle2 } from "lucide-react";
import PharmacyCard from "./PharmacyCard";
import * as service from "@/lib/pharmacy-service";

export default function PharmacyDashboardStats() {
  const [summary, setSummary] = useState<service.PharmacyDashboardSummary | null>(null);

  useEffect(() => {
    let mounted = true;
    service.getDashboardSummary().then((data) => { if (mounted) setSummary(data); }).catch((error) => console.error("Failed to load pharmacy dashboard", error));
    return () => { mounted = false; };
  }, []);

  const stats = [
    {
      key: "prescriptions",
      label: "Pending Prescriptions",
      value: summary?.pendingPrescriptions ?? 0,
      description: "Awaiting dispensing",
      icon: Pill,
      trend: "Awaiting dispensing",
    },
    {
      key: "dispensing",
      label: "Dispensed Today",
      value: summary?.dispensedToday ?? 0,
      description: "Medicines distributed",
      icon: CheckCircle2,
      trend: "Recorded today",
    },
    {
      key: "inventory",
      label: "Total Medicines",
      value: summary?.totalMedicines ?? 0,
      description: "Active inventory items",
      icon: TrendingUp,
      trend: `${summary?.expiredMedicines ?? 0} items expired`,
    },
    {
      key: "stock",
      label: "Low Stock Alerts",
      value: summary?.lowStockAlerts ?? 0,
      description: "Medicines below minimum",
      icon: AlertTriangle,
      trend: "Below minimum stock",
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
