import { NextResponse } from "next/server";
import { getFirestoreClient } from "@/lib/firebaseAdmin";

export const runtime = "nodejs";

function normalizeString(value: unknown): string {
  if (typeof value !== "string") {
    return "";
  }
  return value.trim();
}

function normalizePhone(value: string): string {
  return value.replace(/[^0-9]/g, "");
}

async function parseRequestBody(request: Request): Promise<Record<string, unknown>> {
  const contentType = request.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    return request.json();
  }

  const text = await request.text();
  if (!text) {
    return {};
  }

  try {
    const parsed = JSON.parse(text);
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      return parsed as Record<string, unknown>;
    }
  } catch {
    // fallback to form data parsing
  }

  const formData = await request.formData();
  return Object.fromEntries(formData.entries()) as Record<string, unknown>;
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const hospitalId = normalizeString(url.searchParams.get("hospitalId"));
    const patientId = normalizeString(url.searchParams.get("patientId"));
    const status = normalizeString(url.searchParams.get("status"));

    if (!hospitalId) {
      return NextResponse.json(
        {
          success: false,
          error: "hospitalId is required.",
        },
        { status: 400 }
      );
    }

    const firestore = getFirestoreClient();
    let query = firestore.collection("appointments").where("hospitalId", "==", hospitalId);

    if (patientId) {
      query = query.where("patientId", "==", patientId);
    }

    if (status) {
      query = query.where("status", "==", status);
    }

    const snapshot = await query.orderBy("scheduledAt", "desc").limit(100).get();
    const appointments = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({ success: true, appointments });
  } catch (error) {
    console.error("Appointment lookup failed:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to load appointments.",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await parseRequestBody(request);

    const hospitalId = normalizeString(body.hospitalId);
    const hospitalName = normalizeString(body.hospitalName);
    const patientId = normalizeString(body.patientId);
    const patientName = normalizeString(body.patientName);
    const patientNic = normalizeString(body.patientNic);
    const mobile = normalizeString(body.mobile);
    const department = normalizeString(body.department);
    const doctor = normalizeString(body.doctor);
    const appointmentType = normalizeString(body.appointmentType);
    const priority = normalizeString(body.priority) || "Normal";
    const scheduledAt = normalizeString(body.scheduledAt) || new Date().toISOString();

    if (!hospitalId || !patientId || !patientName || !patientNic || !mobile || !department || !appointmentType) {
      return NextResponse.json(
        {
          success: false,
          error: "hospitalId, patientId, patientName, patientNic, mobile, department, and appointmentType are required.",
        },
        { status: 400 }
      );
    }

    const firestore = getFirestoreClient();
    const now = new Date().toISOString();
    const appointmentRecord = {
      hospitalId,
      hospitalName,
      patientId,
      patientName,
      patientNic,
      mobile,
      mobileSearch: normalizePhone(mobile),
      department,
      doctor,
      appointmentType,
      priority,
      status: "Scheduled",
      scheduledAt,
      createdAt: now,
      updatedAt: now,
    };

    const docRef = await firestore.collection("appointments").add(appointmentRecord);

    return NextResponse.json({
      success: true,
      appointmentId: docRef.id,
      appointment: {
        id: docRef.id,
        ...appointmentRecord,
      },
    }, { status: 201 });
  } catch (error) {
    console.error("Create appointment failed:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create appointment.",
      },
      { status: 500 }
    );
  }
}
