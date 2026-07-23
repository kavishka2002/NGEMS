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

function normalizeCredential(value: unknown): string {
  if (typeof value !== "string") return "";
  return value.trim().toLowerCase();
}

const firebaseApiKey =
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY ||
  process.env.FIREBASE_API_KEY ||
  "";

async function verifyPasswordWithFirebaseAuth(email: string, password: string): Promise<boolean> {
  if (!firebaseApiKey) {
    console.error("Missing Firebase API key for auth verification");
    return false;
  }

  try {
    const response = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${firebaseApiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          returnSecureToken: true,
        }),
      }
    );

    if (!response.ok) {
      return false;
    }

    const data = await response.json();
    return !!data.idToken;
  } catch (error) {
    console.error("Firebase Auth password verify failed", error);
    return false;
  }
}

function getRedirectPath(role: string) {
  const normalized = role.toLowerCase();
  if (normalized.includes("reception")) return "/dashboard/reception";
  if (normalized.includes("pharmacy")) return "/pharmacy/dashboard";
  if (normalized.includes("laboratory")) return "/laboratory/dashboard";
  if (normalized.includes("doctor") || normalized.includes("nurse")) return "/dashboard";
  if (normalized.includes("administrator") || normalized.includes("admin") || normalized.includes("hospital user")) return "/dashboard";
  return "/dashboard";
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
    let foundInStaff = false;

    try {
      const firestore = getFirestoreClient();
      const hospitalSnapshot = await firestore
        .collection("hospitals")
        .where("hospitalId", "==", hospitalId)
        .limit(1)
        .get();

      if (hospitalSnapshot && !hospitalSnapshot.empty) {
        const hospitalData = hospitalSnapshot.docs[0].data();
        const adminUsername = normalizeCredential(hospitalData.adminUsername);
        const adminPassword = normalizeCredential(hospitalData.password);

        if (adminUsername === normalizeCredential(username) && adminPassword === normalizeCredential(password)) {
          userRecord = hospitalData;
          userRecord._isAdmin = true;
        }
      }
    } catch (firestoreError) {
      console.error("Firestore admin login lookup failed", firestoreError);
    }

    if (!userRecord) {
      try {
        const firestore = getFirestoreClient();
        const staffSnapshot = await firestore
          .collection("staff")
          .where("hospitalId", "==", hospitalId)
          .where("username", "==", username)
          .limit(1)
          .get();

        if (staffSnapshot && !staffSnapshot.empty) {
          const staffData = staffSnapshot.docs[0].data();
          userRecord = staffData;
          foundInStaff = true;
        }
      } catch (firestoreError) {
        console.error("Firestore staff login lookup failed", firestoreError);
      }
    }

    if (!userRecord) {
      return NextResponse.json(
        { error: "Invalid Hospital ID, username, or password." },
        { status: 401 }
      );
    }

    if (foundInStaff) {
      const storedPassword = normalizeString(userRecord.password);

      if (storedPassword) {
        if (storedPassword !== password) {
          return NextResponse.json(
            { error: "Invalid Hospital ID, username, or password." },
            { status: 401 }
          );
        }
      } else {
        const email = normalizeString(userRecord.email);
        if (!firebaseApiKey) {
          console.error("Staff login requires Firebase API key or stored password.");
          return NextResponse.json(
            {
              error:
                "Staff credentials cannot be verified because the server is missing the Firebase API key. Please set NEXT_PUBLIC_FIREBASE_API_KEY or recreate the staff account with a stored password.",
            },
            { status: 401 }
          );
        }

        const passwordIsValid = await verifyPasswordWithFirebaseAuth(email, password);
        if (!passwordIsValid) {
          return NextResponse.json(
            { error: "Invalid Hospital ID, username, or password." },
            { status: 401 }
          );
        }
      }
    }

    const resolvedHospitalName =
      normalizeString(userRecord.hospitalName) ||
      normalizeString(userRecord.name) ||
      normalizeString(userRecord.hospitalType) ||
      "Your hospital";

    const resolvedRole =
      normalizeString(userRecord.role) ||
      (userRecord._isAdmin ? "Hospital Administrator" : "Staff");

    const redirectPath = getRedirectPath(resolvedRole);

    const baseResponse = {
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
      role: resolvedRole,
      redirectPath,
    };

    if (foundInStaff) {
      return NextResponse.json({
        ...baseResponse,
        staffRole: resolvedRole,
      });
    }

    return NextResponse.json(baseResponse);
  } catch (error) {
    console.error("Hospital login failed", error);
    return NextResponse.json({ error: "Hospital login failed." }, { status: 500 });
  }
}
