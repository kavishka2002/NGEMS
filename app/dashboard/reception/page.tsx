"use client";

import { useRef, useState } from "react";
import {
  UserRound,
  UserPlus,
  CalendarClock,
  Users,
  ClipboardCheck,
  ListOrdered,
} from "lucide-react";
import DashboardTopbar from "@/components/dashboard/DashboardTopbar";
import StaffInfoCard from "@/components/reception/StaffInfoCard";
import StatCard from "@/components/reception/StatCard";
import QuickActions from "@/components/reception/QuickActions";
import BarChart from "@/components/reception/BarChart";
import PatientRegistrationForm from "@/components/reception/PatientRegistrationForm";
import PatientSearchCard from "@/components/reception/PatientSearchCard";
import PatientFoundCard from "@/components/reception/PatientFoundCard";
import PatientSummaryCard from "@/components/reception/PatientSummaryCard";
import PatientTimeline from "@/components/reception/PatientTimeline";
import HospitalVisitHistory from "@/components/reception/HospitalVisitHistory";
import MedicinesCard from "@/components/reception/MedicinesCard";
import LabReportsCard from "@/components/reception/LabReportsCard";
import { DEMO_KEYS, DEMO_RECORD, PatientRecord } from "@/lib/reception-data";

const REGISTRATIONS_TODAY = [
  { label: "8am", value: 4 },
  { label: "9am", value: 9 },
  { label: "10am", value: 14 },
  { label: "11am", value: 11 },
  { label: "12pm", value: 6 },
  { label: "1pm", value: 5 },
  { label: "2pm", value: 10 },
  { label: "3pm", value: 8 },
];

const QUEUE_STATUS = [
  { label: "Waiting", value: 18 },
  { label: "In Progress", value: 9 },
  { label: "Completed", value: 34 },
  { label: "No-show", value: 3 },
];

const DEPARTMENT_REGISTRATIONS = [
  { label: "OPD", value: 22 },
  { label: "Emerg.", value: 8 },
  { label: "Cardio", value: 6 },
  { label: "Pedia", value: 9 },
  { label: "Surgery", value: 4 },
  { label: "Ortho", value: 5 },
];

export default function ReceptionDashboardPage() {
  const [record, setRecord] = useState<PatientRecord | null>(null);
  const [searched, setSearched] = useState(false);
  const detailRef = useRef<HTMLDivElement>(null);

  const handleResult = (result: PatientRecord | null, didSearch: boolean) => {
    setRecord(result);
    setSearched(didSearch);
  };

  const handleCheckExisting = (query: string) => {
    if (!query.trim()) {
      setRecord(null);
      setSearched(false);
      return;
    }
    const match = DEMO_KEYS.includes(query.trim()) ? DEMO_RECORD : null;
    setRecord(match);
    setSearched(true);
    document.getElementById("search")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const scrollToDetail = () => {
    detailRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <DashboardTopbar
        breadcrumb={["Dashboard", "Reception"]}
        userName="Kasun Perera"
        userRole="Reception Staff"
        userIcon={UserRound}
      />

      <main className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-6">
          <div>
            <h1 className="font-display text-2xl font-semibold text-navy-900 sm:text-[26px]">
              Reception Dashboard
            </h1>
            <p className="mt-1.5 text-sm text-navy-300">
              Patient Registration and Appointment Management
            </p>
          </div>

          <div id="profile">
            <StaffInfoCard
              role="Reception Staff"
              name="Kasun Perera"
              employeeId="REC-0005"
              department="Reception"
              hospital="National Hospital Colombo"
            />
          </div>

          {/* Overview cards */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            <StatCard label="Today's New Patients" value={27} icon={UserPlus} accent="clinical" />
            <StatCard label="Today's Appointments" value={64} icon={CalendarClock} accent="health" />
            <StatCard label="Waiting Patients" value={18} icon={Users} accent="seal" />
            <StatCard label="Completed Registrations" value={34} icon={ClipboardCheck} accent="health" />
            <StatCard label="Current Queue Number" value="Q-042" icon={ListOrdered} accent="rose" />
          </div>

          {/* Quick actions */}
          <QuickActions />

          {/* Charts */}
          <div id="queue" className="grid grid-cols-1 gap-4 scroll-mt-24 lg:grid-cols-3">
            <BarChart title="Today's Patient Registrations" description="By hour" data={REGISTRATIONS_TODAY} color="#146C94" />
            <BarChart title="Daily Queue Status" description="Current token breakdown" data={QUEUE_STATUS} color="#1B998B" />
            <BarChart title="Department Wise Registrations" description="Today" data={DEPARTMENT_REGISTRATIONS} color="#B08D57" />
          </div>

          {/* Registration + Search */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <PatientRegistrationForm onCheckExisting={handleCheckExisting} />
            </div>

            <div className="space-y-6 lg:sticky lg:top-24 lg:self-start">
              {record ? (
                <PatientFoundCard patient={record.patient} onViewHistory={scrollToDetail} />
              ) : (
                <PatientSearchCard onResult={handleResult} />
              )}
              {searched && !record && (
                <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-5 text-center text-sm text-navy-300">
                  No matching patient found. Use the registration form to create a new profile.
                </div>
              )}
            </div>
          </div>

          {/* Full medical record — appears once a patient is found */}
          {record && (
            <div ref={detailRef} className="scroll-mt-24 space-y-6">
              <p className="divider-label">Complete Medical Record &middot; {record.patient.name}</p>
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <div className="space-y-6 lg:col-span-2">
                  <PatientTimeline visits={record.visits} />
                  <HospitalVisitHistory history={record.hospitalHistory} />
                </div>
                <div className="space-y-6">
                  <PatientSummaryCard record={record} />
                  <MedicinesCard medicines={record.medicines} />
                  <LabReportsCard reports={record.labReports} />
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
