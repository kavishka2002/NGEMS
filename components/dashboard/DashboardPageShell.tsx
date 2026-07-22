"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import DashboardNavbar from "@/components/dashboard/DashboardNavbar";
import Sidebar from "@/components/dashboard/Sidebar";
import DashboardCard from "@/components/dashboard/DashboardCard";
import ProfileCard from "@/components/dashboard/ProfileCard";
import DataTable from "@/components/dashboard/DataTable";
import ActivityStrip from "@/components/dashboard/ActivityStrip";
import QuickActions from "@/components/dashboard/QuickActions";
import Button from "@/components/Button";
import {
  PatientTrendChart,
  MonthlyAdmissionsChart,
  MedicineUsageChart,
  DiseaseStatsChart,
} from "@/components/dashboard/ChartCard";
import { overviewStats } from "@/lib/data";

const SESSION_KEY = "ngemsHospitalSession";

type HospitalSession = {
  hospitalId?: string;
  hospitalName?: string;
  hospitalType?: string;
  province?: string;
  district?: string;
  address?: string;
  contactNumber?: string;
  email?: string;
  status?: string;
  registeredOn?: string;
  username?: string;
  role?: string;
};

type HospitalProfile = {
  hospitalId?: string;
  hospitalName?: string;
  hospitalType?: string;
  province?: string;
  district?: string;
  address?: string;
  contactNumber?: string;
  email?: string;
  adminName?: string;
  role?: string;
  status?: string;
  registeredOn?: string;
};

function loadSession(): HospitalSession | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as HospitalSession;
  } catch {
    return null;
  }
}

export default function DashboardPageShell() {
  const [session, setSession] = useState<HospitalSession | null>(null);
  const [hospital, setHospital] = useState<HospitalProfile | null>(null);
  const [loadingHospital, setLoadingHospital] = useState(true);

  useEffect(() => {
    const loadedSession = loadSession();
    setSession(loadedSession);

    const hospitalId = loadedSession?.hospitalId;
    if (!hospitalId) {
      setLoadingHospital(false);
      return;
    }

    const fetchHospital = async () => {
      try {
        const response = await fetch(`/api/hospitals?hospitalId=${encodeURIComponent(hospitalId)}`);
        const data = await response.json();
        if (response.ok && data.success) {
          setHospital(data.hospital);
        }
      } catch (error) {
        console.error("Failed to fetch hospital profile", error);
      } finally {
        setLoadingHospital(false);
      }
    };

    void fetchHospital();
  }, []);

  const currentHospital = {
    hospitalId: hospital?.hospitalId || session?.hospitalId || "NGEMS-HOS-2026-000000",
    hospitalName:
      hospital?.hospitalName ||
      session?.hospitalName ||
      "Your hospital",
    hospitalType: hospital?.hospitalType || session?.hospitalType || "",
    province: hospital?.province || session?.province || "",
    district: hospital?.district || session?.district || "",
    address: hospital?.address || session?.address || "",
    contactNumber: hospital?.contactNumber || session?.contactNumber || "",
    email: hospital?.email || session?.email || "",
    status: hospital?.status || "Registered",
    registeredOn: hospital?.registeredOn || (session ? "Saved profile" : "Not available"),
  };

  const hospitalName = currentHospital.hospitalName;
  const hospitalDistrict = currentHospital.district;
  const hospitalId = currentHospital.hospitalId;
  const userName = session?.username || "Admin User";
  const userRole = session?.role || "Hospital Administrator";

  return (
    <div className="flex h-screen flex-col overflow-hidden" style={{ backgroundColor: "#F0F4F8" }}>
      <DashboardNavbar
        hospitalName={hospitalName}
        hospitalDistrict={hospitalDistrict}
        hospitalId={hospitalId}
        userName={userName}
        userRole={userRole}
      />
      <div className="flex flex-1 min-h-0 overflow-hidden">
        <Sidebar />

        <main className="min-w-0 flex-1 overflow-y-auto overflow-x-hidden px-4 py-6 md:px-6 lg:px-8">
          <div className="mb-6">
            <div className="max-w-7xl w-full mx-auto rounded-lg bg-white/60 px-4 py-6 shadow-sm md:px-6 lg:px-8">
              <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-amber-600">
                    Hospital Administration
                  </p>
                  <h1 className="mt-1 font-display text-3xl font-bold leading-tight text-[#0B2545]">
                    {hospitalName} Dashboard
                  </h1>
                  <p className="mt-1 text-sm text-[#146C94]">
                    Welcome back, {userName}. Here are the latest stats for {hospitalName}.
                  </p>
                </div>
                <div className="mt-4 md:mt-0">
                  <Link href="/dashboard/create-staff">
                    <Button type="button" variant="primary" className="w-auto px-4 py-2 text-sm">
                      Create Staff Account
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
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
              <ProfileCard hospital={currentHospital} />
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
