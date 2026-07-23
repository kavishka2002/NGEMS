import { NextResponse } from "next/server";
import { getFirestoreClient } from "@/lib/firebaseAdmin";

export const runtime = "nodejs";

async function parseRequestBody(request: Request): Promise<Record<string, unknown>> {
  const contentType = request.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    try {
      const json = await request.json();
      if (json && typeof json === "object" && !Array.isArray(json)) {
        return json as Record<string, unknown>;
      }
    } catch {
      // fall back to text parsing
    }
  }

  const text = await request.text();
  if (text) {
    try {
      const parsed = JSON.parse(text);
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
        return parsed as Record<string, unknown>;
      }
    } catch {
      return Object.fromEntries(new URLSearchParams(text)) as Record<string, unknown>;
    }
  }

  const formData = await request.formData();
  return Object.fromEntries(formData.entries()) as Record<string, unknown>;
}

function normalizeString(value: unknown): string {
  if (typeof value === "string") return value.trim();
  if (typeof value === "number") return String(value);
  return "";
}

export async function POST(request: Request) {
  try {
    const body = await parseRequestBody(request);
    const hospitalId = normalizeString(body.hospitalId);
    const username = normalizeString(body.username);
    const password = normalizeString(body.password);

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password are required." },
        { status: 400 }
      );
    }

    // First try doctor authentication using only username/password
    try {
      const firestore = getFirestoreClient();

      // search doctors collection for matching username/password
      const doctorQuery = await firestore
        .collection("doctors")
        .where("username", "==", username)
        .where("password", "==", password)
        .limit(1)
        .get();

      if (doctorQuery && !doctorQuery.empty) {
        const doctorRecord = doctorQuery.docs[0].data();
        const doctorHospitalId = normalizeString(doctorRecord.hospitalId) || hospitalId;

        return NextResponse.json({
          success: true,
          hospitalId: doctorHospitalId,
          hospitalName: normalizeString(doctorRecord.hospitalName) || normalizeString(doctorRecord.hospital) || "Your hospital",
          hospitalType: normalizeString(doctorRecord.hospitalType) || "",
          province: normalizeString(doctorRecord.province) || "",
          district: normalizeString(doctorRecord.district) || "",
          address: normalizeString(doctorRecord.address) || "",
          contactNumber: normalizeString(doctorRecord.contactNumber) || "",
          email: normalizeString(doctorRecord.email) || "",
          username,
          role: normalizeString(doctorRecord.role) || "Doctor",
        });
      }
    } catch (docLookupError) {
      console.error("Firestore doctor lookup failed", docLookupError);
    }

    // Fallback: require hospitalId for hospital admin/staff login
    if (!hospitalId) {
      return NextResponse.json(
        { error: "Hospital ID is required for hospital/staff login." },
        { status: 400 }
      );
    }

    let userRecord: Record<string, unknown> | null = null;
    let querySnapshot: any = null;

    try {
      const firestore = getFirestoreClient();
      querySnapshot = await firestore
        .collection("hospitals")
        .where("hospitalId", "==", hospitalId)
        .where("adminUsername", "==", username)
        .where("password", "==", password)
        .limit(1)
        .get();

      if (querySnapshot && !querySnapshot.empty) {
        userRecord = querySnapshot.docs[0].data();
      }
    } catch (firestoreError) {
      console.error("Firestore login lookup failed", firestoreError);
    }

    if (!userRecord) {
      return NextResponse.json(
        { error: "Invalid Hospital ID, username, or password." },
        { status: 401 }
      );
    }

    const resolvedHospitalName =
      normalizeString(userRecord.hospitalName) ||
      normalizeString(userRecord.name) ||
      normalizeString(userRecord.hospitalType) ||
      "Your hospital";

    const role = normalizeString(userRecord.role) ||
      (username === "admin" ? "Administrator" : "Hospital User");

    return NextResponse.json({
      success: true,
      hospitalId,
      hospitalName: resolvedHospitalName,
      hospitalType: normalizeString(userRecord.hospitalType) || "",
      province: normalizeString(userRecord.province) || "",
      district: normalizeString(userRecord.district) || "",
      address: normalizeString(userRecord.address) || "",
      contactNumber: normalizeString(userRecord.contactNumber) || "",
      email: normalizeString(userRecord.email) || "",
      username,
      role,
    });
  } catch (error) {
    console.error("Hospital login failed", error);
    return NextResponse.json({ error: "Hospital login failed." }, { status: 500 });
  }
}
