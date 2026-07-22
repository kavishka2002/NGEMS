"use client";

import { useState } from "react";
import DashboardNavbar from "@/components/dashboard/DashboardNavbar";
import Sidebar from "@/components/dashboard/Sidebar";
import StaffListComponent from "@/components/dashboard/StaffListComponent";

export default function AllStaffPage() {
    const [hospitalId] = useState("HOS-0001");

    return (
        <div className="flex h-screen flex-col overflow-hidden bg-slate-50">
            <DashboardNavbar />
            <div className="flex flex-1 overflow-hidden">
                <Sidebar />

                <main className="min-w-0 flex-1 overflow-y-auto px-4 py-8 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-7xl">
                        <div className="mb-8">
                            <h1 className="font-display text-2xl font-semibold text-navy-900 sm:text-[26px]">
                                All Staff Members
                            </h1>
                            <p className="mt-1.5 text-sm text-navy-300">
                                View and manage all hospital staff members.
                            </p>
                        </div>

                        <StaffListComponent hospitalId={hospitalId} />
                    </div>
                </main>
            </div>
        </div>
    );
}
