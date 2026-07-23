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
    const snapshot = await db.collection("labRequests").where("hospitalId", "==", hospitalId).get();
    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Failed to load lab requests", error);
    return NextResponse.json({ success: false, error: "Failed to load lab requests" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await parseBody(request);
    const hospitalId = normalizeString(body.hospitalId);
    const patientId = normalizeString(body.patientId);
    const requestId = normalizeString(body.requestId);
    const patientName = normalizeString(body.patientName);
    const doctorName = normalizeString(body.doctorName);
    const testName = normalizeString(body.testName);

    if (!hospitalId || !patientId) {
      return NextResponse.json({ success: false, error: "hospitalId and patientId required" }, { status: 400 });
    }

    const db = getFirestoreClient();
    const now = new Date().toISOString();
    const record = {
      hospitalId,
      patientId,
      requestId: requestId || `REQ-${Date.now()}`,
      patientName,
      doctorName,
      testName,
      status: "Pending",
      priority: normalizeString(body.priority) || "Normal",
      requestDate: normalizeString(body.requestDate) || now,
      createdAt: now,
      updatedAt: now,
      requestedBy: normalizeString(body.requestedBy) || null,
    };
    const doc = await db.collection("labRequests").add(record);
    return NextResponse.json({ success: true, id: doc.id, request: { id: doc.id, ...record } }, { status: 201 });
  } catch (error) {
    console.error("Failed to create lab request", error);
    return NextResponse.json({ success: false, error: "Failed to create lab request" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await parseBody(request);
    const requestId = normalizeString(body.requestId);
    const hospitalId = normalizeString(body.hospitalId);
    const status = normalizeString(body.status);

    if (!requestId || !hospitalId || !status) {
      return NextResponse.json({ success: false, error: "requestId, hospitalId, and status required" }, { status: 400 });
    }

    const db = getFirestoreClient();
    await db.collection("labRequests").doc(requestId).update({ status, updatedAt: new Date().toISOString() });
    return NextResponse.json({ success: true, id: requestId });
  } catch (error) {
    console.error("Failed to update lab request", error);
    return NextResponse.json({ success: false, error: "Failed to update lab request" }, { status: 500 });
  }
}
