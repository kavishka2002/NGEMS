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
    console.error("Failed to load results for verification", error);
    return NextResponse.json({ success: false, error: "Failed to load results for verification" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await parseBody(request);
    const resultId = normalizeString(body.resultId);
    const hospitalId = normalizeString(body.hospitalId);
    const status = normalizeString(body.status);
    const verificationComment = normalizeString(body.verificationComment);

    if (!resultId || !hospitalId || !status) {
      return NextResponse.json({ success: false, error: "resultId, hospitalId, and status required" }, { status: 400 });
    }

    const db = getFirestoreClient();
    const now = new Date().toISOString();
    const resultRef = db.collection("labResults").doc(resultId);
    await resultRef.update({
      verificationStatus: status,
      verificationComment,
      status: status === "Approved" ? "Verified" : "Rejected",
      updatedAt: now,
    });

    if (status === "Approved") {
      await db.collection("labReports").add({
        hospitalId,
        resultId,
        reportId: `REP-${Date.now()}`,
        status: "Verified",
        verifiedBy: "Supervisor",
        completedDate: now,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to verify result", error);
    return NextResponse.json({ success: false, error: "Failed to verify result" }, { status: 500 });
  }
}
