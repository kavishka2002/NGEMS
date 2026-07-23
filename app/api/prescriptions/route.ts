import { NextResponse } from "next/server";
import { getFirestoreClient } from "@/lib/firebaseAdmin";

export const runtime = "nodejs";

function normalizeString(value: unknown): string {
  if (typeof value !== "string") return "";
  return value.trim();
}

async function parseRequestBody(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) return request.json();
  const text = await request.text();
  if (!text) return {};
  try {
    const parsed = JSON.parse(text);
    if (parsed && typeof parsed === "object") return parsed;
  } catch {}
  const formData = await request.formData();
  return Object.fromEntries(formData.entries());
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const hospitalId = normalizeString(url.searchParams.get("hospitalId"));
    const patientId = normalizeString(url.searchParams.get("patientId"));
    const status = normalizeString(url.searchParams.get("status"));

    if (!hospitalId) return NextResponse.json({ success: false, error: "hospitalId is required" }, { status: 400 });

    const db = getFirestoreClient();
    let q = db.collection("prescriptions").where("hospitalId", "==", hospitalId);
    if (patientId) q = q.where("patientId", "==", patientId);
    if (status) q = q.where("status", "==", status);

    const snapshot = await q.get();
    const patientSnapshot = await db.collection("patients").where("hospitalId", "==", hospitalId).get();
    const patientNames = new Map(patientSnapshot.docs.map((doc) => [doc.id, String(doc.data().name || "Unknown Patient")]));
    const items = snapshot.docs.map((d) => {
      const data = d.data();
      return {
        id: d.id,
        ...data,
        patientName: data.patientName || patientNames.get(String(data.patientId || "")) || "Unknown Patient",
        doctorName: data.doctorName || data.doctor || "",
        medicines: Array.isArray(data.medicines) ? data.medicines : Array.isArray(data.items) ? data.items.map((item: any) => `${item.name || "Medicine"} (${item.qty || item.quantity || 1})`) : [],
        status: String(data.status || "pending").toLowerCase(),
        dateIssued: data.dateIssued || data.createdAt || "",
      };
    });
    return NextResponse.json({ success: true, data: items });
  } catch (err) {
    console.error("Prescriptions GET failed:", err);
    return NextResponse.json({ success: false, error: "Failed to load prescriptions" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await parseRequestBody(request);
    const hospitalId = normalizeString(body.hospitalId);
    const patientId = normalizeString(body.patientId);
    const items = body.items || [];

    if (!hospitalId || !patientId || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ success: false, error: "hospitalId, patientId and items are required" }, { status: 400 });
    }

    const db = getFirestoreClient();
    const now = new Date().toISOString();
    const rec = {
      hospitalId,
      patientId,
      items,
      status: "Pending",
      createdAt: now,
      updatedAt: now,
      notes: normalizeString(body.notes),
    };

    const docRef = await db.collection("prescriptions").add(rec);
    return NextResponse.json({ success: true, id: docRef.id, prescription: { id: docRef.id, ...rec } }, { status: 201 });
  } catch (err) {
    console.error("Prescriptions POST failed:", err);
    return NextResponse.json({ success: false, error: "Failed to create prescription" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await parseRequestBody(request);
    const id = normalizeString(body.id);
    if (!id) return NextResponse.json({ success: false, error: "id is required" }, { status: 400 });
    const updates = { ...body };
    delete updates.id;
    updates.updatedAt = new Date().toISOString();

    const db = getFirestoreClient();
    await db.collection("prescriptions").doc(id).update(updates as any);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Prescriptions PUT failed:", err);
    return NextResponse.json({ success: false, error: "Failed to update prescription" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url);
    const id = normalizeString(url.searchParams.get("id"));
    if (!id) return NextResponse.json({ success: false, error: "id is required" }, { status: 400 });
    const db = getFirestoreClient();
    await db.collection("prescriptions").doc(id).delete();
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Prescriptions DELETE failed:", err);
    return NextResponse.json({ success: false, error: "Failed to delete prescription" }, { status: 500 });
  }
}
