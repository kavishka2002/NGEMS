import { NextResponse } from "next/server";
import { getFirestoreClient } from "@/lib/firebaseAdmin";

export const runtime = "nodejs";

function normalizeString(value: unknown): string {
  if (typeof value === "string") return value.trim();
  return "";
}

async function parseBody(request: Request) {
  const contentType = request.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return request.json();
  }
  const text = await request.text();
  if (!text) return {};
  try {
    return JSON.parse(text);
  } catch {
    return Object.fromEntries(new URLSearchParams(text));
  }
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const hospitalId = normalizeString(url.searchParams.get("hospitalId"));
    if (!hospitalId) return NextResponse.json({ success: false, error: "hospitalId required" }, { status: 400 });

    const db = getFirestoreClient();
    const snapshot = await db.collection("labSamples").where("hospitalId", "==", hospitalId).get();
    if (!snapshot.empty) {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      return NextResponse.json({ success: true, data });
    }

    const requestsSnapshot = await db.collection("labRequests").where("hospitalId", "==", hospitalId).get();
    const data = requestsSnapshot.docs.map((doc, index) => ({
      id: doc.id,
      sampleId: `SMP-${String(index + 1).padStart(3, "0")}`,
      requestId: doc.id,
      patient: doc.data().patientName || "Unknown patient",
      test: doc.data().testName || "Routine test",
      sampleType: "Blood",
      collectionStatus: "Pending",
      collectionDate: doc.data().requestDate || "",
      collectionTime: "09:00",
      hospitalId,
    }));
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Failed to load lab samples", error);
    return NextResponse.json({ success: false, error: "Failed to load lab samples" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await parseBody(request);
    const sampleId = normalizeString(body.sampleId);
    const hospitalId = normalizeString(body.hospitalId);
    const requestId = normalizeString(body.requestId);
    const status = normalizeString(body.status);
    const rejectionReason = normalizeString(body.rejectionReason);

    if (!sampleId || !hospitalId || !requestId) {
      return NextResponse.json({ success: false, error: "sampleId, hospitalId, and requestId required" }, { status: 400 });
    }

    const db = getFirestoreClient();
    const ref = db.collection("labSamples").doc(sampleId);
    await ref.set({
      hospitalId,
      requestId,
      sampleId,
      collectionStatus: status || "Collected",
      rejectionReason: rejectionReason || null,
      updatedAt: new Date().toISOString(),
    }, { merge: true });
    return NextResponse.json({ success: true, id: sampleId });
  } catch (error) {
    console.error("Failed to update sample", error);
    return NextResponse.json({ success: false, error: "Failed to update sample" }, { status: 500 });
  }
}
