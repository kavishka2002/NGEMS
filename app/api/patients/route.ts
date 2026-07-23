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
    // continue to form data parse
  }

  const formData = await request.formData();
  return Object.fromEntries(formData.entries()) as Record<string, unknown>;
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const hospitalId = normalizeString(url.searchParams.get("hospitalId"));
    const query = normalizeString(url.searchParams.get("query"));
    const searchBy = normalizeString(url.searchParams.get("searchBy")).toLowerCase();
    const search = normalizeString(url.searchParams.get("search")).toLowerCase();

    console.log("📌 [GET /api/patients] Received:", { hospitalId, query, searchBy });

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
    const patientsRef = firestore.collection("patients");

    if (!query) {
      const snapshot = await patientsRef
        .where("hospitalId", "==", hospitalId)
        .limit(200)
        .get();

      const patients = snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .sort((a, b) => {
          const aCreatedAt = normalizeString(a.createdAt ?? "");
          const bCreatedAt = normalizeString(b.createdAt ?? "");
          return bCreatedAt.localeCompare(aCreatedAt);
        });

      const filteredPatients = search
        ? patients.filter((item) => JSON.stringify(item).toLowerCase().includes(search))
        : patients;

      return NextResponse.json({
        success: true,
        data: filteredPatients,
      });
    }

    const normalizedQuery = query.trim();
    const normalizedPhone = normalizePhone(normalizedQuery);

    let foundDoc: any = null;
    const searchFields = [] as Array<{ field: string; value: string }>;

    if (searchBy === "patient id") {
      searchFields.push({ field: "patientId", value: normalizedQuery });
    } else if (searchBy === "nic number" || searchBy === "nic") {
      searchFields.push({ field: "nic", value: normalizedQuery });
    } else if (searchBy === "passport number" || searchBy === "passport") {
      searchFields.push({ field: "passport", value: normalizedQuery });
    } else if (searchBy === "mobile number" || searchBy === "mobile") {
      searchFields.push({ field: "mobileSearch", value: normalizedPhone });
    } else {
      searchFields.push({ field: "patientId", value: normalizedQuery });
      searchFields.push({ field: "nic", value: normalizedQuery });
      searchFields.push({ field: "passport", value: normalizedQuery });
      if (normalizedPhone) {
        searchFields.push({ field: "mobileSearch", value: normalizedPhone });
      }
    }

    console.log("🔎 Searching fields:", searchFields);

    for (const searchItem of searchFields) {
      if (!searchItem.value) {
        continue;
      }

      try {
        const snapshotCandidate = await patientsRef
          .where(searchItem.field, "==", searchItem.value)
          .limit(10)
          .get();

        const matchingDoc = snapshotCandidate.docs.find((doc) => normalizeString(doc.data().hospitalId) === hospitalId);
        if (matchingDoc) {
          foundDoc = matchingDoc;
          console.log("✅ Found patient via", searchItem.field);
          break;
        }
      } catch (fieldError) {
        console.warn("⚠️ Error searching field", searchItem.field, fieldError);
        continue;
      }
    }

    if (!foundDoc) {
      console.log("📭 No direct match found, doing fallback search...");

      try {
        const snapshotAll = await patientsRef
          .where("hospitalId", "==", hospitalId)
          .limit(500)
          .get();

        const all = snapshotAll.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        console.log(`Found ${all.length} total patients for hospital`);

        const searchLower = normalizedQuery.toLowerCase();
        const phoneSearch = normalizePhone(normalizedQuery);

        const found = all.find((item) => {
          try {
            const s = JSON.stringify(item).toLowerCase();
            if (s.includes(searchLower)) return true;
            if (phoneSearch && JSON.stringify(item).includes(phoneSearch)) return true;
          } catch {
            // ignore
          }
          return false;
        });

        if (!found) {
          console.log("❌ Patient not found with any method");
          return NextResponse.json(
            {
              success: false,
              error: "Patient not found.",
            },
            { status: 404 }
          );
        }

        const patientRecord = {
          patient: found,
          visits: found.visits || [],
          medicines: found.medicines || [],
          labReports: found.labReports || [],
          hospitalHistory: found.hospitalHistory || [],
        };

        return NextResponse.json({ success: true, ...patientRecord });
      } catch (fallbackError) {
        console.error("❌ Fallback search error:", fallbackError);
        return NextResponse.json(
          {
            success: false,
            error: "Fallback search failed: " + String(fallbackError),
          },
          { status: 500 }
        );
      }
    }

    const patientData = foundDoc.data();
    const patientRecord = {
      patient: {
        id: foundDoc.id,
        ...patientData,
      },
      visits: patientData.visits || [],
      medicines: patientData.medicines || [],
      labReports: patientData.labReports || [],
      hospitalHistory: patientData.hospitalHistory || [],
    };

    console.log("✅ Returning patient record:", foundDoc.id);
    return NextResponse.json({
      success: true,
      ...patientRecord,
    });
  } catch (error) {
    console.error("❌ [GET /api/patients] Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to lookup patient: " + String(error),
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
    const fullName = normalizeString(body.fullName);
    const nic = normalizeString(body.nic);
    const passport = normalizeString(body.passport);
    const mobile = normalizeString(body.mobile);
    const dob = normalizeString(body.dob);
    const gender = normalizeString(body.gender);
    const department = normalizeString(body.department);
    const appointmentType = normalizeString(body.appointmentType);
    const priority = normalizeString(body.priority) || "Normal";

    if (!hospitalId || !hospitalName || !fullName || !nic || !mobile || !dob || !gender || !department || !appointmentType) {
      return NextResponse.json(
        {
          success: false,
          error: "Hospital ID, hospital name, name, NIC, mobile, DOB, gender, department, and appointment type are required.",
        },
        { status: 400 }
      );
    }

    const firestore = getFirestoreClient();
    const patientsRef = firestore.collection("patients");
    const appointmentsRef = firestore.collection("appointments");
    const mobileSearch = normalizePhone(mobile);
    const patientId = `PAT-${Math.floor(100000 + Math.random() * 900000)}`;
    const now = new Date().toISOString();

    const existingByNic = await patientsRef
      .where("hospitalId", "==", hospitalId)
      .where("nic", "==", nic)
      .limit(1)
      .get();

    if (!existingByNic.empty) {
      return NextResponse.json(
        {
          success: false,
          error: "A patient with this NIC already exists.",
        },
        { status: 409 }
      );
    }

    if (mobileSearch) {
      const existingByMobile = await patientsRef
        .where("hospitalId", "==", hospitalId)
        .where("mobileSearch", "==", mobileSearch)
        .limit(1)
        .get();

      if (!existingByMobile.empty) {
        return NextResponse.json(
          {
            success: false,
            error: "A patient with this mobile number already exists.",
          },
          { status: 409 }
        );
      }
    }

    const patientRecord = {
      patientId,
      hospitalId,
      hospitalName,
      name: fullName,
      nic,
      passport,
      mobile,
      mobileSearch,
      dob,
      gender,
      bloodGroup: normalizeString(body.bloodGroup),
      regDate: now.split("T")[0],
      status: "Active",
      alerts: body.allergies ? [normalizeString(body.allergies)] : [],
      address: normalizeString(body.address),
      province: normalizeString(body.province),
      district: normalizeString(body.district),
      guardianName: normalizeString(body.guardianName),
      guardianContact: normalizeString(body.guardianContact),
      allergies: normalizeString(body.allergies),
      diseases: normalizeString(body.diseases),
      medications: normalizeString(body.medications),
      disability: normalizeString(body.disability),
      notes: normalizeString(body.notes),
      department,
      doctor: normalizeString(body.doctor),
      appointmentType,
      priority,
      visits: [],
      medicines: [],
      labReports: [],
      hospitalHistory: [],
      createdAt: now,
      updatedAt: now,
    };

    const patientDoc = await patientsRef.add(patientRecord);

    await appointmentsRef.add({
      hospitalId,
      hospitalName,
      patientId,
      patientName: fullName,
      patientNic: nic,
      mobile,
      department,
      doctor: normalizeString(body.doctor),
      appointmentType,
      priority,
      status: "Scheduled",
      scheduledAt: now,
      createdAt: now,
      updatedAt: now,
    });

    return NextResponse.json(
      {
        success: true,
        patientId,
        patient: {
          id: patientDoc.id,
          ...patientRecord,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Patient registration failed:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to register patient.",
      },
      { status: 500 }
    );
  }
}
