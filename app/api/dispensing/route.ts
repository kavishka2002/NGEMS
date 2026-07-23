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
    const snapshot = await db.collection("dispensing").where("hospitalId", "==", hospitalId).orderBy("createdAt", "desc").limit(200).get();
    const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    return NextResponse.json({ success: true, data });
  } catch (err) { console.error(err); return NextResponse.json({ success: false, error: "Failed to load dispensing" }, { status: 500 }); }
}

export async function POST(request: Request) {
  try {
    const body = await parseRequestBody(request);
    const hospitalId = normalizeString(body.hospitalId);
    const prescriptionId = normalizeString(body.prescriptionId);
    const items = body.items || [];
    if (!hospitalId || !prescriptionId || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ success: false, error: "hospitalId, prescriptionId and items required" }, { status: 400 });
    }
    const db = getFirestoreClient();
    const now = new Date().toISOString();
    const rec = { hospitalId, prescriptionId, items, createdAt: now, updatedAt: now, performedBy: body.performedBy || null };
    const docRef = await db.collection("dispensing").add(rec);

    // Optionally update prescription status
    try {
      await db.collection("prescriptions").doc(prescriptionId).update({ status: "Dispensed", updatedAt: now });
    } catch {}

    return NextResponse.json({ success: true, id: docRef.id, dispensing: { id: docRef.id, ...rec } }, { status: 201 });
  } catch (err) { console.error(err); return NextResponse.json({ success: false, error: "Failed to record dispensing" }, { status: 500 }); }
}
