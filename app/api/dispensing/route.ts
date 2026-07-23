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
  try { return JSON.parse(text); } catch {}
  const fd = await request.formData();
  return Object.fromEntries(fd.entries());
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const hospitalId = normalizeString(url.searchParams.get("hospitalId"));
    if (!hospitalId) return NextResponse.json({ success: false, error: "hospitalId required" }, { status: 400 });
    const db = getFirestoreClient();
    const snapshot = await db.collection("dispensing").where("hospitalId", "==", hospitalId).limit(200).get();
    const data = (snapshot.docs
      .map((d) => ({ id: d.id, ...d.data() })) as Array<Record<string, any>>)
      .sort((left, right) => String(right.createdAt || "").localeCompare(String(left.createdAt || "")));
    return NextResponse.json({ success: true, data });
  } catch (err) { console.error(err); return NextResponse.json({ success: false, error: "Failed to load dispensing" }, { status: 500 }); }
}

export async function POST(request: Request) {
  try {
    const body = await parseRequestBody(request);
    const hospitalId = normalizeString(body.hospitalId);
    const prescriptionId = normalizeString(body.prescriptionId);
    let items = body.items || [];
    if (!hospitalId || !prescriptionId || !Array.isArray(items)) {
      return NextResponse.json({ success: false, error: "hospitalId, prescriptionId and items required" }, { status: 400 });
    }
    const db = getFirestoreClient();
    if (items.length === 0) {
      const prescription = await db.collection("prescriptions").doc(prescriptionId).get();
      const prescriptionData = prescription.data();
      if (!prescription.exists || prescriptionData?.hospitalId !== hospitalId) {
        return NextResponse.json({ success: false, error: "Prescription not found" }, { status: 404 });
      }
      items = prescriptionData.items || prescriptionData.medicines || [];
    }
    if (items.length === 0) {
      return NextResponse.json({ success: false, error: "Prescription has no medicines" }, { status: 400 });
    }
    const now = new Date().toISOString();
    const rec = { hospitalId, prescriptionId, items, createdAt: now, updatedAt: now, performedBy: body.performedBy || null };
    const docRef = await db.collection("dispensing").add(rec);
    const transactionBatch = db.batch();
    for (const item of items) {
      const medicine = typeof item === "object" && item !== null ? item as Record<string, unknown> : {};
      transactionBatch.create(db.collection("pharmacyTransactions").doc(), {
        hospitalId,
        medicineName: normalizeString(medicine.name ?? medicine.medicineName ?? item) || "Unknown medicine",
        type: "dispensed",
        quantity: Number(medicine.quantity ?? medicine.qty ?? 1) || 0,
        unit: normalizeString(medicine.unit),
        reason: `Prescription #${prescriptionId}`,
        operator: normalizeString(body.performedBy) || "System",
        timestamp: now,
        sourceId: docRef.id,
      });
    }
    await transactionBatch.commit();

    // Optionally update prescription status
    try {
      await db.collection("prescriptions").doc(prescriptionId).update({ status: "Dispensed", updatedAt: now });
    } catch {}

    return NextResponse.json({ success: true, id: docRef.id, dispensing: { id: docRef.id, ...rec } }, { status: 201 });
  } catch (err) { console.error(err); return NextResponse.json({ success: false, error: "Failed to record dispensing" }, { status: 500 }); }
}
