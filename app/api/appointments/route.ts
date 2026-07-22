import { NextResponse, type NextRequest } from "next/server";
import { getFirestoreClient } from "@/lib/firebaseAdmin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function normalizeString(value: unknown): string {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
}

function normalizePhone(value: string): string {
  return value.replace(/[^0-9]/g, "");
}

async function parseRequestBody(
  request: Request
): Promise<Record<string, unknown>> {
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

    if (
      parsed &&
      typeof parsed === "object" &&
      !Array.isArray(parsed)
    ) {
      return parsed as Record<string, unknown>;
    }
  } catch {
    // Fallback to form data parsing
  }

  const formData = await request.formData();

  return Object.fromEntries(
    formData.entries()
  ) as Record<string, unknown>;
}

/**
 * GET /api/appointments
 *
 * Query parameters:
 * - hospitalId (required)
 * - patientId (optional)
 * - status (optional)
 * - search (optional)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;

    const hospitalId = normalizeString(
      searchParams.get("hospitalId")
    );

    const patientId = normalizeString(
      searchParams.get("patientId")
    );

    const status = normalizeString(
      searchParams.get("status")
    );

    const search =
      normalizeString(searchParams.get("search")).toLowerCase();

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

    let query = firestore
      .collection("appointments")
      .where("hospitalId", "==", hospitalId);

    if (patientId) {
      query = query.where(
        "patientId",
        "==",
        patientId
      );
    }

    if (status) {
      query = query.where(
        "status",
        "==",
        status
      );
    }

    const snapshot = await query.get();

    let appointments = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Search across appointment data
    if (search) {
      appointments = appointments.filter((appointment) =>
        JSON.stringify(appointment)
          .toLowerCase()
          .includes(search)
      );
    }

    // Sort newest appointments first
    appointments.sort((a, b) => {
      const aDate = String(
        a.scheduledAt || a.createdAt || ""
      );

      const bDate = String(
        b.scheduledAt || b.createdAt || ""
      );

      return bDate.localeCompare(aDate);
    });

    // Limit response to 100 records
    appointments = appointments.slice(0, 100);

    return NextResponse.json({
      success: true,
      data: appointments,
      appointments,
    });
  } catch (error) {
    console.error(
      "Appointment lookup failed:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error: "Failed to load appointments.",
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/appointments
 */
export async function POST(request: NextRequest) {
  try {
    const body = await parseRequestBody(request);

    const hospitalId = normalizeString(
      body.hospitalId
    );

    const hospitalName = normalizeString(
      body.hospitalName
    );

    const patientId = normalizeString(
      body.patientId
    );

    const patientName = normalizeString(
      body.patientName
    );

    const patientNic = normalizeString(
      body.patientNic
    );

    const mobile = normalizeString(
      body.mobile
    );

    const department = normalizeString(
      body.department
    );

    const doctor = normalizeString(
      body.doctor
    );

    const appointmentType = normalizeString(
      body.appointmentType
    );

    const priority =
      normalizeString(body.priority) || "Normal";

    const scheduledAt =
      normalizeString(body.scheduledAt) ||
      normalizeString(body.time) ||
      new Date().toISOString();

    const appointmentId =
      normalizeString(body.appointmentId) ||
      `APT-${Date.now()}`;

    // Required fields
    if (
      !hospitalId ||
      !patientName
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Hospital ID and patient name are required.",
        },
        { status: 400 }
      );
    }

    const firestore = getFirestoreClient();

    const now = new Date().toISOString();

    const appointmentRecord = {
      hospitalId,
      hospitalName,

      appointmentId,

      patientId,
      patientName,
      patientNic,

      mobile,
      mobileSearch: normalizePhone(mobile),

      department,
      doctor,

      appointmentType,

      priority,

      // Allow status from request, otherwise Scheduled
      status:
        normalizeString(body.status) ||
        "Scheduled",

      scheduledAt,

      createdAt: now,
      updatedAt: now,
    };

    const docRef = await firestore
      .collection("appointments")
      .add(appointmentRecord);

    return NextResponse.json(
      {
        success: true,
        appointmentId: docRef.id,
        appointment: {
          id: docRef.id,
          ...appointmentRecord,
        },
        data: {
          id: docRef.id,
          ...appointmentRecord,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(
      "Create appointment failed:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error: "Failed to create appointment.",
      },
      { status: 500 }
    );
  }
}