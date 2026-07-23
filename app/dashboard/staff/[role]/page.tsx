"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import DashboardNavbar from "@/components/dashboard/DashboardNavbar";
import Sidebar from "@/components/dashboard/Sidebar";
import StaffListComponent from "@/components/dashboard/StaffListComponent";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

const ROLE_DISPLAY_NAMES: Record<string, string> = {
    doctors: "Doctors",
    nurses: "Nurses",
    "pharmacy-staff": "Pharmacy Staff",
    "laboratory-staff": "Laboratory Staff",
    "reception-staff": "Reception Staff",
};

const ROLE_MAPPING: Record<string, string> = {
    doctors: "Doctor",
    nurses: "Nurse",
    "pharmacy-staff": "Pharmacy Staff",
    "laboratory-staff": "Laboratory Staff",
    "reception-staff": "Reception Staff",
};

export default function RoleStaffPage() {
    const params = useParams();
    const roleSlug = params.role as string;
    const displayName = ROLE_DISPLAY_NAMES[roleSlug] || "Staff";
    const roleFilter = ROLE_MAPPING[roleSlug] || "";
    const [hospitalId, setHospitalId] = useState<string | null>(null);

    useEffect(() => {
        const rawSession = typeof window !== "undefined" ? window.localStorage.getItem("ngemsHospitalSession") : null;
        const session = rawSession ? (JSON.parse(rawSession) as { hospitalId?: string }) : null;
        setHospitalId(session?.hospitalId ?? null);
    }, []);

    return (
        <div className="flex h-screen flex-col overflow-hidden bg-slate-50">
            <DashboardNavbar />
            <div className="flex flex-1 overflow-hidden">
                <Sidebar />

                <main className="min-w-0 flex-1 overflow-y-auto px-4 py-8 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-7xl">
                        <div className="mb-8 flex items-center gap-4">
                            <Link
                                href="/dashboard/staff"
                                className="inline-flex items-center gap-2 text-sm font-medium text-clinical-600 hover:text-clinical-700"
                            >
                                <ArrowLeft size={16} /> Back to All Staff
                            </Link>
                        </div>

                        <div className="mb-8">
                            <h1 className="font-display text-2xl font-semibold text-navy-900 sm:text-[26px]">
                                {displayName}
                            </h1>
                            <p className="mt-1.5 text-sm text-navy-300">
                                View and manage {displayName.toLowerCase()} members.
                            </p>
                        </div>

                        {hospitalId ? (
                            <StaffListComponent hospitalId={hospitalId} roleFilter={roleFilter} />
                        ) : (
                            <div className="rounded-lg border border-rose-200 bg-rose-50 p-6 text-sm text-rose-700">
                                Hospital session not found. Please sign in again.
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}
