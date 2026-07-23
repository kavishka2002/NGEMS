"use client";

import { useEffect, useState } from "react";
import { ChevronDown, Eye, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import Button from "@/components/Button";

interface LabRequest {
  id: string;
  requestId: string;
  patientName: string;
  patientId: string;
  doctor: string;
  test: string;
  priority: string;
  requestDate: string;
  status: string;
}

function clsx(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}

export default function LabRequestsList() {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [requests, setRequests] = useState<LabRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const session = window.localStorage.getItem("ngemsLaboratorySession");
    if (!session) {
      setLoading(false);
      return;
    }

    const parsed = JSON.parse(session);
    fetch(`/api/laboratory/dashboard?hospitalId=${parsed.hospitalId || ""}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setRequests(data.recentRequests || []);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "accepted":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "processing":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "completed":
        return "bg-green-50 text-green-700 border-green-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock size={14} />;
      case "accepted":
        return <AlertCircle size={14} />;
      case "processing":
        return <Eye size={14} />;
      case "completed":
        return <CheckCircle2 size={14} />;
      default:
        return null;
    }
  };

  const getPriorityColor = (priority: string) => {
    return priority === "urgent"
      ? "bg-red-50 text-red-700 border-red-200"
      : "bg-gray-50 text-gray-700 border-gray-200";
  };

  if (loading) {
    return <div className="space-y-3">{Array.from({ length: 3 }).map((_, index) => <div key={index} className="h-20 animate-pulse rounded-lg bg-slate-100" />)}</div>;
  }

  return (
    <div className="space-y-3">
      {requests.map((request) => (
        <div
          key={request.id}
          className="rounded-lg border border-slate-border bg-white shadow-sm transition-all hover:shadow-card"
        >
          <button
            onClick={() =>
              setExpanded(expanded === request.id ? null : request.id)
            }
            className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-slate-50"
          >
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <p className="font-semibold text-navy">{request.patientName}</p>
                <span
                  className={clsx(
                    "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border",
                    getStatusColor(request.status)
                  )}
                >
                  {getStatusIcon(request.status)}
                  {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                </span>
                <span
                  className={clsx(
                    "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border",
                    getPriorityColor(request.priority)
                  )}
                >
                  {request.priority.charAt(0).toUpperCase() + request.priority.slice(1)}
                </span>
              </div>
              <p className="text-sm text-navy/60">
                ID: {request.patientId} | Dr. {request.doctorName} | {request.testType}
              </p>
            </div>
            <ChevronDown
              size={20}
              className={clsx(
                "text-navy/40 transition-transform",
                expanded === request.id ? "rotate-180" : ""
              )}
            />
          </button>

          {expanded === request.id && (
            <div className="border-t border-slate-border px-6 py-4 bg-slate-50">
              <div className="mb-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-navy/50 mb-2">
                  Request Details
                </p>
                <div className="space-y-1 text-sm text-navy">
                  <p>Request ID: {request.requestId}</p>
                  <p>Priority: {request.priority}</p>
                  <p>Requested: {request.requestDate}</p>
                </div>
              </div>
              <div className="flex gap-2">
                {request.status === "Pending" && (
                  <Button type="button" variant="primary" className="px-4 py-2 text-sm">
                    Accept Request
                  </Button>
                )}
                {request.status === "Accepted" && (
                  <Button type="button" variant="primary" className="px-4 py-2 text-sm">
                    Start Processing
                  </Button>
                )}
                {request.status === "Processing" && (
                  <Button type="button" variant="primary" className="px-4 py-2 text-sm">
                    Enter Result
                  </Button>
                )}
                <Button type="button" variant="secondary" className="px-4 py-2 text-sm">
                  View Details
                </Button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
