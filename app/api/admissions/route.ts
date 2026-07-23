import { NextResponse, type NextRequest } from "next/server";
import { getFirestoreClient } from "@/lib/firebaseAdmin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function normalizeString(v: unknown): string {
  if (typeof v !== "string") return "";
  return v.trim();
}

async function parseBody(request: Request) {
  const contentType = request.headers.get("content-type") || "";
  if (contentType.includes("application/json")) return request.json();
  const text = await request.text();
  if (!text) return {};
  try { return JSON.parse(text); } catch {}
  const formData = await request.formData();
  return Object.fromEntries(formData.entries());
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const hospitalId = normalizeString(searchParams.get("hospitalId"));
    const search = normalizeString(searchParams.get("search")).toLowerCase();

    if (!hospitalId) {
      return NextResponse.json({ success: false, error: "Hospital ID is required." }, { status: 400 });
    }

    const firestore = getFirestoreClient();
    let query = firestore.collection("admissions").where("hospitalId", "==", hospitalId);
    const snapshot = await query.get();

    const admissions = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    const filtered = search
      ? admissions.filter((item) => JSON.stringify(item).toLowerCase().includes(search))
      : admissions;

    return NextResponse.json({ success: true, data: filtered });
  } catch (error) {
    console.error("Error fetching admissions:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch admissions." }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await parseBody(request);
    const hospitalId = normalizeString(body.hospitalId);
    const patientId = normalizeString(body.patientId);
    const patientName = normalizeString(body.patientName);

    if (!hospitalId || !patientId) {
      return NextResponse.json({ success: false, error: "Hospital ID and patient ID are required." }, { status: 400 });
    }

    const firestore = getFirestoreClient();
    const now = new Date().toISOString();
    const admission = {
      hospitalId,
      patientId,
      patientName: patientName || null,
      admissionId: normalizeString(body.admissionId) || `ADM-${Date.now()}`,
      ward: normalizeString(body.ward) || null,
      bed: normalizeString(body.bed) || null,
      reason: normalizeString(body.reason) || null,
      status: normalizeString(body.status) || "Admitted",
      createdAt: now,
      updatedAt: now,
    };

    const docRef = await firestore.collection("admissions").add(admission);
    return NextResponse.json({ success: true, data: { id: docRef.id, ...admission } }, { status: 201 });
  } catch (error) {
    console.error("Error creating admission:", error);
    return NextResponse.json({ success: false, error: "Failed to create admission." }, { status: 500 });
  }
}
