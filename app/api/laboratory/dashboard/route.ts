import { NextResponse } from "next/server";
import { getFirestoreClient } from "@/lib/firebaseAdmin";

export const runtime = "nodejs";

function normalizeString(value: unknown): string {
  if (typeof value === "string") return value.trim();
  return "";
}

function toStatus(value: unknown): string {
  const status = normalizeString(value).toLowerCase();
  if (status === "requested" || status === "pending") return "Pending";
  if (status === "accepted" || status === "collected") return "Accepted";
  if (status === "processing" || status === "in progress") return "Processing";
  if (status === "completed" || status === "verified") return "Completed";
  return status ? status.charAt(0).toUpperCase() + status.slice(1) : "Pending";
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const hospitalId = normalizeString(url.searchParams.get("hospitalId"));

    if (!hospitalId) {
      return NextResponse.json({ success: false, error: "hospitalId required" }, { status: 400 });
    }

    const db = getFirestoreClient();
    const requestsSnapshot = await db.collection("labRequests").where("hospitalId", "==", hospitalId).get();
    const resultsSnapshot = await db.collection("labResults").where("hospitalId", "==", hospitalId).get();
    const reportsSnapshot = await db.collection("labReports").where("hospitalId", "==", hospitalId).get();

    const requests = requestsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    const results = resultsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    const reports = reportsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    const pendingRequests = requests.filter((item) => {
      const status = normalizeString(item.status).toLowerCase();
      return status === "pending" || status === "requested" || status === "accepted";
    }).length;

    const samplesAwaitingCollection = requests.filter((item) => {
      const status = normalizeString(item.status).toLowerCase();
      return status === "pending" || status === "requested";
    }).length;

    const inProcessing = requests.filter((item) => {
      const status = normalizeString(item.status).toLowerCase();
      return status === "processing" || status === "in progress";
    }).length;

    const pendingVerification = results.filter((item) => normalizeString(item.status).toLowerCase() === "submitted").length;
    const completedReports = reports.filter((item) => normalizeString(item.status).toLowerCase() === "verified").length;
    const criticalResults = results.filter((item) => normalizeString(item.resultStatus).toLowerCase() === "critical").length;

    const stats = [
      { key: "pending", label: "Pending Test Requests", value: pendingRequests, description: "New requests awaiting review", trend: "+2 today" },
      { key: "today", label: "Today's Tests", value: requests.length, description: "Requests received today", trend: "+5 today" },
      { key: "samples", label: "Samples Awaiting Collection", value: samplesAwaitingCollection, description: "Not yet collected", trend: "Active" },
      { key: "processing", label: "Tests in Processing", value: inProcessing, description: "Under analysis", trend: "In progress" },
      { key: "verification", label: "Results Awaiting Verification", value: pendingVerification, description: "Pending supervisor review", trend: "Review queue" },
      { key: "reports", label: "Completed Reports", value: completedReports, description: "Verified and finalized", trend: "Ready" },
      { key: "critical", label: "Critical Results", value: criticalResults, description: "Immediate attention needed", trend: "Alert" },
    ];

    const recentRequests = requests
      .slice()
      .sort((a, b) => normalizeString(b.createdAt).localeCompare(normalizeString(a.createdAt)))
      .slice(0, 8)
      .map((item) => ({
        id: item.id,
        requestId: item.requestId || item.id,
        patientId: item.patientId || "N/A",
        patientName: item.patientName || "Unknown patient",
        test: item.testName || item.tests?.[0] || "Routine test",
        doctor: item.doctorName || item.requestingDoctor || "Dr. N/A",
        priority: item.priority || "Normal",
        requestDate: item.requestDate || item.createdAt || "",
        status: toStatus(item.status),
      }));

    return NextResponse.json({ success: true, stats, recentRequests });
  } catch (error) {
    console.error("Laboratory dashboard load failed", error);
    return NextResponse.json({ success: false, error: "Failed to load laboratory dashboard" }, { status: 500 });
  }
}
