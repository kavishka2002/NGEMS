import DashboardNavbar from "@/components/dashboard/DashboardNavbar";
import Sidebar from "@/components/dashboard/Sidebar";
import DashboardCard from "@/components/dashboard/DashboardCard";
import ProfileCard from "@/components/dashboard/ProfileCard";
import DataTable from "@/components/dashboard/DataTable";
import ActivityStrip from "@/components/dashboard/ActivityStrip";
import QuickActions from "@/components/dashboard/QuickActions";
import {
  PatientTrendChart,
  MonthlyAdmissionsChart,
  MedicineUsageChart,
  DiseaseStatsChart,
} from "@/components/dashboard/ChartCard";
import { overviewStats } from "@/lib/data";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-slate-bg">
      <DashboardNavbar />
      <div className="flex">
        <Sidebar />

        <main className="min-w-0 flex-1 px-4 py-6 md:px-6 lg:px-8">
          <div className="mb-6 flex flex-col gap-1">
            <p className="text-xs font-medium uppercase tracking-[0.12em] text-clinical-600">
              Hospital Administration
            </p>
            <h1 className="font-display text-2xl font-semibold text-navy md:text-[28px]">
              Dashboard Overview
            </h1>
            <p className="text-sm text-navy/50">
              A summary of staff, patients, and daily activity across the hospital.
            </p>
          </div>

          <section className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 xl:grid-cols-6">
            {overviewStats.map((stat) => (
              <DashboardCard
                key={stat.key}
                statKey={stat.key}
                label={stat.label}
                value={stat.value}
                delta={stat.delta}
                icon={stat.icon}
              />
            ))}
          </section>

          <section className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-5">
            <div className="xl:col-span-3">
              <ProfileCard />
            </div>
            <div className="xl:col-span-2">
              <DataTable />
            </div>
          </section>

          <section className="mt-4">
            <ActivityStrip />
          </section>

          <section className="mt-4">
            <QuickActions />
          </section>

          <section className="mb-8 mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
            <PatientTrendChart />
            <MonthlyAdmissionsChart />
            <MedicineUsageChart />
            <DiseaseStatsChart />
          </section>
        </main>
      </div>
    </div>
  );
}
