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
    const snapshot = await db.collection("labResults").where("hospitalId", "==", hospitalId).get();
    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Failed to load lab results", error);
    return NextResponse.json({ success: false, error: "Failed to load lab results" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await parseBody(request);
    const hospitalId = normalizeString(body.hospitalId);
    const requestId = normalizeString(body.requestId);
    const testName = normalizeString(body.testName);
    const parameter = normalizeString(body.parameter);
    const resultValue = normalizeString(body.resultValue);
    const unit = normalizeString(body.unit);
    const referenceRange = normalizeString(body.referenceRange);
    const resultStatus = normalizeString(body.resultStatus);
    const technicianComment = normalizeString(body.technicianComment);

    if (!hospitalId || !requestId || !testName || !parameter || !resultValue) {
      return NextResponse.json({ success: false, error: "hospitalId, requestId, testName, parameter and resultValue required" }, { status: 400 });
    }

    const db = getFirestoreClient();
    const now = new Date().toISOString();
    const resultDoc = {
      hospitalId,
      requestId,
      testName,
      parameter,
      resultValue,
      unit,
      referenceRange,
      resultStatus: resultStatus || "Normal",
      technicianComment,
      status: "Submitted",
      createdAt: now,
      updatedAt: now,
    };
    const ref = await db.collection("labResults").add(resultDoc);
    return NextResponse.json({ success: true, id: ref.id, result: resultDoc });
  } catch (error) {
    console.error("Failed to record lab result", error);
    return NextResponse.json({ success: false, error: "Failed to record lab result" }, { status: 500 });
  }
}
